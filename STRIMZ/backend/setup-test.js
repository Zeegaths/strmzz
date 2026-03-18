require("dotenv").config();
const db = require("./src/api/v1/database/models");
const jwt = require("jsonwebtoken");

async function main() {
  await db.sequelize.authenticate();
  await db.sequelize.sync();
  console.log("Tables synced");

  // Create user
  let user = await db.User.findOne({ where: { email: "test@strimz.com" } });
  if (!user) {
    user = await db.User.create({
      email: "test@strimz.com",
      password: "Test1234",
      username: "testmerchant",
      type: "eth",
      verified: true,
    });
    console.log("User created:", user.id);
  } else {
    await user.update({ verified: true });
    console.log("User already exists, verified:", user.id);
  }

  // Generate token
  const token = jwt.sign(
    { uid: user.id, access: "auth" },
    process.env.ACCESS_TOKEN_SECRET
  );

  const [t] = await db.Token.findOrCreate({
    where: { userId: user.id },
    defaults: { accessToken: token, userId: user.id },
  });
  await t.update({ accessToken: token });

  console.log("");
  console.log("=== COPY THIS TOKEN ===");
  console.log(token);
  console.log("=======================");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
