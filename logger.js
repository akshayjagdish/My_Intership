const levels = { debug: 10, info: 20, warn: 30, error: 40 };
const configured = levels[process.env.ERP_LOG_LEVEL || "info"] || levels.info;

function write(level, message, fields = {}) {
  if (levels[level] < configured) return;
  const record = {
    ts: new Date().toISOString(),
    level,
    message,
    ...fields
  };
  const line = JSON.stringify(record);
  if (level === "error") console.error(line);
  else console.log(line);
}

const logger = {
  debug: (message, fields) => write("debug", message, fields),
  info: (message, fields) => write("info", message, fields),
  warn: (message, fields) => write("warn", message, fields),
  error: (message, fields) => write("error", message, fields)
};

module.exports = { logger };
