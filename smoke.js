const { server, db } = require("../src/server");
const { config } = require("../src/core/config");

db.load();
server.listen(config.port, async () => {
  try {
    const response = await fetch(`http://127.0.0.1:${config.port}/healthz`);
    const body = await response.json();
    if (body.status !== "ok") throw new Error("Health check failed");
    console.log("Smoke check passed");
  } finally {
    server.close();
  }
});
