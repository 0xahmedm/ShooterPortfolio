let ctx: AudioContext | null = null;

function ac() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function playShot() {
  const a = ac();
  const len = a.sampleRate * 0.12;
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 2200;
  const g = a.createGain();
  g.gain.value = 0.35;
  src.connect(f).connect(g).connect(a.destination);
  src.start();
  const o = a.createOscillator();
  const og = a.createGain();
  o.frequency.setValueAtTime(140, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(40, a.currentTime + 0.1);
  og.gain.setValueAtTime(0.4, a.currentTime);
  og.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.12);
  o.connect(og).connect(a.destination);
  o.start();
  o.stop(a.currentTime + 0.13);
}

export function playHit() {
  const a = ac();
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(1400, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(900, a.currentTime + 0.15);
  g.gain.setValueAtTime(0.18, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.2);
  o.connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + 0.22);
}
