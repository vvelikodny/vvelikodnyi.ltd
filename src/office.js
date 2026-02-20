// Office map constants
export const TILE = 16;
export const COLS = 50;
export const ROWS = 37;
export const W = 800;
export const H = 600;

// Tile types
const T = {
  FLOOR:    0,
  WALL:     1,
  DESK:     2,
  COOLER:   3,
  KITCHEN:  4,
  MEETING:  5,
  PRINTER:  6,
  WINDOW:   7,
  PLANT:    8,
  RUG:      9,
  WC:       10,
};

// Tile colors
const TILE_COLORS = {
  [T.FLOOR]:   '#1a1a2e',
  [T.WALL]:    '#0d0d1a',
  [T.DESK]:    '#2d4a2d',
  [T.COOLER]:  '#1a3a4a',
  [T.KITCHEN]: '#3a2a1a',
  [T.MEETING]: '#2a1a3a',
  [T.PRINTER]: '#3a3a1a',
  [T.WINDOW]:  '#1a3a5a',
  [T.PLANT]:   '#0a2a0a',
  [T.RUG]:     '#22182a',
  [T.WC]:      '#1a2a3a',
};

// Map grid (50×37 tiles = 800×592px)
// Manually laid out office
function buildMap() {
  const m = Array.from({ length: ROWS }, () => Array(COLS).fill(T.FLOOR));

  // Outer walls
  for (let c = 0; c < COLS; c++) { m[0][c] = T.WALL; m[ROWS-1][c] = T.WALL; }
  for (let r = 0; r < ROWS; r++) { m[r][0] = T.WALL; m[r][COLS-1] = T.WALL; }

  // Windows along top wall
  for (let c = 2; c < COLS-2; c += 4) { m[0][c] = T.WINDOW; m[0][c+1] = T.WINDOW; }

  // CEO zone — top-left (rows 2-8, cols 1-10)
  for (let r = 2; r <= 7; r++) for (let c = 1; c <= 10; c++) m[r][c] = T.RUG;
  m[3][3] = T.DESK; m[3][4] = T.DESK; m[4][3] = T.DESK; m[4][4] = T.DESK;

  // Dev desk — top-right (rows 2-8, cols 35-45)
  for (let r = 2; r <= 7; r++) for (let c = 35; c <= 45; c++) m[r][c] = T.RUG;
  m[3][38] = T.DESK; m[3][39] = T.DESK;

  // Accountant desk — bottom-left (rows 22-30, cols 1-12)
  for (let r = 22; r <= 29; r++) for (let c = 1; c <= 12; c++) m[r][c] = T.RUG;
  m[24][3] = T.DESK; m[24][4] = T.DESK;

  // Manager desk — bottom-right (rows 22-30, cols 34-46)
  for (let r = 22; r <= 29; r++) for (let c = 34; c <= 46; c++) m[r][c] = T.RUG;
  m[24][38] = T.DESK; m[24][39] = T.DESK;

  // Tester desk — bottom-center (rows 22-29, cols 20-30)
  for (let r = 22; r <= 29; r++) for (let c = 20; c <= 30; c++) m[r][c] = T.RUG;
  m[24][24] = T.DESK; m[24][25] = T.DESK;

  // Meeting zone — center (rows 12-20, cols 18-32)
  for (let r = 12; r <= 20; r++) for (let c = 18; c <= 32; c++) m[r][c] = T.MEETING;
  // Meeting table
  for (let r = 14; r <= 18; r++) for (let c = 21; c <= 29; c++) m[r][c] = T.DESK;

  // Water cooler — top-center-right (row 2-4, cols 25-27)
  m[3][26] = T.COOLER; m[4][26] = T.COOLER;

  // Kitchen — right side (rows 10-18, cols 44-48)
  for (let r = 10; r <= 18; r++) for (let c = 44; c <= 48; c++) m[r][c] = T.KITCHEN;

  // Printer — left side (rows 12-14, cols 2-5)
  m[13][3] = T.PRINTER; m[13][4] = T.PRINTER;

  // WC — bottom-left corner (rows 31-35, cols 1-7)
  for (let r = 31; r <= 35; r++) for (let c = 1; c <= 7; c++) m[r][c] = T.WC;
  // WC inner walls/stalls
  m[31][1] = T.WALL; m[31][7] = T.WALL;
  m[35][1] = T.WALL; m[35][7] = T.WALL;

  // Plants decoration
  m[2][COLS-2] = T.PLANT;
  m[ROWS-2][2] = T.PLANT;
  m[ROWS-2][COLS-2] = T.PLANT;

  return m;
}

export const MAP = buildMap();

// Named zones — center pixel coords for each zone type
export const ZONES = {
  ceo_desk:     { x: 64,  y: 64  },
  dev_desk:     { x: 616, y: 56  },
  account_desk: { x: 64,  y: 392 },
  manager_desk: { x: 616, y: 392 },
  tester_desk:  { x: 392, y: 392 },
  cooler:       { x: 416, y: 56  },
  kitchen:      { x: 736, y: 224 },
  meeting:      { x: 400, y: 256 },
  printer:      { x: 56,  y: 208 },
  corridor:     { x: 400, y: 128 },
  corridor2:    { x: 400, y: 464 },
  wc:           { x: 64,  y: 528 },
};

export function renderMap(ctx) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tile = MAP[r][c];
      ctx.fillStyle = TILE_COLORS[tile];
      ctx.fillRect(c * TILE, r * TILE, TILE, TILE);

      // Subtle grid lines on floor
      if (tile === T.FLOOR || tile === T.RUG) {
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(c * TILE, r * TILE, 1, TILE);
        ctx.fillRect(c * TILE, r * TILE, TILE, 1);
      }
    }
  }

  // Zone labels
  ctx.font = '8px Courier New';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.textAlign = 'center';
  drawZoneLabel(ctx, 'CEO', ZONES.ceo_desk.x, ZONES.ceo_desk.y - 24);
  drawZoneLabel(ctx, 'DEV', ZONES.dev_desk.x, ZONES.dev_desk.y - 24);
  drawZoneLabel(ctx, 'ACCT', ZONES.account_desk.x, ZONES.account_desk.y - 24);
  drawZoneLabel(ctx, 'MGR', ZONES.manager_desk.x, ZONES.manager_desk.y - 24);
  drawZoneLabel(ctx, 'QA', ZONES.tester_desk.x, ZONES.tester_desk.y - 24);
  drawZoneLabel(ctx, '💧', ZONES.cooler.x, ZONES.cooler.y - 12);
  drawZoneLabel(ctx, '☕', ZONES.kitchen.x - 16, ZONES.kitchen.y);
  drawZoneLabel(ctx, 'MEETING', ZONES.meeting.x, ZONES.meeting.y + 4);
  drawZoneLabel(ctx, '🖨️', ZONES.printer.x, ZONES.printer.y - 8);
  drawZoneLabel(ctx, 'WC', ZONES.wc.x, ZONES.wc.y - 24);
}

function drawZoneLabel(ctx, text, x, y) {
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillText(text, x, y);
}
