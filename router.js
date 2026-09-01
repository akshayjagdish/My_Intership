const { URL } = require("url");
const { sendJson, notFound } = require("./http");

function createRouter(context) {
  const routes = [];

  function add(method, path, options, handler) {
    routes.push({ method, path, options: options || {}, handler });
  }

  async function handle(req, res) {
    const url = new URL(req.url, "http://localhost");
    req.query = Object.fromEntries(url.searchParams.entries());
    req.path = url.pathname;

    const route = routes.find(item => item.method === req.method && matchPath(item.path, req.path, req));
    if (!route) return notFound(res);

    const principal = route.options.public ? null : context.security.authenticate(req);
    if (!route.options.public) {
      context.security.enforceRateLimit(req, principal);
      context.security.authorize(principal, route.options.permission);
      req.principal = principal;
    }

    const routeContext = { ...context, principal, params: req.params || {} };
    const result = await route.handler(req, res, routeContext);
    if (!res.writableEnded && result !== undefined) {
      sendJson(res, result.status || 200, result.body || result, result.headers);
    }
  }

  return {
    get: (path, options, handler) => add("GET", path, options, handler),
    post: (path, options, handler) => add("POST", path, options, handler),
    put: (path, options, handler) => add("PUT", path, options, handler),
    delete: (path, options, handler) => add("DELETE", path, options, handler),
    handle
  };
}

function matchPath(template, actual, req) {
  const templateParts = template.split("/").filter(Boolean);
  const actualParts = actual.split("/").filter(Boolean);
  if (templateParts.length !== actualParts.length) return false;
  const params = {};
  for (let index = 0; index < templateParts.length; index += 1) {
    const part = templateParts[index];
    if (part.startsWith(":")) params[part.slice(1)] = decodeURIComponent(actualParts[index]);
    else if (part !== actualParts[index]) return false;
  }
  req.params = params;
  return true;
}

module.exports = { createRouter };
