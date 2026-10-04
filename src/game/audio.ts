let ctx: AudioContext | null = null;

function ac() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function playShot() {
  const a = ac();
  // Noise burst for the crack
  const len = a.sampleRate * 0.15;
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.setValueAtTime(4000, a.currentTime);
  f.frequency.exponentialRampToValueAtTime(800, a.currentTime + 0.1);
  const g = a.createGain();
  g.gain.value = 0.5;
  src.connect(f).connect(g).connect(a.destination);
  src.start();

  // Low punch for the thump
  const o = a.createOscillator();
  const og = a.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(180, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(30, a.currentTime + 0.12);
  og.gain.setValueAtTime(0.8, a.currentTime);
  og.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.15);
  o.connect(og).connect(a.destination);
  o.start();
  o.stop(a.currentTime + 0.16);
}

export function playHit() {
  const a = ac();
  // High-pitched confirmation ping
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(2200, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(1400, a.currentTime + 0.1);
  g.gain.setValueAtTime(0.3, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.15);
  o.connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + 0.16);
}

export function playUiOpen() {
  const a = ac();
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = "square";
  o.frequency.setValueAtTime(200, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(600, a.currentTime + 0.1);
  
  const f = a.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 1500;

  g.gain.setValueAtTime(0, a.currentTime);
  g.gain.linearRampToValueAtTime(0.1, a.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.2);
  
  o.connect(f).connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + 0.25);
}

export function playUiClose() {
  const a = ac();
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = "square";
  o.frequency.setValueAtTime(600, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(200, a.currentTime + 0.1);
  
  const f = a.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 1500;

  g.gain.setValueAtTime(0, a.currentTime);
  g.gain.linearRampToValueAtTime(0.1, a.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.2);
  
  o.connect(f).connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + 0.25);
}
