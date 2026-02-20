import { ZONES } from './office.js';

// Draw a pixel-art character (bigger, ~24×52px)
export function drawCharacter(ctx, agent) {
  const { x, y } = agent.pos;
  const col = agent.color;
  const frame = agent.animFrame;
  const dir = agent.direction;
  const moving = agent.state === 'moving';

  ctx.save();

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(x, y + 18, 13, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walk bob
  const bob = moving ? Math.sin(frame * 0.35) * 2.5 : 0;

  // ── Legs ──────────────────────────────────────────────
  const legColor = '#1a1a2a';
  if (moving) {
    const swing = Math.sin(frame * 0.45) * 5;
    ctx.fillStyle = legColor;
    ctx.fillRect(x - 9,  y + 4 + bob, 7, 14 + swing);   // left leg
    ctx.fillRect(x + 2,  y + 4 + bob, 7, 14 - swing);   // right leg
    // Shoes
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(x - 10, y + 16 + bob + swing,  9, 4);
    ctx.fillRect(x + 1,  y + 16 + bob - swing,  9, 4);
  } else {
    ctx.fillStyle = legColor;
    ctx.fillRect(x - 9, y + 4, 7, 14);
    ctx.fillRect(x + 2, y + 4, 7, 14);
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(x - 10, y + 17, 9, 4);
    ctx.fillRect(x + 1,  y + 17, 9, 4);
  }

  // ── Body ──────────────────────────────────────────────
  // Shirt (role color)
  ctx.fillStyle = col;
  ctx.fillRect(x - 10, y - 14 + bob, 20, 20);

  // Collar / shirt detail
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(x - 3,  y - 14 + bob, 6, 5);   // collar

  // Pocket
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x + 3,  y - 8 + bob, 5, 5);

  // ── Arms ──────────────────────────────────────────────
  const armSwing = moving ? Math.sin(frame * 0.45) * 4 : 0;
  const skinColor = '#f5c5a0';
  ctx.fillStyle = col;
  ctx.fillRect(x - 16, y - 12 + bob + armSwing,  6, 14);  // left arm
  ctx.fillRect(x + 10, y - 12 + bob - armSwing,  6, 14);  // right arm
  // Hands
  ctx.fillStyle = skinColor;
  ctx.fillRect(x - 16, y + 1 + bob + armSwing,   6, 5);
  ctx.fillRect(x + 10, y + 1 + bob - armSwing,   6, 5);

  // ── Head ──────────────────────────────────────────────
  ctx.fillStyle = skinColor;
  ctx.fillRect(x - 9, y - 32 + bob, 18, 18);

  // Neck
  ctx.fillStyle = skinColor;
  ctx.fillRect(x - 4, y - 15 + bob, 8, 4);

  // Hair
  ctx.fillStyle = agent.hairColor;
  ctx.fillRect(x - 9, y - 32 + bob, 18, 6);   // top hair
  ctx.fillRect(x - 9, y - 32 + bob, 3, 12);   // side hair left
  ctx.fillRect(x + 6, y - 32 + bob, 3, 12);   // side hair right

  // Eyes
  ctx.fillStyle = '#1a1a2a';
  if (dir === 'left') {
    ctx.fillRect(x - 7, y - 22 + bob, 4, 4);
  } else if (dir === 'right') {
    ctx.fillRect(x + 3, y - 22 + bob, 4, 4);
  } else {
    ctx.fillRect(x - 7, y - 22 + bob, 4, 4);
    ctx.fillRect(x + 3, y - 22 + bob, 4, 4);
  }
  // Eye shine
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  if (dir === 'left') {
    ctx.fillRect(x - 6, y - 22 + bob, 1, 1);
  } else if (dir === 'right') {
    ctx.fillRect(x + 4, y - 22 + bob, 1, 1);
  } else {
    ctx.fillRect(x - 6, y - 22 + bob, 1, 1);
    ctx.fillRect(x + 4, y - 22 + bob, 1, 1);
  }

  // Mouth — smile when on break, neutral otherwise
  ctx.fillStyle = '#8a5040';
  if (agent.state === 'break') {
    ctx.fillRect(x - 4, y - 16 + bob, 2, 2);
    ctx.fillRect(x - 2, y - 15 + bob, 5, 2);
    ctx.fillRect(x + 3, y - 16 + bob, 2, 2);
  } else {
    ctx.fillRect(x - 3, y - 15 + bob, 6, 2);
  }

  // ── Role badge (colored dot above head) ──────────────
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(x, y - 37 + bob, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.arc(x - 1, y - 38 + bob, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw name + status speech bubble above character (or below if near top edge)
export function drawStatusBubble(ctx, agent) {
  const { x, y } = agent.pos;
  const name = agent.name;
  const status = agent.currentActivity;
  const bob = (agent.state === 'moving') ? Math.sin(agent.animFrame * 0.35) * 2.5 : 0;

  // Draw bubble below if it would clip off the top of the canvas
  // Name box top = (y - 56) - 13 = y - 69; need at least 4px clearance
  const above = (y - 69 + bob) >= 4;

  ctx.save();
  ctx.textAlign = 'center';

  if (above) {
    // Standard: bubble above the character
    const bubbleY = y - 56 + bob;

    ctx.font = 'bold 10px Courier New';
    const nameW = ctx.measureText(name).width + 12;
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    roundRect(ctx, x - nameW / 2, bubbleY - 13, nameW, 13, 3);
    ctx.fill();
    ctx.fillStyle = agent.color;
    ctx.fillText(name, x, bubbleY - 2);

    if (status) {
      ctx.font = '9px Courier New';
      const maxLen = 20;
      const display = status.length > maxLen ? status.slice(0, maxLen) + '…' : status;
      const statusW = Math.min(ctx.measureText(display).width + 12, 120);
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      roundRect(ctx, x - statusW / 2, bubbleY + 1, statusW, 13, 3);
      ctx.fill();
      ctx.fillStyle = '#cccccc';
      ctx.fillText(display, x, bubbleY + 12);
    }
  } else {
    // Near top edge: draw bubble below the character's feet
    const bubbleY = y + 24 + bob;

    ctx.font = 'bold 10px Courier New';
    const nameW = ctx.measureText(name).width + 12;
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    roundRect(ctx, x - nameW / 2, bubbleY, nameW, 13, 3);
    ctx.fill();
    ctx.fillStyle = agent.color;
    ctx.fillText(name, x, bubbleY + 11);

    if (status) {
      ctx.font = '9px Courier New';
      const maxLen = 20;
      const display = status.length > maxLen ? status.slice(0, maxLen) + '…' : status;
      const statusW = Math.min(ctx.measureText(display).width + 12, 120);
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      roundRect(ctx, x - statusW / 2, bubbleY + 15, statusW, 13, 3);
      ctx.fill();
      ctx.fillStyle = '#cccccc';
      ctx.fillText(display, x, bubbleY + 26);
    }
  }

  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Draw office objects (cooler, kitchen appliances, printer, plants)
export function drawOfficeObjects(ctx) {
  // Water cooler
  drawCooler(ctx, ZONES.cooler.x, ZONES.cooler.y);

  // Kitchen fridge & counter
  drawKitchen(ctx, ZONES.kitchen.x - 16, ZONES.kitchen.y);

  // Printer
  drawPrinter(ctx, ZONES.printer.x, ZONES.printer.y);

  // Meeting table
  drawMeetingTable(ctx, ZONES.meeting.x, ZONES.meeting.y);


  // WC
  drawWC(ctx, ZONES.wc.x, ZONES.wc.y);
}

function drawCooler(ctx, x, y) {
  ctx.save();
  // Tank
  ctx.fillStyle = '#2a4a6a';
  ctx.fillRect(x - 7, y - 20, 14, 24);
  // Water bottle
  ctx.fillStyle = '#4a8aaa';
  ctx.fillRect(x - 4, y - 28, 8, 10);
  // Blue water highlight
  ctx.fillStyle = 'rgba(100,200,255,0.4)';
  ctx.fillRect(x - 6, y - 10, 12, 12);
  // Label
  ctx.font = '6px Courier New';
  ctx.fillStyle = '#7af';
  ctx.textAlign = 'center';
  ctx.fillText('H₂O', x, y - 4);
  ctx.restore();
}

function drawKitchen(ctx, x, y) {
  ctx.save();
  // Counter
  ctx.fillStyle = '#4a3a2a';
  ctx.fillRect(x - 20, y - 10, 40, 20);
  // Fridge
  ctx.fillStyle = '#5a5a6a';
  ctx.fillRect(x - 18, y - 28, 16, 20);
  ctx.fillStyle = '#6a6a7a';
  ctx.fillRect(x - 17, y - 27, 14, 8); // freezer
  ctx.fillStyle = '#333';
  ctx.fillRect(x - 5, y - 18, 2, 1); // handle
  // Microwave
  ctx.fillStyle = '#3a3a4a';
  ctx.fillRect(x + 2, y - 28, 14, 10);
  ctx.fillStyle = '#1a2a3a';
  ctx.fillRect(x + 4, y - 26, 7, 6); // door
  // Coffee mug
  ctx.fillStyle = '#8a5a3a';
  ctx.fillRect(x - 2, y - 12, 6, 6);
  ctx.fillStyle = '#aa7a5a';
  ctx.fillRect(x - 1, y - 11, 4, 4);
  ctx.restore();
}

function drawPrinter(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#3a3a4a';
  ctx.fillRect(x - 12, y - 8, 24, 14);
  // Paper slot
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(x - 8, y - 6, 16, 2);
  // LED
  ctx.fillStyle = '#00ff88';
  ctx.fillRect(x + 7, y - 4, 3, 3);
  ctx.font = '6px Courier New';
  ctx.fillStyle = '#777';
  ctx.textAlign = 'center';
  ctx.fillText('PRINT', x, y + 8);
  ctx.restore();
}

function drawMeetingTable(ctx, x, y) {
  ctx.save();
  // Large oval table
  ctx.fillStyle = '#3a2a4a';
  ctx.beginPath();
  ctx.ellipse(x, y, 52, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5a4a6a';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Table surface reflection
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.beginPath();
  ctx.ellipse(x, y - 8, 30, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawOpenClawPoster(ctx, x, y) {
  ctx.save();
  const pw = 158, ph = 54;

  // Poster frame
  ctx.fillStyle = '#0e0008';
  roundRect(ctx, x - pw / 2, y, pw, ph, 4);
  ctx.fill();
  ctx.strokeStyle = '#cc2200';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Inner glow border
  ctx.strokeStyle = 'rgba(255,80,30,0.25)';
  ctx.lineWidth = 1;
  roundRect(ctx, x - pw / 2 + 3, y + 3, pw - 6, ph - 6, 3);
  ctx.stroke();

  // Pixel lobster (left half of poster)
  drawPixelLobster(ctx, x - 38, y + 36, 1);

  // "OpenClaw" logotype (right half)
  ctx.font = 'bold 13px Courier New';
  ctx.fillStyle = '#ff4422';
  ctx.textAlign = 'left';
  ctx.fillText('OpenClaw', x - 4, y + 24);

  ctx.font = '7px Courier New';
  ctx.fillStyle = '#992211';
  ctx.fillText('AI  PLATFORM', x - 2, y + 36);

  ctx.font = '6px Courier New';
  ctx.fillStyle = '#551100';
  ctx.fillText('openclaw.ai', x - 2, y + 46);

  ctx.restore();
}

// Large semi-transparent OpenClaw floor logo — drawn under everything
export function drawOpenClawCenter(ctx) {
  ctx.save();
  // Sit in the open corridor between top desks and meeting room
  const cx = 400, cy = 148, sc = 2.0;
  ctx.globalAlpha = 0.28;
  drawPixelLobster(ctx, cx, cy, sc);
  ctx.restore();
}

function drawPixelLobster(ctx, cx, cy, scale = 1) {
  // Pixel-art lobster, front-facing, ~34px wide × 46px tall
  // cx/cy = bottom-center of the lobster
  const R  = '#cc2200';   // dark red
  const OR = '#ee4422';   // orange-red body
  const HI = '#ff7755';   // highlight
  const DK = '#881100';   // dark shadow

  function r(dx, dy, w, h, col) {
    ctx.fillStyle = col;
    ctx.fillRect(cx + dx * scale, cy + dy * scale, w * scale, h * scale);
  }

  // ── Antennae ──────────────────────────────────────────
  r(-4, -44, 1, 10, DK);   r(-7, -48, 3,  1, DK);  r(-9, -50, 2, 2, DK);
  r( 3, -44, 1, 10, DK);   r( 4, -48, 3,  1, DK);  r( 7, -50, 2, 2, DK);

  // ── Eye stalks & eyes ────────────────────────────────
  r(-5, -38, 3, 6, R);     r(2, -38, 3, 6, R);
  r(-6, -40, 4, 4, '#fff');r(2, -40, 4, 4, '#fff');  // whites
  r(-5, -39, 2, 2, '#111');r(3, -39, 2, 2, '#111');  // pupils
  r(-4, -38, 1, 1, '#fff');r(4, -38, 1, 1, '#fff');  // shine

  // ── Head / carapace ──────────────────────────────────
  r(-6, -34, 12, 12, OR);
  r(-5, -33, 10,  2, HI);   // top highlight
  r(-4, -28,  8,  2, HI);   // mid highlight

  // ── Left claw ─────────────────────────────────────────
  r(-14, -28, 8, 3, OR);    // left arm
  r(-20, -34, 8, 10, OR);   // left claw body
  r(-20, -36, 6,  4, R);    // top pincer
  r(-20, -24, 6,  3, R);    // bottom pincer
  r(-21, -28, 7,  4, '#0e0008'); // pincer gap
  r(-19, -35, 4,  2, HI);   // claw highlight

  // ── Right claw ────────────────────────────────────────
  r(  6, -28, 8, 3, OR);    // right arm
  r( 12, -34, 8, 10, OR);   // right claw body
  r( 14, -36, 6,  4, R);    // top pincer
  r( 14, -24, 6,  3, R);    // bottom pincer
  r( 14, -28, 7,  4, '#0e0008'); // pincer gap
  r( 15, -35, 4,  2, HI);   // claw highlight

  // ── Abdomen segments ─────────────────────────────────
  r(-5, -22, 10, 4, OR);  r(-4, -21, 8, 2, HI);
  r(-5, -18, 10, 4, OR);  r(-4, -17, 8, 2, HI);
  r(-4, -14,  8, 4, OR);  r(-3, -13, 6, 2, HI);
  r(-4, -10,  8, 4, R);   r(-3,  -9, 6, 2, OR);

  // ── Walking legs (3 pairs) ────────────────────────────
  r(-8, -22, 2, 10, DK);  r( 6, -22, 2, 10, DK);
  r(-8, -18, 2,  8, DK);  r( 6, -18, 2,  8, DK);
  r(-7, -14, 2,  6, DK);  r( 5, -14, 2,  6, DK);

  // ── Tail fan ─────────────────────────────────────────
  r(-9,  -8, 5, 7, OR);   r(-8,  -7, 3, 4, HI);
  r(-3,  -8, 6, 9, OR);   r(-2,  -7, 4, 5, HI);
  r( 4,  -8, 5, 7, OR);   r( 5,  -7, 3, 4, HI);
  // tail tips darker
  r(-9,  -2, 5, 2, R);
  r(-3,  -1, 6, 2, R);
  r( 4,  -2, 5, 2, R);
}

function drawWC(ctx, x, y) {
  ctx.save();
  // Door frame
  ctx.fillStyle = '#1a2a3a';
  ctx.fillRect(x - 22, y - 30, 44, 40);
  // Door
  ctx.fillStyle = '#2a3a4a';
  ctx.fillRect(x - 18, y - 26, 18, 32);
  ctx.fillRect(x + 2,  y - 26, 18, 32);
  // Door handles
  ctx.fillStyle = '#aaaacc';
  ctx.fillRect(x - 4, y - 8, 4, 2);
  ctx.fillRect(x + 2, y - 8, 4, 2);
  // WC sign
  ctx.font = 'bold 9px Courier New';
  ctx.fillStyle = '#88aacc';
  ctx.textAlign = 'center';
  ctx.fillText('WC', x, y - 32);
  // Man/woman icons
  ctx.font = '10px Courier New';
  ctx.fillText('🚹', x - 10, y - 14);
  ctx.fillText('🚺', x + 10, y - 14);
  ctx.restore();
}
