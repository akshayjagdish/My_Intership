function createMetrics() {
  let requestSequence = 0;
  const counters = new Map();
  const timings = [];

  function increment(name, value = 1) {
    counters.set(name, (counters.get(name) || 0) + value);
  }

  function observeRequest(req, res, durationMs) {
    increment("http_requests_total");
    increment(`http_requests_status_${res.statusCode || 200}_total`);
    timings.push({ path: req.path || req.url, method: req.method, durationMs });
    if (timings.length > 1000) timings.shift();
  }

  function nextRequestId() {
    requestSequence += 1;
    return `req-${requestSequence}`;
  }

  function toPrometheus() {
    const lines = [];
    for (const [name, value] of counters.entries()) {
      lines.push(`# TYPE ${name} counter`, `${name} ${value}`);
    }
    const avg = timings.length
      ? timings.reduce((sum, item) => sum + item.durationMs, 0) / timings.length
      : 0;
    lines.push("# TYPE http_request_duration_ms gauge", `http_request_duration_ms ${avg.toFixed(2)}`);
    return `${lines.join("\n")}\n`;
  }

  return { increment, observeRequest, nextRequestId, toPrometheus };
}

module.exports = { createMetrics };
