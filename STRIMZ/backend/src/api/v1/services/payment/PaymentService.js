const { CheckDBResponse } = require("../../helpers");
const {
  PaymentSessionEntity,
  TransactionEntity,
  MerchantEntity,
} = require("../../database/classes");

const CHECKOUT_BASE_URL = process.env.CHECKOUT_URL || "https://pay.strimz.com";

exports.createSession = async (merchantId, data) => {
  try {
    const session = await PaymentSessionEntity.createSession({
      merchantId,
      type: data.type,
      amount: data.amount,
      currency: data.currency || "USDC",
      reference: data.reference || null,
      customerEmail: data.customerEmail || null,
      description: data.description || null,
      successUrl: data.successUrl || null,
      cancelUrl: data.cancelUrl || null,
      subscriptionInterval: data.subscription?.interval || null,
      metadata: data.metadata || null,
    });

    if (session.success === false) {
      return CheckDBResponse.errorResponse(session.error);
    }

    const checkoutUrl = `${CHECKOUT_BASE_URL}/payment?session=${session.sessionId}`;

    return CheckDBResponse.successResponse({
      id: session.id,
      sessionId: session.sessionId,
      type: session.type,
      amount: Number(session.amount),
      currency: session.currency,
      status: session.status,
      checkoutUrl,
      reference: session.reference,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    });
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.getSession = async (sessionId, merchantId) => {
  try {
    const session = await PaymentSessionEntity.getSessionBySessionId(sessionId);
    if (!session) {
      return CheckDBResponse.errorResponse("Session not found");
    }

    // Verify it belongs to this merchant (for SDK calls)
    if (merchantId && session.merchantId !== merchantId) {
      return CheckDBResponse.errorResponse("Session not found");
    }

    return CheckDBResponse.successResponse(session);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.listSessions = async (merchantId, page, size) => {
  try {
    const sessions = await PaymentSessionEntity.getMerchantSessions(
      merchantId,
      page,
      size
    );
    return CheckDBResponse.response(sessions);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.getCheckoutSession = async (sessionId) => {
  try {
    const session = await PaymentSessionEntity.getSessionBySessionId(sessionId);
    if (!session) {
      return CheckDBResponse.errorResponse("Session not found");
    }

    // Check expiry
    if (new Date() > new Date(session.expiresAt)) {
      await PaymentSessionEntity.updateSession(session.id, { status: "expired" });
      return CheckDBResponse.errorResponse("Session expired");
    }

    // Return data needed for checkout UI to render
    return CheckDBResponse.successResponse({
      sessionId: session.sessionId,
      type: session.type,
      amount: Number(session.amount),
      currency: session.currency,
      status: session.status,
      merchantName: session.merchant?.name,
      merchantWallet: session.merchant?.walletAddress,
      merchantOnChainId: session.merchant?.onChainId,
      description: session.description,
      subscriptionInterval: session.subscriptionInterval,
      successUrl: session.successUrl,
      cancelUrl: session.cancelUrl,
    });
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.reportTransactionSubmitted = async (sessionId, transactionHash) => {
  try {
    const session = await PaymentSessionEntity.getSessionBySessionId(sessionId);
    if (!session) {
      return CheckDBResponse.errorResponse("Session not found");
    }

    await PaymentSessionEntity.updateSession(session.id, {
      status: "processing",
      transactionHash,
    });

    return CheckDBResponse.successResponse({ status: "processing" });
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.verifyTransaction = async (transactionId, merchantId) => {
  try {
    const tx = await TransactionEntity.getById(transactionId);
    if (!tx) {
      return CheckDBResponse.errorResponse("Transaction not found");
    }

    if (tx.merchantId !== merchantId) {
      return CheckDBResponse.errorResponse("Transaction not found");
    }

    return CheckDBResponse.successResponse({
      id: tx.id,
      onChainPaymentId: tx.onChainPaymentId,
      amount: Number(tx.amount),
      fee: Number(tx.fee),
      currency: tx.currency,
      status: tx.status,
      type: tx.type,
      payer: tx.payer,
      reference: tx.reference,
      transactionHash: tx.transactionHash,
      blockNumber: tx.blockNumber,
      createdAt: tx.createdAt,
    });
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.getTransaction = async (transactionId, merchantId) => {
  try {
    const tx = await TransactionEntity.getById(transactionId);
    if (!tx || tx.merchantId !== merchantId) {
      return CheckDBResponse.errorResponse("Transaction not found");
    }
    return CheckDBResponse.successResponse(tx);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.listTransactions = async (merchantId, page, size, filters) => {
  try {
    const txs = await TransactionEntity.getMerchantTransactions(
      merchantId,
      page,
      size,
      filters
    );
    return CheckDBResponse.response(txs);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};
