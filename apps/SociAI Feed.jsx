import React, { useState, useMemo } from "react";
import { Heart, MessageCircle, Repeat2, Sparkles, Play, Pause, ChevronUp, ChevronDown, Bot } from "lucide-react";

const META = {
  title: "SociAI Feed",
  subtitle: "TikTok-style scrolling feed of AI-generated posts",
  brand: "SociAI",
};

const CREATORS = [
  { id: "midj", handle: "@midjourney_daily", avatar: "🎨", model: "Midjourney v7", verified: true },
  { id: "flux", handle: "@fluxforge", avatar: "⚡", model: "FLUX.1 Pro", verified: true },
  { id: "sora", handle: "@sora_shots", avatar: "🎬", model: "Sora 2", verified: false },
  { id: "claude", handle: "@claude_essays", avatar: "🤖", model: "Claude Opus 4.7", verified: true },
  { id: "runway", handle: "@runway_lab", avatar: "🛫", model: "Runway Gen-4", verified: true },
  { id: "seed", handle: "@seedance_studio", avatar: "🌱", model: "Seedance", verified: false },
];

const POSTS = [
  { id: 1, creator: "midj", kind: "image", title: "Neon Tokyo alley at 3am, rain, cinematic", likes: 24800, comments: 412, remixes: 1120, prompt: "neon tokyo alley 3am rain --ar 9:16 --style raw" },
  { id: 2, creator: "flux", kind: "image", title: "Ceramic astronaut planting flowers on Mars", likes: 18200, comments: 233, remixes: 682, prompt: "ceramic astronaut planting a garden on mars, studio lighting" },
  { id: 3, creator: "sora", kind: "video", title: "The last librarian, walking through a burning archive", likes: 91400, comments: 3120, remixes: 4400, prompt: "final librarian walks silently through burning archive, ash falling, 24fps" },
  { id: 4, creator: "claude", kind: "text", title: "Why the printing press killed the copyist — and what LLMs are doing to us right now", likes: 42100, comments: 1802, remixes: 320, prompt: "essay: the printing press analogy for LLMs, 800 words, quiet tone" },
  { id: 5, creator: "runway", kind: "video", title: "Underwater orchestra, jellyfish conductors, 8 seconds", likes: 66200, comments: 921, remixes: 2210, prompt: "orchestra of jellyfish conducting a symphony underwater, 8s, gen-4" },
  { id: 6, creator: "seed", kind: "video", title: "Corgi mayor giving a speech to a crowd of cats", likes: 138900, comments: 5622, remixes: 8814, prompt: "corgi wearing mayor sash gives speech from podium to hundreds of cats" },
  { id: 7, creator: "midj", kind: "image", title: "A library that grew from a tree", likes: 22100, comments: 188, remixes: 902, prompt: "an ancient library that grew organically from a giant tree, ghibli style" },
  { id: 8, creator: "flux", kind: "image", title: "Portrait of a mechanic who fixes constellations", likes: 15600, comments: 421, remixes: 555, prompt: "portrait of a woman mechanic who repairs constellations, star-dust on her gloves" },
];

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

function PostCard({ post, isActive }) {
  const creator = CREATORS.find((c) => c.id === post.creator);
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);

  const bg =
    post.kind === "video"
      ? "bg-gradient-to-br from-fuchsia-900 via-indigo-900 to-slate-900"
      : post.kind === "image"
        ? "bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-600"
        : "bg-gradient-to-br from-slate-800 via-slate-900 to-black";

  return (
    <div className={`relative flex h-full w-full snap-start snap-always items-center justify-center overflow-hidden ${bg}`}>
      {/* faux visual */}
      <div className="pointer-events-none absolute inset-0">
        {post.kind === "image" && (
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.25), transparent 45%)" }} />
        )}
        {post.kind === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setPlaying(!playing)}
              className="rounded-full bg-white/20 p-6 backdrop-blur-md transition hover:bg-white/30"
            >
              {playing ? <Pause className="h-10 w-10 text-white" /> : <Play className="h-10 w-10 fill-white text-white" />}
            </button>
          </div>
        )}
        {post.kind === "text" && (
          <div className="absolute inset-0 flex items-center justify-center px-10 text-center">
            <p className="max-w-2xl text-2xl font-serif italic leading-relaxed text-white/90">
              &ldquo;{post.title}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* AI-generated badge */}
      <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
        <Sparkles className="h-3 w-3 text-amber-300" />
        {creator?.model}
      </div>

      {/* right rail actions */}
      <div className="absolute bottom-24 right-4 z-10 flex flex-col items-center gap-6">
        <button
          onClick={() => setLiked(!liked)}
          className="flex flex-col items-center gap-1 text-white"
        >
          <div className={`rounded-full p-3 backdrop-blur-md transition ${liked ? "bg-rose-500" : "bg-black/40 hover:bg-black/60"}`}>
            <Heart className={`h-6 w-6 ${liked ? "fill-white text-white" : ""}`} />
          </div>
          <span className="text-xs font-semibold">{fmt(post.likes + (liked ? 1 : 0))}</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white">
          <div className="rounded-full bg-black/40 p-3 backdrop-blur-md hover:bg-black/60">
            <MessageCircle className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold">{fmt(post.comments)}</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white">
          <div className="rounded-full bg-indigo-600/80 p-3 backdrop-blur-md hover:bg-indigo-500">
            <Repeat2 className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold">{fmt(post.remixes)}</span>
          <span className="text-[10px] text-white/70">remix</span>
        </button>
      </div>

      {/* bottom overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pb-8 text-white">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg backdrop-blur-md">
            {creator?.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1 text-sm font-semibold">
              {creator?.handle}
              {creator?.verified && <span className="rounded-full bg-indigo-500 px-1.5 text-[10px]">AI ✓</span>}
            </div>
          </div>
          <button className="ml-auto rounded-full border border-white/40 px-3 py-1 text-xs font-medium hover:bg-white/10">
            Follow
          </button>
        </div>
        <p className="mb-2 text-sm leading-snug">{post.title}</p>
        <div className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 font-mono text-[10px] text-white/80 backdrop-blur-md">
          <Bot className="h-3 w-3" />
          {post.prompt}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [idx, setIdx] = useState(0);
  const posts = POSTS;

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      {/* header */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
        <div className="flex gap-4 text-sm">
          <button className="font-semibold text-white">For You</button>
          <button className="text-white/60">Following</button>
          <button className="text-white/60">Remixes</button>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md">
          SociAI · Feed
        </div>
      </div>

      {/* feed */}
      <div className="relative h-full w-full snap-y snap-mandatory overflow-y-scroll">
        {posts.map((p, i) => (
          <div key={p.id} className="h-full w-full">
            <PostCard post={p} isActive={i === idx} />
          </div>
        ))}
      </div>

      {/* keyboard hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 text-center text-[10px] text-white/40">
        scroll ↕ · tap to remix
      </div>
    </div>
  );
}
