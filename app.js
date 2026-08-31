const headers = { Authorization: "Bearer demo-admin-token" };

async function api(path) {
  const response = await fetch(path, { headers });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

async function refresh() {
  const [summary, hr, inventory, sales, accounting] = await Promise.all([
    api("/api/reporting/executive-summary"),
    api("/api/hr/employees"),
    api("/api/inventory/items"),
    api("/api/sales/orders"),
    api("/api/accounting/ledger")
  ]);

  document.querySelector("#metrics").innerHTML = [
    ["Headcount", summary.headcount],
    ["Inventory Value", money(summary.inventoryValue)],
    ["Low Stock", summary.lowStockCount],
    ["Pipeline", money(summary.openSalesPipeline)],
    ["Margin", `${Math.round(summary.operatingMargin * 100)}%`]
  ].map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`).join("");

  document.querySelector("#employees").innerHTML = hr.employees
    .map(employee => `<li>${employee.name}<small>${employee.title}, ${employee.department}</small></li>`)
    .join("");

  document.querySelector("#inventory").innerHTML = inventory.items
    .map(item => `<li>${item.name}<small>${item.quantity} on hand · reorder at ${item.reorderPoint}</small>${item.quantity <= item.reorderPoint ? "<span class=\"warning\">Reorder</span>" : ""}</li>`)
    .join("");

  document.querySelector("#sales").innerHTML = sales.orders
    .map(order => `<li>${order.customer}<small>${order.status} · ${money(order.total)}</small></li>`)
    .join("");

  document.querySelector("#ledger").textContent = JSON.stringify(accounting.trialBalance, null, 2);
}

document.querySelector("#refresh").addEventListener("click", refresh);
refresh().catch(error => {
  document.querySelector("main").innerHTML = `<p>${error.message}</p>`;
});
