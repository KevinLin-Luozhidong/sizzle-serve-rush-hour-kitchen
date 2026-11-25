// Every pixel of the kitchen, drawn on canvas: tiled wall, wooden counter,
// chalk order board, the plate, the grill, the ingredient bins and the
// title / paused / game-over overlays. No images, no fonts from the network.
import { FIELD, ING, INGREDIENTS, LAYOUT } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_OVER = 'over';

const FONT = "'Trebuchet MS', Verdana, sans-serif";

function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function text(ctx, str, x, y, size, color, weight = 'bold', align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(str, x, y);
}

function heart(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s, y - s * 0.45, x - s * 0.45, y - s, x, y - s * 0.35);
  ctx.bezierCurveTo(x + s * 0.45, y - s, x + s, y - s * 0.45, x, y + s * 0.35);
  ctx.fill();
}

/** One ingredient, drawn at (x, y) with width w (height ~ w * 0.42). */
export function drawIngredient(ctx, id, x, y, w) {
  const h = w * 0.42;
  ctx.save();
  ctx.translate(x, y);
  if (id === ING.BUN_BOT) {
    ctx.fillStyle = '#e8a94e';
    rr(ctx, 0, 0, w, h * 0.8, 6); ctx.fill();
    ctx.fillStyle = '#d18f2e';
    rr(ctx, 0, h * 0.55, w, h * 0.25, 4); ctx.fill();
    ctx.fillStyle = '#f7cf8a';
    for (let i = 0; i < 4; i += 1) { ctx.beginPath(); ctx.ellipse(w * (0.2 + i * 0.2), h * 0.3, 3, 2, 0, 0, Math.PI * 2); ctx.fill(); }
  } else if (id === ING.BUN_TOP) {
    ctx.fillStyle = '#e8a94e';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.quadraticCurveTo(0, -h * 0.7, w / 2, -h * 0.7);
    ctx.quadraticCurveTo(w, -h * 0.7, w, h);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f7cf8a';
    for (let i = 0; i < 3; i += 1) { ctx.beginPath(); ctx.ellipse(w * (0.28 + i * 0.22), -h * 0.25, 3.5, 2.2, 0, 0, Math.PI * 2); ctx.fill(); }
  } else if (id === ING.PATTY) {
    ctx.fillStyle = '#7a4a21';
    rr(ctx, 0, 0, w, h * 0.9, 8); ctx.fill();
    ctx.fillStyle = '#5d3413';
    for (let i = 0; i < 5; i += 1) { ctx.beginPath(); ctx.arc(w * (0.14 + i * 0.18), h * 0.45, 2.5, 0, Math.PI * 2); ctx.fill(); }
  } else if (id === ING.CHEESE) {
    ctx.fillStyle = '#ffc53d';
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, h * 0.7);
    ctx.lineTo(w * 0.72, h * 0.35); ctx.lineTo(w * 0.5, h * 0.75);
    ctx.lineTo(w * 0.28, h * 0.35); ctx.lineTo(0, h * 0.7);
    ctx.closePath(); ctx.fill();
  } else if (id === ING.LETTUCE) {
    ctx.fillStyle = '#6ab04c';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.55);
    for (let i = 0; i < 4; i += 1) ctx.quadraticCurveTo(w * (0.125 + i * 0.25), -h * 0.35, w * (0.25 + i * 0.25), h * 0.55);
    ctx.lineTo(w, h * 0.8); ctx.lineTo(0, h * 0.8);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#4e8a35'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(w * 0.1, h * 0.5); ctx.lineTo(w * 0.9, h * 0.5); ctx.stroke();
  } else if (id === ING.TOMATO) {
    ctx.fillStyle = '#e4572e';
    ctx.beginPath(); ctx.ellipse(w / 2, h * 0.45, w / 2, h * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f4845f';
    ctx.beginPath(); ctx.ellipse(w / 2, h * 0.45, w * 0.32, h * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c23d1a';
    for (let i = 0; i < 3; i += 1) { ctx.beginPath(); ctx.arc(w * (0.3 + i * 0.2), h * 0.45, 2, 0, Math.PI * 2); ctx.fill(); }
  } else if (id === ING.ONION) {
    ctx.strokeStyle = '#c9a7d8'; ctx.lineWidth = 5;
    for (let r = 0.5; r > 0.12; r -= 0.14) {
      ctx.beginPath(); ctx.ellipse(w / 2, h * 0.45, (w / 2) * r, h * 0.5 * r, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = '#efe6f5';
    ctx.beginPath(); ctx.arc(w / 2, h * 0.45, 3, 0, Math.PI * 2); ctx.fill();
  } else if (id === ING.SAUCE) {
    ctx.strokeStyle = '#ff8c42'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(2, h * 0.25);
    for (let i = 0; i < 4; i += 1) ctx.lineTo(w * (0.2 + i * 0.2), i % 2 ? h * 0.75 : h * 0.25);
    ctx.stroke();
  }
  ctx.restore();
}

function plateMatches(state) {
  return state.tickets.some(
    (t) => t.dish.stack.length === state.plate.length
      && t.dish.stack.every((ing, i) => ing === state.plate[i]),
  );
}

export function createRenderer(canvas) {
  canvas.width = FIELD.width;
  canvas.height = FIELD.height;
  const ctx = canvas.getContext('2d');

  function drawKitchen(state) {
    // Wall: warm cream with a terracotta tile band.
    ctx.fillStyle = '#f7e8c8';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = '#e8b48a';
    ctx.fillRect(0, 64, FIELD.width, 74);
    ctx.strokeStyle = '#d89a6a'; ctx.lineWidth = 2;
    for (let x = 0; x < FIELD.width; x += 64) { ctx.beginPath(); ctx.moveTo(x, 64); ctx.lineTo(x, 138); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(0, 101); ctx.lineTo(FIELD.width, 101); ctx.stroke();
    // Hanging lamps.
    for (const lx of [440, 640, 840]) {
      ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, 26); ctx.stroke();
      ctx.fillStyle = '#ffc53d';
      ctx.beginPath(); ctx.moveTo(lx - 22, 26); ctx.lineTo(lx + 22, 26); ctx.lineTo(lx + 12, 48); ctx.lineTo(lx - 12, 48); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255, 197, 61, 0.18)';
      ctx.beginPath(); ctx.moveTo(lx - 22, 48); ctx.lineTo(lx + 22, 48); ctx.lineTo(lx + 60, 138); ctx.lineTo(lx - 60, 138); ctx.closePath(); ctx.fill();
    }
    // Wooden counter band behind the bins.
    ctx.fillStyle = '#a06a35';
    ctx.fillRect(0, 548, FIELD.width, 8);
    ctx.fillStyle = '#8a5a2b';
    ctx.fillRect(0, 556, FIELD.width, 164);
    ctx.fillStyle = '#754a20';
    for (let x = 0; x < FIELD.width; x += 128) ctx.fillRect(x, 556, 3, 164);
  }

  function drawTopBar(state, best) {
    const b = LAYOUT.topBar;
    ctx.fillStyle = '#5d3413';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = '#7a4a21';
    ctx.fillRect(b.x, b.y + b.h - 6, b.w, 6);
    text(ctx, 'SIZZLE & SERVE', 20, 42, 28, '#ffc53d');
    text(ctx, 'Rush Hour Kitchen', 268, 40, 15, '#f7e8c8', 'normal');
    // Day clock.
    const mm = Math.floor(state.dayLeft / 60);
    const ss = Math.floor(state.dayLeft % 60).toString().padStart(2, '0');
    ctx.fillStyle = state.dayLeft <= 20 ? '#ff6b5e' : '#fff8e7';
    ctx.beginPath(); ctx.arc(560, 32, 20, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#5d3413'; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = '#5d3413'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(560, 32); ctx.lineTo(560, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(560, 32); ctx.lineTo(570, 35); ctx.stroke();
    text(ctx, `${mm}:${ss}`, 588, 41, 26, state.dayLeft <= 20 ? '#ff8c7a' : '#fff8e7');
    // Day progress bar.
    const frac = Math.max(0, state.dayLeft / 150);
    ctx.fillStyle = '#3d220c'; rr(ctx, 660, 24, 130, 16, 8); ctx.fill();
    ctx.fillStyle = frac > 0.5 ? '#6ab04c' : frac > 0.25 ? '#ffc53d' : '#e4572e';
    rr(ctx, 660, 24, 130 * frac, 16, 8); ctx.fill();
    text(ctx, `SCORE ${state.score}`, 820, 41, 24, '#fff8e7');
    if (state.combo >= 2) text(ctx, `COMBO x${state.combo}`, 1000, 41, 22, '#ff8c42');
    for (let i = 0; i < 3; i += 1) heart(ctx, 1150 + i * 30, 32, 11, i < state.hearts ? '#ff5e7a' : '#4a2c14');
    text(ctx, `LV ${state.level}`, 1240, 41, 18, '#ffc53d', 'bold', 'right');
  }

  function drawBoard(state, need) {
    const bd = LAYOUT.board;
    ctx.fillStyle = '#2f4f3e';
    rr(ctx, bd.x, bd.y, bd.w, bd.h, 12); ctx.fill();
    ctx.strokeStyle = '#c9a86a'; ctx.lineWidth = 3; rr(ctx, bd.x, bd.y, bd.w, bd.h, 12); ctx.stroke();
    text(ctx, 'ORDER BOARD', bd.x + 16, bd.y + 30, 20, '#fff8e7');
    text(ctx, `Served: ${state.served}`, bd.x + bd.w - 16, bd.y + 30, 15, '#c9e7c9', 'normal', 'right');
    if (state.tickets.length === 0) {
      text(ctx, 'No orders yet…', bd.x + 16, bd.y + 90, 17, '#c9e7c9', 'normal');
      text(ctx, 'Tickets arrive soon!', bd.x + 16, bd.y + 118, 15, '#9dbfa9', 'normal');
    }
    state.tickets.forEach((ticket, i) => {
      const tx = bd.x + 8;
      const ty = bd.y + 44 + i * (LAYOUT.ticket.h + LAYOUT.ticket.gap);
      const selected = ticket.id === state.selectedId;
      const urgent = ticket.patience < 10;
      ctx.fillStyle = '#fff8e7';
      rr(ctx, tx, ty, LAYOUT.ticket.w, LAYOUT.ticket.h, 10); ctx.fill();
      if (selected) { ctx.strokeStyle = '#ffc53d'; ctx.lineWidth = 4; rr(ctx, tx, ty, LAYOUT.ticket.w, LAYOUT.ticket.h, 10); ctx.stroke(); }
      else if (urgent) { ctx.strokeStyle = Math.floor(state.time * 4) % 2 ? '#e4572e' : '#fff8e7'; ctx.lineWidth = 3; rr(ctx, tx, ty, LAYOUT.ticket.w, LAYOUT.ticket.h, 10); ctx.stroke(); }
      text(ctx, `#${ticket.id} ${ticket.dish.name}`, tx + 12, ty + 24, 17, '#3d220c');
      text(ctx, `$${ticket.dish.price}`, tx + LAYOUT.ticket.w - 12, ty + 24, 17, '#2e7d32', 'bold', 'right');
      // Required stack, bottom to top, left to right.
      ticket.dish.stack.forEach((ing, j) => {
        const ix = tx + 12 + j * 34;
        const iy = ty + 44;
        const isNext = selected && j === state.plate.length
          && state.plate.every((p, k) => p === ticket.dish.stack[k]);
        if (isNext) {
          ctx.fillStyle = 'rgba(255, 197, 61, 0.5)';
          ctx.beginPath(); ctx.arc(ix + 13, iy + 8, 17, 0, Math.PI * 2); ctx.fill();
        }
        drawIngredient(ctx, ing, ix, iy, 26);
      });
      // Patience bar.
      const pf = Math.max(0, ticket.patience / ticket.maxPatience);
      ctx.fillStyle = '#e0d5bd'; rr(ctx, tx + 12, ty + 82, LAYOUT.ticket.w - 24, 10, 5); ctx.fill();
      ctx.fillStyle = pf > 0.5 ? '#6ab04c' : pf > 0.25 ? '#ff8c42' : '#e4572e';
      rr(ctx, tx + 12, ty + 82, (LAYOUT.ticket.w - 24) * pf, 10, 5); ctx.fill();
    });
    text(ctx, 'Click a ticket to work on it', bd.x + 16, bd.y + bd.h - 10, 13, '#9dbfa9', 'normal');
  }

  function drawPlateZone(state, need) {
    const p = LAYOUT.plate;
    text(ctx, 'YOUR PLATE', p.cx, p.cy - 150, 18, '#5d3413', 'bold', 'center');
    // Plate.
    ctx.fillStyle = '#fdfdfd';
    ctx.beginPath(); ctx.ellipse(p.cx, p.cy, p.rx, p.ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#c9c9c9'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#e8e8e8';
    ctx.beginPath(); ctx.ellipse(p.cx, p.cy, p.rx - 26, p.ry - 9, 0, 0, Math.PI * 2); ctx.fill();
    if (state.plate.length === 0) {
      text(ctx, 'Empty plate — build the ticket order!', p.cx, p.cy - 44, 15, '#8a5a2b', 'normal', 'center');
    } else {
      state.plate.forEach((ing, i) => {
        const w = 250 - i * 3;
        const y = p.cy - 16 - i * 24;
        drawIngredient(ctx, ing, p.cx - w / 2, y - 10, w);
      });
    }
    // Serve / trash buttons.
    const ready = plateMatches(state);
    const sv = LAYOUT.serve;
    const pulse = ready ? 0.75 + 0.25 * Math.sin(state.time * 6) : 1;
    ctx.save();
    if (ready) { ctx.shadowColor = '#2e7d32'; ctx.shadowBlur = 24 * pulse; }
    ctx.fillStyle = ready ? '#2e7d32' : '#9aa39a';
    rr(ctx, sv.x, sv.y, sv.w, sv.h, 12); ctx.fill();
    ctx.restore();
    text(ctx, 'SERVE!', sv.x + sv.w / 2, sv.y + 36, 22, '#ffffff', 'bold', 'center');
    const tr = LAYOUT.trash;
    ctx.fillStyle = '#b0563a';
    rr(ctx, tr.x, tr.y, tr.w, tr.h, 10); ctx.fill();
    text(ctx, 'Trash (T)', tr.x + tr.w / 2, tr.y + 27, 15, '#ffffff', 'bold', 'center');
    if (state.hint) text(ctx, state.hint, p.cx, 545, 16, '#b03024', 'bold', 'center');
  }

  function drawGrill(state) {
    const g = LAYOUT.grill;
    ctx.fillStyle = '#3a3f44';
    rr(ctx, g.x, g.y, g.w, g.h, 12); ctx.fill();
    ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 3; rr(ctx, g.x, g.y, g.w, g.h, 12); ctx.stroke();
    text(ctx, 'GRILL', g.x + 16, g.y + 30, 20, '#fff8e7');
    text(ctx, 'Patty (2) cooks here', g.x + g.w - 16, g.y + 30, 13, '#c9c9c9', 'normal', 'right');
    state.grill.forEach((slot, i) => {
      const sx = g.x + 22 + i * 132;
      const sy = g.y + 52;
      // Grate.
      ctx.fillStyle = '#22252a';
      rr(ctx, sx, sy, 116, 116, 10); ctx.fill();
      ctx.strokeStyle = '#4a4f55'; ctx.lineWidth = 3;
      for (let k = 1; k < 5; k += 1) { ctx.beginPath(); ctx.moveTo(sx + 8, sy + k * 22); ctx.lineTo(sx + 108, sy + k * 22); ctx.stroke(); }
      if (slot.state !== 'empty') {
        const cx = sx + 58;
        const cy = sy + 58;
        // Progress ring while cooking.
        if (slot.state === 'cooking') {
          ctx.strokeStyle = '#ffc53d'; ctx.lineWidth = 6;
          ctx.beginPath(); ctx.arc(cx, cy, 46, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, slot.t / 4)); ctx.stroke();
        }
        const color = slot.state === 'cooking'
          ? (slot.t < 2 ? '#d98a7a' : '#9a5a30')
          : slot.state === 'ready' ? '#7a4a21' : '#232323';
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(cx, cy, 38, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.beginPath(); ctx.arc(cx - 10, cy - 12, 12, 0, Math.PI * 2); ctx.fill();
        if (slot.state === 'burnt') {
          // Smoke puffs.
          ctx.fillStyle = 'rgba(120,120,120,0.7)';
          ctx.beginPath(); ctx.arc(cx - 8, cy - 52, 9, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + 10, cy - 62, 12, 0, Math.PI * 2); ctx.fill();
        }
        if (slot.state === 'ready') {
          ctx.fillStyle = '#2e7d32';
          rr(ctx, cx - 34, cy + 44, 68, 22, 8); ctx.fill();
          text(ctx, 'READY!', cx, cy + 60, 13, '#ffffff', 'bold', 'center');
        }
      } else {
        text(ctx, 'empty', sx + 58, sy + 62, 15, '#6b7280', 'normal', 'center');
      }
      const label = slot.state === 'empty' ? '' : slot.state === 'cooking' ? 'Cooking…' : slot.state === 'ready' ? 'Click to take!' : 'Burnt — click to toss';
      if (label) text(ctx, label, sx + 58, sy + 138, 13, '#fff8e7', 'normal', 'center');
    });
  }

  function drawHelp() {
    const h = LAYOUT.help;
    ctx.fillStyle = '#fff8e7';
    rr(ctx, h.x, h.y, h.w, h.h, 12); ctx.fill();
    ctx.strokeStyle = '#c9a86a'; ctx.lineWidth = 2; rr(ctx, h.x, h.y, h.w, h.h, 12); ctx.stroke();
    text(ctx, 'HOW TO PLAY', h.x + 16, h.y + 30, 18, '#5d3413');
    const lines = [
      '1. Click a ticket to pick it.',
      '2. Click bins in ticket order,',
      '    bottom bun first.',
      '3. Patty (key 2) must grill first:',
      '    click it again when READY.',
      '4. SPACE serves • T trashes.',
      '5. Beat the patience bar for tips!',
      'Keys 1–8 bins • P pause • M mute',
    ];
    lines.forEach((line, i) => text(ctx, line, h.x + 16, h.y + 58 + i * 20, 14, '#3d220c', 'normal'));
  }

  function drawBins(state, need) {
    const b = LAYOUT.bins;
    const bw = b.w / b.count;
    INGREDIENTS.forEach((ing, i) => {
      const bx = b.x + i * bw;
      const by = b.y;
      const isNext = need === ing.id;
      const pulse = isNext ? 0.6 + 0.4 * Math.sin(state.time * 6) : 0;
      ctx.fillStyle = isNext ? '#fff3c4' : '#f7e8c8';
      rr(ctx, bx + 6, by + 6, bw - 12, b.h - 12, 14); ctx.fill();
      if (isNext) {
        ctx.strokeStyle = `rgba(255, 180, 0, ${0.5 + pulse * 0.5})`;
        ctx.lineWidth = 4;
        rr(ctx, bx + 6, by + 6, bw - 12, b.h - 12, 14); ctx.stroke();
      }
      // Key badge.
      ctx.fillStyle = '#5d3413';
      ctx.beginPath(); ctx.arc(bx + 26, by + 26, 13, 0, Math.PI * 2); ctx.fill();
      text(ctx, ing.key, bx + 26, by + 31, 15, '#ffc53d', 'bold', 'center');
      drawIngredient(ctx, ing.id, bx + bw / 2 - 42, by + 52, 84);
      text(ctx, ing.name, bx + bw / 2, by + 122, 15, '#3d220c', 'bold', 'center');
      if (ing.id === ING.PATTY) text(ctx, 'grill first!', bx + bw / 2, by + 140, 12, '#b0563a', 'normal', 'center');
      else if (isNext) text(ctx, 'NEXT!', bx + bw / 2, by + 140, 13, '#2e7d32', 'bold', 'center');
    });
  }

  function drawPopups(state) {
    for (const p of state.popups) {
      ctx.globalAlpha = Math.min(1, p.ttl);
      text(ctx, p.text, p.x, p.y, 20, p.color, 'bold', 'center');
    }
    ctx.globalAlpha = 1;
  }

  function drawBanner(state) {
    if (!state.banner) return;
    ctx.fillStyle = 'rgba(61, 34, 12, 0.9)';
    const w = 560;
    rr(ctx, 360, 84, w, 52, 12); ctx.fill();
    text(ctx, state.banner.text, 640, 118, 24, '#ffc53d', 'bold', 'center');
  }

  function overlay(title, lines, btn, best) {
    ctx.fillStyle = 'rgba(40, 20, 5, 0.72)';
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = '#fff8e7';
    rr(ctx, 290, 110, 700, 460, 18); ctx.fill();
    ctx.strokeStyle = '#ffc53d'; ctx.lineWidth = 4; rr(ctx, 290, 110, 700, 460, 18); ctx.stroke();
    text(ctx, title, 640, 180, 46, '#5d3413', 'bold', 'center');
    lines.forEach((line, i) => text(ctx, line.text, 640, 240 + i * 34, line.size ?? 19, line.color ?? '#3d220c', line.weight ?? 'normal', 'center'));
    if (btn) {
      ctx.fillStyle = '#2e7d32';
      rr(ctx, btn.x, btn.y, btn.w, btn.h, 14); ctx.fill();
      text(ctx, btn.label, btn.x + btn.w / 2, btn.y + 42, 26, '#ffffff', 'bold', 'center');
    }
    if (best !== undefined) text(ctx, `Best score: ${best}`, 640, 545, 17, '#8a5a2b', 'normal', 'center');
  }

  return {
    draw(state, screen, best) {
      ctx.save();
      if (state.shake > 0) {
        const s = state.shake;
        ctx.translate(Math.sin(state.time * 47) * s * 0.5, Math.cos(state.time * 39) * s * 0.5);
      }
      drawKitchen(state);
      const need = screen === SCREEN_PLAY || screen === SCREEN_PAUSED
        ? null : null;
      // next-needed is computed by the world for the selected ticket.
      drawTopBar(state, best);
      drawBoard(state, need);
      drawPlateZone(state, need);
      drawGrill(state);
      drawHelp();
      // Bins need the next ingredient: ask the world via a render-time hook.
      drawBins(state, this._need ?? null);
      drawPopups(state);
      drawBanner(state);
      ctx.restore();

      if (screen === SCREEN_TITLE) {
        overlay('SIZZLE & SERVE', [
          { text: 'Rush Hour Kitchen — build every ticket before its patience runs out!', size: 20, color: '#5d3413', weight: 'bold' },
          { text: 'Click the bins in ticket order. Patties must grill first (key 2).', size: 18 },
          { text: 'Serve with SPACE when the plate matches a ticket. Fast serves earn tips.', size: 18 },
          { text: 'Three walk-outs end the shift early. Survive the 150-second day!', size: 18 },
          { text: 'Mouse + keys 1–8 • P pause • M mute • Enter to start', size: 16, color: '#8a5a2b' },
        ], { ...LAYOUT.startBtn, label: 'START SHIFT  (Enter)' }, best);
      } else if (screen === SCREEN_PAUSED) {
        overlay('PAUSED', [
          { text: 'Take a breath — the tickets wait for no one.', size: 19 },
          { text: 'Press P or Enter to get back to the pass.', size: 18 },
        ], null);
      } else if (screen === SCREEN_OVER) {
        const total = state.placed + state.mistakes;
        const acc = total === 0 ? 100 : Math.round((state.placed / total) * 100);
        overlay('SHIFT OVER!', [
          { text: state.overReason, size: 22, color: '#b0563a', weight: 'bold' },
          { text: `Score: ${state.score}    •    Dishes served: ${state.served}`, size: 20 },
          { text: `Accuracy: ${acc}%    •    Best combo: x${state.bestCombo}    •    Level reached: ${state.level}`, size: 20 },
          { text: state.score >= best && state.score > 0 ? 'New best score!' : 'Can you beat your best next shift?', size: 18, color: '#2e7d32' },
        ], { ...LAYOUT.againBtn, label: 'PLAY AGAIN  (Enter)' }, best);
      }
    },
    /** The renderer is told the next-needed ingredient each frame. */
    setNeed(value) { this._need = value; },
  };
}
