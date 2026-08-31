const { randomUUID } = require("crypto");
const { requireFields, assertNumber } = require("../core/validation");

function registerSalesModule(router) {
  router.get("/api/sales/orders", { permission: "sales:read" }, (_req, _res, { db }) => {
    return { orders: db.list("salesOrders") };
  });

  router.post("/api/sales/orders", { permission: "sales:write" }, (req, _res, { db, audit, principal, cache }) => {
    requireFields(req.body, ["customer", "total"]);
    assertNumber(req.body.total, "total");
    const order = db.insert("salesOrders", {
      id: `so-${randomUUID()}`,
      customer: req.body.customer,
      status: req.body.status || "draft",
      total: req.body.total,
      itemIds: Array.isArray(req.body.itemIds) ? req.body.itemIds : [],
      updatedAt: new Date().toISOString()
    });
    cache.invalidate("reporting:");
    audit.write({ action: "sales.order.created", principalId: principal.id, salesOrderId: order.id });
    return { status: 201, body: { order } };
  });
}

module.exports = { registerSalesModule };
