const express = require("express");
const WebhookController = require("../../controllers/webhook/WebhookController");

const router = express.Router();

router.post("/strimz", WebhookController.handleStrimzWebhook);

module.exports = router;
