"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Facility } from "./Facility";
import { Targets } from "./Targets";
import { Player } from "./Player";
import { useGame } from "./store";
import { Panel, lockPointer } from "./Panels";
import { profile, sections } from "@/data/portfolio";

function Crosshair() {
  const hit = useGame((s) => s.hitTick);
  const shots = useGame((s) => s.shots);
  const [flash, setFlash] = useState(false);
  const [kick, setKick] = useState(false);
  useEffect(() => {
    if (!hit) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 180);
    return () => clearTimeout(t);
  }, [hit]);
  useEffect(() => {
    if (!shots) return;
    setKick(true);
    const t = setTimeout(() => setKick(false), 90);
    return () => clearTimeout(t);
  }, [shots]);
  return (
    <div className="pointer-events-none fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
      <div className={`crosshair ${kick ? "crosshair-kick" : ""}`}>
        <span /><span /><span /><span />
        <i />
      </div>
      {flash && <div className="hitmarker" />}
    </div>
  );
}

function HUD() {
  const locked = useGame((s) => s.locked);
  const open = useGame((s) => s.open);
  return (
    <>
      {locked && <Crosshair />}
      <div className="pointer-events-none fixed left-6 top-6 z-10">
        <p className="font-display text-sm tracking-[0.35em] text-foreground/90">{profile.name}</p>
        <p className="hud-kicker">Training facility</p>
      </div>
      <div className="pointer-events-none fixed bottom-6 left-6 z-10 flex gap-2">
        {Object.values(sections).map((s) => (
          <span key={s.code} className="hud-chip" style={{ borderColor: s.color }}>
            <b style={{ color: s.color }}>{s.code}</b> {s.label}
          </span>
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-6 right-6 z-10 text-right text-xs uppercase tracking-[0.25em] text-muted-foreground">
        WASD move · Mouse aim · Click shoot · Shift walk · Esc pause
      </div>
      {open && <Panel id={open} />}
      {!locked && !open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-md animate-in fade-in">
          <div className="text-center">
            <p className="hud-kicker mb-3">Portfolio // Live range</p>
            <h1 className="font-display text-6xl tracking-[0.12em] text-foreground md:text-8xl">{profile.name}</h1>
            <p className="font-display mt-2 text-xl tracking-[0.5em] text-primary">{profile.title}</p>
            <p className="mx-auto mt-6 max-w-md text-muted-foreground">
              Shoot the four targets to open Projects, Skills, Education and Contact.
            </p>
            <button id="play-btn" onClick={lockPointer} className="hud-btn mt-8 text-lg">
              Enter range
            </button>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">Desktop · mouse & keyboard</p>
          </div>
        </div>
      )}
    </>
  );
}

export function Game() {
  return (
    <div className="dark fixed inset-0 bg-background">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 78, near: 0.05, far: 120, position: [0, 1.7, 12] }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={["#1a1d23"]} />
        <fog attach="fog" args={["#1a1d23", 25, 60]} />
        <hemisphereLight args={["#ffffff", "#5a5f6a", 0.7]} />
        <directionalLight
          position={[8, 14, 10]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-22}
          shadow-camera-right={22}
          shadow-camera-top={22}
          shadow-camera-bottom={-22}
          shadow-bias={-0.0005}
        />
        <Environment resolution={128}>
          <Lightformer intensity={2} position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[30, 30, 1]} color="#ffffff" />
          <Lightformer intensity={1.5} color="#ff4655" position={[-15, 3, 0]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          <Lightformer intensity={1.5} color="#2fd3c4" position={[15, 3, 0]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <Facility />
          <Targets />
        </Suspense>
        <Player />
      </Canvas>
      <HUD />
    </div>
  );
}
