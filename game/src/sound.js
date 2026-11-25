// Tiny WebAudio synth: every sound is an oscillator, no audio files.
// The context is created on the first user gesture (unlock) so browsers
// allow it; before that every call is a silent no-op.
let ctx = null;
let muted = false;

export function unlockAudio() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch { /* no audio in this browser: the game stays silent */ }
}

function tone(freq, dur, type, gain, when = 0) {
  if (!ctx || muted) return;
  try {
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch { /* ignore */ }
}

const SOUNDS = {
  click: () => tone(620, 0.06, 'square', 0.05),
  place: () => { tone(520, 0.07, 'sine', 0.12); tone(780, 0.09, 'sine', 0.1, 0.05); },
  ticket: () => { tone(880, 0.08, 'triangle', 0.08); tone(1174, 0.1, 'triangle', 0.06, 0.07); },
  ready: () => { tone(659, 0.1, 'sine', 0.12); tone(880, 0.14, 'sine', 0.12, 0.08); },
  serve: () => { tone(523, 0.1, 'triangle', 0.14); tone(659, 0.1, 'triangle', 0.14, 0.09); tone(784, 0.18, 'triangle', 0.14, 0.18); },
  bad: () => tone(130, 0.22, 'sawtooth', 0.1),
  ding: () => tone(1046, 0.16, 'sine', 0.1),
  sizzle: () => tone(220, 0.25, 'sawtooth', 0.05),
  trash: () => tone(300, 0.12, 'square', 0.06),
  levelup: () => { tone(523, 0.1, 'square', 0.08); tone(659, 0.1, 'square', 0.08, 0.09); tone(784, 0.1, 'square', 0.08, 0.18); tone(1046, 0.2, 'square', 0.1, 0.27); },
};

export function playSfx(isMuted, name) {
  muted = isMuted;
  const fn = SOUNDS[name];
  if (fn) fn();
}
