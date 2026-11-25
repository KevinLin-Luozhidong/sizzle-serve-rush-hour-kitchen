// The kitchen itself: tickets, the plate, the grill, the clock, the score.
// Pure state + rules; rendering lives in render.js, input in input.js.
import {
  DAY_SECONDS, DISHES, ING, MAX_HEARTS, MAX_TICKETS,
  PATTY_BURN_SECONDS, PATTY_COOK_SECONDS,
} from './config.js';
import { playSfx } from './sound.js';

function dishPool(level) {
  if (level <= 1) return DISHES.slice(0, 2);
  if (level === 2) return DISHES.slice(0, 4);
  return DISHES;
}

export function createWorld(random) {
  const state = fresh();

  function fresh() {
    return {
      time: 0, dayLeft: DAY_SECONDS, score: 0, combo: 0, bestCombo: 0,
      served: 0, placed: 0, mistakes: 0, hearts: MAX_HEARTS, level: 1,
      tickets: [], selectedId: null, plate: [],
      grill: [{ state: 'empty', t: 0 }, { state: 'empty', t: 0 }],
      popups: [], banner: null, spawnTimer: 11, nextTicketId: 1,
      over: false, overReason: '', shake: 0, muted: false, hint: '',
    };
  }

  function spawnTicket() {
    const pool = dishPool(state.level);
    const dish = pool[Math.floor(random() * pool.length)];
    const maxPatience = Math.max(22, 38 - state.level * 2);
    const ticket = { id: state.nextTicketId, dish, patience: maxPatience, maxPatience };
    state.nextTicketId += 1;
    state.tickets.push(ticket);
    if (state.selectedId === null) state.selectedId = ticket.id;
    playSfx(state.muted, 'ticket');
    return ticket;
  }

  function selectedTicket() {
    return state.tickets.find((t) => t.id === state.selectedId) ?? state.tickets[0] ?? null;
  }

  /** The ingredient the selected ticket needs next, or null when the plate does not fit it. */
  function nextNeeded() {
    const ticket = selectedTicket();
    if (!ticket) return null;
    const stack = ticket.dish.stack;
    if (state.plate.length >= stack.length) return null;
    for (let i = 0; i < state.plate.length; i += 1) {
      if (state.plate[i] !== stack[i]) return null;
    }
    return stack[state.plate.length];
  }

  function popup(x, y, text, color) {
    state.popups.push({ x, y, text, color, ttl: 1.4 });
    if (state.popups.length > 12) state.popups.shift();
  }

  function mistake(x, y, text) {
    state.mistakes += 1;
    state.combo = 0;
    state.shake = 8;
    state.hint = text;
    popup(x, y, text, '#e4572e');
    playSfx(state.muted, 'bad');
  }

  function placeOnPlate(ing, x, y) {
    state.plate.push(ing);
    state.placed += 1;
    state.hint = '';
    popup(x, y - 10, 'Nice!', '#2e7d32');
    playSfx(state.muted, 'place');
    const ticket = selectedTicket();
    if (ticket && state.plate.length === ticket.dish.stack.length) {
      playSfx(state.muted, 'ready');
      popup(640, 330, 'Ready to serve!', '#2e7d32');
    }
  }

  function serve() {
    const match = state.tickets.find(
      (t) => t.dish.stack.length === state.plate.length
        && t.dish.stack.every((ing, i) => ing === state.plate[i]),
    );
    if (!match) {
      state.shake = 5;
      state.hint = 'Plate does not match any ticket yet.';
      popup(940, 400, 'No match!', '#e4572e');
      playSfx(state.muted, 'bad');
      return;
    }
    const tip = Math.round((match.dish.price / 2) * (match.patience / match.maxPatience));
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    const points = match.dish.price + tip + 10 * state.combo;
    state.score += points;
    state.served += 1;
    popup(940, 390, `+${points}  $${match.dish.price} + $${tip} tip`, '#2e7d32');
    if (state.combo >= 3) popup(940, 360, `COMBO x${state.combo}!`, '#ff8c42');
    playSfx(state.muted, 'serve');
    state.tickets = state.tickets.filter((t) => t.id !== match.id);
    state.plate = [];
    state.selectedId = state.tickets[0]?.id ?? null;
    const newLevel = 1 + Math.floor(state.served / 4);
    if (newLevel > state.level) {
      state.level = newLevel;
      state.banner = { text: `LEVEL ${newLevel} — tickets get faster!`, ttl: 2.2 };
      playSfx(state.muted, 'levelup');
    }
  }

  const world = {
    state,

    reset() {
      Object.assign(state, fresh());
      spawnTicket();
    },

    toggleMute() {
      state.muted = !state.muted;
    },

    selectedTicket,
    nextNeeded,

    apply(action) {
      if (state.over || !action) return;
      if (action.kind === 'select') {
        const ticket = state.tickets[action.index];
        if (ticket) {
          state.selectedId = ticket.id;
          state.hint = '';
          playSfx(state.muted, 'click');
        }
        return;
      }
      if (action.kind === 'bin') {
        const { id, x, y } = action;
        if (id === ING.PATTY) {
          const slot = state.grill.findIndex((s) => s.state === 'empty');
          if (slot === -1) { popup(x, y - 10, 'Grill full!', '#e4572e'); playSfx(state.muted, 'bad'); return; }
          state.grill[slot] = { state: 'cooking', t: 0 };
          playSfx(state.muted, 'sizzle');
          popup(x, y - 10, 'On the grill!', '#7a4a21');
          return;
        }
        const need = nextNeeded();
        if (need === null) {
          mistake(x, y, 'Plate does not fit this ticket!');
        } else if (id === need) {
          placeOnPlate(id, x, y);
        } else {
          mistake(x, y, 'Wrong order — check the ticket!');
        }
        return;
      }
      if (action.kind === 'grill') {
        const slot = state.grill[action.slot];
        if (!slot || slot.state === 'empty') return;
        if (slot.state === 'cooking') { popup(action.x, action.y, 'Still cooking…', '#7a4a21'); return; }
        if (slot.state === 'burnt') {
          state.grill[action.slot] = { state: 'empty', t: 0 };
          popup(action.x, action.y, 'Burnt — tossed!', '#e4572e');
          playSfx(state.muted, 'trash');
          return;
        }
        // Ready patty.
        const need = nextNeeded();
        if (need === ING.PATTY) {
          state.grill[action.slot] = { state: 'empty', t: 0 };
          placeOnPlate(ING.PATTY, action.x, action.y);
        } else {
          mistake(action.x, action.y, 'Patty is not next!');
        }
        return;
      }
      if (action.kind === 'serve') { serve(); return; }
      if (action.kind === 'trash') {
        if (state.plate.length === 0) return;
        state.plate = [];
        state.hint = '';
        popup(930, 470, 'Plate cleared', '#666666');
        playSfx(state.muted, 'trash');
      }
    },

    step(dt) {
      if (state.over) return;
      state.time += dt;
      state.dayLeft -= dt;
      if (state.dayLeft <= 0) {
        state.dayLeft = 0;
        state.over = true;
        state.overReason = 'Day complete!';
        return;
      }
      // Tickets arrive faster as the level rises.
      state.spawnTimer -= dt;
      if (state.spawnTimer <= 0 && state.tickets.length < MAX_TICKETS) {
        spawnTicket();
        state.spawnTimer = Math.max(8, 15 - state.level);
      }
      // Patience drains; a ticket that hits zero walks out.
      for (let i = state.tickets.length - 1; i >= 0; i -= 1) {
        const ticket = state.tickets[i];
        ticket.patience -= dt;
        if (ticket.patience <= 0) {
          state.tickets.splice(i, 1);
          state.hearts -= 1;
          state.combo = 0;
          state.shake = 10;
          state.banner = { text: 'A customer walked out!', ttl: 1.8 };
          playSfx(state.muted, 'bad');
          if (state.selectedId === ticket.id) state.selectedId = state.tickets[0]?.id ?? null;
          if (state.hearts <= 0) {
            state.over = true;
            state.overReason = 'Too many walk-outs!';
            return;
          }
        }
      }
      // The grill cooks, then burns.
      for (const slot of state.grill) {
        if (slot.state === 'cooking') {
          slot.t += dt;
          if (slot.t >= PATTY_COOK_SECONDS) { slot.state = 'ready'; slot.t = 0; playSfx(state.muted, 'ding'); }
        } else if (slot.state === 'ready') {
          slot.t += dt;
          if (slot.t >= PATTY_BURN_SECONDS) { slot.state = 'burnt'; slot.t = 0; }
        }
      }
      for (let i = state.popups.length - 1; i >= 0; i -= 1) {
        const p = state.popups[i];
        p.ttl -= dt;
        p.y -= 22 * dt;
        if (p.ttl <= 0) state.popups.splice(i, 1);
      }
      if (state.banner) {
        state.banner.ttl -= dt;
        if (state.banner.ttl <= 0) state.banner = null;
      }
      if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 30);
    },
  };
  return world;
}
