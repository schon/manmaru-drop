// Headless-browser smoke test: serve the repo locally, open index.html in
// Chromium, fail on uncaught exceptions or a missing canvas, save a screenshot.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};
const server = createServer((req, res) => {
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const file = normalize(join(root, urlPath));
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((resolve) => server.listen(8901, '127.0.0.1', resolve));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('http://127.0.0.1:8901/index.html', { waitUntil: 'load' });
await page.waitForTimeout(5000);
const canvasCount = await page.locator('canvas').count();
mkdirSync('smoke', { recursive: true });
await page.screenshot({ path: 'smoke/screenshot.png' });
await browser.close();
server.close();

console.log(`canvas elements: ${canvasCount}`);
console.log(`uncaught errors: ${errors.length}`);
for (const e of errors) console.error(e);
if (canvasCount === 0 || errors.length > 0) process.exit(1);
console.log('smoke OK');
