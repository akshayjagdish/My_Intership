const { createHash, timingSafeEqual } = require("crypto");
const { config } = require("./config");

const demoPrincipals = {
  "demo-admin-token": {
    id: "u-admin",
    name: "ERP Administrator",
    roles: ["admin"],
    permissions: ["*"]
  },
  "demo-manager-token": {
    id: "u-manager",
    name: "Operations Manager",
    roles: ["manager"],
    permissions: ["hr:read", "inventory:*", "sales:*", "reporting:read"]
  },
  "demo-accountant-token": {
    id: "u-accountant",
    name: "Accountant",
    roles: ["accountant"],
    permissions: ["accounting:*", "sales:read", "reporting:read"]
  }
};

function createSecurity({ audit, metrics }) {
  const buckets = new Map();

  function authenticate(req) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const principal = demoPrincipals[token];
    if (!principal) {
      metrics.increment("auth_failures_total");
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      error.publicMessage = "Valid bearer token required";
      throw error;
    }
    return principal;
  }

  function authorize(principal, permission) {
    if (!permission) return;
    if (hasPermission(principal.permissions, permission)) return;
    audit.write({ action: "authorization.denied", principalId: principal.id, permission });
    const error = new Error("Forbidden");
    error.statusCode = 403;
    error.publicMessage = "Insufficient permissions";
    throw error;
  }

  function enforceRateLimit(req, principal) {
    const key = `${principal.id}:${req.socket.remoteAddress}`;
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + config.rateLimitWindowMs };
    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + config.rateLimitWindowMs;
    }
    bucket.count += 1;
    buckets.set(key, bucket);
    if (bucket.count > config.rateLimitMax) {
      const error = new Error("Rate limited");
      error.statusCode = 429;
      error.publicMessage = "Rate limit exceeded";
      throw error;
    }
  }

  return { authenticate, authorize, enforceRateLimit, hashValue };
}

function hasPermission(permissions, required) {
  return permissions.some(permission => {
    if (permission === "*") return true;
    if (permission.endsWith(":*")) return required.startsWith(permission.slice(0, -1));
    return permission === required;
  });
}

function hashValue(value) {
  const digest = createHash("sha256").update(`${config.jwtSecret}:${value}`).digest();
  return digest.toString("hex");
}

function secureCompare(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

module.exports = { createSecurity, hasPermission, secureCompare };
