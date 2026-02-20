import { renderMap, ZONES } from './office.js';
import { drawCharacter, drawStatusBubble, drawOfficeObjects } from './sprites.js';
import { createAgents, ROLE_LABELS } from './agents.js';

// ─── WebSocket metrics (server pushes, client is read-only) ──────────────────
function connectMetricsSocket() {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws    = new WebSocket(`${proto}//${location.host}`);

  ws.addEventListener('message', ({ data }) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'metrics') updateCostDisplay(msg);
    } catch {}
  });

  // Reconnect on drop
  ws.addEventListener('close', () => setTimeout(connectMetricsSocket, 2000));
  ws.addEventListener('error', () => ws.close());
}

connectMetricsSocket();

// ─── Event Bus ───────────────────────────────────────────────────────────────
const EventBus = {
  _handlers: {},
  on(event, fn) {
    if (!this._handlers[event]) this._handlers[event] = [];
    this._handlers[event].push(fn);
  },
  emit(event, data) {
    (this._handlers[event] || []).forEach(fn => fn(data));
  },
};
window.AgentsOfficeEventBus = EventBus;

// ─── Office-wide random events ────────────────────────────────────────────────
const OFFICE_EVENTS = [
  {
    title: '🍕 Pizza delivery!',
    color: '#ff6030',
    duration: 20,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '🍕 Eating pizza', state: 'break', zone: 'kitchen', duration: 18 })),
  },
  {
    title: '🚨 FIRE DRILL!',
    color: '#ff2020',
    duration: 15,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '🚨 Fire drill!', state: 'break', zone: 'corridor', duration: 13 })),
  },
  {
    title: '📣 All-hands meeting!',
    color: '#4080ff',
    duration: 25,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '📣 All-hands', state: 'working', zone: 'meeting', duration: 22 })),
  },
  {
    title: '⚡ Production is DOWN!',
    color: '#ff4040',
    duration: 20,
    effect: (agents) => {
      const dev = agents.find(a => a.id === 'dev');
      const qa  = agents.find(a => a.id === 'tester');
      const ceo = agents.find(a => a.id === 'ceo');
      dev?.applyExternalEvent({ activity: '🔥 PROD IS DOWN!!!', state: 'working', zone: 'dev_desk',    duration: 18 });
      qa?.applyExternalEvent({  activity: '😱 Checking logs',    state: 'working', zone: 'tester_desk', duration: 18 });
      ceo?.applyExternalEvent({ activity: '😰 Status update?',   state: 'working', zone: 'ceo_desk',    duration: 18 });
    },
  },
  {
    title: '🎉 Happy Birthday Sheryl!',
    color: '#ff40ff',
    duration: 20,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '🎂 Birthday cake!', state: 'break', zone: 'kitchen', duration: 18 })),
  },
  {
    title: '💸 PAYDAY FRIDAY!',
    color: '#40ff80',
    duration: 15,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '💸 It\'s payday!', state: 'break', zone: 'cooler', duration: 12 })),
  },
  {
    title: '☕ Coffee machine is broken!',
    color: '#c08040',
    duration: 18,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '😭 No coffee???', state: 'break', zone: 'kitchen', duration: 15 })),
  },
  {
    title: '🤖 New AI tool demo!',
    color: '#40c0ff',
    duration: 20,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '🤖 AI demo time', state: 'working', zone: 'meeting', duration: 18 })),
  },
  {
    title: '🌮 It\'s Taco Tuesday!',
    color: '#ffaa20',
    duration: 20,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '🌮 Taco Tuesday!', state: 'break', zone: 'kitchen', duration: 18 })),
  },
  {
    title: '📦 New MacBooks arrived!',
    color: '#aaaaaa',
    duration: 18,
    effect: (agents) => {
      const dev = agents.find(a => a.id === 'dev');
      dev?.applyExternalEvent({ activity: '📦 Unboxing MacBook', state: 'break', zone: 'dev_desk', duration: 16 });
      agents.filter(a => a.id !== 'dev').forEach(a =>
        a.applyExternalEvent({ activity: '😮 Checking new Mac', state: 'break', zone: 'dev_desk', duration: 12 })
      );
    },
  },
  {
    title: '🏆 Sprint Review!',
    color: '#80ff40',
    duration: 25,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '🏆 Sprint review', state: 'working', zone: 'meeting', duration: 22 })),
  },
  {
    title: '🧊 AC is broken! 🥵',
    color: '#ff8040',
    duration: 15,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '🥵 So hot...', state: 'break', zone: 'cooler', duration: 12 })),
  },
  {
    title: '🎲 Team building activity!',
    color: '#ff80ff',
    duration: 20,
    effect: (agents) => agents.forEach(a => a.applyExternalEvent({ activity: '🎲 Team building', state: 'break', zone: 'corridor2', duration: 18 })),
  },
  {
    title: '💻 Windows Update time...',
    color: '#4040aa',
    duration: 15,
    effect: (agents) => {
      const dev = agents.find(a => a.id === 'dev');
      dev?.applyExternalEvent({ activity: '😠 Forced update', state: 'break', zone: 'dev_desk', duration: 13 });
    },
  },
  {
    title: '📊 Investor presentation!',
    color: '#ffcc00',
    duration: 25,
    effect: (agents) => {
      const ceo = agents.find(a => a.id === 'ceo');
      const mgr = agents.find(a => a.id === 'manager');
      ceo?.applyExternalEvent({ activity: '📊 Pitch deck time', state: 'working', zone: 'meeting', duration: 22 });
      mgr?.applyExternalEvent({ activity: '📊 Supporting CEO',  state: 'working', zone: 'meeting', duration: 22 });
    },
  },
];

// ─── Paired meeting events ─────────────────────────────────────────────────────
// When one agent does a 1:1, pick a partner and send them both to meeting room
const PAIRED_ACTIVITIES = ['1:1 with the team', '💬 Code review', 'Budget meeting', 'Performance review', 'Syncing the team'];

function isPaired(activityText) {
  return PAIRED_ACTIVITIES.some(p => activityText.includes('1:1') || activityText.includes('Code review') || activityText.includes('review'));
}

// ─── Banner notification ───────────────────────────────────────────────────────
let banner = null;

function showBanner(text, color) {
  banner = { text, color, alpha: 1.0, timer: 4.0 };
}

function drawBanner(ctx, dt) {
  if (!banner) return;
  banner.timer -= dt;
  if (banner.timer <= 0) { banner = null; return; }
  banner.alpha = Math.min(1, banner.timer / 1.0);

  const w = 500, h = 36, x = (800 - w) / 2, y = 28;
  ctx.save();
  ctx.globalAlpha = banner.alpha;
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = banner.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.font = 'bold 13px Courier New';
  ctx.fillStyle = banner.color;
  ctx.textAlign = 'center';
  ctx.fillText(banner.text, 400, y + 24);
  ctx.restore();
}

// ─── Event feed (bottom strip) ────────────────────────────────────────────────
const feed = [];

function addFeedItem(text) {
  feed.unshift({ text, age: 0 });
  if (feed.length > 4) feed.pop();
}

function drawFeed(ctx, dt) {
  ctx.save();
  ctx.font = '8px Courier New';
  ctx.textAlign = 'left';
  feed.forEach((item, i) => {
    item.age += dt;
    const alpha = Math.max(0, 1 - item.age / 12);
    ctx.fillStyle = `rgba(0,255,136,${alpha * 0.6})`;
    ctx.fillText(`> ${item.text}`, 8, 590 - i * 12);
  });
  ctx.restore();
}

// ─── Cost display (fed by server WebSocket push) ─────────────────────────────
function updateCostDisplay({ tokens, usd, btc, btcPrice }) {
  const tokensEl = document.getElementById('stat-tokens');
  const usdEl    = document.getElementById('stat-usd');
  const btcEl    = document.getElementById('stat-btc');
  const noteEl   = document.getElementById('btc-price-note');
  if (!tokensEl) return;

  tokensEl.textContent = Number(tokens).toLocaleString('en-US');
  usdEl.textContent    = '$' + usd;
  btcEl.textContent    = btc ? '₿ ' + btc : '₿ —';
  if (noteEl && btcPrice) noteEl.textContent = `1 BTC = $${Number(btcPrice).toLocaleString('en-US')}`;
}

// ─── HUD ─────────────────────────────────────────────────────────────────────
function buildHUD(agents) {
  const container = document.getElementById('agent-list');
  agents.forEach(agent => {
    const card = document.createElement('div');
    card.className = 'agent-card';
    card.id = `hud-${agent.id}`;
    card.style.borderLeftColor = agent.color;
    card.innerHTML = `
      <div class="agent-name" style="color: ${agent.color}">${agent.name}</div>
      <div class="agent-role">${ROLE_LABELS[agent.role]}</div>
      <div class="agent-status" id="status-${agent.id}">…</div>
      <span class="agent-state state-idle" id="state-${agent.id}">idle</span>
    `;
    container.appendChild(card);
  });
}

function updateHUD(agent) {
  const statusEl = document.getElementById(`status-${agent.id}`);
  const stateEl  = document.getElementById(`state-${agent.id}`);
  if (statusEl) statusEl.textContent = agent.currentActivity || '…';
  if (stateEl) {
    stateEl.textContent = agent.state;
    stateEl.className = `agent-state state-${agent.state}`;
  }
}

// ─── Main Game Loop ───────────────────────────────────────────────────────────
function start() {
  const canvas = document.getElementById('office');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const agents = createAgents();
  agents.forEach(agent => { agent.onStatusChange = updateHUD; });
  buildHUD(agents);

  // ── Office event scheduler ──
  let nextEventIn = randRange(30, 60);
  let eventCooldown = 0;

  // ── 1:1 pairing: intercept CEO's 1:1 to also move the manager ──
  agents.forEach(agent => {
    const origNotify = agent._notify.bind(agent);
    agent._notify = function () {
      origNotify();
      // If CEO starts a 1:1, drag Karen along
      if (agent.id === 'ceo' && agent.currentActivity?.includes('1:1')) {
        const partner = agents.find(a => a.id === 'manager');
        if (partner && !partner.externalOverride) {
          partner.applyExternalEvent({ activity: '💬 1:1 w/ Vitalii', state: 'working', zone: 'meeting', duration: 15 });
        }
      }
      // If Elon starts code review, drag Rex along
      if (agent.id === 'dev' && agent.currentActivity?.includes('Code review')) {
        const partner = agents.find(a => a.id === 'tester');
        if (partner && !partner.externalOverride) {
          partner.applyExternalEvent({ activity: '💬 Code review w/ Elon', state: 'working', zone: 'meeting', duration: 12 });

        }
      }
      // Budget meeting: Penny + Karen
      if (agent.id === 'accountant' && agent.currentActivity?.includes('Budget meeting')) {
        const partner = agents.find(a => a.id === 'manager');
        if (partner && !partner.externalOverride) {
          partner.applyExternalEvent({ activity: '💬 Budget meeting', state: 'working', zone: 'meeting', duration: 12 });
        }
      }
    };
  });

  let lastTime = performance.now();

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    // Metrics are pushed from server via WebSocket — no client-side accumulation

    // Office event tick
    eventCooldown -= dt;
    nextEventIn -= dt;
    if (nextEventIn <= 0 && eventCooldown <= 0) {
      const evt = OFFICE_EVENTS[Math.floor(Math.random() * OFFICE_EVENTS.length)];
      evt.effect(agents);
      showBanner(evt.title, evt.color);
      addFeedItem(evt.title);
      eventCooldown = evt.duration + 10;
      nextEventIn = randRange(40, 90);
    }

    // Render
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderMap(ctx);
    drawOfficeObjects(ctx);

    agents
      .sort((a, b) => a.pos.y - b.pos.y)
      .forEach(agent => {
        agent.update(dt);
        drawCharacter(ctx, agent);
        drawStatusBubble(ctx, agent);
      });

    drawClock(ctx);
    drawBanner(ctx, dt);
    drawFeed(ctx, dt);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // External WebSocket-ready hook
  EventBus.on('external:event', ({ agentId, activity, state, zone, duration }) => {
    if (agentId === 'all') {
      agents.forEach(a => a.applyExternalEvent({ activity, state, zone, duration }));
    } else {
      const agent = agents.find(a => a.id === agentId);
      if (agent) agent.applyExternalEvent({ activity, state, zone, duration });
    }
  });
}

function drawClock(ctx) {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  ctx.save();
  ctx.font = 'bold 10px Courier New';
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(6, 6, 130, 24);
  ctx.fillStyle = '#00ff88';
  ctx.textAlign = 'left';
  ctx.fillText(time, 10, 19);
  ctx.font = '8px Courier New';
  ctx.fillStyle = '#556';
  ctx.fillText(date, 70, 19);
  ctx.restore();
}

function randRange(min, max) {
  return min + Math.random() * (max - min);
}

document.addEventListener('DOMContentLoaded', start);
