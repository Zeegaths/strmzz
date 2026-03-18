const PaymentService = require("../../services/payment/PaymentService");
const { CheckBadRequest } = require("../../validations");
const { MessageResponse } = require("../../helpers");

// ============================================================================
// SDK Routes (API Key auth — req.merchant is set by VerifyApiKey)
// ============================================================================

exports.createSession = async (req, res, next) => {
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);

  try {
    const result = await PaymentService.createSession(req.merchant.id, req.body);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Session created", 201, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Session creation failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const result = await PaymentService.getSession(
      req.params.sessionId,
      req.merchant.id
    );
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Session found", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Not found", 404, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.listSessions = async (req, res, next) => {
  try {
    const { page, size } = req.pagination;
    const result = await PaymentService.listSessions(req.merchant.id, page, size);
    return MessageResponse.successResponse(res, "Sessions", 200, result.data);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.verifyTransaction = async (req, res, next) => {
  try {
    const result = await PaymentService.verifyTransaction(
      req.params.transactionId,
      req.merchant.id
    );
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Transaction verified", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Not found", 404, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const result = await PaymentService.getTransaction(
      req.params.transactionId,
      req.merchant.id
    );
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Transaction found", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Not found", 404, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.listTransactions = async (req, res, next) => {
  try {
    const { page, size } = req.pagination;
    const result = await PaymentService.listTransactions(
      req.merchant.id,
      page,
      size,
      req.query
    );
    return MessageResponse.successResponse(res, "Transactions", 200, result.data);
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

// ============================================================================
// Checkout Routes (Session auth — req.paymentSession is set by middleware)
// ============================================================================

exports.getCheckoutSession = async (req, res, next) => {
  try {
    const result = await PaymentService.getCheckoutSession(req.params.sessionId);
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Checkout session", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Session error", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};

exports.reportTransactionSubmitted = async (req, res, next) => {
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);

  try {
    const result = await PaymentService.reportTransactionSubmitted(
      req.params.sessionId,
      req.body.transactionHash
    );
    const { success, ...rest } = result;
    if (success) {
      MessageResponse.successResponse(res, "Transaction reported", 200, rest.data || rest.message);
    } else {
      MessageResponse.errorResponse(res, "Report failed", 422, rest.error || rest.message);
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(res, "internal server error", 500, error.message);
  }
};