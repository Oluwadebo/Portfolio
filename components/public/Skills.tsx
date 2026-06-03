"use client";

const skills = [
  {
    category: "FRONTEND",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "BACKEND",
    items: ["Node.js", "Express", "REST APIs", "JWT Auth"],
  },
  {
    category: "DATABASE",
    items: ["MongoDB","Mongoose"],
  },
  { category: "TOOLS", items: ["Git","GitHub", "Vercel", "Render"] },
];

const tags = [
  "NEXT.JS",
  "TYPESCRIPT",
  "NODE.JS",
  "MONGODB",
  "EXPRESS.JS",
  "REST APIS",
  "JWT AUTH",
  "TAILWIND CSS",
  "GIT",
  "VERCEL",
  "RENDER",
];

export default function Skills() {
  return (
    <section id="skills" className="w-full flex justify-center py-24 px-6">
      <div className="w-full max-w-5xl">
        <p className="font-mono text-[10px] tracking-[.25em] text-[#3B82F6] mb-3">
          SKILLS
        </p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-10">
          My Tech Stack<span className="text-[#3B82F6]">.</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {skills.map((group) => (
            <div
              key={group.category}
              className="bg-[#0D1220] border border-white/5 p-5 hover:border-[#3B82F6]/30 transition-colors"
            >
              <p className="font-mono text-[10px] text-[#3B82F6] tracking-[.2em] mb-4">
                {group.category}
              </p>
              <ul className="space-y-2">
                {group.items.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 text-[#94A3B8] text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#3B82F6] flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-3 py-1.5 border border-[#3B82F6]/20 text-[#3B82F6]/60 tracking-[.1em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
