"use client";

import { Award, Code2, Cpu, GitBranch, Mail, MapPin, Network, Users, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { about, achievements, education, profile, skills } from "@/data/portfolio";

const skillIcons = [Code2, Cpu, Network, GitBranch, Workflow, Users];

export function SkillRecords() {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{skills.map((group, i) => {
    const Icon = skillIcons[i] ?? Code2;
    return <section key={group.group} className="skill-record"><div className="mb-4 flex items-center justify-between"><Icon className="h-5 w-5 text-secondary" /><span className="terminal-label">PROFILE / 0{i + 1}</span></div><h3 className="font-display text-lg">{group.group}</h3><div className="mt-3 flex flex-wrap gap-2">{group.items.map((item) => <span className="skill-tag" key={item}>{item}</span>)}</div></section>;
  })}</div>;
}

export function EducationRecords() {
  return <div className="space-y-6">{education.map((entry, i) => <article className="training-record" key={entry.school}><div className="training-number font-display">0{i + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2"><p className="terminal-label text-chart-3">EDUCATION RECORD / 0{i + 1}</p><p className="terminal-label text-foreground">{entry.years}</p></div><h3 className="mt-4 font-display text-xl md:text-2xl">{entry.degree}</h3><p className="mt-2 text-foreground">{entry.school}</p><p className="mt-1 text-sm text-muted-foreground">{entry.note}</p>{entry.location && <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{entry.location}</p>}</div></article>)}</div>;
}

export function PersonnelRecord() {
  return <div>
    <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
      <section><p className="terminal-label text-chart-4">PERSONNEL / GAME DEVELOPER</p><h3 className="mt-3 font-display text-2xl">{profile.name}</h3><p className="mt-1 text-secondary">Game Developer</p><p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">{about.bio}</p></section>
      <section className="min-w-0"><p className="terminal-label mb-3">CONTACT CHANNELS</p><p className="mb-3 flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-chart-4" />{about.location}</p><Button asChild variant="outline" className="email-link h-auto justify-start py-3"><a href={`mailto:${about.email}`}><Mail className="shrink-0 text-chart-4" /><span>{about.email}</span></a></Button><div className="mt-3 flex flex-wrap gap-2">{about.socials.map((social) => social.href ? <Button asChild variant="outline" size="sm" key={social.label}><a href={social.href} target="_blank" rel="noreferrer">{social.label}</a></Button> : <span key={social.label} title={`${social.label} link not supplied`}><Button disabled variant="outline" size="sm">{social.label}</Button></span>)}</div></section>
    </div>
    <section className="mt-8 border-t border-border pt-6"><div className="mb-4 flex items-center gap-3"><Award className="h-5 w-5 text-chart-3" /><h3 className="terminal-label text-foreground">ACHIEVEMENT RECORDS</h3></div><div className="grid gap-x-8 sm:grid-cols-2">{achievements.map((record) => <article className="achievement-record" key={`${record.event}-${record.year}`}><span className="terminal-label text-chart-3">{record.year}</span><div className="min-w-0"><h4 className="font-display text-base">{record.award}</h4><p className="mt-1 text-sm text-foreground">{record.event}</p><p className="text-xs text-muted-foreground">{record.institution}</p></div></article>)}</div></section>
  </div>;
}
