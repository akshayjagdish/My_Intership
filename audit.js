const { appendFileSync, mkdirSync } = require("fs");
const { dirname } = require("path");
const { logger } = require("./logger");

function createAuditLog(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
  return {
    write(event) {
      const record = {
        ts: new Date().toISOString(),
        ...event
      };
      appendFileSync(filePath, `${JSON.stringify(record)}\n`);
      logger.info("audit_event", { action: record.action, principalId: record.principalId });
    }
  };
}

module.exports = { createAuditLog };
