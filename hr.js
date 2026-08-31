const { randomUUID } = require("crypto");
const { requireFields, assertNumber } = require("../core/validation");

function registerHrModule(router) {
  router.get("/api/hr/employees", { permission: "hr:read" }, (_req, _res, { db }) => {
    return { employees: db.list("employees") };
  });

  router.post("/api/hr/employees", { permission: "hr:write" }, (req, _res, { db, audit, principal }) => {
    requireFields(req.body, ["name", "department", "title", "salary"]);
    assertNumber(req.body.salary, "salary");
    const employee = db.insert("employees", {
      id: `emp-${randomUUID()}`,
      name: req.body.name,
      department: req.body.department,
      title: req.body.title,
      salary: req.body.salary,
      status: req.body.status || "active",
      updatedAt: new Date().toISOString()
    });
    audit.write({ action: "hr.employee.created", principalId: principal.id, employeeId: employee.id });
    return { status: 201, body: { employee } };
  });
}

module.exports = { registerHrModule };
