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
      
      {/* Top Left HUD */}
      <div className="pointer-events-none fixed left-8 top-8 z-10 transition-opacity duration-300" style={{ opacity: locked && !open ? 1 : 0 }}>
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 shadow-lg relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <p className="font-display text-xs tracking-[0.4em] text-primary drop-shadow-md">SYS.OP. {profile.name}</p>
          <p className="hud-kicker mt-1 text-white/90 drop-shadow-md">TACTICAL TRAINING SIMULATION v1.0</p>
        </div>
      </div>

      {/* Bottom Left HUD (Sections Status) */}
      <div className="pointer-events-none fixed bottom-8 left-8 z-10 flex flex-col gap-2 transition-opacity duration-300" style={{ opacity: locked && !open ? 1 : 0 }}>
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 shadow-lg">
          <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-3 drop-shadow-md border-b border-white/10 pb-2">Target Sectors</div>
          <div className="flex flex-col gap-2">
            {Object.values(sections).map((s) => (
              <div key={s.code} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }}></span>
                <span className="font-display font-bold text-xs tracking-[0.2em]" style={{ color: s.color }}>{s.code}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-white/90">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Right HUD (Controls) */}
      <div className="pointer-events-none fixed bottom-8 right-8 z-10 text-right transition-opacity duration-300" style={{ opacity: locked && !open ? 1 : 0 }}>
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 shadow-lg">
          <div className="text-xs uppercase tracking-[0.3em] text-white/70 mb-2 drop-shadow-md">Input Diagnostics</div>
          <div className="font-display text-[10px] uppercase tracking-[0.2em] text-white/90 grid grid-cols-2 gap-x-4 gap-y-2 text-left">
            <div><span className="text-primary font-bold mr-2">[WASD]</span>MOVE</div>
            <div><span className="text-primary font-bold mr-2">[MOUSE]</span>AIM</div>
            <div><span className="text-primary font-bold mr-2">[LMB]</span>SHOOT</div>
            <div><span className="text-primary font-bold mr-2">[SHIFT]</span>WALK</div>
            <div className="col-span-2 text-center mt-1 pt-2 border-t border-white/10"><span className="text-primary font-bold mr-2">[ESC]</span>PAUSE</div>
          </div>
        </div>
      </div>

      {open && <Panel id={open} />}
      
      {/* Start Screen / Pause Screen */}
      {!locked && !open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-xl animate-in fade-in duration-500 crt-flicker">
          <div className="relative text-center border border-primary/20 bg-background/40 p-12 shadow-[0_0_50px_rgba(255,70,85,0.1)]">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
            
            <p className="hud-kicker mb-4 text-primary animate-pulse">INITIATING SECURE CONNECTION...</p>
            <h1 className="font-display text-6xl tracking-[0.15em] text-foreground md:text-8xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{profile.name}</h1>
            <p className="font-display mt-3 text-xl tracking-[0.4em] text-primary drop-shadow-[0_0_8px_rgba(255,70,85,0.4)]">{profile.title}</p>
            
            <div className="mx-auto mt-8 max-w-lg border-t border-b border-border/50 py-6">
              <p className="font-display text-sm tracking-widest text-muted-foreground mb-2">MISSION BRIEFING:</p>
              <p className="text-sm tracking-wide text-muted-foreground/80 leading-relaxed">
                Welcome to the interactive portfolio environment.<br/>
                Shoot the designated target sectors to access encrypted professional data.<br/>
                <span className="text-primary/80 mt-2 block">System requires manual initialization to proceed.</span>
              </p>
            </div>
            
            <button id="play-btn" onClick={lockPointer} className="hud-btn mt-10 text-xl px-12 py-4 group relative overflow-hidden">
              <span className="relative z-10 font-display font-bold tracking-[0.2em]">INITIALIZE LINK</span>
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
            </button>
            
            <p className="mt-6 font-display text-[10px] uppercase tracking-[0.4em] text-muted-foreground/50">
              Authentication: Desktop | Input: Mouse & Keyboard
            </p>
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
