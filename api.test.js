const test = require("node:test");
const assert = require("node:assert/strict");

process.env.ERP_DATA_FILE = "./data/test-erp-db.json";

const { server, db } = require("../src/server");
const { calculateTrialBalance } = require("../src/modules/accounting");

let baseUrl;

test.before(async () => {
  db.load();
  await new Promise(resolve => {
    server.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test("rejects unauthenticated module requests", async () => {
  const response = await fetch(`${baseUrl}/api/hr/employees`);
  assert.equal(response.status, 401);
});

test("returns executive reporting summary", async () => {
  const response = await fetch(`${baseUrl}/api/reporting/executive-summary`, {
    headers: { Authorization: "Bearer demo-admin-token" }
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.headcount, 3);
  assert.equal(body.lowStockCount, 1);
  assert.ok(body.inventoryValue > 0);
});

test("enforces role based access control", async () => {
  const response = await fetch(`${baseUrl}/api/accounting/ledger`, {
    headers: { Authorization: "Bearer demo-manager-token" }
  });
  assert.equal(response.status, 403);
});

test("calculates trial balance", () => {
  const balance = calculateTrialBalance([
    { type: "credit", amount: 100 },
    { type: "debit", amount: 40 }
  ]);
  assert.deepEqual(balance, { credit: 100, debit: 40, balance: 60 });
});
