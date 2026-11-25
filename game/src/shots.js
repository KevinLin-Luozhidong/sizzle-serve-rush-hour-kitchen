// The screenshot scenes behind ?shot=play|mid|start|end. Each one stages a
// real world state directly (tickets, plate, grill, clock) so the frame is
// exactly what a short game looks like, and the same seed always gives the
// same frame.
import { DISHES, ING } from './config.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

function ticket(id, dishIndex, patience, maxPatience) {
  return { id, dish: DISHES[dishIndex], patience, maxPatience };
}

export function stageShot(name, world) {
  const s = world.state;
  world.reset();
  if (name === 'play') {
    // Cover: a finished Classic Burger on the plate, SERVE glowing, a patty
    // ready on the grill, three tickets (one urgent), clock at 1:38.
    s.score = 340; s.combo = 2; s.bestCombo = 3; s.served = 3; s.placed = 12;
    s.dayLeft = 98; s.level = 2; s.time = 52;
    s.tickets = [
      ticket(1, 0, 28, 34),
      ticket(2, 1, 12, 34),
      ticket(3, 2, 30, 36),
    ];
    s.selectedId = 1;
    s.plate = [ING.BUN_BOT, ING.PATTY, ING.CHEESE, ING.BUN_TOP];
    s.grill = [{ state: 'ready', t: 0 }, { state: 'cooking', t: 2.5 }];
    s.popups = [{ x: 940, y: 390, text: '+180  $120 + $48 tip', color: '#2e7d32', ttl: 1.4 }];
    return { screen: SCREEN_PLAY, best: 1240 };
  }
  if (name === 'mid') {
    // A dish mid-assembly: three layers on the plate, Top Bun highlighted NEXT.
    s.score = 180; s.combo = 1; s.bestCombo = 2; s.served = 2; s.placed = 7;
    s.dayLeft = 121; s.level = 1; s.time = 29;
    s.tickets = [ticket(1, 0, 26, 34), ticket(2, 1, 31, 34)];
    s.selectedId = 1;
    s.plate = [ING.BUN_BOT, ING.PATTY, ING.CHEESE];
    s.grill = [{ state: 'cooking', t: 1.2 }, { state: 'empty', t: 0 }];
    return { screen: SCREEN_PLAY, best: 1240 };
  }
  if (name === 'end') {
    s.score = 1240; s.served = 9; s.placed = 41; s.mistakes = 4;
    s.bestCombo = 5; s.level = 3; s.dayLeft = 0;
    s.over = true; s.overReason = 'Day complete!';
    s.tickets = [];
    s.plate = [];
    return { screen: SCREEN_OVER, best: 1240 };
  }
  // start (default): title screen over a live-looking kitchen.
  s.time = 5;
  s.tickets = [ticket(1, 0, 30, 34)];
  s.selectedId = 1;
  s.plate = [ING.BUN_BOT, ING.PATTY];
  s.grill = [{ state: 'cooking', t: 2 }, { state: 'empty', t: 0 }];
  return { screen: SCREEN_TITLE, best: 1240 };
}
