const { resolve } = require("path");

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.ERP_JWT_SECRET || "development-only-secret",
  dataFile: resolve(process.env.ERP_DATA_FILE || "./data/erp-db.json"),
  auditFile: resolve(process.env.ERP_AUDIT_FILE || "./logs/audit.log"),
  logLevel: process.env.ERP_LOG_LEVEL || "info",
  rateLimitWindowMs: Number(process.env.ERP_RATE_LIMIT_WINDOW_MS || 60_000),
  rateLimitMax: Number(process.env.ERP_RATE_LIMIT_MAX || 120)
};

module.exports = { config };
