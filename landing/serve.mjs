import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const CRM_URL = (process.env.CRM_URL || process.env.APP_URL || process.env.ACHARE_APP_URL || '').replace(/\/$/, '');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let file = req.url.split('?')[0];

  // Health check endpoint for Docker / reverse proxy / load balancer
  if (file === '/healthz' || file === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
  }

  if (file === '/' || file === '') file = '/index.html';
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not Found');
  }

  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';

  // If serving index.html and a CRM_URL is configured in environment, inject it into head
  if (file === '/index.html' && CRM_URL) {
    fs.readFile(filePath, 'utf8', (err, html) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Internal Server Error');
      }
      const injected = html.replace(
        '<head>',
        `<head>\n    <script>window.__ACHARE_CRM_URL__ = ${JSON.stringify(CRM_URL)};</script>`
      );
      res.writeHead(200, {
        'Content-Type': mime,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(injected);
    });
    return;
  }

  res.writeHead(200, {
    'Content-Type': mime,
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Achare Landing Page running at http://localhost:${PORT}`);
  if (CRM_URL) {
    console.log(`Configured CRM App URL: ${CRM_URL}`);
  }
});
