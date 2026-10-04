export type SectionId = "projects" | "skills" | "education" | "about";

export const profile = {
  name: "AHMED MAHMOUD",
  title: "GAME DEVELOPER",
  photo: "", // e.g. "photo.jpg" placed in /public — leave empty for placeholder
};

export const sections: Record<
  SectionId,
  { label: string; code: string; color: string; position: [number, number, number]; terminal: string; header: string }
> = {
  projects: { label: "PROJECTS", code: "01", color: "#ff4655", position: [-12, 0, -14], terminal: "PROJECT DATABASE", header: "PROJECT DATABASE // ACCESS GRANTED" },
  skills: { label: "SKILLS", code: "02", color: "#2fd3c4", position: [-4, 0, -14], terminal: "TRAINING PROFILE", header: "TRAINING PROFILE // AHMED MAHMOUD" },
  education: { label: "EDUCATION", code: "03", color: "#f5b942", position: [4, 0, -14], terminal: "TRAINING RECORD", header: "TRAINING RECORD // EDUCATION" },
  about: { label: "ABOUT / CONTACT", code: "04", color: "#8fa8ff", position: [12, 0, -14], terminal: "PERSONNEL FILE", header: "PERSONNEL FILE // AHMED MAHMOUD" },
};

export type Project = {
  id: string; name: string; category: string; tech: string[]; desc: string;
  contributions: string[];
  github?: string; play?: string; mediaUrl?: string;
  media?: { src: string; alt: string; kind: "image" | "video" | "youtube" }[];
};

export const projects: Project[] = [
  { id: "eyedentify", name: "EyeDentify AI", category: "Graduation Project", tech: ["Python", "Computer Vision"], desc: "AI-based systems for detecting eye and body diseases from external and retinal eye images using classification, segmentation, and regression models.", contributions: [] },
  { id: "escctrl", name: "ESCCTRL", category: "2D Puzzle Platformer", tech: ["C++", "SFML"], desc: "2D puzzle platformer with movement-based puzzles and interactive gameplay mechanics.", contributions: ["Gameplay systems", "Player mechanics", "Collision handling"] },
  { id: "tilt", name: "Tilt Game Solver", category: "Puzzle-solving System", tech: ["C#", "BFS", "Graph Theory"], desc: "Puzzle-solving system using breadth-first search and graph traversal for complex multi-object movement mechanics.", contributions: [] },
  { id: "duck", name: "The Great Duck War", category: "Collaborative Cinematic Rendering", tech: ["Blender"], desc: "Collaborative cinematic rendering project.", contributions: ["3D asset integration", "Environment composition", "Camera sequencing", "Lighting", "Final scene rendering"] },
];

export const skills = [
  { group: "Programming", items: ["C++", "C#", "Python", "Java", "Arduino C"] },
  { group: "Game Development", items: ["Unity", "Unreal Engine", "SFML", "OpenGL"] },
  { group: "Computer Science", items: ["OOP", "Data Structures", "Algorithms", "Design Patterns", "Networks"] },
  { group: "Tools", items: ["Git", "GitHub"] },
  { group: "Methodologies", items: ["Agile", "Scrum"] },
  { group: "Soft Skills", items: ["Problem Solving", "Teamwork", "Communication", "Presentation"] },
];

export const education = [
  { school: "Information Technology Institute (ITI)", degree: "Game Programming Diploma", years: "Oct 2025 – Aug 2026", note: "9-Month Professional Diploma", location: "Smart Village, Giza" },
  { school: "Ain Shams University", degree: "B.Sc. in Computer Science — Scientific Computing", years: "Oct 2021 – Jul 2025", note: "Faculty of Computer and Information Science", location: "" },
];

export const about = {
  bio: "Game developer with a background in computer science and a passion for creating interactive experiences, gameplay systems, and technical solutions.",
  location: "Cairo, Egypt",
  email: "ahmedmahmoud15520034@gmail.com",
  socials: [
    { label: "GitHub" },
    { label: "LinkedIn" },
    { label: "itch.io" },
    { label: "X" },
  ] as { label: string; href?: string }[],
};

export const achievements = [
  { award: "3rd Place", event: "SATC Competition", year: "2024", institution: "Military College" },
  { award: "Best Space Mission Idea", event: "SATC Competition", year: "2023", institution: "Military College" },
  { award: "Top 10", event: "Real-Life Competition", year: "2023", institution: "American University in Cairo" },
  { award: "1st Place Project", event: "Electronics Competition", year: "2021", institution: "Ain Shams University" },
];
