const pagination = require("./pagination/pagination");
const isValidId = require("./check-id/check-id");
const VerifyToken = require("./check-jwt/VerifyToken");
const verifyAdmin = require("./verify-admin/verifyAdmin");
const verifySuperAdmin = require("./verify-super-admin/verifySuperAdmin");

// New
const {
  VerifyApiKey,
  RequireSecretKey,
  VerifySessionAccess,
} = require("./api-key/VerifyApiKey");

module.exports = {
  pagination,
  isValidId,
  VerifyToken,
  verifyAdmin,
  verifySuperAdmin,
  VerifyApiKey,
  RequireSecretKey,
  VerifySessionAccess,
};
