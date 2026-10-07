/* Efectos de sonido generados con Web Audio (sin archivos externos) */
const SFX = (() => {
  let ctx = null;
  let enabled = true;
  const get = () => {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } }
    return ctx;
  };
  function tone(freq, dur, type = "sine", vol = 0.15, delay = 0) {
    if (!enabled) return;
    const c = get(); if (!c) return;
    const t = c.currentTime + delay;
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur);
  }
  return {
    ok() { tone(660, .12, "triangle"); tone(990, .18, "triangle", .12, .1); },
    error() { tone(180, .25, "sawtooth", .12); tone(120, .4, "sawtooth", .12, .2); },
    alarm() { for (let i = 0; i < 4; i++) { tone(880, .15, "square", .07, i * .3); tone(440, .15, "square", .07, i * .3 + .15); } },
    key() { [523, 659, 784, 1046].forEach((f, i) => tone(f, .25, "triangle", .13, i * .12)); },
    click() { tone(1200, .04, "square", .04); },
    win() { [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(f, .3, "triangle", .13, i * .14)); },
    toggle() { enabled = !enabled; return enabled; },
    set(v) { enabled = v; },
    get enabled() { return enabled; }
  };
})();
