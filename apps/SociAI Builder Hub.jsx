import React, { useState, useMemo } from "react";
import { ArrowUp, MessageSquare, Rocket, GitFork, Star, Search, Filter, Zap, Award } from "lucide-react";

const META = {
  title: "SociAI Builder Hub",
  subtitle: "Product Hunt for AI apps, agents, and prompts — built by people, shipped by everyone",
  brand: "SociAI",
};

const CATEGORIES = [
  { id: "agents", label: "Agents", emoji: "🤖" },
  { id: "prompts", label: "Prompts", emoji: "💬" },
  { id: "apps", label: "Apps", emoji: "📱" },
  { id: "skills", label: "Skills", emoji: "🎯" },
  { id: "chars", label: "Characters", emoji: "🎭" },
];

const LAUNCHES = [
  { id: 1, cat: "agents", rank: 1, name: "TinyAuditor", by: "@renata", tagline: "One agent that reads your PR and points at the one bug that matters", votes: 812, comments: 94, forks: 41, stack: ["Claude Opus 4.7", "GitHub API"], featured: true },
  { id: 2, cat: "prompts", rank: 2, name: "The 3-Line CEO", by: "@lin", tagline: "System prompt that turns any LLM into a ruthless product editor. Every reply <= 3 lines.", votes: 604, comments: 71, forks: 220, stack: ["Any LLM"], featured: false },
  { id: 3, cat: "apps", rank: 3, name: "Refrigerator Chef", by: "@ada", tagline: "Snap fridge → get a recipe. Vision + planner + shopping-list agent in one PWA.", votes: 512, comments: 48, forks: 12, stack: ["GPT-5V", "Next.js"], featured: false },
  { id: 4, cat: "skills", rank: 4, name: "abc-diagrams", by: "@mat", tagline: "Claude Code skill that turns any topic into editorial HTML+SVG diagrams. No Mermaid slop.", votes: 488, comments: 62, forks: 33, stack: ["Claude Code", "SVG"], featured: true },
  { id: 5, cat: "chars", rank: 5, name: "Marcus Aurelius (Unofficial)", by: "@fsb", tagline: "Character card trained on Meditations + 400 stoic annotations. Talks like a general, thinks like a monk.", votes: 402, comments: 28, forks: 88, stack: ["Character.AI export"], featured: false },
  { id: 6, cat: "agents", rank: 6, name: "MailMason", by: "@lin", tagline: "Reads your inbox once at 8am, drafts 5 replies, and shuts up until you accept them.", votes: 371, comments: 44, forks: 21, stack: ["Gmail MCP", "Claude"], featured: false },
  { id: 7, cat: "apps", rank: 7, name: "ScrollFlix", by: "@mat", tagline: "Netflix for AI-generated 5-second video loops. Endless scroll, no ads, no algorithm.", votes: 358, comments: 82, forks: 6, stack: ["Seedance", "Remotion"], featured: false },
  { id: 8, cat: "prompts", rank: 8, name: "The Brutal Reviewer", by: "@renata", tagline: "Pastes your landing page copy. Returns 3 headline rewrites and the one truth you're hiding.", votes: 302, comments: 39, forks: 141, stack: ["Any LLM"], featured: false },
];

function VoteButton({ votes }) {
  const [voted, setVoted] = useState(false);
  return (
    <button
      onClick={() => setVoted(!voted)}
      className={`flex w-14 flex-col items-center justify-center rounded-lg border py-2 transition ${
        voted
          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
          : "border-neutral-300 bg-white text-neutral-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
      }`}
    >
      <ArrowUp className={`h-5 w-5 ${voted ? "fill-indigo-500 text-indigo-500" : ""}`} />
      <span className="mt-0.5 text-sm font-semibold">{votes + (voted ? 1 : 0)}</span>
    </button>
  );
}

function LaunchRow({ launch }) {
  const cat = CATEGORIES.find((c) => c.id === launch.cat);
  return (
    <article className="group flex gap-4 border-b border-neutral-200 px-5 py-4 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/40">
      <VoteButton votes={launch.votes} />
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-2xl">
        {cat?.emoji}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-neutral-900 group-hover:text-indigo-600 dark:text-neutral-100">
            {launch.name}
          </h3>
          {launch.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              <Award className="h-3 w-3" />
              featured
            </span>
          )}
          <span className="text-xs text-neutral-500">by {launch.by}</span>
        </div>
        <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{launch.tagline}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {launch.comments}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5" />
            {launch.forks} forks
          </span>
          <span className="text-neutral-400">·</span>
          <div className="flex gap-1">
            {launch.stack.map((s) => (
              <span
                key={s}
                className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("hot");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let l = LAUNCHES;
    if (cat !== "all") l = l.filter((x) => x.cat === cat);
    if (q) {
      const s = q.toLowerCase();
      l = l.filter(
        (x) =>
          x.name.toLowerCase().includes(s) ||
          x.tagline.toLowerCase().includes(s) ||
          x.by.toLowerCase().includes(s)
      );
    }
    if (sort === "hot") l = [...l].sort((a, b) => b.votes - a.votes);
    if (sort === "new") l = [...l].sort((a, b) => a.rank - b.rank);
    if (sort === "forks") l = [...l].sort((a, b) => b.forks - a.forks);
    return l;
  }, [cat, sort, q]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">SociAI</h1>
              <p className="text-xs text-neutral-500">Builder Hub · today&rsquo;s launches</p>
            </div>
          </div>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            + Ship yours
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search agents, prompts, characters…"
              className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            />
          </div>
          <div className="flex gap-1 rounded-lg bg-white p-1 text-xs dark:bg-neutral-900">
            {[
              { id: "hot", label: "🔥 Hot", icon: <Zap className="h-3 w-3" /> },
              { id: "new", label: "🆕 New" },
              { id: "forks", label: "🍴 Most forked" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`rounded-md px-3 py-1.5 font-semibold transition ${
                  sort === s.id
                    ? "bg-indigo-600 text-white"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setCat("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              cat === "all"
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                cat === c.id
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500">
              No launches match. Try different filters.
            </div>
          ) : (
            filtered.map((l) => <LaunchRow key={l.id} launch={l} />)
          )}
        </div>

        <footer className="mt-6 text-center text-xs text-neutral-500">
          SociAI Builder Hub · {LAUNCHES.length} launches today · new drop every morning
        </footer>
      </div>
    </div>
  );
}
