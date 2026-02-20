import { ZONES } from './office.js';

// Role-based activity definitions
const ROLE_ACTIVITIES = {
  // Vitalii — day shift (9:00–18:00): Software Engineer @ Gcore, Edge Network
  ceo_day: [
    { text: '⚡ Optimizing edge nodes',       zone: 'ceo_desk',  state: 'working', duration: [30, 60] },
    { text: '🌐 Edge CDN config review',      zone: 'ceo_desk',  state: 'working', duration: [24, 54] },
    { text: '📡 Deploying new edge POP',      zone: 'ceo_desk',  state: 'working', duration: [30, 54] },
    { text: '🔧 Debugging CDN latency',       zone: 'ceo_desk',  state: 'working', duration: [24, 48] },
    { text: '🛡️ DDoS protection tuning',     zone: 'ceo_desk',  state: 'working', duration: [18, 42] },
    { text: '📊 Traffic analytics dashboard', zone: 'ceo_desk',  state: 'working', duration: [15, 36] },
    { text: '💻 Coding edge worker logic',    zone: 'ceo_desk',  state: 'working', duration: [36, 60] },
    { text: '🔍 Reviewing Gcore PRs',         zone: 'ceo_desk',  state: 'working', duration: [24, 45] },
    { text: '🤝 Gcore team sync',             zone: 'meeting',   state: 'working', duration: [30, 54] },
    { text: '📝 Tech spec: edge routing',     zone: 'ceo_desk',  state: 'working', duration: [24, 48] },
    { text: '⚙️ Fine-tuning CDN rules',      zone: 'ceo_desk',  state: 'working', duration: [18, 42] },
    { text: '🌍 Global POP monitoring',       zone: 'ceo_desk',  state: 'working', duration: [15, 36] },
    { text: '🏗️ Edge infra planning',        zone: 'meeting',   state: 'working', duration: [24, 48] },
    { text: '🚀 Shipping edge feature',       zone: 'ceo_desk',  state: 'working', duration: [30, 60] },
    { text: '📞 Gcore architecture call',     zone: 'ceo_desk',  state: 'working', duration: [30, 54] },
    { text: '😤 "Why is latency 3ms not 2?"', zone: 'ceo_desk',  state: 'working', duration: [15, 30] },
    { text: '☕ Coffee break',               zone: 'kitchen',   state: 'break',   duration: [12, 24] },
    { text: '💧 Hydration check',            zone: 'cooler',    state: 'break',   duration: [9, 18]  },
    { text: '🚶 Walking the floor',          zone: 'corridor',  state: 'moving',  duration: [12, 24] },
    { text: '🚽 Bio break',                 zone: 'wc',        state: 'break',   duration: [9, 18]  },
  ],
  // Vitalii — evening (18:00+): AI research, building AI team 24/7
  ceo_evening: [
    { text: '🤖 Building AI agent team',      zone: 'ceo_desk',  state: 'working', duration: [36, 72] },
    { text: '🧠 Reading AI research papers',  zone: 'ceo_desk',  state: 'working', duration: [30, 60] },
    { text: '🌙 Late-night AI coding',        zone: 'ceo_desk',  state: 'working', duration: [36, 72] },
    { text: '📡 Deploying agents to prod',    zone: 'ceo_desk',  state: 'working', duration: [24, 54] },
    { text: '🔧 Fine-tuning AI prompts',      zone: 'ceo_desk',  state: 'working', duration: [24, 48] },
    { text: '📊 Monitoring agent metrics',    zone: 'ceo_desk',  state: 'working', duration: [18, 42] },
    { text: '🚀 AI product roadmap',          zone: 'ceo_desk',  state: 'working', duration: [30, 54] },
    { text: '🧪 Testing new AI model',        zone: 'ceo_desk',  state: 'working', duration: [24, 48] },
    { text: '🌐 AI agent orchestration',      zone: 'ceo_desk',  state: 'working', duration: [30, 60] },
    { text: '💡 "What if agents ran 24/7?"', zone: 'ceo_desk',  state: 'working', duration: [18, 42] },
    { text: '🤔 Automating daily routines',   zone: 'ceo_desk',  state: 'working', duration: [24, 54] },
    { text: '📚 Claude API deep dive',        zone: 'ceo_desk',  state: 'working', duration: [30, 54] },
    { text: '🔭 Visioning AI future',         zone: 'ceo_desk',  state: 'working', duration: [18, 36] },
    { text: '😤 "The bots broke again"',      zone: 'ceo_desk',  state: 'working', duration: [15, 36] },
    { text: '💬 1:1 with the AI team',       zone: 'meeting',   state: 'working', duration: [24, 48] },
    { text: '🏆 Agents working while I sleep',zone: 'ceo_desk',  state: 'working', duration: [30, 60] },
    { text: '☕ Midnight coffee',             zone: 'kitchen',   state: 'break',   duration: [12, 24] },
    { text: '💧 Hydration (forgot again)',    zone: 'cooler',    state: 'break',   duration: [9, 18]  },
    { text: '🧘 Mindfulness break',           zone: 'corridor2', state: 'break',   duration: [12, 24] },
    { text: '🚽 Bio break',                  zone: 'wc',        state: 'break',   duration: [9, 18]  },
  ],
  // fallback (unused but keeps _pickNextActivity safe)
  ceo: [
    { text: '☕ Coffee break', zone: 'kitchen', state: 'break', duration: [12, 24] },
  ],
  dev: [
    { text: '💻 Shipping it',               zone: 'dev_desk',  state: 'working', duration: [30, 60] },
    { text: '🐛 Debugging... again',        zone: 'dev_desk',  state: 'working', duration: [24, 54] },
    { text: '📖 Reading the docs',          zone: 'dev_desk',  state: 'working', duration: [15, 36] },
    { text: '🖨️ Printing manifesto',        zone: 'printer',   state: 'working', duration: [9, 21]  },
    { text: '💬 Code review',               zone: 'meeting',   state: 'working', duration: [24, 45] },
    { text: '🔥 Move fast, break things',   zone: 'dev_desk',  state: 'working', duration: [18, 42] },
    { text: '🦀 Rewriting it in Rust',      zone: 'dev_desk',  state: 'working', duration: [36, 60] },
    { text: '🤦 Pushed to main by accident',zone: 'dev_desk',  state: 'working', duration: [15, 30] },
    { text: '📦 npm install --save chaos',  zone: 'dev_desk',  state: 'working', duration: [12, 27]  },
    { text: '🎥 YouTube tutorial',          zone: 'dev_desk',  state: 'break',   duration: [15, 36] },
    { text: '🤖 Asking ChatGPT',            zone: 'dev_desk',  state: 'working', duration: [12, 24]  },
    { text: '😤 Stack Overflow: no answer', zone: 'dev_desk',  state: 'working', duration: [18, 36] },
    { text: '🚀 Deploying on Friday',       zone: 'dev_desk',  state: 'working', duration: [15, 30] },
    { text: '⚡ Optimizing prematurely',    zone: 'dev_desk',  state: 'working', duration: [24, 48] },
    { text: '📝 Writing README no one reads',zone:'dev_desk',  state: 'working', duration: [12, 24]  },
    { text: '☕ Coffee #5 today',           zone: 'kitchen',   state: 'break',   duration: [12, 24]  },
    { text: '💧 Water (rare event)',        zone: 'cooler',    state: 'break',   duration: [6, 15]  },
    { text: '🎮 Taking a break',            zone: 'corridor2', state: 'break',   duration: [9, 21]  },
    { text: '🔍 Googling the error',        zone: 'dev_desk',  state: 'working', duration: [15, 30] },
    { text: '😴 Rubber duck debugging',     zone: 'dev_desk',  state: 'working', duration: [12, 27]  },
    { text: '🚽 Coding on the toilet',      zone: 'wc',        state: 'break',   duration: [12, 24]  },
  ],
  accountant: [
    { text: '📊 Counting beans',            zone: 'account_desk', state: 'working', duration: [30, 60] },
    { text: '📋 Monthly report',            zone: 'account_desk', state: 'working', duration: [24, 54] },
    { text: '💰 Budget analysis',           zone: 'account_desk', state: 'working', duration: [18, 42] },
    { text: '🖨️ Printing invoices',         zone: 'printer',      state: 'working', duration: [9, 18]  },
    { text: '☕ Tea time',                  zone: 'kitchen',      state: 'break',   duration: [12, 24]  },
    { text: '📞 Calling the tax office',    zone: 'account_desk', state: 'working', duration: [15, 36] },
    { text: '💧 Cooler gossip',             zone: 'cooler',       state: 'break',   duration: [6, 15]  },
    { text: '💬 Budget meeting',            zone: 'meeting',      state: 'working', duration: [24, 45] },
    { text: '🔍 Found $0.01 discrepancy',   zone: 'account_desk', state: 'working', duration: [30, 60] },
    { text: '😤 Blocking Elon\'s AWS bill', zone: 'account_desk', state: 'working', duration: [15, 30] },
    { text: '📑 Year-end close',            zone: 'account_desk', state: 'working', duration: [30, 54] },
    { text: '🧾 Auditing expenses',         zone: 'account_desk', state: 'working', duration: [24, 42] },
    { text: '📮 Requesting receipts',       zone: 'account_desk', state: 'working', duration: [12, 24]  },
    { text: '💸 ROI calculations',          zone: 'account_desk', state: 'working', duration: [18, 36] },
    { text: '🔐 Reconciling accounts',      zone: 'account_desk', state: 'working', duration: [24, 48] },
    { text: '📈 Quarterly forecast',        zone: 'meeting',      state: 'working', duration: [24, 45] },
    { text: '😱 Tax deadline tomorrow',     zone: 'account_desk', state: 'working', duration: [24, 54] },
    { text: '₿ Mining BTC on work PC',     zone: 'account_desk', state: 'working', duration: [18, 42] },
    { text: '🕵️ "I am not Satoshi"',       zone: 'account_desk', state: 'working', duration: [12, 24]  },
    { text: '🌐 Checking blockchain',       zone: 'account_desk', state: 'working', duration: [15, 30] },
    { text: '💎 HODLing the budget',        zone: 'account_desk', state: 'working', duration: [12, 24]  },
    { text: '📉 Number go down 😭',        zone: 'account_desk', state: 'working', duration: [15, 30] },
    { text: '🔐 Encrypting spreadsheet',   zone: 'account_desk', state: 'working', duration: [12, 24]  },
    { text: '🏦 "Banks are obsolete"',     zone: 'cooler',       state: 'break',   duration: [9, 18]  },
    { text: '🤫 Hiding private keys',      zone: 'account_desk', state: 'working', duration: [15, 30] },
    { text: '📊 Calculating to 8 decimals',zone: 'account_desk', state: 'working', duration: [18, 36] },
    { text: '🚽 Counting coins inside',    zone: 'wc',           state: 'break',   duration: [9, 21]  },
    { text: '👻 Gone anonymous again',     zone: 'corridor',     state: 'moving',  duration: [12, 24]  },
    { text: '📈 CoinMarketCap all day',    zone: 'account_desk', state: 'working', duration: [24, 48] },
    { text: '🦄 Aping into new DeFi',      zone: 'account_desk', state: 'working', duration: [18, 36] },
    { text: '🌊 Yield farming session',    zone: 'account_desk', state: 'working', duration: [24, 48] },
    { text: '💹 Checking Uniswap',         zone: 'account_desk', state: 'working', duration: [15, 30] },
    { text: '🐋 Whale watching on chain',  zone: 'account_desk', state: 'working', duration: [18, 36] },
    { text: '🏊 Liquidity pool diving',    zone: 'account_desk', state: 'working', duration: [21, 42] },
    { text: '😰 Rug pull detected!',       zone: 'account_desk', state: 'working', duration: [12, 24]  },
    { text: '🎰 Staking everything',       zone: 'account_desk', state: 'working', duration: [15, 30] },
    { text: '📱 CoinGecko refresh ×100',   zone: 'account_desk', state: 'working', duration: [12, 24]  },
    { text: '⛽ Gas fees: $420',           zone: 'account_desk', state: 'working', duration: [9, 21]  },
  ],
  manager: [
    { text: '📋 Making a plan',             zone: 'manager_desk', state: 'working', duration: [24, 48] },
    { text: '💬 Syncing the team',          zone: 'meeting',      state: 'working', duration: [30, 60] },
    { text: '📧 Emailing everyone',         zone: 'manager_desk', state: 'working', duration: [15, 36] },
    { text: '🗓️ Blocking calendars',        zone: 'manager_desk', state: 'working', duration: [12, 30] },
    { text: '☕ Coffee (mandatory)',        zone: 'kitchen',      state: 'break',   duration: [12, 24]  },
    { text: '🖨️ TPS reports',              zone: 'printer',      state: 'working', duration: [6, 18]  },
    { text: '💧 Cooler networking',         zone: 'cooler',       state: 'break',   duration: [6, 15]  },
    { text: '🚶 Managing by walking',       zone: 'corridor',     state: 'moving',  duration: [9, 21]  },
    { text: '📅 Sprint retrospective',      zone: 'meeting',      state: 'working', duration: [30, 60] },
    { text: '📊 Updating JIRA board',       zone: 'manager_desk', state: 'working', duration: [15, 36] },
    { text: '🤝 Performance review',        zone: 'meeting',      state: 'working', duration: [36, 60] },
    { text: '📣 Standup in 5 minutes',      zone: 'corridor',     state: 'moving',  duration: [9, 18]  },
    { text: '😤 Per my last email...',      zone: 'manager_desk', state: 'working', duration: [15, 30] },
    { text: '🎯 Defining requirements',     zone: 'manager_desk', state: 'working', duration: [18, 42] },
    { text: '📞 Client call',               zone: 'manager_desk', state: 'working', duration: [24, 48] },
    { text: '🏆 Team building ideas',       zone: 'meeting',      state: 'working', duration: [18, 36] },
    { text: '😅 Adding meeting to fix meetings', zone:'meeting',  state: 'working', duration: [15, 30] },
    { text: '🚽 Quick bio break',           zone: 'wc',           state: 'break',   duration: [9, 18]  },
  ],
  tester: [
    { text: '🐛 Hunting bugs',              zone: 'tester_desk', state: 'working', duration: [24, 54] },
    { text: '✅ Writing test cases',        zone: 'tester_desk', state: 'working', duration: [18, 42] },
    { text: '💥 Breaking things',           zone: 'tester_desk', state: 'working', duration: [15, 36] },
    { text: '🔍 Regression test',           zone: 'tester_desk', state: 'working', duration: [24, 48] },
    { text: '🎯 Testing in prod',           zone: 'tester_desk', state: 'working', duration: [12, 30] },
    { text: '😤 Found another bug',         zone: 'meeting',     state: 'working', duration: [18, 36] },
    { text: '🖨️ Bug report #247',           zone: 'printer',     state: 'working', duration: [9, 18]  },
    { text: '☕ Debugging coffee',          zone: 'kitchen',     state: 'break',   duration: [12, 24]  },
    { text: '💧 Stress relief water',       zone: 'cooler',      state: 'break',   duration: [6, 15]  },
    { text: '🔥 It works on my machine',    zone: 'tester_desk', state: 'working', duration: [15, 30] },
    { text: '🤖 Writing automation',        zone: 'tester_desk', state: 'working', duration: [30, 60] },
    { text: '⚙️ Running CI/CD pipeline',   zone: 'tester_desk', state: 'working', duration: [18, 36] },
    { text: '🚨 Filing P0 bug',             zone: 'tester_desk', state: 'working', duration: [15, 30] },
    { text: '🙄 Marking as "won\'t fix"',   zone: 'tester_desk', state: 'working', duration: [12, 24]  },
    { text: '🕵️ Security scan',            zone: 'tester_desk', state: 'working', duration: [18, 42] },
    { text: '📊 Test coverage report',      zone: 'tester_desk', state: 'working', duration: [15, 30] },
    { text: '😱 0% test coverage!',         zone: 'meeting',     state: 'working', duration: [15, 36] },
    { text: '🐞 Edge case discovered',      zone: 'tester_desk', state: 'working', duration: [18, 36] },
    { text: '🔄 Flaky test investigation',  zone: 'tester_desk', state: 'working', duration: [24, 48] },
    { text: '🪲 Named bug after herself',   zone: 'tester_desk', state: 'working', duration: [12, 24]  },
    { text: '📜 Bug registry since 1947',   zone: 'tester_desk', state: 'working', duration: [15, 30] },
    { text: '🦗 Actual moth in the code',   zone: 'tester_desk', state: 'working', duration: [15, 30] },
    { text: '💀 Killed the process',        zone: 'tester_desk', state: 'working', duration: [9, 21]  },
    { text: '🔬 Examining specimen',        zone: 'tester_desk', state: 'working', duration: [18, 36] },
    { text: '📸 Bug screenshot #1337',      zone: 'printer',     state: 'working', duration: [9, 18]  },
    { text: '🧹 Cleaning up after Elon',    zone: 'tester_desk', state: 'working', duration: [15, 30] },
    { text: '😤 "That\'s a feature!"',      zone: 'meeting',     state: 'working', duration: [15, 30] },
    { text: '🕰️ Debugging COBOL (1959)',   zone: 'tester_desk', state: 'working', duration: [24, 48] },
    { text: '🚽 Reading bug reports',       zone: 'wc',          state: 'break',   duration: [12, 24]  },
    { text: '🧪 Running experiments',       zone: 'tester_desk', state: 'working', duration: [18, 36] },
    { text: '📋 Expected vs actual: 3hr',   zone: 'tester_desk', state: 'working', duration: [24, 48] },
  ],
};

export class Agent {
  constructor({ id, name, role, color, hairColor, startZone }) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.color = color;
    this.hairColor = hairColor;

    const startPos = ZONES[startZone];
    this.pos = { x: startPos.x, y: startPos.y };
    this.target = { x: startPos.x, y: startPos.y };

    this.state = 'idle';
    this.currentActivity = '';
    this.timer = rand(2, 5);
    this.animFrame = Math.random() * 100;
    this.direction = 'down';
    this.speed = 60;

    this.externalOverride = false;
    this.onStatusChange = null;
  }

  update(dt) {
    this.animFrame += dt * 30;
    if (this.externalOverride) return;
    this.timer -= dt;
    if (this.state === 'moving') {
      this._moveToTarget(dt);
    } else if (this.timer <= 0) {
      this._pickNextActivity();
    }
  }

  _moveToTarget(dt) {
    const dx = this.target.x - this.pos.x;
    const dy = this.target.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 2) {
      this.pos.x = this.target.x;
      this.pos.y = this.target.y;
      this._startActivity();
      return;
    }
    const move = Math.min(this.speed * dt, dist);
    this.pos.x += (dx / dist) * move;
    this.pos.y += (dy / dist) * move;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx > 0 ? 'right' : 'left';
    } else {
      this.direction = dy > 0 ? 'down' : 'up';
    }
  }

  _pickNextActivity() {
    let pool = this.role;
    if (this.role === 'ceo') {
      const hour = new Date().getHours();
      pool = (hour >= 9 && hour < 18) ? 'ceo_day' : 'ceo_evening';
    }
    const activities = ROLE_ACTIVITIES[pool];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    this._pendingActivity = activity;
    const zone = ZONES[activity.zone];
    this.target = {
      x: zone.x + rand(-8, 8),
      y: zone.y + rand(-8, 8),
    };
    this.state = 'moving';
    this.currentActivity = '🚶 Walking…';
    this._notify();
  }

  _startActivity() {
    const act = this._pendingActivity;
    if (!act) return;
    this.state = act.state;
    this.currentActivity = act.text;
    this.timer = rand(act.duration[0], act.duration[1]);
    this.direction = 'down';
    this._notify();
  }

  applyExternalEvent({ activity, state, zone, duration = 10 }) {
    this.externalOverride = true;
    this.state = 'moving';
    this.currentActivity = '🚶 Walking…';

    const targetZone = zone ? ZONES[zone] : { x: this.pos.x, y: this.pos.y };
    this.target = {
      x: targetZone.x + rand(-12, 12),
      y: targetZone.y + rand(-12, 12),
    };
    this._pendingActivity = { text: activity, state: state || 'working', duration: [duration, duration] };
    this._notify();

    setTimeout(() => {
      this.externalOverride = false;
      this.timer = 0;
    }, (duration + 5) * 1000);
  }

  _notify() {
    if (this.onStatusChange) this.onStatusChange(this);
  }
}

export function createAgents() {
  return [
    new Agent({ id: 'ceo',        name: 'Vitalii', role: 'ceo',        color: '#f0c040', hairColor: '#8a6020', startZone: 'ceo_desk'     }),
    new Agent({ id: 'dev',        name: 'Elon',    role: 'dev',        color: '#4080f0', hairColor: '#202040', startZone: 'dev_desk'     }),
    new Agent({ id: 'accountant', name: 'Satoshi', role: 'accountant', color: '#40c080', hairColor: '#804020', startZone: 'account_desk' }),
    new Agent({ id: 'manager',    name: 'Sheryl',  role: 'manager',    color: '#c040c0', hairColor: '#3a1a3a', startZone: 'manager_desk' }),
    new Agent({ id: 'tester',     name: 'Grace',   role: 'tester',     color: '#e05030', hairColor: '#1a0a0a', startZone: 'tester_desk'  }),
  ];
}

export const ROLE_LABELS = {
  ceo:        'Le Patron',
  dev:        'Sr. Staff Engineer',
  accountant: 'Accountant',
  manager:    'Office Manager',
  tester:     'Staff QA Engineer',
};

function rand(min, max) {
  return min + Math.random() * (max - min);
}
