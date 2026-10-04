"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { sections, type SectionId } from "@/data/portfolio";
import { game } from "./store";
import { ProjectDatabase } from "./ProjectDatabase";
import { EducationRecords, PersonnelRecord, SkillRecords } from "./PortfolioRecords";
import { playUiOpen, playUiClose } from "./audio";

export function lockPointer() {
  document.querySelector("canvas")?.requestPointerLock();
}

function Body({ id }: { id: SectionId }) {
  if (id === "projects") return <ProjectDatabase />;
  if (id === "skills") return <SkillRecords />;
  if (id === "education") return <EducationRecords />;
  return <PersonnelRecord />;
}

export function Panel({ id }: { id: SectionId }) {
  const s = sections[id];
  
  useEffect(() => {
    playUiOpen();
  }, []);
  
  const close = () => {
    playUiClose();
    game.set({ open: null });
    lockPointer();
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.code === "KeyE" && close();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-6 sm:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
      <div className="hud-panel relative flex h-full w-full max-w-6xl flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 crt-flicker" style={{ ["--sec" as string]: s.color }}>
        
        {/* Terminal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-black/40 px-8 py-5">
          <div className="flex items-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center border" style={{ borderColor: s.color, backgroundColor: `${s.color}20` }}>
              <span className="font-display text-xl font-bold" style={{ color: s.color }}>{s.code}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p className="hud-kicker tracking-[0.3em]" style={{ color: s.color }}>SECTOR DECRYPTED</p>
                <div className="h-[1px] w-12 bg-border"></div>
                <p className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">ACCESS GRANTED</p>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-widest text-foreground md:text-5xl drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] uppercase">
                {s.label}
              </h2>
            </div>
          </div>
          <button onClick={close} className="hud-btn-ghost group relative flex h-12 w-12 items-center justify-center border border-border bg-black/40 hover:border-primary transition-colors duration-200" aria-label="Close">
            <X className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Content Area */}
        <div className="relative flex-1 bg-black/60 min-h-0">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
          <div className="h-full overflow-y-auto custom-scrollbar px-8 py-8">
            <Body id={id} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
        </div>

        {/* Terminal Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-border bg-black/60 px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: s.color, boxShadow: `0 0 10px ${s.color}` }} />
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70">
              UPLINK ACTIVE · SECURE CONNECTION
            </p>
          </div>
          <button onClick={close} className="hud-btn text-sm px-8 py-3 flex items-center gap-3 group">
            <span className="relative z-10">DISCONNECT TERMINAL</span>
            <span className="relative z-10 font-display text-xs bg-black/30 px-2 py-1 rounded border border-current/20">[E]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
