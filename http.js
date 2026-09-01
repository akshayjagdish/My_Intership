const { createReadStream, existsSync } = require("fs");
const { extname } = require("path");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    if (!["POST", "PUT", "PATCH"].includes(req.method)) return resolve({});
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        const error = new Error("Payload too large");
        error.statusCode = 413;
        reject(error);
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (_error) {
        const error = new Error("Invalid JSON");
        error.statusCode = 400;
        error.publicMessage = "Request body must be valid JSON";
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload, headers = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    ...headers
  });
  res.end(body);
}

function sendFile(res, filePath, contentType) {
  if (!existsSync(filePath)) return notFound(res);
  res.writeHead(200, {
    "content-type": contentType || contentTypes[extname(filePath)] || "application/octet-stream",
    "x-content-type-options": "nosniff",
    "cache-control": "public, max-age=300"
  });
  createReadStream(filePath).pipe(res);
}

function notFound(res) {
  sendJson(res, 404, { error: "Not found" });
}

module.exports = { parseBody, sendJson, sendFile, notFound };
