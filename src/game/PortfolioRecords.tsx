"use client";

import { Award, Code2, Cpu, GitBranch, Mail, MapPin, Network, Users, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { about, achievements, education, profile, skills } from "@/data/portfolio";

const skillIcons = [Code2, Cpu, Network, GitBranch, Workflow, Users];

export function SkillRecords() {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{skills.map((group, i) => {
    const Icon = skillIcons[i] ?? Code2;
    return <section key={group.group} className="skill-record border-white/20 bg-black/40"><div className="mb-4 flex items-center justify-between"><Icon className="h-5 w-5 text-primary" /><span className="terminal-label text-white/60">PROFILE / 0{i + 1}</span></div><h3 className="font-display text-lg text-white font-bold tracking-wide">{group.group}</h3><div className="mt-4 flex flex-wrap gap-2">{group.items.map((item) => <span className="skill-tag text-white/80 border-white/20 bg-white/5" key={item}>{item}</span>)}</div></section>;
  })}</div>;
}

export function EducationRecords() {
  return <div className="space-y-6">{education.map((entry, i) => <article className="training-record border-white/20 bg-black/40" key={entry.school}><div className="training-number font-display text-primary">0{i + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2"><p className="terminal-label text-primary/80">EDUCATION RECORD / 0{i + 1}</p><p className="terminal-label text-white/90">{entry.years}</p></div><h3 className="mt-4 font-display text-xl md:text-2xl text-white font-bold">{entry.degree}</h3><p className="mt-2 text-white/90">{entry.school}</p><p className="mt-1 text-sm text-white/70">{entry.note}</p>{entry.location && <p className="mt-3 flex items-center gap-2 text-sm text-white/60"><MapPin className="h-4 w-4" />{entry.location}</p>}</div></article>)}</div>;
}

export function PersonnelRecord() {
  return <div>
    <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
      <section><p className="terminal-label text-primary">PERSONNEL / GAME DEVELOPER</p><h3 className="mt-3 font-display text-3xl text-white font-bold">{profile.name}</h3><p className="mt-1 text-white/80 font-display tracking-widest uppercase">Game Developer</p><p className="mt-5 max-w-lg text-sm leading-relaxed text-white/80">{about.bio}</p></section>
      <section className="min-w-0"><p className="terminal-label mb-3 text-white/60">CONTACT CHANNELS</p><p className="mb-4 flex items-center gap-2 text-sm text-white/90"><MapPin className="h-4 w-4 text-primary" />{about.location}</p><Button asChild variant="outline" className="email-link h-auto justify-start py-4 border-white/20 bg-black/40 hover:bg-white/10 hover:border-primary text-white"><a href={`mailto:${about.email}`}><Mail className="shrink-0 text-primary" /><span>{about.email}</span></a></Button><div className="mt-4 flex flex-wrap gap-2">{about.socials.map((social) => social.href ? <Button asChild variant="outline" size="sm" key={social.label} className="border-white/20 bg-black/40 hover:bg-white/10 text-white hover:text-white"><a href={social.href} target="_blank" rel="noreferrer">{social.label}</a></Button> : <span key={social.label} title={`${social.label} link not supplied`}><Button disabled variant="outline" size="sm" className="border-white/10 text-white/30">{social.label}</Button></span>)}</div></section>
    </div>
    <section className="mt-10 border-t border-white/10 pt-8"><div className="mb-6 flex items-center gap-3"><Award className="h-5 w-5 text-primary" /><h3 className="terminal-label text-white">ACHIEVEMENT RECORDS</h3></div><div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">{achievements.map((record) => <article className="achievement-record border border-white/10 bg-black/20 p-4" key={`${record.event}-${record.year}`}><span className="terminal-label text-primary">{record.year}</span><div className="min-w-0"><h4 className="font-display text-base text-white font-bold">{record.award}</h4><p className="mt-1 text-sm text-white/90">{record.event}</p><p className="mt-1 text-xs text-white/60">{record.institution}</p></div></article>)}</div></section>
  </div>;
}
