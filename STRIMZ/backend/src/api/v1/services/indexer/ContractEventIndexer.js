/**
 * Contract Event Indexer (Sequelize version)
 *
 * Listens to StrimzPayments contract events on Base and syncs to Postgres.
 * Runs alongside Express server as a background service.
 */

const { ethers } = require("ethers");
const cron = require("node-cron");

const STRIMZ_PAYMENTS_ABI = [
  "event PaymentProcessed(bytes32 indexed paymentId, address indexed payer, bytes32 indexed merchantId, uint256 amount, uint256 fee)",
  "event SubscriptionCreated(bytes32 indexed subscriptionId, address indexed subscriber, bytes32 indexed merchantId, uint256 amount, uint8 interval)",
  "event SubscriptionCharged(bytes32 indexed subscriptionId, bytes32 indexed paymentId, uint256 amount)",
  "event SubscriptionStatusChanged(bytes32 indexed subscriptionId, uint8 status)",
  "function batchChargeSubscriptions(bytes32[] calldata subscriptionIds) external",
  "function isSubscriptionDue(bytes32 subscriptionId) external view returns (bool)",
];

const INTERVAL_MAP = { 0: "weekly", 1: "monthly", 2: "quarterly", 3: "yearly" };
const STATUS_MAP = { 0: "active", 1: "paused", 2: "cancelled" };

class ContractEventIndexer {
  constructor({ rpcUrl, contractAddress, chargerPrivateKey, entities, webhookService }) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contract = new ethers.Contract(contractAddress, STRIMZ_PAYMENTS_ABI, this.provider);
    this.entities = entities;
    this.webhookService = webhookService;

    // Signer for batch-charging subscriptions
    // In production: use KMS, not raw key
    if (chargerPrivateKey) {
      this.chargerWallet = new ethers.Wallet(chargerPrivateKey, this.provider);
      this.chargerContract = new ethers.Contract(
        contractAddress,
        STRIMZ_PAYMENTS_ABI,
        this.chargerWallet
      );
    }
  }

  async start() {
    console.log("[Indexer] Starting contract event indexer...");

    this.listenForPayments();
    this.listenForSubscriptionCreated();
    this.listenForSubscriptionCharged();
    this.listenForSubscriptionStatusChanged();

    // Charge due subscriptions every 15 min
    cron.schedule("*/15 * * * *", () => this.processDueSubscriptions());

    // Retry failed charges every hour
    cron.schedule("0 * * * *", () => this.retryFailedCharges());

    // Expire stale sessions every 5 min
    cron.schedule("*/5 * * * *", () => this.expireSessions());

    console.log("[Indexer] Event listeners and cron jobs active");
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  listenForPayments() {
    this.contract.on(
      "PaymentProcessed",
      async (paymentId, payer, merchantId, amount, fee, event) => {
        try {
          console.log(`[Indexer] PaymentProcessed: ${paymentId}`);

          const {
            TransactionEntity,
            PaymentSessionEntity,
            MerchantEntity,
            IndexerStateEntity,
          } = this.entities;

          // Deduplicate
          const exists = await TransactionEntity.existsByOnChainPaymentId(paymentId);
          if (exists) return;

          // Find merchant in our DB
          const merchant = await MerchantEntity.getMerchantByOnChainId(merchantId);
          if (!merchant) {
            console.warn(`[Indexer] Unknown merchant: ${merchantId}`);
            return;
          }

          // Find matching session
          const session = await PaymentSessionEntity.findPendingByMerchantAndReference(
            merchantId,
            null
          );

          // Record transaction
          const tx = await TransactionEntity.createTransaction({
            onChainPaymentId: paymentId,
            sessionId: session?.id || null,
            merchantId: merchant.id,
            onChainMerchantId: merchantId,
            payer,
            token: "USDC",
            amount: ethers.formatUnits(amount, 6),
            fee: ethers.formatUnits(fee, 6),
            currency: "USDC",
            status: "completed",
            type: "one_time",
            reference: session?.reference || null,
            transactionHash: event.log.transactionHash,
            blockNumber: event.log.blockNumber,
          });

          // Update session if found
          if (session) {
            await PaymentSessionEntity.updateSession(session.id, {
              status: "completed",
              onChainPaymentId: paymentId,
              transactionHash: event.log.transactionHash,
              blockNumber: event.log.blockNumber,
            });
          }

          // Dispatch webhook
          if (merchant.webhookUrl) {
            await this.webhookService.dispatch(merchant, {
              type: "payment.completed",
              data: {
                paymentId,
                sessionId: session?.sessionId || null,
                amount: ethers.formatUnits(amount, 6),
                fee: ethers.formatUnits(fee, 6),
                currency: "USDC",
                payer,
                reference: session?.reference || null,
                transactionHash: event.log.transactionHash,
              },
            });
          }

          await IndexerStateEntity.saveCheckpoint(event.log.blockNumber);
        } catch (error) {
          console.error("[Indexer] PaymentProcessed error:", error);
        }
      }
    );
  }

  listenForSubscriptionCreated() {
    this.contract.on(
      "SubscriptionCreated",
      async (subscriptionId, subscriber, merchantId, amount, interval, event) => {
        try {
          console.log(`[Indexer] SubscriptionCreated: ${subscriptionId}`);

          const { SubscriptionEntity, MerchantEntity, IndexerStateEntity } = this.entities;

          const exists = await SubscriptionEntity.existsByOnChainId(subscriptionId);
          if (exists) return;

          const merchant = await MerchantEntity.getMerchantByOnChainId(merchantId);
          if (!merchant) return;

          await SubscriptionEntity.createSubscription({
            onChainSubscriptionId: subscriptionId,
            merchantId: merchant.id,
            onChainMerchantId: merchantId,
            subscriber,
            token: "USDC", // Will need to read from contract for multi-token
            amount: ethers.formatUnits(amount, 6),
            interval: INTERVAL_MAP[interval] || "monthly",
            status: "active",
            chargeCount: 0,
            failedChargeCount: 0,
            lastChargeAt: new Date(),
            transactionHash: event.log.transactionHash,
          });

          if (merchant.webhookUrl) {
            await this.webhookService.dispatch(merchant, {
              type: "subscription.created",
              data: {
                subscriptionId,
                subscriber,
                amount: ethers.formatUnits(amount, 6),
                interval: INTERVAL_MAP[interval],
              },
            });
          }

          await IndexerStateEntity.saveCheckpoint(event.log.blockNumber);
        } catch (error) {
          console.error("[Indexer] SubscriptionCreated error:", error);
        }
      }
    );
  }

  listenForSubscriptionCharged() {
    this.contract.on(
      "SubscriptionCharged",
      async (subscriptionId, paymentId, amount, event) => {
        try {
          console.log(`[Indexer] SubscriptionCharged: ${subscriptionId}`);

          const { SubscriptionEntity, MerchantEntity, IndexerStateEntity } = this.entities;

          const sub = await SubscriptionEntity.getByOnChainId(subscriptionId);
          if (!sub) return;

          await SubscriptionEntity.updateByOnChainId(subscriptionId, {
            lastChargeAt: new Date(),
            chargeCount: sub.chargeCount + 1,
            lastPaymentId: paymentId,
            failedChargeCount: 0, // Reset on success
            status: "active",
          });

          const merchant = await MerchantEntity.getMerchantById(sub.merchantId);
          if (merchant && merchant.webhookUrl) {
            await this.webhookService.dispatch(merchant, {
              type: "subscription.charged",
              data: {
                subscriptionId,
                paymentId,
                amount: ethers.formatUnits(amount, 6),
                chargeCount: sub.chargeCount + 1,
                transactionHash: event.log.transactionHash,
              },
            });
          }

          await IndexerStateEntity.saveCheckpoint(event.log.blockNumber);
        } catch (error) {
          console.error("[Indexer] SubscriptionCharged error:", error);
        }
      }
    );
  }

  listenForSubscriptionStatusChanged() {
    this.contract.on(
      "SubscriptionStatusChanged",
      async (subscriptionId, status, event) => {
        try {
          console.log(`[Indexer] StatusChanged: ${subscriptionId} → ${STATUS_MAP[status]}`);

          const { SubscriptionEntity, MerchantEntity, IndexerStateEntity } = this.entities;

          const sub = await SubscriptionEntity.updateByOnChainId(subscriptionId, {
            status: STATUS_MAP[status] || "active",
          });

          if (sub && sub.success !== false) {
            const merchant = await MerchantEntity.getMerchantById(sub.merchantId);
            const eventType =
              STATUS_MAP[status] === "cancelled"
                ? "subscription.cancelled"
                : STATUS_MAP[status] === "paused"
                ? "subscription.paused"
                : "subscription.resumed";

            if (merchant && merchant.webhookUrl) {
              await this.webhookService.dispatch(merchant, {
                type: eventType,
                data: { subscriptionId, status: STATUS_MAP[status] },
              });
            }
          }

          await IndexerStateEntity.saveCheckpoint(event.log.blockNumber);
        } catch (error) {
          console.error("[Indexer] StatusChanged error:", error);
        }
      }
    );
  }

  // ==========================================================================
  // Cron Jobs
  // ==========================================================================

  async processDueSubscriptions() {
    if (!this.chargerContract) return;

    try {
      const { SubscriptionEntity } = this.entities;
      const activeSubs = await SubscriptionEntity.getActiveSubscriptions();

      const dueSubs = [];
      for (const sub of activeSubs) {
        try {
          const isDue = await this.contract.isSubscriptionDue(sub.onChainSubscriptionId);
          if (isDue) dueSubs.push(sub.onChainSubscriptionId);
        } catch (err) {
          // Skip — may have been cancelled on-chain
        }
      }

      if (dueSubs.length === 0) return;

      console.log(`[Indexer] Charging ${dueSubs.length} due subscriptions`);

      const tx = await this.chargerContract.batchChargeSubscriptions(dueSubs);
      const receipt = await tx.wait();
      console.log(`[Indexer] Batch charge tx: ${receipt.hash}`);
    } catch (error) {
      console.error("[Indexer] processDueSubscriptions error:", error);
    }
  }

  async retryFailedCharges() {
    try {
      const { SubscriptionEntity, MerchantEntity } = this.entities;
      const overdue = await SubscriptionEntity.getOverdueSubscriptions(7);

      for (const sub of overdue) {
        await SubscriptionEntity.updateByOnChainId(sub.onChainSubscriptionId, {
          status: "past_due",
        });

        const merchant = await MerchantEntity.getMerchantById(sub.merchantId);
        if (merchant && merchant.webhookUrl) {
          await this.webhookService.dispatch(merchant, {
            type: "subscription.charge_failed",
            data: {
              subscriptionId: sub.onChainSubscriptionId,
              subscriber: sub.subscriber,
              amount: Number(sub.amount),
              failedAttempts: sub.failedChargeCount,
              status: "past_due",
            },
          });
        }
      }
    } catch (error) {
      console.error("[Indexer] retryFailedCharges error:", error);
    }
  }

  async expireSessions() {
    try {
      const { PaymentSessionEntity } = this.entities;
      const count = await PaymentSessionEntity.expireStaleSessions();
      if (count > 0) console.log(`[Indexer] Expired ${count} stale sessions`);
    } catch (error) {
      console.error("[Indexer] expireSessions error:", error);
    }
  }
}

module.exports = { ContractEventIndexer };