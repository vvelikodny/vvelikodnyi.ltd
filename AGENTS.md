# Agents Guide — Velikodnyi SARL Office

This file provides context for AI agents (Claude, Cursor, Copilot, etc.) working in this repository.

## Project Overview

**Velikodnyi SARL Office** is a real-time pixel-art office simulation that visualizes an AI agent team at work. Characters roam the office, switch between activities, and react to office-wide events — all rendered in a browser via HTML5 Canvas.

Live: https://vvelikodnyi.ltd

## Architecture

```
agents-office-web-ui/
├── index.html          # Entry point — canvas + HUD panel
├── server.js           # Node.js HTTP + WebSocket server
│   ├── Serves static files
│   ├── Tracks global token/cost metrics
│   └── Broadcasts metrics to all clients via WebSocket (1s interval)
├── ecosystem.config.cjs # PM2 process manager config (zero-downtime reload)
├── metrics.json        # Persisted token counter (do not edit manually)
└── src/
    ├── simulation.js   # Game loop, office events, HUD, WS client
    ├── agents.js       # Agent class, state machine, role activities
    ├── office.js       # Tile map, zone coordinates, map renderer
    └── sprites.js      # Pixel-art character + object drawing
```

## Key Concepts

### Agents
Five characters, each with a role and activity pool:
- **Vitalii** — CEO
- **Elon** — Sr. Staff Engineer
- **Satoshi** — Accountant
- **Sheryl** — Office Manager
- **Grace** — Staff QA Engineer

Each agent runs a state machine: `idle → moving → working/break → idle`

### Zones
Named locations on the tile map (see `ZONES` in `office.js`):
`ceo_desk`, `dev_desk`, `account_desk`, `manager_desk`, `tester_desk`, `cooler`, `kitchen`, `meeting`, `printer`, `wc`, `corridor`, `corridor2`

### Office Events
Random events fire every 40–90 seconds (see `OFFICE_EVENTS` in `simulation.js`), overriding agent activities — pizza delivery, fire drill, production outage, all-hands, etc.

### Metrics (WebSocket)
The server generates token burn metrics server-side and pushes them to all connected browsers via WebSocket. Clients are read-only — no POST. Metrics persist across restarts via `metrics.json`.

### Paired Activities
Some activities automatically pull a second agent:
- CEO `1:1` → Sheryl joins the meeting room
- Elon `Code review` → Grace joins
- Satoshi `Budget meeting` → Sheryl joins

## Deployment

```bash
pm2 reload office      # zero-downtime deploy after code changes
pm2 logs office        # live logs
pm2 status             # process health
```

Server: Ubuntu 24.04, Nginx + Let's Encrypt SSL, PM2.

## Adding Real AI Agent Events

The simulation is designed for real event injection. From any source:

```javascript
// Browser console or WebSocket client:
AgentsOfficeEventBus.emit('external:event', {
  agentId:  'dev',           // ceo | dev | accountant | manager | tester | all
  activity: '🚀 Deploying',
  state:    'working',
  zone:     'dev_desk',
  duration: 30,
});
```

The server-side equivalent is planned via a future `/events` WebSocket channel.

## Code Style

- Vanilla JS ES modules, no build step, no bundler
- Canvas 2D API only — no external rendering libraries
- All text in English
- Activities use emoji prefix + short description
- Duration arrays are `[minSeconds, maxSeconds]`
