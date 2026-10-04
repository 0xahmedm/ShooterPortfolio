import * as THREE from "three";

export function labelTexture(
  lines: { text: string; size: number; color: string; weight?: number; spacing?: number }[],
  w = 1024,
  h = 512,
  bg = "rgba(0,0,0,0)",
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);
  g.textAlign = "center";
  g.textBaseline = "middle";
  const total = lines.reduce((a, l) => a + l.size * 1.25, 0);
  let y = h / 2 - total / 2;
  for (const l of lines) {
    y += (l.size * 1.25) / 2;
    g.font = `${l.weight ?? 700} ${l.size}px "Chakra Petch", "Arial Narrow", sans-serif`;
    (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${l.spacing ?? 0}px`;
    g.fillStyle = l.color;
    g.fillText(l.text, w / 2, y);
    y += (l.size * 1.25) / 2;
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
