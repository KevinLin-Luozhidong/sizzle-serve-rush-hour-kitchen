// Mouse + keyboard input for Sizzle & Serve. Clicks are hit-tested against
// the bins, the grill slots, the serve/trash buttons, the tickets and the
// big start / play-again buttons; keys mirror the same actions.
import { INGREDIENTS, LAYOUT } from './config.js';
import { unlockAudio } from './sound.js';

export const ACTION = {
  CONFIRM: 'confirm',
  PAUSE: 'pause',
  MUTE: 'mute',
};

function inside(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

export function createInput(canvas) {
  let queued = null;
  let lastClick = null;

  function toGame(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 1280,
      y: ((e.clientY - rect.top) / rect.height) * 720,
    };
  }

  canvas.addEventListener('pointerdown', (e) => {
    unlockAudio();
    lastClick = toGame(e);
  });

  window.addEventListener('keydown', (e) => {
    unlockAudio();
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    if (k === 'enter' || k === ' ') { queued = k === ' ' ? { kind: 'serve' } : ACTION.CONFIRM; e.preventDefault(); return; }
    if (k === 'p' || k === 'escape') { queued = ACTION.PAUSE; return; }
    if (k === 'm') { queued = ACTION.MUTE; return; }
    if (k === 't') { queued = { kind: 'trash' }; return; }
    const bin = INGREDIENTS.find((ing) => ing.key === k);
    if (bin) {
      const b = LAYOUT.bins;
      const bw = b.w / b.count;
      const i = INGREDIENTS.indexOf(bin);
      queued = { kind: 'bin', id: bin.id, x: b.x + i * bw + bw / 2, y: b.y + 60 };
    }
  });

  return {
    /** One action per frame, if any: a queued key action, else a click action. */
    poll() {
      if (queued) {
        const a = queued;
        queued = null;
        return a;
      }
      if (!lastClick) return null;
      const { x, y } = lastClick;
      lastClick = null;
      // Big buttons (title / game-over screens).
      if (inside(x, y, LAYOUT.startBtn) || inside(x, y, LAYOUT.againBtn)) return ACTION.CONFIRM;
      // Serve / trash.
      if (inside(x, y, LAYOUT.serve)) return { kind: 'serve' };
      if (inside(x, y, LAYOUT.trash)) return { kind: 'trash' };
      // Grill slots.
      const g = LAYOUT.grill;
      for (let i = 0; i < 2; i += 1) {
        const slot = { x: g.x + 22 + i * 132, y: g.y + 52, w: 116, h: 116 };
        if (inside(x, y, slot)) return { kind: 'grill', slot: i, x: slot.x + 58, y: slot.y + 58 };
      }
      // Tickets on the order board.
      const bd = LAYOUT.board;
      for (let i = 0; i < 3; i += 1) {
        const t = { x: bd.x + 8, y: bd.y + 44 + i * (LAYOUT.ticket.h + LAYOUT.ticket.gap), w: LAYOUT.ticket.w, h: LAYOUT.ticket.h };
        if (inside(x, y, t)) return { kind: 'select', index: i, x, y };
      }
      // Ingredient bins.
      const b = LAYOUT.bins;
      if (inside(x, y, b)) {
        const bw = b.w / b.count;
        const i = Math.min(b.count - 1, Math.floor((x - b.x) / bw));
        return { kind: 'bin', id: INGREDIENTS[i].id, x: b.x + i * bw + bw / 2, y: b.y + 60 };
      }
      return null;
    },
  };
}
