// Local web server for the portfolio. gallery-data.js is rebuilt from
// assets/images/ on every request, so new or removed images show up on reload.
//
//   node server.js        → http://localhost:3000
//   PORT=8080 node server.js

const http = require("http");
const fs = require("fs");
const path = require("path");
const { buildGalleryScript } = require("./build-gallery");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
};

function send(res, status, body, type = "text/plain; charset=utf-8", extra = {}) {
  res.writeHead(status, { "Content-Type": type, ...extra });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    return send(res, 400, "Bad request");
  }

  if (pathname === "/gallery-data.js") {
    try {
      return send(res, 200, buildGalleryScript(), TYPES[".js"], { "Cache-Control": "no-store" });
    } catch (err) {
      console.error(err);
      return send(res, 500, `console.error(${JSON.stringify("Gallery build failed: " + err.message)});`, TYPES[".js"]);
    }
  }

  if (pathname.endsWith("/")) pathname += "index.html";
  const file = path.join(ROOT, pathname);
  if (!file.startsWith(ROOT + path.sep)) return send(res, 403, "Forbidden");

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, "Not found");
    const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Content-Length": stat.size, "Cache-Control": "no-cache" });
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
