function requireFields(body, fields) {
  const missing = fields.filter(field => body[field] === undefined || body[field] === null || body[field] === "");
  if (missing.length) {
    const error = new Error(`Missing fields: ${missing.join(", ")}`);
    error.statusCode = 400;
    error.publicMessage = error.message;
    throw error;
  }
}

function assertNumber(value, field) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    const error = new Error(`${field} must be a number`);
    error.statusCode = 400;
    error.publicMessage = error.message;
    throw error;
  }
}

module.exports = { requireFields, assertNumber };
