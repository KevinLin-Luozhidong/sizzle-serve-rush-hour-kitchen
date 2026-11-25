// Tunables for Sizzle & Serve: Rush Hour Kitchen.
export const FIELD = { width: 1280, height: 720 };
export const STEP = 1 / 60;
export const DAY_SECONDS = 150;
export const BEST_KEY = 'sizzle-serve-best';
export const MAX_TICKETS = 3;
export const MAX_HEARTS = 3;
export const PATTY_COOK_SECONDS = 4;
export const PATTY_BURN_SECONDS = 7;

// Ingredients, in bin order (keys 1-8). Patty is the only one that must be
// grilled first; everything else goes straight from its bin onto the plate.
export const ING = {
  BUN_BOT: 0, PATTY: 1, CHEESE: 2, LETTUCE: 3,
  TOMATO: 4, ONION: 5, SAUCE: 6, BUN_TOP: 7,
};
export const INGREDIENTS = [
  { id: ING.BUN_BOT, name: 'Bottom Bun', short: 'Bun', key: '1', color: '#e8a94e' },
  { id: ING.PATTY, name: 'Patty', short: 'Patty', key: '2', color: '#7a4a21' },
  { id: ING.CHEESE, name: 'Cheese', short: 'Cheese', key: '3', color: '#ffc53d' },
  { id: ING.LETTUCE, name: 'Lettuce', short: 'Lettuce', key: '4', color: '#6ab04c' },
  { id: ING.TOMATO, name: 'Tomato', short: 'Tomato', key: '5', color: '#e4572e' },
  { id: ING.ONION, name: 'Onion', short: 'Onion', key: '6', color: '#c9a7d8' },
  { id: ING.SAUCE, name: 'Sauce', short: 'Sauce', key: '7', color: '#ff8c42' },
  { id: ING.BUN_TOP, name: 'Top Bun', short: 'Top Bun', key: '8', color: '#e8a94e' },
];

// Dishes: the stack, bottom to top, the ticket shows. Prices are the base
// pay; a fast serve adds a tip of up to half the price again.
export const DISHES = [
  { name: 'Classic Burger', stack: [ING.BUN_BOT, ING.PATTY, ING.CHEESE, ING.BUN_TOP], price: 120 },
  { name: 'Garden Burger', stack: [ING.BUN_BOT, ING.PATTY, ING.LETTUCE, ING.TOMATO, ING.BUN_TOP], price: 150 },
  { name: 'Onion Melt', stack: [ING.BUN_BOT, ING.PATTY, ING.ONION, ING.CHEESE, ING.SAUCE, ING.BUN_TOP], price: 180 },
  { name: 'Double Melt', stack: [ING.BUN_BOT, ING.PATTY, ING.CHEESE, ING.PATTY, ING.CHEESE, ING.BUN_TOP], price: 220 },
  { name: 'Veggie Delight', stack: [ING.BUN_BOT, ING.LETTUCE, ING.TOMATO, ING.ONION, ING.CHEESE, ING.SAUCE, ING.BUN_TOP], price: 170 },
  { name: 'Sunny Stack', stack: [ING.BUN_BOT, ING.PATTY, ING.CHEESE, ING.LETTUCE, ING.TOMATO, ING.SAUCE, ING.BUN_TOP], price: 240 },
];

// Layout (logical 1280x720 canvas).
export const LAYOUT = {
  topBar: { x: 0, y: 0, w: 1280, h: 64 },
  board: { x: 16, y: 80, w: 280, h: 452 },
  ticket: { w: 264, h: 106, gap: 10 },
  plate: { cx: 640, cy: 470, rx: 175, ry: 36 },
  serve: { x: 880, y: 408, w: 120, h: 56 },
  trash: { x: 880, y: 476, w: 120, h: 40 },
  grill: { x: 984, y: 80, w: 280, h: 236 },
  help: { x: 984, y: 332, w: 280, h: 200 },
  bins: { x: 16, y: 556, w: 1248, h: 148, count: 8 },
  startBtn: { x: 490, y: 560, w: 300, h: 64 },
  againBtn: { x: 490, y: 560, w: 300, h: 64 },
};
