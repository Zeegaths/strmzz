require("dotenv").config();
const { sequelize } = require("./src/api/v1/database/models");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const AppRoutes = require("./src/api/v1/routes");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("common"));
app.use("/api/v1", AppRoutes);

app.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

const ErrorHandler = require("./src/api/v1/validations/error/ErrorHandler");
app.use(ErrorHandler);

const server = app;
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log("server running");
  await sequelize.authenticate({ force: true });
  console.log("database connected");

  // Start contract event indexer if configured
  if (process.env.BASE_RPC_URL && process.env.STRIMZ_CONTRACT_ADDRESS) {
    try {
      const {
        ContractEventIndexer,
      } = require("./src/api/v1/services/indexer/ContractEventIndexer");
      const {
        WebhookService,
      } = require("./src/api/v1/services/webhook/WebhookService");
      const {
        MerchantEntity,
        TransactionEntity,
        SubscriptionEntity,
        PaymentSessionEntity,
        IndexerStateEntity,
      } = require("./src/api/v1/database/classes");

      const webhookService = new WebhookService();

      const indexer = new ContractEventIndexer({
        rpcUrl: process.env.BASE_RPC_URL,
        contractAddress: process.env.STRIMZ_CONTRACT_ADDRESS,
        chargerPrivateKey: process.env.CHARGER_PRIVATE_KEY || null,
        entities: {
          MerchantEntity,
          TransactionEntity,
          SubscriptionEntity,
          PaymentSessionEntity,
          IndexerStateEntity,
        },
        webhookService,
      });

      await indexer.start();
      console.log("contract indexer started");
    } catch (error) {
      console.error("Failed to start indexer:", error.message);
      console.log("Server running without indexer — add BASE_RPC_URL and STRIMZ_CONTRACT_ADDRESS to .env");
    }
  } else {
    console.log("Indexer skipped — set BASE_RPC_URL and STRIMZ_CONTRACT_ADDRESS to enable");
  }
});
