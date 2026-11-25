// Sizzle & Serve: Rush Hour Kitchen — an original cooking game.
// You run a small kitchen: tickets arrive on the order board, you build each
// dish layer by layer on the plate (buns, cheese, veg, sauce), cook patties on
// the grill until they are browned, and serve before a ticket's patience runs
// out. Serve fast for tips, keep the combo alive, survive the 150-second day.
// Pure canvas 2D, no assets, no network. Mouse + keyboard. Seeded RNG so the
// screenshot scenes (?shot=) are repeatable.
import { BEST_KEY, DAY_SECONDS, STEP } from './config.js';
import { createRandom } from './random.js';
import { createWorld } from './world.js';
import { createRenderer, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE } from './render.js';
import { createInput, ACTION } from './input.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const world = createWorld(createRandom(seed));
const renderer = createRenderer(canvas);

function readBest() {
  try { return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0; } catch { return 0; }
}
function saveBest(value) {
  try { window.localStorage.setItem(BEST_KEY, String(value)); } catch { /* private mode: best lasts this visit */ }
}

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.setNeed(world.nextNeeded());
    renderer.draw(world.state, scene.screen, scene.best);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let best = readBest();
  let accumulator = 0;
  let last = performance.now();

  function announce(message) { status.textContent = message; }

  function startGame() {
    world.reset();
    accumulator = 0;
    screen = SCREEN_PLAY;
    announce('Playing. Serve the tickets before their patience runs out.');
  }
  function endGame(reason) {
    screen = SCREEN_OVER;
    if (world.state.score > best) { best = world.state.score; saveBest(best); }
    announce(`Shift over. ${reason} Score ${world.state.score}. Best ${best}.`);
  }

  function frame(now) {
    requestAnimationFrame(frame);
    let elapsed = (now - last) / 1000;
    last = now;
    if (elapsed > 0.25) elapsed = 0.25;
    const action = input.poll();
    if (screen === SCREEN_TITLE) {
      if (action === ACTION.CONFIRM) startGame();
      else if (action === ACTION.MUTE) world.toggleMute();
    } else if (screen === SCREEN_PLAY) {
      if (action === ACTION.PAUSE) { screen = SCREEN_PAUSED; announce('Paused.'); }
      else if (action === ACTION.MUTE) world.toggleMute();
      else if (action) world.apply(action);
      accumulator += elapsed;
      while (accumulator >= STEP) {
        accumulator -= STEP;
        world.step(STEP);
      }
      if (world.state.over) endGame(world.state.overReason);
    } else if (screen === SCREEN_PAUSED) {
      if (action === ACTION.PAUSE || action === ACTION.CONFIRM) { screen = SCREEN_PLAY; announce('Playing.'); }
      else if (action === ACTION.MUTE) world.toggleMute();
    } else if (screen === SCREEN_OVER) {
      if (action === ACTION.CONFIRM) startGame();
      else if (action === ACTION.MUTE) world.toggleMute();
    }
    renderer.setNeed(world.nextNeeded());
    renderer.draw(world.state, screen, best);
  }
  requestAnimationFrame(frame);
}

// Boot: a ?shot= URL stages one scene for screenshots instead of playing.
if (shot) runShot(shot);
else runGame();
