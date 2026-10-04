"use client";

import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gridTexture } from "./textures";
import { labelTexture } from "./labels";
import { profile } from "@/data/portfolio";

export const ROOM = { w: 40, d: 40, h: 9 };
export const PILLARS: [number, number][] = [
  [-8, -4], [8, -4], [-8, 6], [8, 6],
];

function Wall({ pos, rot, w, tex }: { pos: [number, number, number]; rot: number; w: number; tex: THREE.Texture }) {
  return (
    <mesh position={pos} rotation-y={rot} receiveShadow>
      <planeGeometry args={[w, ROOM.h]} />
      <meshStandardMaterial map={tex} roughness={0.8} />
    </mesh>
  );
}

function Photo() {
  return profile.photo ? <PhotoTex /> : <PhotoPlaceholder />;
}
function PhotoPlaceholder() {
  {
    const tex = useMemo(
      () =>
        labelTexture(
          [{ text: "◉", size: 160, color: "#5b6270" }, { text: "PROFILE IMAGE", size: 46, color: "#8a919e", spacing: 8 }],
          512, 512, "#1b1f27",
        ),
      [],
    );
    return <meshBasicMaterial map={tex} toneMapped={false} />;
  }
}
function PhotoTex() {
  const t = useTexture(`${import.meta.env.BASE_URL}${profile.photo}`);
  t.colorSpace = THREE.SRGBColorSpace;
  return <meshBasicMaterial map={t} toneMapped={false} />;
}

export function Facility() {
  const floor = useMemo(() => gridTexture("#c9ccd1", "#b3b7be", 4, 10), []);
  const wall = useMemo(() => {
    const t = gridTexture("#e4e5e8", "#cfd2d7", 2, 1);
    t.repeat.set(8, 2);
    return t;
  }, []);
  const title = useMemo(
    () =>
      labelTexture([
        { text: profile.name, size: 130, color: "#f4f5f7", spacing: 14 },
        { text: "— " + profile.title + " —", size: 56, color: "#ff4655", spacing: 22 },
      ], 1600, 512),
    [],
  );

  return (
    <group>
      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
        <meshStandardMaterial map={floor} roughness={0.55} metalness={0.05} />
      </mesh>
      {/* ceiling */}
      <mesh rotation-x={Math.PI / 2} position-y={ROOM.h}>
        <planeGeometry args={[ROOM.w, ROOM.d]} />
        <meshStandardMaterial color="#6a707c" emissive="#3a3f4a" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* light strips */}
      {[-12, -4, 4, 12].map((x) => (
        <mesh key={x} position={[x, ROOM.h - 0.05, 0]} rotation-x={Math.PI / 2}>
          <planeGeometry args={[0.4, ROOM.d - 4]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      ))}
      <Wall pos={[0, ROOM.h / 2, -ROOM.d / 2]} rot={0} w={ROOM.w} tex={wall} />
      <Wall pos={[0, ROOM.h / 2, ROOM.d / 2]} rot={Math.PI} w={ROOM.w} tex={wall} />
      <Wall pos={[-ROOM.w / 2, ROOM.h / 2, 0]} rot={Math.PI / 2} w={ROOM.d} tex={wall} />
      <Wall pos={[ROOM.w / 2, ROOM.h / 2, 0]} rot={-Math.PI / 2} w={ROOM.d} tex={wall} />
      {/* baseboard accent */}
      {([
        [0, -ROOM.d / 2 + 0.02, 0, ROOM.w],
        [0, ROOM.d / 2 - 0.02, Math.PI, ROOM.w],
      ] as [number, number, number, number][]).map(([x, z, r, w], i) => (
        <mesh key={i} position={[x, 0.5, z]} rotation-y={r}>
          <planeGeometry args={[w, 0.08]} />
          <meshBasicMaterial color="#ff4655" toneMapped={false} />
        </mesh>
      ))}
      {/* pillars */}
      {PILLARS.map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0, z]}>
          <mesh position-y={ROOM.h / 2} castShadow receiveShadow>
            <boxGeometry args={[1.4, ROOM.h, 1.4]} />
            <meshStandardMaterial color="#3a3f4a" roughness={0.4} metalness={0.4} />
          </mesh>
          <mesh position-y={1.2}>
            <boxGeometry args={[1.44, 0.06, 1.44]} />
            <meshBasicMaterial color="#2fd3c4" toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* spawn sign: hangs above, facing spawn */}
      <group position={[0, 6.2, 2]}>
        <mesh position-z={-0.06}>
          <boxGeometry args={[11, 3.6, 0.1]} />
          <meshStandardMaterial color="#14171d" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[1.4, 0, 0]}>
          <planeGeometry args={[7.6, 2.4]} />
          <meshBasicMaterial map={title} transparent toneMapped={false} />
        </mesh>
        <mesh position={[-3.7, 0, 0]}>
          <planeGeometry args={[2.6, 2.6]} />
          <Photo />
        </mesh>
        <mesh position={[0, -1.85, 0]}>
          <planeGeometry args={[11, 0.08]} />
          <meshBasicMaterial color="#ff4655" toneMapped={false} />
        </mesh>
      </group>
      {/* spawn pad */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 12]}>
        <ringGeometry args={[1.4, 1.6, 48]} />
        <meshBasicMaterial color="#ff4655" toneMapped={false} />
      </mesh>
    </group>
  );
}
