function registerReportingModule(router) {
  router.get("/api/reporting/executive-summary", { permission: "reporting:read" }, (_req, _res, { db, cache }) => {
    const key = "reporting:executive-summary";
    const cached = cache.get(key);
    if (cached) return { ...cached, cached: true };
    const employees = db.list("employees");
    const items = db.list("inventoryItems");
    const ledger = db.list("ledgerEntries");
    const orders = db.list("salesOrders");
    const revenue = ledger.filter(entry => entry.account === "Revenue").reduce((sum, entry) => sum + entry.amount, 0);
    const expenses = ledger.filter(entry => entry.type === "debit").reduce((sum, entry) => sum + entry.amount, 0);
    const summary = {
      cached: false,
      generatedAt: new Date().toISOString(),
      headcount: employees.filter(employee => employee.status === "active").length,
      inventoryValue: items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0),
      lowStockCount: items.filter(item => item.quantity <= item.reorderPoint).length,
      openSalesPipeline: orders.filter(order => order.status !== "cancelled").reduce((sum, order) => sum + order.total, 0),
      revenue,
      expenses,
      operatingMargin: revenue ? Number(((revenue - expenses) / revenue).toFixed(4)) : 0
    };
    cache.set(key, summary);
    return summary;
  });
}

module.exports = { registerReportingModule };
