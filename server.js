const { createServer } = require("http");
const { join } = require("path");
const { parseBody, sendJson, sendFile, notFound } = require("./core/http");
const { config } = require("./core/config");
const { logger } = require("./core/logger");
const { createDatabase } = require("./core/database");
const { createSecurity } = require("./core/security");
const { createAuditLog } = require("./core/audit");
const { createMetrics } = require("./core/metrics");
const { createCache } = require("./core/cache");
const { createRouter } = require("./core/router");
const { registerHrModule } = require("./modules/hr");
const { registerInventoryModule } = require("./modules/inventory");
const { registerAccountingModule } = require("./modules/accounting");
const { registerSalesModule } = require("./modules/sales");
const { registerReportingModule } = require("./modules/reporting");

const db = createDatabase(config.dataFile);
const metrics = createMetrics();
const cache = createCache({ ttlMs: 30_000, maxEntries: 500 });
const audit = createAuditLog(config.auditFile);
const security = createSecurity({ audit, metrics });
const router = createRouter({ db, cache, audit, metrics, security });

registerHrModule(router);
registerInventoryModule(router);
registerAccountingModule(router);
registerSalesModule(router);
registerReportingModule(router);

router.get("/healthz", { public: true }, (_req, res) => {
  sendJson(res, 200, {
    status: "ok",
    service: "enterprise-erp",
    environment: config.nodeEnv,
    uptimeSeconds: Math.round(process.uptime())
  });
});

router.get("/metrics", { public: true }, (_req, res) => {
  res.writeHead(200, { "content-type": "text/plain; version=0.0.4; charset=utf-8" });
  res.end(metrics.toPrometheus());
});

router.get("/", { public: true }, (_req, res) => {
  sendFile(res, join(__dirname, "..", "public", "index.html"));
});

router.get("/app.js", { public: true }, (_req, res) => {
  sendFile(res, join(__dirname, "..", "public", "app.js"), "application/javascript");
});

router.get("/styles.css", { public: true }, (_req, res) => {
  sendFile(res, join(__dirname, "..", "public", "styles.css"), "text/css");
});

const server = createServer(async (req, res) => {
  const started = Date.now();
  req.id = metrics.nextRequestId();
  try {
    req.body = await parseBody(req);
    await router.handle(req, res);
  } catch (error) {
    logger.error("request_failed", { requestId: req.id, error: error.message });
    sendJson(res, error.statusCode || 500, {
      error: error.publicMessage || "Internal server error",
      requestId: req.id
    });
  } finally {
    metrics.observeRequest(req, res, Date.now() - started);
  }
});

if (require.main === module) {
  db.load();
  server.listen(config.port, () => {
    logger.info("erp_started", { port: config.port, environment: config.nodeEnv });
  });
}

module.exports = { server, db, router, metrics };
