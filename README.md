# Velikodnyi SARL Office

A real-time pixel-art office simulation of an AI agent team.

**Live → https://vvelikodnyi.ltd**

## What is this?

A browser-based pixel office where AI agents (bots) visually simulate a real team at work. Characters walk between desks, take coffee breaks, go to the WC, attend all-hands meetings, panic when production goes down — all rendered live in HTML5 Canvas.

Built as the frontend for a future AI agents platform where real agent activity will drive the simulation.

## Team

| Character | Role | Fun fact |
|-----------|------|----------|
| 👑 Vitalii | Le Patron | By day: Edge Network engineer @ Gcore. By night: building AI agents 24/7 |
| 💻 Elon | Sr. Staff Engineer | Pushes to main by accident, rewrites in Rust |
| 💰 Satoshi | Accountant | Mining BTC on work PC, "I am not Satoshi" |
| 📋 Sheryl | Office Manager | TPS reports, blocks everyone's calendar |
| 🐛 Grace | Staff QA Engineer | Debugging COBOL (1959), "that's a feature!" |

## Features

- Pixel-art office with zones: desks, cooler, kitchen, WC, meeting room, printer
- Per-role activity pools (17–20 activities each, all with humor)
- Random office-wide events every ~60s: pizza delivery, fire drill, production outage, payday Friday, taco Tuesday...
- Paired meetings: 1:1s and code reviews pull a second agent automatically
- Live AI cost meter: tokens burned + USD + BTC price (server-side, shared across all browsers)
- WebSocket push — server owns all state, clients are read-only

## Tech Stack

- **Frontend:** Vanilla JS, HTML5 Canvas, zero dependencies, no build step
- **Backend:** Node.js (HTTP + WebSocket server)
- **Process manager:** PM2 (zero-downtime reloads)
- **Infra:** Ubuntu 24.04, Nginx, Let's Encrypt SSL

## Development

```bash
# Start server
pm2 start ecosystem.config.cjs

# Zero-downtime deploy after edits
pm2 reload office

# Logs
pm2 logs office
```

Open `http://localhost:8080`

## Injecting Real Events

```javascript
// From browser console or any WebSocket client:
AgentsOfficeEventBus.emit('external:event', {
  agentId:  'dev',        // ceo | dev | accountant | manager | tester | all
  activity: '🚀 Deploying v2.0',
  state:    'working',
  zone:     'dev_desk',
  duration: 30,
});
```

## AI Agents Context

See [AGENTS.md](./AGENTS.md) for full architecture guide, designed for AI coding assistants working in this repo.

---

*Made with ❤️ in Luxembourg 🇱🇺 · [Velikodnyi SARL](https://vvelikodnyi.ltd)*
