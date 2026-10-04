"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronRight, Film, Github, ImageOff, Play, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects, type Project } from "@/data/portfolio";

function ProjectMedia({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  const media = project.media?.[active];
  return (
    <div>
      <div className="project-media">
        {media?.kind === "image" ? <img src={media.src} alt={media.alt} className="h-full w-full object-contain" />
          : media?.kind === "video" ? <video src={media.src} controls aria-label={media.alt} className="h-full w-full object-contain" />
          : media?.kind === "youtube" ? <iframe src={media.src} title={media.alt} allowFullScreen className="h-full w-full border-0" />
          : <div className="flex flex-col items-center gap-3 text-muted-foreground"><ImageOff className="h-8 w-8" strokeWidth={1} /><span className="terminal-label">MEDIA // NOT ATTACHED</span></div>}
        <span className="media-index terminal-label">{project.id.toUpperCase()} / {String(active + 1).padStart(2, "0")}</span>
      </div>
      {(project.media?.length ?? 0) > 1 && <div className="mt-2 flex gap-2">{project.media?.map((item, i) => <Button key={item.src} variant="outline" size="sm" aria-pressed={active === i} onClick={() => setActive(i)}>{i + 1}</Button>)}</div>}
    </div>
  );
}

export function ProjectDatabase() {
  const [selected, setSelected] = useState(projects[0]?.id);
  const project = projects.find((p) => p.id === selected) ?? projects[0];
  if (!project) return null;
  const index = projects.indexOf(project) + 1;
  const actions = [{ label: "GitHub", icon: Github, href: project.github }, { label: "Play", icon: Play, href: project.play }, { label: "Media", icon: Film, href: project.mediaUrl }];
  return (
    <div className="project-database">
      <div className="project-records flex flex-col gap-3" aria-label="Project records">
        <div className="flex items-center justify-between pb-1"><span className="terminal-label">INDEX / 04 RECORDS</span><ScanLine className="h-4 w-4 text-primary" /></div>
        {projects.map((p, i) => <Button key={p.id} variant="ghost" className="project-record h-auto flex-col items-start justify-start p-4 whitespace-normal text-wrap overflow-hidden w-full" aria-pressed={p.id === selected} onClick={() => setSelected(p.id)}>
          <div className="flex w-full items-center justify-between gap-3 mb-1"><span className="terminal-label text-primary">{String(i + 1).padStart(2, "0")} / {p.category}</span><ChevronRight className="h-4 w-4 shrink-0" /></div>
          <h3 className="font-display text-xl text-white font-bold tracking-wide text-left w-full break-words">{p.name}</h3>
          <span className="text-[10px] text-white/70 uppercase tracking-wider text-left mt-1 w-full">{p.tech.join(" · ")}</span>
          <p className="record-summary text-white/80 mt-2 text-left w-full break-words">{p.desc}</p>
          {p.contributions.length > 0 && <p className="record-summary text-primary/80 mt-1 text-left w-full break-words whitespace-normal text-wrap">{p.contributions.join(" · ")}</p>}
        </Button>)}
      </div>
      <section className="project-focus" aria-label="Selected project" key={project.id}>
        <div className="mb-3 flex items-center justify-between"><span className="terminal-label text-primary">FILE {String(index).padStart(2, "0")} // OPEN</span><span className="terminal-label">PROJECT ARCHIVE</span></div>
        <ProjectMedia project={project} />
        <div className="mt-5 flex items-start justify-between gap-3"><div><p className="terminal-label text-white/60">{project.category}</p><h3 className="mt-1 font-display text-2xl md:text-3xl text-white font-bold tracking-wide">{project.name}</h3></div><ArrowUpRight className="mt-1 h-6 w-6 shrink-0 text-primary" /></div>
        <div className="mt-3 flex flex-wrap gap-2">{project.tech.map((tech) => <span key={tech} className="tech-label text-white/80 border-white/20 bg-white/5">{tech}</span>)}</div>
        <p className="mt-5 text-sm leading-relaxed text-white/90">{project.desc}</p>
        {project.contributions.length > 0 && <div className="mt-6 border-t border-white/10 pt-4"><p className="terminal-label text-white/60">CONTRIBUTIONS</p><ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{project.contributions.map((c) => <li key={c} className="flex items-center gap-2 text-sm text-white/80"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{c}</li>)}</ul></div>}
        <div className="mt-5 flex flex-wrap gap-2">{actions.map(({ label, icon: Icon, href }) => href ? <Button asChild key={label} variant="outline" size="sm"><a href={href} target="_blank" rel="noreferrer"><Icon />{label}</a></Button> : <span key={label} title={`${label} link not supplied`}><Button disabled variant="outline" size="sm"><Icon />{label}</Button></span>)}</div>
      </section>
    </div>
  );
}
