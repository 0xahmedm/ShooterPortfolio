"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sections, type SectionId } from "@/data/portfolio";
import { labelTexture } from "./labels";

export const targetHits: Record<string, number> = {};

function Target({ id }: { id: SectionId }) {
  const s = sections[id];
  const disc = useRef<THREE.Group>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const label = useMemo(
    () =>
      labelTexture([
        { text: s.code, size: 70, color: s.color, spacing: 6 },
        { text: s.label, size: 92, color: "#f4f5f7", spacing: 8 },
        { text: "SHOOT TO OPEN", size: 34, color: "#8a919e", spacing: 10, weight: 500 },
      ], 1024, 400),
    [s],
  );
  const color = useMemo(() => new THREE.Color(s.color), [s]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const since = t - (targetHits[id] ?? -10);
    if (disc.current) {
      disc.current.position.y = 2.4 + Math.sin(t * 1.4 + s.position[0]) * 0.08;
      const kick = since < 0.5 ? Math.sin(since * 30) * Math.exp(-since * 8) * 0.6 : 0;
      disc.current.rotation.x = -kick;
      disc.current.rotation.y = since < 0.6 ? since * Math.PI * 4 * (1 - since / 0.6) : 0;
    }
    if (glow.current) {
      const f = since < 0.4 ? 1 - since / 0.4 : 0;
      glow.current.color.copy(color).lerp(new THREE.Color("#ffffff"), f);
    }
  });

  return (
    <group position={s.position}>
      {/* stand */}
      <mesh position-y={1} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 2, 12]} />
        <meshStandardMaterial color="#2a2e36" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position-y={0.05} receiveShadow>
        <cylinderGeometry args={[1, 1.1, 0.1, 32]} />
        <meshStandardMaterial color="#1c2027" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.11}>
        <ringGeometry args={[0.85, 0.95, 48]} />
        <meshBasicMaterial color={s.color} toneMapped={false} />
      </mesh>
      {/* disc */}
      <group ref={disc} position-y={2.4} userData={{ section: id }}>
        <mesh rotation-x={Math.PI / 2} castShadow userData={{ section: id }}>
          <cylinderGeometry args={[1, 1, 0.15, 48]} />
          <meshStandardMaterial color="#f4f5f7" roughness={0.35} />
        </mesh>
        {[0.78, 0.5, 0.2].map((r, i) => (
          <mesh key={r} position-z={0.08 + i * 0.002}>
            <ringGeometry args={[r - 0.1, r, 48]} />
            <meshBasicMaterial ref={i === 0 ? glow : null} color={s.color} toneMapped={false} />
          </mesh>
        ))}
      </group>
      {/* label panel */}
      <mesh position={[0, 4.4, 0]}>
        <planeGeometry args={[4.2, 1.64]} />
        <meshBasicMaterial map={label} transparent toneMapped={false} />
      </mesh>
      <pointLight position={[0, 3, 1.5]} color={s.color} intensity={6} distance={7} />
    </group>
  );
}

export function Targets() {
  return (
    <group name="targets">
      {(Object.keys(sections) as SectionId[]).map((id) => (
        <Target key={id} id={id} />
      ))}
    </group>
  );
}
