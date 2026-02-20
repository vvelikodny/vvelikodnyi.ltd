import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 8080;
const METRICS_FILE = path.join(__dirname, 'metrics.json');

// ─── Persistent metrics ───────────────────────────────────────────────────────
function loadMetrics() {
  try { return JSON.parse(fs.readFileSync(METRICS_FILE, 'utf8')); }
  catch { return { tokens: 0 }; }
}

const metrics = loadMetrics();

setInterval(() => {
  fs.writeFileSync(METRICS_FILE, JSON.stringify({ tokens: Math.floor(metrics.tokens) }));
}, 10_000);

// ─── Token burn simulation ────────────────────────────────────────────────────
// Average burn rate across 5 agents (assumes ~3 working at any time)
// CEO:18, Dev:28, Accountant:10, Manager:12, Tester:22 → avg ~18/agent
// 3 agents working on average → ~54 tokens/sec with natural variance

const BASE_BURN = 54;   // tokens/sec baseline

function tickTokens(dt) {
  // Add slight random variance ±30% each tick for realism
  const variance = 1 + (Math.random() - 0.5) * 0.6;
  metrics.tokens += BASE_BURN * variance * dt;
}

// ─── BTC price (server-side fetch) ───────────────────────────────────────────
let btcPriceUsd = null;

async function fetchBtcPrice() {
  try {
    const res  = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await res.json();
    btcPriceUsd = data?.bitcoin?.usd ?? null;
    console.log(`BTC price updated: $${btcPriceUsd?.toLocaleString()}`);
  } catch (e) {
    console.warn('BTC price fetch failed:', e.message);
  }
}

fetchBtcPrice();
setInterval(fetchBtcPrice, 60_000);

// ─── Broadcast helpers ────────────────────────────────────────────────────────
const COST_PER_1K = 0.015;  // USD per 1K tokens (~Claude Sonnet)

function buildMetricsMessage() {
  const tokens  = metrics.tokens;
  const usd     = (tokens / 1000) * COST_PER_1K;
  const btc     = btcPriceUsd ? usd / btcPriceUsd : null;
  return JSON.stringify({
    type:     'metrics',
    tokens:   Math.floor(tokens),
    usd:      usd.toFixed(4),
    btc:      btc !== null ? btc.toFixed(8) : null,
    btcPrice: btcPriceUsd,
  });
}

function broadcast(wss, message) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(message);
  });
}

// ─── HTTP server (static files) ──────────────────────────────────────────────
const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
};

const httpServer = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost`);
  let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); res.end(); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

// ─── WebSocket server ─────────────────────────────────────────────────────────
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
  console.log(`Client connected (total: ${wss.clients.size})`);

  // Send current metrics immediately on connect
  ws.send(buildMetricsMessage());

  ws.on('close', () => {
    console.log(`Client disconnected (total: ${wss.clients.size})`);
  });
});

// ─── Main tick loop ───────────────────────────────────────────────────────────
const TICK_MS = 1000;  // broadcast every second
let lastTick = Date.now();

setInterval(() => {
  const now = Date.now();
  const dt  = (now - lastTick) / 1000;
  lastTick  = now;

  tickTokens(dt);

  if (wss.clients.size > 0) {
    broadcast(wss, buildMetricsMessage());
  }
}, TICK_MS);

// ─── Start ────────────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`Velikodnyi SARL server → http://localhost:${PORT}`);
  console.log(`WebSocket ready on ws://localhost:${PORT}`);
  // Signal PM2 that the process is ready (enables zero-downtime reload)
  if (process.send) process.send('ready');
});
