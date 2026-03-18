require("dotenv").config();
const db = require("./src/api/v1/database/models");
const crypto = require("crypto");

async function main() {
  await db.sequelize.authenticate();

  const merchant = await db.Merchant.findOne({ where: { businessEmail: "test@strimz.com" } });
  if (!merchant) { console.log("No merchant found"); process.exit(1); }

  const pk = "pk_live_" + crypto.randomBytes(24).toString("hex");
  const sk = "sk_live_" + crypto.randomBytes(24).toString("hex");

  const pkHash = crypto.createHash("sha256").update(pk).digest("hex");
  const skHash = crypto.createHash("sha256").update(sk).digest("hex");

  await db.ApiKey.create({ merchantId: merchant.id, hashedKey: pkHash, keyType: "public", environment: "live", prefix: "pk_live_" + pk.substring(8, 16), active: true, requestCount: 0 });
  await db.ApiKey.create({ merchantId: merchant.id, hashedKey: skHash, keyType: "secret", environment: "live", prefix: "sk_live_" + sk.substring(8, 16), active: true, requestCount: 0 });

  console.log("");
  console.log("=== YOUR API KEYS (save these) ===");
  console.log("Public key:", pk);
  console.log("Secret key:", sk);
  console.log("==================================");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
