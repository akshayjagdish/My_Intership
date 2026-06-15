
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

const siteData = {
  services: [
    {
      title: "React Development",
      icon: "fa-code",
      description: "Modern, responsive interfaces built with reusable React components."
    },
    {
      title: "UI/UX Design",
      icon: "fa-pen-nib",
      description: "Clear user journeys, polished layouts, and practical interaction design."
    },
    {
      title: "API Integration",
      icon: "fa-plug",
      description: "Reliable backend connections for forms, dashboards, and business workflows."
    },
    {
      title: "SEO Optimization",
      icon: "fa-magnifying-glass-chart",
      description: "Search-friendly structure, metadata, and performance-focused delivery."
    },
    {
      title: "Performance",
      icon: "fa-gauge-high",
      description: "Fast page loads, efficient assets, and smooth user experiences."
    },
    {
      title: "Accessibility",
      icon: "fa-universal-access",
      description: "Inclusive interfaces designed for keyboard, screen reader, and mobile users."
    }
  ],
  dashboard: {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    stats: [
      { label: "Performance Score", value: "98%" },
      { label: "Accessibility", value: "100%" },
      { label: "Loading Time", value: "0.5s" }
    ]
  },
  team: [
    { name: "Ayush Tirole", role: "Lead Developer", image: "https://picsum.photos/300/300?random=11" },
    { name: "Pankaj Patil", role: "Product Designer", image: "https://picsum.photos/300/300?random=12" },
    { name: "Akshay Dahibhate", role: "Project Manager", image: "https://picsum.photos/300/300?random=13" },
    { name: "Devesh Mahajan", role: "SEO Expert", image: "https://picsum.photos/300/300?random=14" }
  ],
  testimonials: [
    { quote: "Amazing responsive website with modern animations.", author: "Client 1" },
    { quote: "Excellent performance and mobile friendly layouts.", author: "Client 2" },
    { quote: "Best React website with accessibility support.", author: "Client 3" }
  ]
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function ensureMessageStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, "[]", "utf8");
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1000000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function validateContact(data) {
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const message = String(data.message || "").trim();
  const errors = {};

  if (!name) {
    errors.name = "Name is required";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Valid email required";
  }

  if (message.length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    contact: { name, email, message }
  };
}

function saveContact(contact) {
  ensureMessageStore();

  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
  const savedContact = {
    id: crypto.randomUUID(),
    ...contact,
    createdAt: new Date().toISOString()
  };

  messages.push(savedContact);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf8");

  return savedContact;
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, { status: "ok" });
  }

  if (req.method === "GET" && url.pathname === "/api/site-data") {
    return sendJson(res, 200, siteData);
  }

  if (req.method === "GET" && url.pathname === "/api/messages") {
    ensureMessageStore();
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
    return sendJson(res, 200, { messages });
  }

  if (req.method === "POST" && url.pathname === "/api/contact") {
    try {
      const body = await readBody(req);
      const payload = body ? JSON.parse(body) : {};
      const result = validateContact(payload);

      if (!result.isValid) {
        return sendJson(res, 400, {
          message: "Please fix the form errors.",
          errors: result.errors
        });
      }

      const savedContact = saveContact(result.contact);
      return sendJson(res, 201, {
        message: "Message received successfully.",
        contact: savedContact
      });
    } catch (error) {
      return sendJson(res, 400, {
        message: error.message === "Request body too large" ? error.message : "Invalid request body."
      });
    }
  }

  return sendJson(res, 404, { message: "API route not found." });
}

function serveStatic(req, res, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      return res.end("Not found");
    }

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith("/api/")) {
    return handleApi(req, res, url);
  }

  return serveStatic(req, res, url);
});

server.listen(PORT, () => {
  ensureMessageStore();
  console.log(`Business website running at http://localhost:${PORT}`);
});
