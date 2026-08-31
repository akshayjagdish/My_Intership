const { randomUUID } = require("crypto");
const { requireFields, assertNumber } = require("../core/validation");

function registerInventoryModule(router) {
  router.get("/api/inventory/items", { permission: "inventory:read" }, (_req, _res, { db }) => {
    const items = db.list("inventoryItems");
    return {
      items,
      reorderAlerts: items.filter(item => item.quantity <= item.reorderPoint)
    };
  });

  router.post("/api/inventory/items", { permission: "inventory:write" }, (req, _res, { db, audit, principal, cache }) => {
    requireFields(req.body, ["sku", "name", "quantity", "reorderPoint", "unitCost"]);
    ["quantity", "reorderPoint", "unitCost"].forEach(field => assertNumber(req.body[field], field));
    const item = db.insert("inventoryItems", {
      id: `sku-${randomUUID()}`,
      sku: req.body.sku,
      name: req.body.name,
      quantity: req.body.quantity,
      reorderPoint: req.body.reorderPoint,
      unitCost: req.body.unitCost,
      updatedAt: new Date().toISOString()
    });
    cache.invalidate("reporting:");
    audit.write({ action: "inventory.item.created", principalId: principal.id, itemId: item.id });
    return { status: 201, body: { item } };
  });
}

module.exports = { registerInventoryModule };
