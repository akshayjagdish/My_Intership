const { readFileSync } = require("fs");
const { join } = require("path");
const { spawnSync } = require("child_process");

const result = spawnSync(process.execPath, ["--check", join("src", "server.js")], { encoding: "utf8" });
if (result.status !== 0) {
  process.stderr.write(result.stderr);
  process.exit(result.status);
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
for (const script of ["test", "start", "smoke"]) {
  if (!packageJson.scripts[script]) {
    console.error(`Missing npm script: ${script}`);
    process.exit(1);
  }
}

console.log("Static checks passed");
