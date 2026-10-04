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
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-background/60 p-6 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="hud-panel w-full max-w-5xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300" style={{ ["--sec" as string]: s.color }}>
        <div className="flex items-start justify-between border-b border-border px-8 py-6">
          <div>
            <p className="hud-kicker" style={{ color: s.color }}>SECTOR {s.code}</p>
            <h2 className="font-display text-4xl tracking-wider text-foreground md:text-5xl">{s.label}</h2>
          </div>
          <button onClick={close} className="hud-btn-ghost" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-8 py-6">
          <Body id={id} />
        </div>
        <div className="flex items-center justify-between border-t border-border px-8 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Placeholder content</p>
          <button onClick={close} className="hud-btn">Return to range · E</button>
        </div>
      </div>
    </div>
  );
}
