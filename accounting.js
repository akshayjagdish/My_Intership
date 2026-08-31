const { randomUUID } = require("crypto");
const { requireFields, assertNumber } = require("../core/validation");

function registerAccountingModule(router) {
  router.get("/api/accounting/ledger", { permission: "accounting:read" }, (_req, _res, { db }) => {
    const entries = db.list("ledgerEntries");
    return { entries, trialBalance: calculateTrialBalance(entries) };
  });

  router.post("/api/accounting/ledger", { permission: "accounting:write" }, (req, _res, { db, audit, principal, cache }) => {
    requireFields(req.body, ["account", "type", "amount", "period"]);
    assertNumber(req.body.amount, "amount");
    if (!["debit", "credit"].includes(req.body.type)) {
      const error = new Error("type must be debit or credit");
      error.statusCode = 400;
      error.publicMessage = error.message;
      throw error;
    }
    const entry = db.insert("ledgerEntries", {
      id: `led-${randomUUID()}`,
      account: req.body.account,
      type: req.body.type,
      amount: req.body.amount,
      period: req.body.period,
      updatedAt: new Date().toISOString()
    });
    cache.invalidate("reporting:");
    audit.write({ action: "accounting.ledger.created", principalId: principal.id, ledgerEntryId: entry.id });
    return { status: 201, body: { entry } };
  });
}

function calculateTrialBalance(entries) {
  return entries.reduce(
    (totals, entry) => {
      totals[entry.type] += entry.amount;
      totals.balance = totals.credit - totals.debit;
      return totals;
    },
    { debit: 0, credit: 0, balance: 0 }
  );
}

module.exports = { registerAccountingModule, calculateTrialBalance };
