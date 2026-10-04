import * as THREE from "three";

export function labelTexture(
  lines: { text: string; size: number; color: string; weight?: number; spacing?: number }[],
  w = 1024,
  h = 512,
  bg = "rgba(0,0,0,0.4)",
  borderColor = "",
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  
  // Tactical background
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);

  // Tactical border
  if (borderColor) {
    g.strokeStyle = borderColor;
    g.lineWidth = 4;
    g.strokeRect(2, 2, w - 4, h - 4);
    
    // Corner accents
    g.lineWidth = 12;
    g.beginPath();
    g.moveTo(0, 40); g.lineTo(0, 0); g.lineTo(40, 0); // Top Left
    g.moveTo(w - 40, 0); g.lineTo(w, 0); g.lineTo(w, 40); // Top Right
    g.moveTo(w, h - 40); g.lineTo(w, h); g.lineTo(w - 40, h); // Bottom Right
    g.moveTo(40, h); g.lineTo(0, h); g.lineTo(0, h - 40); // Bottom Left
    g.stroke();
  }

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
