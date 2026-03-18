const crypto = require("crypto");
const { ApiKeyEntity } = require("../../database/classes");

/**
 * API Key Authentication Middleware
 *
 * Merchants authenticate SDK calls with API keys:
 *   pk_live_xxx / pk_test_xxx → public keys (client SDK)
 *   sk_live_xxx / sk_test_xxx → secret keys (server SDK)
 *
 * Header: Authorization: Bearer sk_live_abc123...
 *
 * Sets req.merchant, req.apiKeyType, req.isTestMode
 */
const VerifyApiKey = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "API key required",
        error: "Pass API key as: Authorization: Bearer sk_live_xxx",
      });
    }

    const apiKey = authHeader.split(" ")[1];
    const keyPrefix = apiKey.substring(0, 7); // "pk_live" or "sk_test" etc

    if (!["pk_live", "sk_live", "pk_test", "sk_test"].includes(keyPrefix)) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key format",
        error: "Keys start with pk_live_, sk_live_, pk_test_, or sk_test_",
      });
    }

    const isSecretKey = keyPrefix.startsWith("sk_");
    const isTestMode = keyPrefix.includes("_test");

    // Hash for lookup (we never store raw keys)
    const hashedKey = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");

    const keyRecord = await ApiKeyEntity.findByHashedKey(hashedKey);

    if (!keyRecord || keyRecord.success === false) {
      return res.status(401).json({
        success: false,
        message: "Invalid or revoked API key",
        error: "Check your API key and try again",
      });
    }

    if (!keyRecord.merchant || !keyRecord.merchant.active) {
      return res.status(403).json({
        success: false,
        message: "Merchant account inactive",
        error: "Contact support",
      });
    }

    // Attach to request
    req.merchant = keyRecord.merchant;
    req.apiKeyType = isSecretKey ? "secret" : "public";
    req.isTestMode = isTestMode;
    req.apiKeyId = keyRecord.id;

    // Track usage async (don't block the request)
    ApiKeyEntity.trackUsage(keyRecord.id).catch(() => {});

    next();
  } catch (error) {
    console.error("[ApiKeyAuth] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: "Internal error",
    });
  }
};

/**
 * Require secret key — blocks public key access
 */
const RequireSecretKey = (req, res, next) => {
  if (req.apiKeyType !== "secret") {
    return res.status(403).json({
      success: false,
      message: "Secret key required",
      error: "Use sk_live_xxx or sk_test_xxx for this endpoint",
    });
  }
  next();
};

/**
 * Session auth for checkout pages
 */
const VerifySessionAccess = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { PaymentSessionEntity } = require("../../database/classes");

    const session = await PaymentSessionEntity.getSessionBySessionId(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
        error: "Invalid session ID",
      });
    }

    if (new Date() > new Date(session.expiresAt)) {
      return res.status(410).json({
        success: false,
        message: "Session expired",
        error: "This payment session has expired",
      });
    }

    if (!session.merchant || !session.merchant.active) {
      return res.status(403).json({
        success: false,
        message: "Merchant inactive",
        error: "Merchant is not active",
      });
    }

    req.paymentSession = session;
    req.merchant = session.merchant;
    next();
  } catch (error) {
    console.error("[SessionAuth] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Session validation failed",
      error: "Internal error",
    });
  }
};

module.exports = {
  VerifyApiKey,
  RequireSecretKey,
  VerifySessionAccess,
};
