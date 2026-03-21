require("dotenv").config();

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT;
const DB_PORT = process.env.DB_PORT;
const DB = process.env.DB;

// If DB vars are set, use PostgreSQL (Neon); otherwise fallback to SQLite
const usePostgres = DB_USERNAME && DB_PASSWORD && DB_HOST && DB;

const postgresConfig = {
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB,
  host: DB_HOST,
  port: DB_PORT || 5432,
  dialect: DB_DIALECT || "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

const sqliteConfig = {
  username: "user",
  password: "testpassword",
  database: "dev-db",
  dialect: "sqlite",
  storage: "./dev.sqlite",
  logging: false,
};

module.exports = {
  development: usePostgres ? postgresConfig : sqliteConfig,
  test: postgresConfig,
  production: postgresConfig,
};
