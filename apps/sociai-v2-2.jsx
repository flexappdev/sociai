import { useState, useMemo, useEffect } from "react";
import {
  Sun, Moon, Menu, Search, ChevronRight, ChevronLeft, LayoutGrid, List, Rows3,
  BookOpen, GraduationCap, FileText, LayoutDashboard, CheckCircle2, Circle,
  Newspaper, FlaskConical, Clock, Award, PenLine, ListChecks, X, RotateCcw, Mic,
  BookMarked, LogOut, User, Lock, Users, Eye, EyeOff, ArrowLeft, Lightbulb,
  MessageCircleQuestion, KeyRound, BarChart3, AlertTriangle, Sparkles, Shuffle, Film,
} from "lucide-react";

/* ══════════ TOKENS — SociAI (slate neutrals + #006699 accent, dark-first) ══════════ */
const TOKENS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;0,6..96,700;0,6..96,800;1,6..96,400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root, [data-theme="dark"] {
  --background:#0b0f14; --foreground:#f4f7f9;
  --card:#141a21; --card-foreground:#f4f7f9;
  --popover:#141a21; --popover-foreground:#f4f7f9;
  --primary:#0d86c0; --primary-deep:#006699; --primary-foreground:#f0f9ff;
  --secondary:#1b232c; --secondary-foreground:#c5d0d9;
  --muted:#1b232c; --muted-foreground:#8fa0ad;
  --accent:rgba(13,134,192,0.16); --accent-foreground:#3aa5d6;
  --destructive:#ef4444; --destructive-foreground:#fef2f2;
  --border:#2c3843; --input:#1b232c; --ring:rgba(13,134,192,0.5);
  --radius:8px;
  --surface-1:#141a21; --surface-2:#1b232c; --surface-3:#2c3843; --border-subtle:#1b232c;
  --success:#22c55e; --success-muted:rgba(34,197,94,0.15);
  --warning:#f59e0b; --warning-muted:rgba(245,158,11,0.15);
  --info:#38bdf8; --info-muted:rgba(56,189,248,0.15);
  --shadow-sm:0 1px 2px rgba(0,0,0,0.3); --shadow-md:0 4px 12px rgba(0,0,0,0.4); --shadow-lg:0 8px 24px rgba(0,0,0,0.5);
}
[data-theme="light"] {
  --background:#f6f9fb; --foreground:#13202b;
  --card:#ffffff; --card-foreground:#13202b;
  --popover:#ffffff; --popover-foreground:#13202b;
  --primary:#006699; --primary-deep:#006699; --primary-foreground:#ffffff;
  --secondary:#eaf1f5; --secondary-foreground:#39505f;
  --muted:#eaf1f5; --muted-foreground:#5f7686;
  --accent:rgba(0,102,153,0.10); --accent-foreground:#006699;
  --destructive:#dc2626; --destructive-foreground:#ffffff;
  --border:#cddae2; --input:#e3ecf1; --ring:rgba(0,102,153,0.4);
  --surface-1:#ffffff; --surface-2:#eaf1f5; --surface-3:#dbe7ee; --border-subtle:#e3ecf1;
  --success:#16a34a; --success-muted:rgba(22,163,74,0.1);
  --warning:#d97706; --warning-muted:rgba(217,119,6,0.1);
  --info:#0284c7; --info-muted:rgba(2,132,199,0.1);
  --shadow-sm:0 1px 2px rgba(16,42,58,0.06); --shadow-md:0 4px 12px rgba(16,42,58,0.09); --shadow-lg:0 8px 24px rgba(16,42,58,0.12);
}
body { font-family:'Inter',system-ui,sans-serif; font-size:13px; line-height:1.5; color:var(--foreground); background:var(--background); -webkit-font-smoothing:antialiased; }
.serif { font-family:'Bodoni Moda', Georgia, serif; }
::-webkit-scrollbar { width:6px; height:6px; }
::-webkit-scrollbar-track { background:var(--surface-1); }
::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
:focus-visible { outline:2px solid var(--ring); outline-offset:2px; }
.hoverable { transition:border-color .15s, background .15s; }
.hoverable:hover { border-color:var(--primary) !important; }
.navitem:hover { background:var(--accent); }
`;

/* ══════════ Primitives ══════════ */
function cn(...c) { return c.filter(Boolean).join(" "); }

/* SociAI mark — a sociogram: nodes and ties, in the brand blue */
const SociMark = ({ size = 30 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="29" stroke="var(--primary)" strokeWidth="2.5" opacity="0.35" />
    <path d="M32 13 L50 41 L14 41 Z" stroke="var(--primary)" strokeWidth="2" opacity="0.55" />
    <path d="M32 13 L32 41 M14 41 L50 41" stroke="var(--primary)" strokeWidth="1.4" opacity="0.35" />
    <circle cx="32" cy="13" r="5.5" fill="var(--primary)" />
    <circle cx="50" cy="41" r="5.5" fill="var(--primary)" />
    <circle cx="14" cy="41" r="5.5" fill="var(--primary)" />
    <circle cx="32" cy="41" r="4" fill="var(--accent-foreground)" />
  </svg>
);

function Badge({ children, variant = "default", size = "sm" }) {
  const v = {
    default: { bg: "var(--muted)", color: "var(--muted-foreground)" },
    primary: { bg: "var(--accent)", color: "var(--accent-foreground)" },
    success: { bg: "var(--success-muted)", color: "var(--success)" },
    warning: { bg: "var(--warning-muted)", color: "var(--warning)" },
    info: { bg: "var(--info-muted)", color: "var(--info)" },
    destructive: { bg: "rgba(239,68,68,0.15)", color: "var(--destructive)" },
  }[variant] || { bg: "var(--muted)", color: "var(--muted-foreground)" };
  return (
    <span style={{ background: v.bg, color: v.color, padding: size === "xs" ? "1px 6px" : "2px 8px",
      borderRadius: 9999, fontSize: size === "xs" ? 10 : 11, fontWeight: 500, whiteSpace: "nowrap", letterSpacing: "0.01em" }}>
      {children}
    </span>
  );
}

function Btn({ children, variant = "primary", size = "sm", onClick, disabled, style = {} }) {
  const sizes = { xs: { padding: "4px 10px", fontSize: 11 }, sm: { padding: "7px 14px", fontSize: 12 }, md: { padding: "10px 20px", fontSize: 13 } };
  const variants = {
    primary: { background: "var(--primary)", color: "var(--primary-foreground)" },
    secondary: { background: "var(--secondary)", color: "var(--secondary-foreground)", border: "1px solid var(--border)" },
    ghost: { background: "transparent", color: "var(--muted-foreground)" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      cursor: disabled ? "not-allowed" : "pointer", borderRadius: "var(--radius)", fontWeight: 600,
      display: "inline-flex", alignItems: "center", gap: 6, border: "none", transition: "all .15s",
      fontFamily: "inherit", opacity: disabled ? 0.5 : 1, ...sizes[size], ...variants[variant], ...style,
    }}>{children}</button>
  );
}

/* ══════════ Slug helpers ══════════ */
function slugify(str) {
  return String(str).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ══════════ Diagram registry — one visual per class ══════════
   kinds: flow | cycle | tree | compare | layers | pyramid | matrix */
const DIAGRAMS = {
  s1c1: { kind: "layers", focus: "Deep Mediatization", labels: ["Work", "Intimacy", "Politics", "Health", "Play"], note: "Media is no longer a tool — it is where social life happens." },
  s1c2: { kind: "flow", focus: "Algorithmic Assemblage", labels: ["Data", "Code", "Team", "Users", "Outcome"], note: "An algorithm is never just math." },
  s1c3: { kind: "compare", focus: "3 ML Paradigms", labels: ["Supervised", "Unsupervised", "Reinforcement", "Labelled pairs", "Structure hunting", "Reward shaping"], note: "Every objective is a value choice." },
  s1c4: { kind: "flow", focus: "GenAI Pipeline", labels: ["Corpus", "Pretrain", "Tune (RLHF)", "Prompt", "Output"], note: "Each arrow is a human decision." },
  s1c5: { kind: "cycle", focus: "Surveillance Capitalism", labels: ["Extract", "Predict", "Modify", "Sell futures"], note: "Behaviour → data → predictions → behavioural markets." },
  s1c6: { kind: "matrix", focus: "Attention Economy", labels: ["Time", "Engagement", "Ads", "Emotion"], note: "Attention is the scarce resource; outrage is the cheapest fuel." },
  s1c7: { kind: "tree", focus: "Platform Society", labels: ["Search", "Social", "Marketplace", "Cloud", "Payments"], note: "Platforms are the operating layer of coordination." },
  s1c8: { kind: "compare", focus: "Public vs Networked Public", labels: ["Public sphere", "Networked publics", "Deliberation", "Scroll & react", "Editors", "Algorithms"], note: "Same idea, new pipes, new gatekeepers." },
  s1c9: { kind: "cycle", focus: "Gig Loop", labels: ["Task offered", "Worker accepts", "Algorithmic score", "Reallocation"], note: "The manager is a stopwatch that can fire you." },
  s1c10: { kind: "layers", focus: "The Datafied Self", labels: ["Steps", "Sleep", "Mood", "Diet", "Sex"], note: "Optimisation becomes a moral vocabulary for intimacy." },
  s1c11: { kind: "flow", focus: "Filter Bubble", labels: ["Click", "Signal", "Rank", "Feed", "Belief"], note: "The feed learns you faster than you learn it." },
  s1c12: { kind: "matrix", focus: "Digital Divide 2×2", labels: ["Access", "Skill", "Have+Skill=Benefit", "Have−Skill=Passive", "Lack+Skill=Blocked", "Lack−Skill=Excluded"], note: "Access is only the first divide." },
  s1c13: { kind: "compare", focus: "Semester 1 — Machines & Markets", labels: ["Media", "Data", "Platforms", "Culture", "Capital", "Labour"], note: "Six threads to synthesise for the midterm." },
  s2c14: { kind: "tree", focus: "The Alignment Problem", labels: ["Values", "Reward", "Behaviour", "Outer align", "Inner align"], note: "Aligning to WHOSE values, decided HOW?" },
  s2c15: { kind: "pyramid", focus: "Bias Stack", labels: ["Historical", "Representation", "Measurement", "Aggregation", "Deployment"], note: "Bias enters at every layer of the ML lifecycle." },
  s2c16: { kind: "matrix", focus: "AI × Inequality", labels: ["Race", "Class", "Gender", "Global South"], note: "Existing hierarchies get automated at scale." },
  s2c17: { kind: "flow", focus: "Automation Curve", labels: ["Task", "Codify", "Automate", "Displace", "Redesign"], note: "The question is not IF but WHO decides and WHO retrains." },
  s2c18: { kind: "cycle", focus: "Info Disorder", labels: ["Create", "Amplify", "Believe", "Act"], note: "Misinformation is a social system, not a mistake." },
  s2c19: { kind: "compare", focus: "Human vs Machine Cognition", labels: ["Human", "Machine", "Slow, embodied", "Fast, statistical", "Meaning-making", "Pattern-matching"], note: "Cognition is not one thing." },
  s2c20: { kind: "layers", focus: "AI in Institutions", labels: ["School", "Hospital", "Court", "Police", "Welfare"], note: "Discretion is being replaced by dashboards." },
  s2c21: { kind: "pyramid", focus: "Ethics of AI", labels: ["Values", "Principles", "Rules", "Practice", "Redress"], note: "Principles without redress are decoration." },
  s2c22: { kind: "matrix", focus: "Regulatory Geographies", labels: ["EU regulates", "US innovates", "China coordinates", "Global South complies"], note: "Different games, different winners." },
  s2c23: { kind: "tree", focus: "The EU AI Act", labels: ["Prohibited", "High-risk", "Limited-risk", "Minimal"], note: "Europe's risk-tiered ordering of AI." },
  s2c24: { kind: "cycle", focus: "AI & Climate", labels: ["Train", "Emit", "Cool", "Discard"], note: "Every prompt has a physical footprint." },
  s2c25: { kind: "flow", focus: "AI Governance Actors", labels: ["Labs", "States", "Users", "Civil society", "Standards"], note: "Governance is a contest, not a table of rules." },
  s2c26: { kind: "pyramid", focus: "Futures of AI Society", labels: ["Automation", "Augmentation", "Alignment", "Autonomy", "Accountability"], note: "The last question of the course is: who gets to answer these?" },
};

/* ══════════ Diagram component ══════════ */
function Diagram({ spec, compact }) {
  if (!spec) return null;
  const H = compact ? 150 : 200;
  const W = compact ? 320 : 460;
  const c = "var(--primary)";
  const cd = "var(--primary-deep)";
  const bg = "var(--surface-2)";
  const fg = "var(--foreground)";
  const mute = "var(--muted-foreground)";

  const renderKind = () => {
    const { kind, labels } = spec;
    const n = labels.length;
    if (kind === "flow") {
      const boxW = (W - 40) / n - 12;
      const gap = 12;
      return (<g>{labels.map((l, i) => { const x = 20 + i * (boxW + gap); const y = H / 2 - 22; return (<g key={i}><rect x={x} y={y} width={boxW} height={44} rx={8} fill={bg} stroke={c} strokeWidth={i === 0 || i === n - 1 ? 2 : 1} /><text x={x + boxW / 2} y={y + 27} textAnchor="middle" fill={fg} fontSize={compact ? 10 : 11} fontWeight={600}>{l.length > 14 ? l.slice(0, 12) + "…" : l}</text>{i < n - 1 && (<path d={`M${x + boxW + 1} ${y + 22} L${x + boxW + gap - 3} ${y + 22}`} stroke={c} strokeWidth={1.5} markerEnd="url(#arr)" />)}</g>); })}</g>);
    }
    if (kind === "cycle") {
      const cx = W / 2, cy = H / 2, r = compact ? 55 : 70;
      const step = (2 * Math.PI) / n;
      return (<g><circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />{labels.map((l, i) => { const a = -Math.PI / 2 + i * step; const x = cx + Math.cos(a) * r; const y = cy + Math.sin(a) * r; return (<g key={i}><circle cx={x} cy={y} r={compact ? 24 : 30} fill={bg} stroke={c} strokeWidth={1.5} /><text x={x} y={y + 3} textAnchor="middle" fill={fg} fontSize={compact ? 9 : 10} fontWeight={600}>{l.length > 10 ? l.slice(0, 9) + "…" : l}</text></g>); })}{labels.map((_, i) => { const a1 = -Math.PI / 2 + i * step; const a2 = -Math.PI / 2 + ((i + 1) % n) * step; const rr = compact ? 30 : 36; const x1 = cx + Math.cos(a1) * (r - rr / 2) * 0.85 + Math.cos(a1 + Math.PI / 2) * 12; const y1 = cy + Math.sin(a1) * (r - rr / 2) * 0.85 + Math.sin(a1 + Math.PI / 2) * 12; const x2 = cx + Math.cos(a2) * (r - rr / 2) * 0.85 - Math.cos(a2 - Math.PI / 2) * 12; const y2 = cy + Math.sin(a2) * (r - rr / 2) * 0.85 - Math.sin(a2 - Math.PI / 2) * 12; return <path key={"a" + i} d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} stroke={c} strokeWidth={1} fill="none" markerEnd="url(#arr)" opacity={0.6} />; })}</g>);
    }
    if (kind === "tree") {
      const rootW = 130;
      const childW = (W - 40) / Math.max(1, n - 1) - 10;
      return (<g><rect x={W / 2 - rootW / 2} y={22} width={rootW} height={38} rx={8} fill={c} stroke={cd} /><text x={W / 2} y={46} textAnchor="middle" fill="#fff" fontSize={compact ? 11 : 12} fontWeight={700}>{labels[0]?.length > 18 ? labels[0].slice(0, 17) + "…" : labels[0]}</text>{labels.slice(1).map((l, i) => { const cxb = 20 + i * (childW + 10) + childW / 2; const yb = H - 55; return (<g key={i}><line x1={W / 2} y1={60} x2={cxb} y2={yb} stroke={c} strokeWidth={1} /><rect x={cxb - childW / 2} y={yb} width={childW} height={36} rx={7} fill={bg} stroke={c} /><text x={cxb} y={yb + 22} textAnchor="middle" fill={fg} fontSize={compact ? 9 : 10} fontWeight={600}>{l.length > 13 ? l.slice(0, 12) + "…" : l}</text></g>); })}</g>);
    }
    if (kind === "compare") {
      const half = Math.floor(labels.length / 2);
      const leftLabels = labels.slice(0, half);
      const rightLabels = labels.slice(half);
      const rowH = (H - 40) / Math.max(1, half);
      return (<g>{leftLabels.map((l, i) => (<g key={"l" + i}><rect x={20} y={30 + i * rowH} width={W / 2 - 30} height={rowH - 8} rx={6} fill={bg} stroke={c} strokeWidth={i === 0 ? 2 : 1} /><text x={W / 4 + 5} y={30 + i * rowH + rowH / 2 - 2} textAnchor="middle" fill={fg} fontSize={compact ? 10 : 11} fontWeight={i === 0 ? 700 : 500}>{l.length > 18 ? l.slice(0, 17) + "…" : l}</text></g>))}{rightLabels.map((l, i) => (<g key={"r" + i}><rect x={W / 2 + 10} y={30 + i * rowH} width={W / 2 - 30} height={rowH - 8} rx={6} fill={bg} stroke={cd} strokeWidth={i === 0 ? 2 : 1} /><text x={(3 * W) / 4 - 5} y={30 + i * rowH + rowH / 2 - 2} textAnchor="middle" fill={fg} fontSize={compact ? 10 : 11} fontWeight={i === 0 ? 700 : 500}>{l.length > 18 ? l.slice(0, 17) + "…" : l}</text></g>))}</g>);
    }
    if (kind === "layers") {
      const rowH = (H - 40) / n;
      return (<g>{labels.map((l, i) => (<g key={i}><rect x={30 + i * 4} y={20 + i * rowH} width={W - 60 - i * 8} height={rowH - 6} rx={6} fill={bg} stroke={c} strokeWidth={1} opacity={0.5 + (i * 0.5) / n} /><text x={W / 2} y={20 + i * rowH + rowH / 2 - 1} textAnchor="middle" fill={fg} fontSize={compact ? 10 : 11} fontWeight={600}>{l.length > 24 ? l.slice(0, 22) + "…" : l}</text></g>))}</g>);
    }
    if (kind === "pyramid") {
      const rowH = (H - 40) / n;
      return (<g>{labels.map((l, i) => { const w = (W - 60) * (0.35 + (0.65 * i) / (n - 1 || 1)); const x = (W - w) / 2; const y = H - 20 - (i + 1) * rowH; return (<g key={i}><rect x={x} y={y} width={w} height={rowH - 4} rx={4} fill={i === 0 ? c : bg} stroke={c} strokeWidth={1} /><text x={W / 2} y={y + rowH / 2} textAnchor="middle" fill={i === 0 ? "#fff" : fg} fontSize={compact ? 9.5 : 10.5} fontWeight={i === 0 ? 700 : 600}>{l.length > 22 ? l.slice(0, 20) + "…" : l}</text></g>); })}</g>);
    }
    if (kind === "matrix") {
      const axis = labels.slice(0, 2);
      const cells = labels.slice(2);
      const cw = (W - 80) / 2, ch = (H - 60) / 2;
      return (<g><text x={W / 2} y={16} textAnchor="middle" fill={mute} fontSize={compact ? 9 : 10} fontWeight={700}>{axis[0] || ""}</text><text x={16} y={H / 2} textAnchor="middle" fill={mute} fontSize={compact ? 9 : 10} fontWeight={700} transform={`rotate(-90 16 ${H / 2})`}>{axis[1] || ""}</text>{[0, 1, 2, 3].map((i) => { const col = i % 2, row = Math.floor(i / 2); const x = 40 + col * cw, y = 26 + row * ch; return (<g key={i}><rect x={x} y={y} width={cw - 4} height={ch - 4} rx={6} fill={bg} stroke={c} strokeWidth={1} /><text x={x + (cw - 4) / 2} y={y + (ch - 4) / 2 + 3} textAnchor="middle" fill={fg} fontSize={compact ? 9 : 10} fontWeight={600}><tspan>{(cells[i] || "").slice(0, 22)}</tspan></text></g>); })}</g>);
    }
    return null;
  };

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: compact ? 10 : 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-foreground)", letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <BarChart3 size={12} /> DIAGRAM · {spec.kind.toUpperCase()}
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>{spec.focus}</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={compact ? 150 : 200} style={{ display: "block" }}>
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,8 L7,4 z" fill={c} />
          </marker>
        </defs>
        {renderKind()}
      </svg>
      {spec.note && (
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--muted-foreground)", fontStyle: "italic", textAlign: "center" }}>
          {spec.note}
        </div>
      )}
    </div>
  );
}

/* ══════════ DATA — 26 sessions with full lectures, quizzes, exams ══════════ */
const SESSIONS = [
  /* ───── SEMESTER 1 — Machines, Markets & Media ───── */
  { id: "s1c1", sem: 1, num: 1, title: "Introduction — Living in a Digital Society", thumb: "📱",
    tags: ["digital society", "culture", "identity"],
    desc: "What does it mean that social life is now datafied and mediated? Course overview, expectations, and the sociological toolkit we will use all year.",
    reading: { kind: "paper", ref: "Couldry, N. & Hepp, A. (2017). The Mediated Construction of Reality, ch. 1. Polity Press." },
    lec: {
      intro: "This opening lecture sets the intellectual agenda for the year: artificial intelligence and digital media are not gadgets added on top of society — they are increasingly the fabric through which society is produced. We ask what changes when everyday life becomes datafied, and what sociology, specifically, has to say about it.",
      sections: [
        { h: "From tools to environments", ps: ["Early sociology of technology treated media as discrete tools with measurable 'effects'. Couldry and Hepp argue we have entered 'deep mediatization': digital media and data infrastructures are now entangled with every domain of social life — work, intimacy, politics, health. Technology is no longer something we use; it is somewhere we live.", "Consider the difference between owning a landline and carrying a smartphone. The landline waited in the hallway; the smartphone travels in the pocket, mediating navigation, payment, friendship, romance, news and work. There is no longer a before and after of media use — only degrees of connection.", "This is why Couldry and Hepp speak of a media manifold rather than individual media: the point is not any single app but the interlocking whole. Analytically, the shift demands that sociology stop treating the digital as a variable and start treating it as the terrain."] },
        { h: "Datafication and the social", ps: ["Datafication is the conversion of social action — friendship, movement, mood, attention — into quantifiable, machine-readable data. Once quantified, social life becomes calculable, predictable and, crucially, monetizable. This shift underwrites everything we study this year, from surveillance capitalism to algorithmic management.", "Examples multiply once you look: a like becomes a preference signal, a pause on a video becomes an engagement metric, a route to work becomes a location history. None of these were data before an infrastructure existed to capture, store and price them.", "Two consequences follow. First, categories built for machines start to shape self-understanding — people learn to think of themselves in metrics. Second, whoever owns the conversion process owns a new kind of capital, which is why datafication is a question of power, not merely of measurement."] },
        { h: "The sociological lens", ps: ["Against technological determinism ('AI will inevitably cause X') and pure social constructivism ('technology is whatever we make of it'), we adopt a socio-technical approach: technologies are shaped by social interests and, once deployed, reshape social relations in patterned, unequal ways. Our recurring questions: who builds it, who benefits, who bears the risk, and who gets to decide?", "Determinism appears everywhere in public debate: AI will take the jobs, the algorithm radicalised him, technology connects the world. Each sentence gives agency to the artefact and hides the firms, engineers, laws and users behind it.", "The socio-technical alternative keeps both sides in view. The QWERTY keyboard, the elevator, the contraceptive pill: each was shaped by interests and then reshaped daily life along patterned lines. Our year applies exactly this double gaze to AI."] },
        { h: "A short history of the digital", ps: ["From ARPANET to the smartphone to generative AI, digitalisation advanced in waves — connection, participation, platformisation, datafication, automation. Each wave layered new infrastructures on the last; none replaced society, but each rewired how coordination, commerce and conversation happen.", "The rough chronology: ARPANET in 1969, the web in 1991, search and social platforms through the 2000s, smartphones after 2007, deep learning from 2012, generative AI reaching mass adoption in 2023 — the fastest technology diffusion ever recorded.", "Periodisation matters because each layer left institutions behind: the open web produced norms of free content that advertising then monetised; social platforms produced connectivity that AI now mines as training data. History here is not background — it is the supply chain of the present."] },
        { h: "Mediatization of institutions", ps: ["Schools, hospitals, courts and churches now operate through platforms, dashboards and data flows. Sociologists track how institutional logics change when metrics travel: a school run through learning analytics is not the same school with new tools — its definition of a good student shifts.", "Take the university itself: admission algorithms, plagiarism detection, learning-management dashboards, citation metrics. Each tool answers a real need, and together they redefine what studying, teaching and excelling mean in practice.", "The general lesson comes from institutional theory: when an organisation adopts a metric, behaviour bends toward it. Mediatization is therefore not neutral plumbing — it is a slow renegotiation of every institution's definition of success."] },
        { h: "The quantified self", ps: ["Wearables, streaks and step counts turn the body and the day into data projects. Self-tracking promises autonomy and knowledge, yet it also imports market metrics into intimate life — optimisation becomes a moral vocabulary for sleep, mood and friendship.", "Fitness trackers, sleep scores, screen-time reports, period apps, mood logs: the market for self-measurement is vast, and its data flows onward to insurers, advertisers and employers in ways users rarely trace.", "Sociologists read self-tracking ambivalently. It can empower — patients managing chronic illness swear by it — and it can discipline, importing the logic of performance review into rest, food and love. The same device does both; context decides which."] },
        { h: "Digital divides", ps: ["Access is only the first divide. Skills, usage and outcomes divide again: the same internet yields homework help in one household and pure entertainment platforms in another. AI adds a new layer — who has the tools, literacy and power to benefit from automation.", "The classic finding: giving households broadband does not equalise outcomes. Wealthier families convert access into homework help, careers advice and civic voice; poorer families receive the same bandwidth configured toward entertainment and extraction.", "AI sharpens the pattern. Those with skills use models as tutors and accelerants; those without meet them as opaque gatekeepers — scoring their CVs, their benefit claims, their loan applications. The divide is no longer about who is online but about who the system works for."] },
        { h: "Key thinkers, mapped", ps: ["This year you will meet Zuboff on extraction, boyd on youth publics, Turkle on intimacy, van Dijck on platforms, Bradford on regulation, Gabriel on values. Keep a running map: most disagreements between them are really disagreements about where power sits.", "A quick orientation: Zuboff sees corporate extraction as the core problem; boyd insists on studying users before judging them; Turkle worries about intimacy; van Dijck dissects platform architecture; Bradford follows regulatory power; Gabriel asks whose values rule.", "Use the map actively. When two authors clash — Zuboff's alarmed structuralism against boyd's patient ethnography — ask what each can see that the other cannot. Exam essays that stage such confrontations, fairly, earn the highest bands."] },
        { h: "How to study a digital society", ps: ["Digital sociology mixes classic methods — interviews, ethnography, surveys — with new ones: platform data analysis, algorithm audits, digital trace research. Each method sees differently, and each raises fresh ethical questions about consent and visibility.", "Concretely: interviews reveal how drivers experience the algorithm; audits reveal what the algorithm actually does; trace data reveals patterns at scale; ethnography reveals the meanings users build. Triangulation is not a luxury in this field — it is the method.", "Ethics has changed too. Public tweets feel like data but belong to people; scraping, anonymisation and consent all require fresh judgment. Every method chapter this year returns to one question: what do we owe the people inside our datasets?"] },
        { h: "Using this course", ps: ["Every class pairs one reading with one lecture and ends with a quiz; exams reward connections across sessions, not summaries. Read before class, contest at least one claim per text, and keep asking the four questions: who builds, who benefits, who bears risk, who decides.", "Practical mechanics: readings average twenty to forty pages a week; quizzes take fifteen minutes and draw directly from them; the midterm covers half a semester, the final all of it. The presentation in week 25 carries 15 percent of the second semester.", "One study strategy beats all others here: after each class, write three sentences connecting the new reading to any previous one. Twenty-six classes later you will possess the cross-case arguments that exams reward — built weekly, painlessly."] },
      ],
      concepts: ["deep mediatization", "datafication", "socio-technical systems", "technological determinism"],
      discuss: ["List three activities you did today that produced data about you. Who holds that data, and what could it predict?", "Is 'digital society' a new type of society or the same society with new tools? Defend one position."],
    },
    quiz: [
      { q: "According to Couldry & Hepp, 'deep mediatization' refers to…", o: ["Media replacing face-to-face interaction entirely", "Every element of social life becoming entangled with digital media and data", "The growth of investigative journalism", "Faster internet infrastructure"], a: 1 },
      { q: "A 'datafied' society is one where…", o: ["Data is stored on paper", "Social activities are converted into quantifiable data", "Only governments hold data", "Data has no economic value"], a: 1 },
      { q: "Sociology approaches technology primarily as…", o: ["A neutral tool with fixed effects", "Something shaped by, and shaping, social relations and power", "A purely engineering problem", "An unpredictable natural force"], a: 1 },
    ] },
  { id: "s1c2", sem: 1, num: 2, title: "Algorithms — Power in the Code", thumb: "🧮",
    tags: ["algorithms", "power", "opacity"],
    desc: "Algorithms as socio-technical objects: how they classify, rank and decide — and why studying them is methodologically hard.",
    reading: { kind: "paper", ref: "Kitchin, R. (2017). 'Thinking critically about and researching algorithms', Information, Communication & Society, 20(1)." },
    lec: {
      intro: "Algorithms decide what you see, what you pay, whether you get the loan, the job interview, or the parole hearing. This lecture treats the algorithm not as mathematics but as a social institution — designed by people, embedded in organisations, and exercising a quiet but pervasive form of power.",
      sections: [
        { h: "What is an algorithm, sociologically?", ps: ["Technically, an algorithm is a finite sequence of steps that transforms input into output. Kitchin insists this definition misleads: real-world algorithms are 'ontogenetic' — endlessly tweaked, retrained and A/B-tested — and embedded in assemblages of code, data, business models, legal constraints and human workarounds. To study 'the algorithm' is to study that whole assemblage.", "A recipe is an algorithm; so is a bureaucratic procedure. What distinguishes the platform algorithm is scale, speed and feedback: it applies to millions simultaneously, updates continuously, and learns from the behaviour it provokes.", "Kitchin's ontogenetic point has teeth: the Facebook ranking of Monday is not the ranking of Friday. Studying such an object is like ethnographing a city during an earthquake — which is why he insists on studying the assemblage, not the artefact."] },
        { h: "Black boxes and method", ps: ["Algorithms resist study: they are proprietary, technically opaque, personalised (everyone sees a different output) and constantly changing. Kitchin surveys methodological responses — interviewing designers, reverse engineering outputs, auditing with sock-puppet accounts, ethnographies of coding teams. Each sees only part of the elephant, which is itself a finding about power.", "Researchers have been inventive: creating fleets of fake profiles to compare what different users are shown, interviewing former engineers under anonymity, analysing patents, even suing for access. Each tactic met a legal or technical wall built by the platform.", "The opacity is not accidental — trade secrecy, gaming prevention and liability management all reward it. That the object of study defends itself against study tells you it knows exactly how much power is at stake."] },
        { h: "Algorithmic power and governance", ps: ["Ranking, filtering and scoring are acts of classification — and, as Bourdieu and Foucault taught, classification is power. When such classification is automated and naturalised as 'just math', it becomes harder to contest. 'Algorithmic governance' names the ordering of social life through such systems, often without the procedural safeguards we demand of human bureaucracy.", "Compare the loan officer and the credit model. Both classify; but the officer can be questioned, shamed, appealed to and held responsible. The model distributes the same power while dissolving the address at which you could contest it.", "Foucault would recognise the pattern: power is most effective when it disappears into procedure. Algorithmic governance extends the filing cabinet and the census — older classification machines — with one addition: it acts in real time, on everyone, at once."] },
        { h: "A short history of automated decision", ps: ["Long before deep learning, bureaucracies scored people: credit ratings, actuarial tables, school tracking. Algorithms industrialise a much older practice — formal classification of persons — which is why the sociology of bureaucracy remains excellent preparation for studying them.", "Credit scoring emerged in the 1950s precisely to replace prejudiced loan officers with statistics — an equality argument. FICO scores then became gatekeepers of housing, cars and sometimes jobs, encoding new exclusions behind the neutral number.", "The lesson for AI debates: every automated decision system is sold as a correction of human bias and later discovered to have institutionalised its own. The cycle is now on its third or fourth turn; sociology's job is to remember the previous ones."] },
        { h: "Recommenders as culture machines", ps: ["Recommendation systems do not just serve taste; they shape it. By ranking what is seen, they set agendas for music, news and belief — a curatorial power once held by editors and DJs, now exercised by optimisation loops tuned to engagement.", "Streaming services report that most viewing starts from a recommendation, not a search. Playlists shape what music gets made — artists write shorter intros because skips are counted — and feeds decide which news outlets survive.", "Cultural sociology once studied gatekeepers: editors, labels, critics. The gatekeepers remain, but the most powerful one is now an optimisation loop whose taste is engagement. Culture adapts to its distributor — as it always has, faster than ever."] },
        { h: "The scored society", ps: ["Credit scores, fraud scores, risk scores, hiring scores: life chances increasingly pass through numerical gates. Scores feel objective, yet each encodes choices about data, thresholds and error costs — and mistakes fall unevenly across social groups.", "Beyond credit: tenant-screening scores decide apartments, fraud scores freeze benefit payments, risk scores inform bail, productivity scores rank warehouse workers. Most subjects never learn their score exists until it blocks something.", "Scores share a family structure: a proxy stands in for a person, a threshold stands in for a judgment, and the burden of error falls on the scored. Due process — knowing, contesting, correcting — is the reform demand that unites every scored domain."] },
        { h: "Feedback loops and performativity", ps: ["Algorithmic predictions act on the world they predict. Police sent where crime was recorded find more crime there; trending lists make trends. Sociologists call this performativity — the model helps produce the reality it claims merely to describe.", "Predictive policing is the canonical case: patrols sent to high-score areas record more incidents there, the records feed the model, the model raises the score. The prediction manufactures its own confirmation while appearing merely to observe.", "Economists know the pattern from ratings and rankings — universities gaming league tables, restaurants chasing stars. Wherever a measure feeds back into the world it measures, expect performativity; with algorithms the loop simply runs faster and with less friction."] },
        { h: "Folk theories of the algorithm", ps: ["Users develop their own theories — shadowbans, lucky posting hours, the mood of the feed — and act on them. These folk theories matter sociologically: people strategise around imagined algorithms, so even a misunderstood system reshapes behaviour.", "Creators trade tips: post at certain hours, avoid certain words, never edit after publishing. Some tips are true, some superstition — the platform rarely confirms either, and the uncertainty itself keeps producers anxiously compliant.", "Folk theories are sociologically productive: they show ordinary people theorising power under conditions of enforced ignorance. Studying what users believe the algorithm does can matter more than the code — because beliefs, not code, guide their behaviour."] },
        { h: "Accountability and explanation", ps: ["Explainable AI promises reasons for decisions, but explanation is a social relation, not a printout: an appeal needs someone empowered to reverse the outcome. Due process — notice, reasons, contest — is the older technology that automation often quietly removes.", "GDPR gestures at a right to explanation; the AI Act adds documentation duties. But a saliency map is not a reason, and a reason without a route to reversal is decoration. Explanation is only accountability when someone must answer.", "The deeper design question: which decisions should remain contestable by construction? Some scholars argue for algorithmic due process — notice, hearing, appeal — as a legal default wherever automated systems allocate rights or resources."] },
        { h: "A research agenda", ps: ["Kitchin leaves us a checklist: study the code and its makers, the data and its gaps, the institutions deploying the system, and the users adapting to it. No single method suffices — algorithmic power lives in the whole assemblage, so research must too.", "Kitchin's own list: ethnographies of production, reverse engineering, interviews with designers, examining code where possible, and studying effects in the wild. A decade later, add audits at scale and the new leverage of regulatory data-access rights.", "For your own work: pick one algorithmic system you can actually reach — a university tool, a local platform — and ask the assemblage questions. The methodological lesson generalises far beyond algorithms: study power where it hides, with whatever instruments reach it."] },
      ],
      concepts: ["socio-technical assemblage", "black box", "algorithmic governance", "classification power"],
      discuss: ["Choose one algorithm you interact with daily. What would a sociologist need to access to truly understand it?", "Is an opaque algorithm more or less accountable than an opaque human bureaucrat? Why?"],
    },
    quiz: [
      { q: "Kitchin argues algorithms should be studied as…", o: ["Pure mathematical objects", "Contingent, ontogenetic socio-technical assemblages", "Neutral instructions", "Legal documents"], a: 1 },
      { q: "A key methodological challenge in researching algorithms is…", o: ["They are too simple", "Their black-boxed, proprietary and constantly-updated nature", "Too many researchers already study them", "They never change"], a: 1 },
      { q: "'Algorithmic governance' describes…", o: ["Electing programmers to parliament", "Ordering and regulating social life through automated computational systems", "Government bans on code", "Open-source licensing"], a: 1 },
    ] },
  { id: "s1c3", sem: 1, num: 3, title: "AI Technologies I — Machine Learning, Deep Learning, RL", thumb: "🤖",
    tags: ["machine learning", "deep learning", "reinforcement learning"],
    desc: "A sociologist's guide to the machinery: supervised learning, neural networks, reinforcement learning — what the terms actually mean and why definitions matter politically.",
    reading: { kind: "press", ref: "Hao, K. (2018). 'What is machine learning?', MIT Technology Review." },
    lec: {
      intro: "You cannot critique what you cannot describe. This lecture gives a non-mathematical but precise vocabulary for the main paradigms of machine learning, and shows that even 'purely technical' choices — what counts as a label, what counts as a reward — are social decisions in disguise.",
      sections: [
        { h: "Learning from data", ps: ["Classical software encodes rules by hand; machine learning infers rules from examples. In supervised learning, a model is trained on labelled pairs (this image → 'cat'; this CV → 'hired') and learns to generalise. The politics enter immediately: someone chose the labels, and historical labels encode historical judgments — including discriminatory ones.", "A concrete example: a CV-screening model trained on a decade of hiring decisions at a firm that promoted few women will learn that signals of femaleness predict rejection. Amazon built exactly this system and scrapped it in 2018.", "The general principle is unforgiving: supervised learning is institutional memory made executable. Whatever pattern the past contains — merit, prejudice, accident — the model faithfully industrialises. Data is never raw; it is cooked by history."] },
        { h: "Neural networks and deep learning", ps: ["Deep learning stacks layers of artificial neurons that progressively extract features from raw data — edges, then shapes, then faces. Its triumphs since 2012 rest on three inputs: massive datasets, massive computation, and low-paid human labelling work. The sociology of AI is therefore also a sociology of data supply chains and hidden labour.", "The 2012 ImageNet moment is the origin story: a neural network halved the error rate in image recognition, and the field pivoted overnight. The ingredients were not new theory but new scale — GPUs and a million labelled images.", "Note who labelled those images: crowdworkers, paid cents per tag, through platforms like Mechanical Turk. Every triumphant benchmark stands on an invisible scaffold of piecework — a theme that returns in the gig economy class."] },
        { h: "Reinforcement learning", ps: ["In reinforcement learning an agent acts in an environment and adjusts its behaviour to maximise a reward signal — the paradigm behind AlphaGo and behind recommender systems tuned to maximise engagement. The choice of reward function is a value choice: optimise 'time on site' and you have chosen, sociologically, what human attention is for.", "AlphaGo's famous move 37 — a play no human would make — showed reinforcement learning discovering strategies beyond its designers. The same paradigm, pointed at humans, becomes the recommender that discovers outrage keeps us scrolling.", "The sociological reading: a reward function is a codified answer to what matters. When engineers choose engagement, they legislate — without debate, for billions. The question who writes the reward function belongs beside who writes the laws."] },
        { h: "The data pipeline", ps: ["Before any learning happens, data is collected, cleaned, labelled and filtered — each step a chain of human judgments. Much of this work is outsourced to low-paid annotators worldwide, making modern AI a global labour arrangement as much as a technique.", "Follow one image: scraped from the web, filtered by one contractor in Kenya, labelled by another in the Philippines, quality-checked in Colombia, then consumed by a training run in Oregon. The pipeline is a map of the global division of digital labour.", "Investigations have documented content annotators paid under two dollars an hour to view traumatic material so models can refuse it. The clean interface of AI has a supply chain — and supply chains are where sociology traditionally finds the costs."] },
        { h: "Benchmarks and leaderboards", ps: ["Progress in machine learning is measured on shared benchmarks, and labs compete for leaderboard positions. Benchmarks quietly define what counts as intelligence — and when models overfit the test, headline progress can outrun real capability.", "When a benchmark saturates, the field declares progress — yet models acing exams still fail simple variations, suggesting the test taught the answer. Goodhart operates in science too: the measure became the target.", "Benchmarks also steer priorities: what is measured gets optimised, so capabilities with benchmarks (English question-answering) race ahead of ones without (low-resource languages, honesty under pressure). The politics of AI progress hides in test design."] },
        { h: "Generalisation and failure", ps: ["Models excel on data resembling their training distribution and fail strangely outside it — a stop sign with stickers, a dialect underrepresented online. Failure modes are patterned, not random, which is exactly what makes them sociologically interesting.", "Documented failures cluster: speech recognition erring twice as often for Black speakers, vision systems mislabelling darker faces, medical models collapsing when moved to a new hospital. Each traces to who and what the training data contained.", "The pattern predicts where harm lands: on whoever the data underrepresents. Robustness is thus a distributional question — reliability for whom — which converts an engineering property into a topic for the sociology of inequality."] },
        { h: "The compute economy", ps: ["Training frontier models requires GPU clusters costing hundreds of millions, concentrating capability in a few firms and states. Compute has become a strategic resource — rationed, export-controlled and lobbied over like oil.", "Numbers anchor the point: frontier training runs cost hundreds of millions of dollars; a single AI datacentre draws the power of a small city; access to top GPUs is brokered like a scarce commodity because it is one.", "Consequences cascade: universities cannot replicate industrial results, so science depends on corporate goodwill; states treat chips as strategic assets; and the barrier to entry entrenches incumbents. Political economy explains more about AI than architecture diagrams do."] },
        { h: "Opening the black box, partly", ps: ["Interpretability research probes what networks internally represent, but full transparency remains elusive. For social scientists the lesson is pragmatic: govern systems by their measured behaviour and impacts, not by promises about their insides.", "Interpretability researchers have found circuits for individual concepts inside networks and can sometimes steer behaviour by editing them. The work is real science — and it covers a small island in an ocean of parameters.", "The governance implication: do not wait for transparency. Aviation regulates aircraft whose aerodynamics no single person fully computes, through testing, monitoring and liability. Behavioural regulation of opaque systems has precedents; use them."] },
        { h: "ML as organisational practice", ps: ["In real firms, machine learning is meetings, dashboards, deadlines and A/B tests. Ethnographies of ML teams show accuracy trading off against launch dates and revenue targets — the model reflects the organisation that built it.", "Field studies of ML teams describe a familiar office world: sprint deadlines, OKRs, demo days, promotion incentives that reward launches over maintenance. The dataset nobody cleaned and the evaluation nobody reran are organisational facts, not technical ones.", "This lens dissolves the myth of the neutral pipeline. Ask of any deployed model: what deadline shaped it, which team owned the risk, who could say stop? The answers usually explain the failures better than the mathematics."] },
        { h: "Takeaways for the non-engineer", ps: ["You now hold the essential vocabulary: data, labels, objectives, rewards, generalisation. The recurring insight is that every technical choice — what to optimise, what to label, what to ignore — is simultaneously a social choice with distributional consequences.", "Test yourself: can you explain to a friend why training data matters, what a reward function is, and why models fail off-distribution? Those three ideas unlock most public AI controversies.", "Carry them forward critically. When a vendor claims 95 percent accuracy, you now ask: on whose data, against which benchmark, failing on whom? Technical literacy in this course is a form of civic self-defence."] },
      ],
      concepts: ["supervised learning", "training data & labels", "deep neural networks", "reward function"],
      discuss: ["Take a familiar app. What is it plausibly optimising for, and who chose that objective?", "Why does it matter socially whether labels come from experts, crowdworkers, or past administrative decisions?"],
    },
    quiz: [
      { q: "Machine learning differs from classical programming because…", o: ["It requires no computers", "Rules are inferred from data rather than hand-coded", "It only works on text", "It never makes errors"], a: 1 },
      { q: "In supervised learning, models are trained on…", o: ["Unlabelled data", "Labelled examples pairing inputs with expected outputs", "Random noise", "Human interviews"], a: 1 },
      { q: "Reinforcement learning agents improve by…", o: ["Reading textbooks", "Receiving rewards and penalties from interaction with an environment", "Copying other software", "Being manually rewritten daily"], a: 1 },
    ] },
  { id: "s1c4", sem: 1, num: 4, title: "AI Technologies II — LLMs & Generative AI", thumb: "✨",
    tags: ["LLMs", "generative AI", "language"],
    desc: "Large language models and generative systems: scale, training data, and the 'stochastic parrots' critique of meaning, bias and cost.",
    reading: { kind: "paper", ref: "Bender, E., Gebru, T., McMillan-Major, A. & Mitchell, M. (2021). 'On the Dangers of Stochastic Parrots', FAccT '21." },
    lec: {
      intro: "Generative AI produces fluent text, images and code on demand. This lecture explains how large language models work at a conceptual level, then takes seriously the most influential critique written about them — a paper that cost one of its authors her job at Google.",
      sections: [
        { h: "Scale and the transformer moment", ps: ["Large language models are trained to predict the next token across trillions of words scraped largely from the internet. With sufficient scale, next-token prediction yields startling capabilities: translation, summarisation, reasoning-like behaviour. The recipe — more data, more parameters, more compute — concentrates capability in the handful of organisations that can afford it.", "The transformer architecture (2017) made training parallelisable; scaling laws then showed capability rising predictably with size. The recipe was public — the resources were not, which is why a handful of labs now define the frontier.", "Emergent capabilities complicate governance: abilities appear at scale that smaller models lacked, so regulators are asked to certify systems whose behaviour surprises even their makers. The uncertainty is structural, not a temporary bug."] },
        { h: "The stochastic parrots critique", ps: ["Bender and colleagues argue that LLMs are 'stochastic parrots': systems that stitch together plausible sequences from patterns in training data, without communicative intent or grounded meaning. Their warnings: web-scale corpora overrepresent dominant voices and encode bias; training costs are environmentally significant; and fluency invites misplaced trust — humans instinctively attribute a mind to coherent text.", "The paper's four warnings — environmental cost, unfathomable training data, research opportunity cost, and the illusion of meaning — read as a checklist of the controversies that followed. Few academic papers have aged so predictively.", "Its reception is itself a case study: Google demanded retraction, Gebru was pushed out, and the episode demonstrated the paper's own thesis about who controls the narrative of AI. We return to it in the ethics class."] },
        { h: "Synthetic text in society", ps: ["When plausible text becomes free, institutions calibrated to scarce text come under strain: education (essays), journalism (content farms), science (paper mills), politics (astroturfing). The sociological question is not 'is the model intelligent?' but 'what happens to trust, authorship and epistemic authority when anyone can generate anything?'", "Early evidence is in: content farms flooding the web, fabricated legal citations sanctioned in court, student essays outsourced at scale, and social platforms battling coordinated synthetic personas. Each institution is improvising its response.", "The economics are the key: when production cost falls to zero, filtering cost explodes. Institutions built to evaluate scarce text — peer review, editorial desks, admissions — face a denial-of-service attack from abundance itself."] },
        { h: "How an LLM is made", ps: ["Pretraining on web-scale text yields a raw predictor; fine-tuning and reinforcement learning from human feedback shape it into an assistant. The pipeline matters: each stage imports different values — the internet at large, then rater guidelines written by companies.", "Stage by stage: pretraining ingests the internet; supervised fine-tuning teaches the assistant format; RLHF tunes behaviour toward what raters prefer; system prompts and filters add final constraints. Each stage is a valve where values enter.", "The sociological insight is that alignment is layered labour: anonymous web authors, then contracted raters, then policy writers. Ask of any model behaviour — refusals, politeness, politics — at which layer it was installed, and by whom."] },
        { h: "Hallucination and truth", ps: ["LLMs optimise plausibility, not truth, so they confidently fabricate citations, dates and case law. Fluent error is more dangerous than obvious error — it exploits our habit of treating coherent language as evidence of a knowing mind.", "A New York lawyer submitted a brief citing six cases an LLM invented; courts have since sanctioned dozens more. The failures are not random noise — the model produces exactly what plausible legal text looks like, which is the problem.", "Fluency exploits a deep human heuristic: coherent language signals a competent mind. Sociolinguists call it the register of authority. Machines now produce that register on demand, decoupling the signal from the competence it once indicated."] },
        { h: "Prompting as literacy", ps: ["Getting good output has become a skill — framing, context, iteration. Like earlier literacies, it distributes unevenly and rewards those already educated, raising the question of who benefits most from supposedly democratising tools.", "Studies of workplace AI adoption find the same users extracting tenfold different value from identical tools: the difference is framing skill, domain knowledge to verify output, and confidence to iterate. The tool amplifies existing advantages.", "Bourdieu would call it cultural capital in new clothing. Educational responses are emerging — prompt curricula, AI literacy standards — but as with every literacy, early distribution follows class lines unless institutions deliberately intervene."] },
        { h: "The hidden workforce", ps: ["Behind every polished model stand data workers: raters ranking responses, annotators flagging toxic content — often traumatic work outsourced at low wages. The apparent autonomy of AI conceals a very human production line.", "Reporting from Nairobi, Manila and Caracas documents the rooms where RLHF happens: quotas, screen recording, nondisclosure agreements, and psychological toll from reviewing violent or sexual content — for wages a fraction of the model's hourly revenue.", "The pattern repeats industrial history: value produced at the periphery, captured at the core, with the labour rendered invisible by design. Labour sociology has the tools ready; the field simply moved into a browser tab."] },
        { h: "Authorship and property", ps: ["Trained on copyrighted books, articles and art, generative models triggered lawsuits from authors and news organisations worldwide. At stake is a classic sociological question in new dress: who owns culture when culture becomes training data.", "The suits stack up: novelists against model makers, news organisations negotiating licences, artists watermarking against scraping, programmers contesting code assistants trained on their repositories. Courts worldwide are drawing the lines case by case.", "Beneath the law sits a sociological question about creative labour: if style can be extracted and replayed, what remains property of the stylist? Copyright was built for copies; generative AI trades in patterns — a category the law never priced."] },
        { h: "Open, closed, concentrated", ps: ["A handful of firms control frontier models; open-weight alternatives diffuse capability but complicate control. The open-versus-closed debate is really a debate about concentration: what powers should any private actor hold over a general-purpose technology.", "Open-weight releases let researchers, startups and states run capable models locally — and let anyone strip the safety tuning. Closed APIs keep control — and concentrate it. Neither camp escapes the trade-off; they choose different risks.", "Sociologically, watch the interests behind the arguments: incumbents discover safety cases for closure, challengers discover freedom cases for openness. Positions track balance sheets remarkably well — which does not settle the question, but clarifies the debate."] },
        { h: "The chatbot as social actor", ps: ["People confide in, argue with and attach to conversational systems designed for engagement. Whatever the machinery underneath, chatbots function socially as actors — which is why their design choices are matters of public, not merely technical, concern.", "People say please to assistants, confide in companions at 3am, and rate advice from a bot as more empathetic than a doctor's in blind studies. Sociality does not require a mind on the other side — only a convincing performance of one.", "Goffman again: interaction runs on ritual, and machines can now perform the ritual. The design choices — persona, warmth, sycophancy — are therefore consequential social engineering, deserving the scrutiny we give to any actor addressing millions daily."] },
      ],
      concepts: ["large language model", "next-token prediction", "stochastic parrot", "documentation debt"],
      discuss: ["If an LLM produces a true statement without 'understanding' it, does the lack of understanding matter socially? When?", "Which institutions in your life assume that text is costly to produce? What happens to them now?"],
    },
    quiz: [
      { q: "The 'stochastic parrot' metaphor suggests LLMs…", o: ["Understand language like humans", "Stitch together plausible text from patterns without grounded meaning", "Are conscious", "Cannot produce fluent text"], a: 1 },
      { q: "Bender et al. warn that ever-larger training corpora tend to…", o: ["Eliminate all bias", "Overrepresent dominant, hegemonic viewpoints", "Shrink environmental costs", "Contain only verified facts"], a: 1 },
      { q: "One documented risk of fluent generative text is…", o: ["It is always labelled as synthetic", "People attribute intent and trust to machine output", "It cannot be published online", "It only exists in English"], a: 1 },
    ] },
  { id: "s1c5", sem: 1, num: 5, title: "Surveillance Capitalism", thumb: "👁️",
    tags: ["surveillance", "data extraction", "Zuboff"],
    desc: "Zuboff's 'Big Other': behavioural surplus, prediction products, and a new logic of accumulation built on watching us.",
    reading: { kind: "paper", ref: "Zuboff, S. (2015). 'Big Other: surveillance capitalism and the prospects of an information civilization', Journal of Information Technology, 30." },
    lec: {
      intro: "Shoshana Zuboff names our economic era: surveillance capitalism, a logic of accumulation in which human experience is claimed as free raw material for prediction and behavioural modification. This lecture reconstructs her argument and tests it against its critics.",
      sections: [
        { h: "Behavioural surplus", ps: ["Platforms collect far more data than needed to run their services — location traces, dwell time, typing rhythms. Zuboff calls this excess 'behavioural surplus'. Like the enclosure of common land, it is a dispossession: experience that belonged to no market is unilaterally claimed as a corporate asset, without meaningful consent.", "The founding discovery, in Zuboff's telling: Google noticed that search logs — kept initially as exhaust — predicted clicks on ads. The leftover became the asset; within years, collecting the leftover became the point.", "The enclosure analogy repays attention. Commons became property through fences and law; experience became data through terms of service and sensors. In both cases the dispossessed were told the change was natural, efficient and for their benefit."] },
        { h: "Prediction products and futures markets", ps: ["The surplus feeds machine learning that manufactures 'prediction products' — forecasts of what we will click, buy, and do — sold in 'behavioural futures markets' to advertisers and insurers. The user is neither the customer nor merely the product: we are the raw material. Revenue depends on prediction accuracy, which creates a structural incentive to know, and eventually to shape, behaviour.", "Real-time bidding makes it concrete: in the milliseconds a page loads, an auction sells the opportunity to influence you, priced by predictions about your behaviour. Hundreds of billions of such auctions run daily.", "Zuboff's sharpest claim follows: certainty is worth more than guessing, so the market pressure runs toward intervention — nudging behaviour to match the prediction. Pokémon Go herding players past paying businesses was, for her, the prototype."] },
        { h: "Big Other and instrumentarian power", ps: ["Zuboff distinguishes this from Orwell's Big Brother: 'Big Other' does not want your soul, only your predictability. Its power is 'instrumentarian' — nudging, herding, conditioning at scale. Critics (e.g. Morozov) reply that Zuboff indicts surveillance while sparing capitalism itself; others note state surveillance and worker surveillance predate Google. Hold both the thesis and its critique.", "The distinction matters: totalitarian power wanted belief and confession; instrumentarian power is indifferent to your soul. It wants your next click to be predictable — conditioning without conviction, herding without ideology.", "Critics push back hard. Morozov argues Zuboff romanticises pre-Google capitalism; labour historians note workers were always watched; others find her nudge-fears overstated. Hold the concept and the critique together — the exam rewards exactly that tension."] },
        { h: "From Ford to Google", ps: ["Zuboff situates surveillance capitalism historically: Fordism traded fair wages for mass consumption; the Google model discovered profit in prediction instead. Accumulation logics succeed each other — and each brings its own characteristic form of power.", "Ford paid five dollars a day so workers could buy the cars — accumulation aligned with mass prosperity. The surveillance model needs users, not customers: you are neither paid nor charged, merely harvested. The social contract shrank to a checkbox.", "Periodising matters for politics: managerial capitalism was tamed by unions and regulation crafted for factories. Surveillance capitalism awaits its equivalents — instruments crafted for data, attention and prediction. The GDPR and DSA are early drafts."] },
        { h: "The extraction imperative", ps: ["Prediction improves with more, and more varied, data — so surveillance capitalism expands relentlessly into voice, home, car, body and city. Network effects and economies of scale make this expansion self-reinforcing and hard for competitors or users to resist.", "Watch the expansion in your own home: the speaker that listens, the TV that reports viewing, the doorbell that films the street, the car that logs location. Each device has a data strategy, because prediction markets reward whoever knows more.", "Economies of scale in data create winner-take-most dynamics: better predictions attract more users, who generate more data, which improves predictions. Antitrust scholars now treat data advantage as the moat — the competition problem of our time."] },
        { h: "Consent theatre", ps: ["Terms of service and cookie banners perform consent without providing it: unread, unnegotiable, bundled. Sociologically they are legitimation rituals — converting structural asymmetry into the appearance of individual choice.", "The numbers are famous: reading every privacy policy you encounter would take weeks per year; comprehension studies show even lawyers misjudge what they permit. The system functions only because nobody reads — and it is designed for nobody to read.", "Legitimation theory explains the persistence: the ritual of clicking accept transfers responsibility to the clicker. Real reform proposals shift the default — data minimisation by law, purpose limitation, collective consent — because individual vigilance has demonstrably failed."] },
        { h: "The state joins in", ps: ["Snowden revealed intelligence agencies riding commercial data flows; police purchase location data that brokers sell. The neat separation of corporate and state surveillance dissolves into a single interlocking apparatus with two doors.", "Post-Snowden, the pattern kept repeating: police buying location data from brokers to skip warrants, immigration agencies purchasing utility records, agencies compelling platform disclosure. The market launders what law would forbid the state to collect directly.", "This nexus complicates simple remedies: constraining companies leaves state appetites intact, and constraining states leaves the commercial reservoir full. Effective privacy politics has to drain the reservoir itself — which is why data minimisation is the strategic demand."] },
        { h: "The privacy paradox, revisited", ps: ["People say they value privacy yet click accept — a paradox often blamed on laziness. Better explanations are structural: no real alternatives, opaque trade-offs, and services woven into work and social life that one cannot simply exit.", "Experiments confirm the structure: when private alternatives exist at equal convenience, people choose them; when privacy costs friction, defaults win. The paradox largely dissolves once choice architecture is taken seriously.", "The framing matters politically: paradox talk blames users and licenses inaction. Structural talk — no exit, no alternatives, engineered defaults — points at design and law. How a problem is named decides who owes the remedy."] },
        { h: "Zuboff and her critics", ps: ["Marxist readers argue the problem is capitalism, not its surveillance variant; historians note that credit bureaus and workplace monitoring long predate Google; others say users get real value back. Testing the thesis against its critics is the exam skill this course rewards.", "A fair reconstruction of the strongest critique: the harms Zuboff catalogues — manipulation, monopoly, exploitation — are capitalism's standard repertoire, so naming a new epoch may obscure old remedies like antitrust and labour power.", "Her defenders reply that scale changes kind: no previous firm watched two billion people in real time. Adjudicating this — continuity versus rupture — is a classic sociological exercise, and either position, argued with evidence, can earn full marks."] },
        { h: "Exits and alternatives", ps: ["Responses range from individual hygiene to structural redesign: privacy law with teeth, data trusts holding rights collectively, public digital infrastructure, interoperability forcing competition. Each remedy implies a different diagnosis of where the harm lies.", "Existing experiments deserve study: public broadcasting survived commercial capture; credit unions coexist with banks; Wikipedia runs on donations at planetary scale. Non-extractive information infrastructure is not utopian — it is underfunded.", "The design question for your generation: which digital functions are utilities deserving public or cooperative form, and which belong to markets? The answer will be decided politically — by people who understand the systems, which is the point of this course."] },
      ],
      concepts: ["behavioural surplus", "prediction products", "Big Other", "instrumentarian power"],
      discuss: ["Zuboff says we are the 'raw material', not the product. Does the distinction change anything politically?", "Is the problem surveillance, capitalism, or their combination? What would each diagnosis imply for reform?"],
    },
    quiz: [
      { q: "'Behavioural surplus' is…", o: ["Extra salary for tech workers", "Data exhaust beyond service needs, claimed as raw material for prediction", "Unused server capacity", "Excess screen time"], a: 1 },
      { q: "For Zuboff, the core product sold under surveillance capitalism is…", o: ["Hardware", "Predictions of future behaviour, sold in behavioural futures markets", "Subscriptions", "Open data"], a: 1 },
      { q: "'Big Other' names…", o: ["A TV show", "A ubiquitous digital apparatus that monitors and modifies behaviour", "A rival company to Google", "State-only surveillance"], a: 1 },
    ] },
  { id: "s1c6", sem: 1, num: 6, title: "The Attention Economy", thumb: "⏳",
    tags: ["attention", "design", "persuasion"],
    desc: "Attention as scarce resource: persuasive design, infinite scroll, and the ex-Silicon Valley insiders who fear what they built.",
    reading: { kind: "press", ref: "Lewis, P. (2017). \"'Our minds can be hijacked': the tech insiders who fear a smartphone dystopia\", The Guardian." },
    lec: {
      intro: "Herbert Simon saw it in 1971: a wealth of information creates a poverty of attention. This lecture analyses the industry built on capturing that scarce resource — and the defectors from Silicon Valley who describe, from the inside, how the capture works.",
      sections: [
        { h: "Attention as commodity", ps: ["Ad-funded platforms sell audiences to advertisers; attention is their inventory. The longer you stay and the more you engage, the more inventory exists and the richer the targeting data becomes. This economic base explains design decisions better than any story about user preferences: the product is optimised to be difficult to leave.", "Herbert Simon's 1971 formulation remains the cleanest: information consumes attention, so information wealth creates attention poverty. He wrote it before the feed existed; the feed is its industrial confirmation.", "The market did the rest: attention is measurable (time, clicks), targetable (profiles), and auctionable (ads) — the three properties a commodity needs. Once attention could be inventoried, an industry formed to expand the inventory."] },
        { h: "Persuasive design", ps: ["Lewis's Guardian piece assembles the insiders' toolbox: variable-ratio rewards borrowed from slot machines (pull to refresh), social reciprocity hooks (read receipts, streaks), bottomless feeds that remove stopping cues, and notifications engineered as interruptions. Designers trained in behavioural psychology — many via Stanford's Persuasive Technology Lab — knew precisely which levers they were pulling.", "The techniques have laboratory pedigrees: variable-ratio reinforcement is the slot-machine schedule from behavioural psychology; the pull-to-refresh gesture deliberately mimics the lever. Designers cited the literature in their own talks.", "The insiders quoted by Lewis matter evidentially: these are confessions from the control room, not speculation from outside. When the engineer of the like button limits his own children's use, the design intent is no longer deniable."] },
        { h: "Resistance and the limits of willpower", ps: ["Framing the problem as individual 'screen time' misdiagnoses a structural asymmetry: a thousand engineers optimising against one prefrontal cortex. Sociologically, responses divide into individual hygiene (digital detox), design ethics ('time well spent'), and regulation of dark patterns. Note who benefits when the solution is framed as personal discipline.", "The asymmetry in numbers: platform teams run thousands of A/B tests annually against user retention; the user brings a prefrontal cortex that evolution tuned for scarcity, not engineered abundance. Framing this as a fair fight is ideology.", "Public-health history offers the template: tobacco and gambling moved from personal-vice framing to regulated-industry framing once design intent was documented. Attention design is somewhere on that road — the documents already exist."] },
        { h: "The attention merchants, a history", ps: ["Tim Wu traces the trade in attention from the penny press through radio and television to the smartphone. Each medium refined the same bargain — free content for audience minutes — and each provoked a backlash when capture went too far.", "Wu's arc: the penny press sold readers to advertisers in 1833; radio brought the jingle into the kitchen; television concentrated national attention into prime time; the smartphone dissolved prime time into every waking moment.", "Each era ended in revolt — ad-free subscriptions, public broadcasting, remote controls, ad blockers. The cycle of capture and backlash suggests the current regime is not final; it also suggests capture returns in new clothes."] },
        { h: "The interruption regime", ps: ["Notifications convert other people's priorities into your impulses. Studies of task switching show each interruption carries a recovery cost measured in minutes — an invisible tax the interruption economy levies on work, study and rest.", "Laboratory studies put resumption cost after an interruption at up to twenty minutes for complex tasks; office workers check email dozens of times daily; students switch screens every few minutes while studying. The regime has a measurable price.", "Institutions are responding: schools sequester phones, companies declare meeting-free days, France legislated a right to disconnect. Each is an attempt to rebuild, collectively, the stopping cues that design removed individually."] },
        { h: "Metrics all the way down", ps: ["Inside platforms, attention is managed through dashboards: daily active users, session length, retention curves. Teams are bonused on these numbers, which is how the abstract attention economy becomes a very concrete set of design decisions.", "Internal leaks repeatedly show the dashboard's sovereignty: features that reduced session time were rolled back, warnings from research teams lost to growth targets. The metric is the constitution of the product organisation.", "This is Weberian rationalisation in miniature: once a value is quantified, the quantity outcompetes the value. Time well spent lost to time spent because only one of them had a graph."] },
        { h: "Designing for children", ps: ["Autoplay, streaks and loot-box mechanics reach users whose self-regulation is still developing. Regulators have begun responding with age-appropriate design codes — a live test of whether persuasive design can be governed at all.", "The UK Age-Appropriate Design Code forced global changes — autoplay off for minors, high-privacy defaults — demonstrating that regulation of design, not just content, is feasible. Several jurisdictions are copying it.", "The child case also softens the paternalism objection: nobody argues minors consented to variable-ratio scheduling. Once conceded for children, the question becomes uncomfortable — what exactly makes the same mechanics legitimate for adults?"] },
        { h: "The inequality of attention", ps: ["Deep focus is becoming a class privilege: the wealthy buy schools, workplaces and apps that protect concentration, while attention-extracting defaults concentrate on everyone else. Attention, like income, has a distribution.", "Observable proxies: private schools banning devices while underfunded ones teach on them; executives paying for retreats and assistants that guard focus; premium ad-free tiers pricing out distraction for those who can pay.", "The stratification insight: when a resource becomes scarce, its distribution becomes a class matter. Deep attention — the precondition of learning and skilled work — is quietly joining housing and health among the unequally distributed goods."] },
        { h: "The design ethics movement", ps: ["Insiders founded movements — Time Well Spent, humane technology — pressuring firms to ship screen-time tools and calmer defaults. Sociologically, note both the achievement and the limit: engagement remains the business model beneath the wellness features.", "Outcomes so far: screen-time dashboards on every major OS, grayscale modes, nudges to take breaks — genuine changes, shipped under pressure from defector-founded organisations and looming regulation.", "The structural critique stands: features that reduce engagement marginally coexist with business models that require it absolutely. Sociology of reform movements predicts this shape — concessions at the interface, continuity at the balance sheet — and the prediction has held."] },
        { h: "Regulating dark patterns", ps: ["The EU now bans manipulative interface design in several instruments, and consumer agencies elsewhere follow. The regulatory question is precise: where does persuasion end and manipulation begin — and who bears the burden of proving the difference.", "The DSA bans interfaces that deceive or manipulate; the EU Data Act and consumer directives add teeth; US FTC actions have fined subscription traps. A legal vocabulary — dark patterns — now names what design critics long described.", "Enforcement is the frontier: manipulation must be proven pattern by pattern, and design mutates faster than dockets. Watch this space with the pacing problem from the regulation class in mind — the same race, run at the interface."] },
      ],
      concepts: ["attention economy", "variable rewards", "dark patterns", "stopping cues"],
      discuss: ["Audit one app on your phone: identify three specific design features engineered to extend your session.", "Should persuasive design be regulated like other public-health risks, or is that paternalism?"],
    },
    quiz: [
      { q: "In the attention economy, the scarce resource being competed for is…", o: ["Bandwidth", "Human attention", "Electricity", "Storage space"], a: 1 },
      { q: "'Persuasive design' techniques include…", o: ["Longer terms of service", "Variable rewards, infinite scroll and notification triggers", "Slower loading screens", "Mandatory log-offs"], a: 1 },
      { q: "The business rationale behind maximising 'time on site' is…", o: ["User wellbeing", "More attention means more advertising inventory and data", "Legal compliance", "Reducing server costs"], a: 1 },
    ] },
  { id: "s1c7", sem: 1, num: 7, title: "Social Media and Society", thumb: "💬",
    tags: ["social media", "youth", "publics"],
    desc: "Networked publics, context collapse, and teenage social life online — beyond moral panic.",
    reading: { kind: "paper", ref: "boyd, d. (2014). It's Complicated: The Social Lives of Networked Teens, ch. 1. Yale University Press." },
    lec: {
      intro: "Every generation panics about its youth and their media. danah boyd's decade of ethnographic fieldwork with American teenagers offers an antidote: careful attention to what young people actually do online, and to the architectural features that make digital sociality genuinely different.",
      sections: [
        { h: "Networked publics", ps: ["boyd analyses social media as 'networked publics' — spaces constructed by technology with four distinctive affordances: persistence (content endures), visibility (audiences scale), spreadability (sharing is frictionless) and searchability (the past is retrievable). Teenage hangouts once evaporated at curfew; now they are archived, searchable and screenshot-able.", "boyd's four affordances repay memorisation because they explain so much downstream: persistence explains why teenage mistakes follow adults; searchability explains employer screening; spreadability explains virality; visibility explains the performing self.", "The architectural point generalises: publics have always been shaped by their infrastructure — the agora, the coffeehouse, the printing press. Software is simply the newest architecture of assembly, and its walls are decided in product meetings."] },
        { h: "Context collapse and identity work", ps: ["Offline, we perform different selves for different audiences — Goffman's dramaturgy. Online, those audiences collapse into one: parents, friends, teachers and future employers read the same profile. Teens respond with 'social steganography' — encoding messages legible only to peers — and platform migration. Identity work continues; the stage has changed.", "Her fieldwork example endures: a teenager writes a joke legible as irony to friends and as alarm to grandparents — same post, two audiences, one collapsed context. The dramaturgical stage lost its backstage.", "Platforms later productised the insight: finstas, close-friends lists, disappearing stories are all context-restoration features. Users demanded back the segmented audiences that the real-name, single-profile architecture had abolished."] },
        { h: "Beyond moral panic", ps: ["boyd shows that most teen online behaviour extends familiar sociality: hanging out, flirting, status negotiation — displaced online partly because adult society fenced off physical space (curfews, scheduled childhoods, stranger-danger). Panics about addiction and predators misread continuity as catastrophe, and often justify surveillance that harms the vulnerable teens it claims to protect.", "boyd's structural observation: adult society scheduled childhood, fenced public space and priced hanging out — then panicked when sociality moved to the only unsupervised space left. The phone did not steal the mall; policy closed it.", "Method is the antidote to panic: she spent years talking with teenagers before generalising. Compare the headlines of any decade — comics, rock, video games — and the pattern instructs: panic first, evidence later, apology never."] },
        { h: "Platform vernaculars", ps: ["Each platform breeds its own language — memes, duets, ratioing, alt accounts. These vernaculars are genuine cultures: learned, policed by peers, and legible only to insiders, which is precisely how youth cultures have always worked.", "Examples age fast — which is itself the finding: vernaculars turn over quickly precisely because legibility to outsiders (parents, brands, moderators) destroys their function. Obsolescence is a feature of youth culture, not a bug.", "For researchers, vernacular fluency is access: boyd could read social steganography because she learned the codes. The methodological maxim — learn the language before judging the speech — is simply ethnography's oldest rule, applied to feeds."] },
        { h: "Weak ties and social capital", ps: ["Networks of acquaintances — weak ties — carry job leads and novel information, and platforms multiply them cheaply. The sociological question is what happens to strong ties, and whether maintained visibility substitutes for maintained intimacy.", "Granovetter's classic finding — jobs arrive through acquaintances, not close friends — predated the internet by decades. Platforms industrialised weak-tie maintenance: hundreds of dormant connections kept warm by birthday reminders and passive visibility.", "The open question is conversion: does a follower equal an acquaintance when you need a favour, a reference, a couch? Studies suggest online weak ties convert unevenly — better for information, worse for support — which nuances the social-capital optimism."] },
        { h: "Communities and subcultures", ps: ["From fandoms to support groups to extremist forums, online communities supply belonging that offline institutions increasingly do not. The same affordances that comfort the isolated teenager also organise the radicalised one — structure, not content, is the constant.", "The same structure serves opposite contents: a rare-disease forum where patients out-research their doctors, and an extremist board where grievance finds grammar. Affordances — anonymity, persistence, findability — power both.", "Sociology resists judging the form: community is neither good nor bad, it is strong or weak. The policy question is content-specific and hard: how to preserve the lifeline forums while starving the radicalising ones, when both run on identical rails."] },
        { h: "Harassment and moderation", ps: ["Networked publics distribute voice and abuse together; harassment falls heaviest on women and minorities. Moderation — human and algorithmic — becomes the invisible government of speech, making platform policy a de facto constitutional question.", "The research is consistent: women journalists, minority public figures and LGBTQ teens face disproportionate abuse; many respond by self-censoring or leaving — a silencing effect that never appears in engagement metrics.", "Moderation is therefore a distribution of voice: every rule about harassment decides who can afford to speak publicly. Constitutional lawyers argue about state censorship; sociologists note that platform policy governs more daily speech than any state."] },
        { h: "The influencer economy", ps: ["Visibility became a career: creators monetise authenticity itself, managed by metrics and brand deals. boyd's identity work turns professional — the self as small enterprise, with the burnout statistics to match.", "The numbers professionalised: agencies, rate cards, engagement audits, contracts specifying posts per month. Behind the authentic morning routine stands a production schedule — emotional labour with a content calendar.", "Burnout studies of creators read like Hochschild's flight attendants: the self as product exhausts. The aspiration is also stratified — the visible winners recruit millions of hopefuls into an economy whose median income is near zero."] },
        { h: "Beyond the Western platform", ps: ["Most of the world's users live outside Silicon Valley's imagination: WhatsApp organises commerce and rumour in Brazil and India; super-apps bundle whole lives in China. Generalising from American teens is a sampling error sociology must avoid.", "Concrete contrasts: WeChat bundles payment, government services and messaging into one super-app; WhatsApp is infrastructure for commerce and politics across Africa, India and Brazil; content moderation in dozens of languages barely exists.", "The theoretical stake: concepts minted on American platforms — context collapse, networked publics — travel imperfectly. Digital sociology is now correcting a sampling bias in its own foundations, much as anthropology once did."] },
        { h: "Researching youth online, ethically", ps: ["Studying minors on platforms raises hard questions: public posts are not informed consent, and anonymisation fails against search. boyd's fieldwork models the standard — long-term presence, consent, and returning findings to the studied community.", "The dilemmas are concrete: a public post by a fourteen-year-old is legally visible and ethically ambiguous; quoting it verbatim makes them searchable; paraphrase distorts. Research ethics boards are still catching up to these textures.", "boyd's standard — consent, presence, reciprocity — costs time, which is why shortcuts tempt. The course position: the more powerless the studied group, the higher the ethical bar. Teenagers online are studied constantly and consulted never; sociology should differ."] },
      ],
      concepts: ["networked publics", "affordances", "context collapse", "social steganography"],
      discuss: ["How do you manage context collapse in your own profiles? What strategies do you share with boyd's teens?", "Which current panic about young people and technology might future sociologists judge as overblown — and which as justified?"],
    },
    quiz: [
      { q: "boyd's 'networked publics' are shaped by affordances such as…", o: ["Ephemerality and locality", "Persistence, visibility, spreadability and searchability", "Anonymity only", "Paper records"], a: 1 },
      { q: "'Context collapse' happens when…", o: ["Servers crash", "Distinct audiences (family, friends, employers) merge into one online", "Users delete accounts", "Apps are redesigned"], a: 1 },
      { q: "boyd argues moral panics about teens online often…", o: ["Are always accurate", "Misread continuity in teen sociality as radical novelty", "Come from teens themselves", "Focus on infrastructure"], a: 1 },
    ] },
  { id: "s1c8", sem: 1, num: 8, title: "The Giants and Engagement", thumb: "🏢",
    tags: ["platforms", "engagement", "whistleblowing"],
    desc: "Inside the platform giants: what the Facebook Files revealed about engagement metrics, internal research and public harm.",
    reading: { kind: "press", ref: "Wall Street Journal (2021). 'The Facebook Files' investigative series." },
    lec: {
      intro: "In 2021, thousands of leaked internal documents let researchers see what a platform giant knew about itself. This lecture uses the Facebook Files as a case study in organisational sociology: how metrics become goals, how internal knowledge is managed, and what whistleblowing reveals about corporate governance.",
      sections: [
        { h: "The engagement machine", ps: ["In 2018 Facebook reweighted its News Feed around 'meaningful social interactions' — reactions, comments, reshares. Internal researchers documented the consequence: content optimised for the metric skewed toward outrage and sensationalism, and European political parties told the company they had shifted to more negative messaging because positive posts no longer travelled. The metric was not measuring the social world; it was remaking it.", "The internal memos are unusually candid: researchers wrote that misinformation and outrage content was among the most reshared, and that the ranking change had made the platform angrier — while executives publicly celebrated meaningful interactions.", "The European parties episode deserves its fame: political actors explicitly told the company its algorithm punished positive policy content, so they had gone negative. A private firm's metric had become an unelected editor of democratic tone."] },
        { h: "Internal knowledge vs public accountability", ps: ["The Files showed rigorous internal research — on Instagram and teen body image, on under-resourced moderation in the Global South, on the 'XCheck' programme exempting elites from rules — coexisting with public denials. Sociologically this is Merton's organised scepticism inverted: knowledge produced, then contained, because acting on it threatened growth. The gap between what an organisation knows and what it admits is itself a power structure.", "The Instagram research is the sharpest case: internal slides acknowledged harm to a subset of teenage girls on body image while public statements minimised it. Whatever the effect sizes, the gap between the two registers was the scandal.", "Organisational sociology names the mechanism: information that threatens core revenue is produced, contained and strategically forgotten. Regulators drew the lesson — the DSA now compels risk research disclosure precisely because voluntary candour failed."] },
        { h: "Whistleblowing and platform governance", ps: ["Frances Haugen's disclosures triggered hearings, lawsuits and regulation (feeding the EU's DSA). The episode raises durable questions: can self-regulation work when engagement pays the bills? Should platform research be subject to external audit like pharmaceutical trials? And what protections do tech whistleblowers — often the only window into these systems — deserve?", "Haugen's method mattered: she copied systematically, briefed regulators on three continents, and framed disclosures around governance rather than gossip. The playbook has since been studied by would-be whistleblowers across the industry.", "The structural problem she exposed persists: platforms are among the only industries whose internal safety research is invisible until leaked. Aviation, pharma and finance all crossed this bridge before — mandatory reporting followed each of their scandals."] },
        { h: "The political economy of platforms", ps: ["Advertising funds the giants, and moats — network effects, data advantages, default deals, acquisitions — protect them. Understanding the balance sheet explains conduct better than any theory of corporate ethics.", "Advertising still supplies the overwhelming majority of revenue for the major social platforms, which means the customer is the advertiser and the product is predicted attention. Every design controversy makes sense from this single fact.", "The moats are documented in antitrust filings: default-search payments worth tens of billions, acquisitions of nascent rivals, data advantages no entrant can replicate. Market structure, not managerial virtue, sets the limits of reform."] },
        { h: "Moderation at scale", ps: ["Tens of thousands of outsourced moderators absorb the feed's worst content for modest pay and lasting trauma, while automated filters catch volume but miss context. Every feed you scroll is cleaned by this hidden, global assembly line.", "Investigations from Manila to Nairobi describe quotas of hundreds of items per shift, seconds per decision, and PTSD rates that led to settlements with moderators. The industry outsources the trauma along with the labour.", "Automation catches the obvious and misses the contextual — satire, dialect, local politics. The result is a two-tier system: fast statistical cleaning everywhere, careful human judgment only where lawsuits or headlines threaten."] },
        { h: "The amplification debate", ps: ["Does engagement ranking radicalise, or merely reflect demand? Studies conflict, partly because platforms control the data needed to answer. The Files showed internal researchers worrying precisely about amplification — evidence the question is real, not moral panic.", "Landmark collaborations gave outside researchers rare data access and found smaller feed effects on attitudes than critics expected — over short windows, on consenting users, during elections. Critics reply the design could not capture cumulative, ecosystem-level change.", "The methodological standoff is the lesson: causal claims about platforms require data platforms control. This is why researcher data access became a legal demand — you cannot referee a game whose tapes the players keep."] },
        { h: "The Global South asymmetry", ps: ["Internal documents showed moderation budgets concentrated on English-speaking markets while risks concentrated elsewhere — most infamously in Myanmar. Platform power is global; platform accountability remains stubbornly local.", "The Myanmar case is the darkest: UN investigators found the platform had played a determining role in spreading hatred before the Rohingya atrocities, while the company employed a handful of Burmese speakers for millions of users.", "The asymmetry is economic: markets with low ad revenue receive residual safety investment while contributing full engagement. Risk is exported to where accountability is weakest — a pattern environmental sociology documented for toxic industries long ago."] },
        { h: "From Files to law", ps: ["Haugen's disclosures fed directly into the EU's Digital Services Act: risk assessments, researcher data access, independent audits. One leak reshaped the regulatory environment — a case study in how whistleblowing converts hidden knowledge into public rules.", "Specific DSA provisions trace to the Files: mandatory systemic-risk assessments, independent audits, researcher access to platform data, and transparency for recommender systems — each answers a revealed gap.", "The case shows civil society's leverage point: legislation was drafting while the leaks landed, and the evidence hardened wavering articles. Timing, not just truth, decides which revelations become rules."] },
        { h: "Comparing whistleblowers", ps: ["Set Haugen beside Cambridge Analytica's Wylie and the NSA's Snowden: different institutions, same structure — insiders converting privileged access into public knowledge at personal cost. Whistleblowing has become a core accountability mechanism of the information age.", "The comparison teaches variation: Snowden fled to exile, Wylie became a media figure, Haugen testified in suits and kept counsel close. Legal design — what protections existed — explains much of the difference in their fates.", "Sociologically, whistleblowing is a structural role, not a personality: closed systems with public consequences generate insiders whose knowledge outgrows their loyalty. Expect more of them wherever internal research meets external harm — AI labs included."] },
        { h: "Can giants be governed?", ps: ["Options on the table: structural break-ups, interoperability mandates, fiduciary duties, public-utility treatment, or the EU's risk-regulation model. Each assumes a different theory of the harm — market power, design incentives, or scale itself.", "Each instrument has a live experiment: the EU runs risk regulation, US courts run antitrust, some jurisdictions mandate interoperability for messaging. The next decade is a natural comparison of governance theories.", "Your analytical task is matching remedy to diagnosis: if the harm is scale, break-ups follow; if incentives, redesign the business model; if opacity, force transparency. Essays that align diagnosis and remedy coherently outscore those that list solutions."] },
      ],
      concepts: ["engagement-based ranking", "meaningful social interactions", "XCheck", "whistleblowing"],
      discuss: ["Goodhart's law says a measure that becomes a target ceases to be a good measure. Apply it to engagement ranking.", "Design one external-audit mechanism for platform research. Who audits, with what access, answerable to whom?"],
    },
    quiz: [
      { q: "The Facebook Files were based primarily on…", o: ["Academic surveys", "Leaked internal company research and documents", "Government audits", "User polls"], a: 1 },
      { q: "'Engagement-based ranking' prioritises content that…", o: ["Is fact-checked", "Generates reactions, comments and shares — including outrage", "Is chronological", "Comes from institutions"], a: 1 },
      { q: "Sociologically, the episode illustrates…", o: ["Platforms always self-correct", "Tensions between commercial metrics and public knowledge of harms", "Regulation is impossible", "Users do not care"], a: 1 },
    ] },
  { id: "s1c9", sem: 1, num: 9, title: "The Gig Economy", thumb: "🛵",
    tags: ["gig economy", "labour", "platform work"],
    desc: "Algorithmic management at Uber: information asymmetries, soft control, and what 'being your own boss' really means.",
    reading: { kind: "paper", ref: "Rosenblat, A. & Stark, L. (2016). 'Algorithmic Labor and Information Asymmetries: A Case Study of Uber's Drivers', IJoC, 10." },
    lec: {
      intro: "Platform work promises freedom: no boss, no schedule, be your own entrepreneur. Rosenblat and Stark's study of Uber drivers dismantles the promise, showing how management has not disappeared but migrated into the app — opaque, automated and harder to argue with.",
      sections: [
        { h: "Platform work and the employment question", ps: ["Gig platforms classify workers as independent contractors, shedding minimum wage, insurance and collective bargaining obligations. Yet the platform sets prices, allocates work, monitors performance and can 'deactivate' (fire) workers. The legal fiction of independence, contested in courts worldwide — including France's Cour de cassation — is the industry's foundational sociological fact.", "The French courts led early: the Cour de cassation reclassified an Uber driver as an employee in 2020, citing the impossibility of building a clientele and the control exercised through the app. Spain then legislated riders into employment outright.", "Misclassification is best read as regulatory arbitrage: the platform enjoys the control of an employer at the cost profile of a marketplace. The EU directive's presumption of employment tries to reprice exactly that arbitrage."] },
        { h: "Algorithmic management in practice", ps: ["Rosenblat and Stark document the machinery: blind ride acceptance (destination hidden until pickup), acceptance-rate thresholds enforced by threat of deactivation, surge-pricing heatmaps that promise earnings which often evaporate on arrival, and nudges ('You're almost there!') that borrow game design to extend shifts. Each mechanism relies on the platform knowing more than the worker — information asymmetry as a management technique.", "Each mechanism is a small masterpiece of asymmetry: blind acceptance transfers route risk to the driver; surge maps promise without contracting; acceptance thresholds discipline without a supervisor ever appearing.", "Rosenblat and Stark's larger point: the app is not a neutral matchmaker but a management interface designed to maximise fleet availability at minimum guaranteed cost. Reading interfaces as management is a transferable analytic skill."] },
        { h: "Ratings, autonomy and resistance", ps: ["The five-star rating outsources supervision to customers: drivers perform emotional labour (Hochschild) — water bottles, curated small talk — for an unaccountable, biased evaluator whose scores can end their livelihood. Yet workers respond: WhatsApp groups decode the algorithm, forums share surge strategies, and couriers from Paris to Jakarta have organised strikes. Control invites counter-conduct.", "Hochschild's emotional labour translates directly: drivers report performing cheerfulness through fatigue, absorbing abuse silently, offering amenities from their own pockets — all priced into a five-star average that a bad week can crater.", "Ratings also import customer bias: audit studies find identical service scored differently by passenger demographics. A discriminatory input becomes a neutral-looking number with firing power — laundering, again, as a management technique."] },
        { h: "Piecework, an old story", ps: ["Payment by task predates the factory: the putting-out system, dockside shape-ups, piece-rate sewing. Platforms revive piecework with GPS and ratings — which is why labour historians felt recognition long before sociologists coined new terms.", "The putting-out system paid weavers per piece, shifted equipment costs onto cottages, and used merchants' information advantage over dispersed workers — a structural twin of the delivery app, minus the GPS.", "Marx analysed piece wages as the form of wage most favourable to capital: it individualises effort, obscures the wage relation and makes workers drive themselves. The gig app is piecework perfected by telemetry."] },
        { h: "Varieties of gig work", ps: ["The gig economy is plural: ride-hailing in Paris, delivery in Jakarta, care platforms, freelance marketplaces. Regulation, union strength and labour markets differ, so the same app produces different working lives in different countries.", "Comparative studies show institutional gravity: the same platform pays social contributions in Geneva, fights reclassification in California, and operates informally in Lagos. The algorithm is global; the working life it produces is national.", "This is the classic varieties-of-capitalism insight applied downward: labour law, union density and welfare states refract identical technology into different class experiences. Any essay generalising about the gig economy should specify where."] },
        { h: "The invisible gig", ps: ["Behind the visible courier stands the invisible microworker: labelling images, moderating content, transcribing audio for cents per task on global platforms. This ghost work trains the very AI said to make work disappear.", "Platforms for microtasks coordinate millions of workers who label images, transcribe receipts and moderate content in queues priced per task — the piece rates often falling below local minimum wages once search time counts.", "Ghost work inverts the automation story: AI does not eliminate labour, it disassembles jobs into tasks and scatters them across time zones. What disappears is not work but the employer — and with it, every protection addressed to employers."] },
        { h: "Risk shifted downward", ps: ["Platforms shed the costs employment once carried — sick pay, accidents, equipment, slow hours. Risk does not vanish; it relocates onto individual workers and, through them, onto families and public health systems.", "The pandemic made the shift visible: couriers were declared essential and insured as independent; sick pay arrived, where it arrived, as charity or PR. Risk had been contractually pre-positioned on the workforce years earlier.", "Beck's risk society thesis gains a labour chapter: modernity's institutions once pooled risk (insurance, employment); platformisation unpools it, returning workers to individualised exposure their grandparents' unions had collectivised."] },
        { h: "The legal battlefield", ps: ["Courts in France, the UK and Spain have reclassified drivers and riders; the EU platform-work directive presumes employment under algorithmic control. Law is where the gig economy's central fiction — independence — is being contested clause by clause.", "Keep the map current: UK courts granted worker status with minimum wage and holidays; Spain legislated; France oscillates; the EU directive sets a rebuttable presumption of employment under algorithmic direction. Appeals continue everywhere.", "The doctrinal battle is about control: courts increasingly read algorithmic direction — pricing, dispatch, discipline — as the modern form of subordination. Once code counts as command, the contractor fiction collapses; that recognition is spreading."] },
        { h: "Collective action 2.0", ps: ["Couriers coordinate strikes through the same phones that dispatch them; forums reverse-engineer pay algorithms; new unions blend app-savvy with old organising. Where the boss is an algorithm, resistance becomes partly a data practice.", "Documented repertoires: mass simultaneous log-offs to trigger surge pricing, WhatsApp networks sharing deactivation defences, data requests under GDPR used to expose pay algorithms, and app-based unions winning bargaining rights.", "The theoretical novelty: workers organise through the same infrastructure that manages them, and information about the algorithm becomes a collective resource. Labour history rhymes — the tools change, the counter-organisation follows."] },
        { h: "The gigification of everything", ps: ["Beyond the apps, gig logics spread inward: zero-hour contracts, internal talent marketplaces, metric-managed professionals. The gig economy may matter less as a sector than as a template for how algorithmic management enters ordinary employment.", "Watch the diffusion: hospital shifts auctioned through apps, warehouse rates set by telemetry, professionals ranked by dashboard metrics, internal gig marketplaces inside multinationals. The employment contract persists while its content is algorithmically hollowed.", "The analytic upshot: study algorithmic management as a technology of control that travels across legal forms. The gig economy was its laboratory; standard employment is its market."] },
      ],
      concepts: ["algorithmic management", "information asymmetry", "misclassification", "emotional labour"],
      discuss: ["Is the Uber driver more or less free than the Fordist factory worker? Specify the dimensions of freedom you're using.", "Customer ratings discriminate. Should platforms be liable for biased ratings the way employers are for biased managers?"],
    },
    quiz: [
      { q: "'Algorithmic management' refers to…", o: ["Managers learning to code", "Directing and evaluating workers through automated systems (dispatch, ratings, nudges)", "Union-run scheduling", "Paper timesheets"], a: 1 },
      { q: "Rosenblat & Stark show Uber's information asymmetries include…", o: ["Drivers seeing all rider data", "Drivers accepting rides without knowing the destination or fare", "Full wage transparency", "Public algorithms"], a: 1 },
      { q: "Customer ratings function sociologically as…", o: ["Harmless feedback", "Outsourced, unaccountable performance management", "Legal contracts", "A form of tipping"], a: 1 },
    ] },
  { id: "s1c10", sem: 1, num: 10, title: "Robotics and Automation", thumb: "🦾",
    tags: ["robotics", "automation", "work"],
    desc: "From factory arms to warehouse fleets: automation anxiety in historical perspective, and who actually bears the risk.",
    reading: { kind: "press", ref: "The Economist (2016). 'Automation and anxiety: Will smarter machines cause mass unemployment?'" },
    lec: {
      intro: "From the Luddites to the warehouse robot, machines have always triggered anxiety about work. This lecture places today's robotics in that long history, distinguishes displacement from disappearance, and looks closely at what automation does to the jobs that remain.",
      sections: [
        { h: "Automation waves in historical perspective", ps: ["The Economist's survey rehearses the pattern: mechanised looms, tractors and ATMs each destroyed specific jobs while total employment eventually grew, as productivity gains created demand elsewhere. But 'eventually' hides generations of dislocated workers and hollowed regions — the aggregate optimism of economists is cold comfort at the biographical scale where sociology works.", "The numbers behind the reassurance: agriculture fell from half of employment to a few percent across a century, absorbed by manufacturing and services nobody had imagined. Aggregate adjustment worked — across generations, with immense localised pain.", "The Economist's own caveat deserves emphasis: past adjustment ran through education expansions and new sectors. Whether the same escalator exists now — when the new sector automates too — is precisely what the optimists assume and cannot prove."] },
        { h: "Tasks, not occupations", ps: ["Modern analysis decomposes jobs into tasks: machines take over routine, codifiable tasks (assembly, data entry) while complementing non-routine ones (judgment, care, persuasion). The result is polarisation — growth at the high-skill top and the low-paid, hard-to-automate bottom (cleaning, care work), with erosion in the routine middle. Automation reshapes the class structure before it changes the unemployment rate.", "The ATM parable: cash machines cut teller costs per branch, banks opened more branches, teller numbers rose for decades while the job shifted toward sales and service. Task substitution plus demand effects beat naive replacement arithmetic.", "Polarisation has distributional teeth: the eroding middle — clerical, routine manufacturing — was the historic ladder into stability for workers without degrees. Automation debates are class debates because the tasks at risk are classed."] },
        { h: "Bodies, pace and the warehouse", ps: ["Where robots and humans work together, the machine often sets the tempo. In fulfilment centres, pickers guided by handheld scanners and surrounded by robotic shelves face algorithmically monitored 'rates', with injury statistics to match. The sociological question shifts from 'will robots take the jobs?' to 'what do robot-paced jobs do to human bodies, autonomy and dignity?'", "Injury data tell the story: investigative reporting and regulator findings have repeatedly shown serious-injury rates in robotised fulfilment centres exceeding industry averages, with rate-tracking algorithms named as the driver.", "Marx's real subsumption is the concept ready-made: machinery does not just assist labour, it dictates its rhythm. The scanner that counts seconds between picks is the assembly line's descendant — attached now to the worker's hand."] },
        { h: "What robots still cannot do", ps: ["Moravec's paradox endures: chess is easy, folding laundry is hard. Perception, dexterity and unstructured environments resist automation, which is why warehouses redesign the environment around the robot rather than the robot around the world.", "Moravec's explanation was evolutionary: perception and manipulation ride on millions of years of optimisation; chess is a recent veneer. Hence robots that best grandmasters and fumble door handles.", "Deployment follows the paradox: automation succeeds where the world can be standardised — pallets, containers, highways at cruise — and stalls where it cannot: homes, hospitals, sidewalks. Predicting automation means auditing the standardisability of settings."] },
        { h: "Automating care", ps: ["Robots now comfort dementia patients and monitor the elderly, with Japan the leading laboratory. Care shows automation's limit case: the tasks are physical, but the work is relational — what exactly is delivered when the carer cannot care?", "Japan's experiments — the PARO seal for dementia wards, lifting exoskeletons, monitoring sensors — respond to demographic arithmetic: too few working-age carers for the ageing population. Necessity, not enthusiasm, drives adoption.", "The conceptual puzzle stands: care is recognition, and a device cannot recognise. Yet field studies show patients comforted and carers relieved of back-breaking tasks. Perhaps the question is not robot versus human but which tasks within care are relational at all."] },
        { h: "Cobots and hybrid teams", ps: ["The dominant factory pattern is collaboration, not replacement: humans handle exceptions, robots handle repetition. The sociological action is in the interface — who adapts to whom, and whose pace becomes the team's pace.", "Factory case studies find the pattern: robots take the welds and lifts, humans keep exceptions, quality and changeovers — and the metrics measuring humans tighten, because the robot's uptime becomes the benchmark.", "Interface sociology asks the power question: when the line pauses, who diagnoses whom? Skilled hybrid work exists where workers can interrogate the machine; degraded hybrid work exists where the machine interrogates the worker."] },
        { h: "The politics of robot design", ps: ["Assistants get female voices; security robots get bulk and baritone. Design choices encode social scripts about gender, service and authority — robots are cultural artefacts before they are mechanical ones.", "The evidence is systematic: voice assistants defaulted to deferential female personas until criticism forced options; service robots are styled cute to disarm; security robots are styled imposing to deter. Design is rhetoric in plastic.", "These choices script human expectations — who serves, who guards, what deference sounds like — and rehearse them millions of times daily. Cultural sociology treats artefacts as texts; robots are unusually explicit ones."] },
        { h: "Automation's geography", ps: ["Robot-dense regions are specific places — motor valleys, logistics corridors — so automation shocks arrive as regional crises, not national averages. The politics of automation is therefore also the politics of left-behind places.", "The maps overlap ominously: regions dense in routine manufacturing correlate with political volatility across Western democracies; the automation shock and the populist surge share a postcode.", "Regional sociology adds the mechanism: when the plant sheds shifts, the shock propagates through suppliers, shops, schools and marriages. Aggregate statistics recover; places sometimes do not. Policy that ignores geography treats a wound with an average."] },
        { h: "Hype as a management tool", ps: ["Announcing automation disciplines labour whether or not the robots work: the credible threat lowers wage demands. Studying automation discourse — who proclaims inevitability, to whom, with what timing — is studying power.", "Historical rhyme: nineteenth-century employers paraded machines before wage negotiations; today, executives announce AI-driven restructuring to markets that reward headcount cuts. The announcement moves the share price whether or not the system ships.", "Discourse analysis therefore belongs in the automation toolkit: track who declares inevitability, in which venue, before which negotiation. The performative economy of AI claims is measurable — and often does more work than the AI."] },
        { h: "Policy responses", ps: ["Proposals range from robot taxes and retraining accounts to sectoral bargaining over deployment and slower, negotiated adoption. Comparative evidence suggests institutions, not robot counts, decide whether automation produces shared gains or concentrated pain.", "The comparative evidence in one line: countries with strong retraining systems and sectoral bargaining (Denmark, Sweden) show high automation adoption with low worker anxiety; flexible-fire economies show the reverse. Institutions metabolise the same technology differently.", "The robot-tax debate crystallises the choices: tax the machine and slow adoption, or tax its owners' gains and fund transitions. Both are answers to the same question — who owns the productivity dividend — which no algorithm will decide."] },
      ],
      concepts: ["task-based analysis", "job polarisation", "machine pacing", "Luddism (revisited)"],
      discuss: ["The Luddites are remembered as anti-technology. Historians say they opposed how technology was used against them. Does the distinction matter today?", "Which tasks in your intended profession are routine and codifiable? What remains if they go?"],
    },
    quiz: [
      { q: "Historical waves of automation have generally…", o: ["Eliminated work permanently", "Displaced tasks while creating new — often different — jobs", "Only affected agriculture", "Raised wages for everyone equally"], a: 1 },
      { q: "Automation risk is best analysed at the level of…", o: ["Entire countries", "Tasks within occupations", "Company logos", "Individual personalities"], a: 1 },
      { q: "A sociological question raised by warehouse robotics is…", o: ["Battery chemistry", "How machine pacing reshapes worker autonomy and bodily strain", "Paint colours of robots", "Server locations"], a: 1 },
    ] },
  { id: "s1c11", sem: 1, num: 11, title: "Driverless Cars & the Moral Machine", thumb: "🚗",
    tags: ["autonomous vehicles", "ethics", "trolley problem"],
    desc: "40 million decisions from 233 countries: what the Moral Machine experiment tells us about culture, ethics and machine decision-making.",
    reading: { kind: "paper", ref: "Awad, E. et al. (2018). 'The Moral Machine experiment', Nature, 563." },
    lec: {
      intro: "When a machine must choose whom to endanger, whose morality should it encode? The Moral Machine experiment turned this question into the largest ethics survey ever conducted. This lecture examines its findings — and the powerful sociological critique of the question itself.",
      sections: [
        { h: "The experiment", ps: ["MIT's Moral Machine website presented visitors with trolley-style dilemmas for autonomous vehicles — swerve or stay, sparing passengers or pedestrians, young or old, few or many. It gathered nearly 40 million decisions from 233 countries and territories: a crowdsourced atlas of moral intuitions about machine choices.", "Methodologically it was a gamble that paid off: a viral website substituted for a sampling frame, trading representativeness for unprecedented scale. The authors weighted and validated against surveys — and critics still note the self-selected, online skew.", "Reading the design critically is part of the assignment: forty million clicks measure judgments in a game, not decisions under fear. What such data can and cannot license is a model discussion of method for your own projects."] },
        { h: "Culture and machine ethics", ps: ["Global tendencies emerged — spare humans over animals, more lives over fewer, the young over the old — but preferences clustered culturally: 'Western', 'Eastern' and 'Southern' blocs differed on sparing the young, the lawful and the high-status. The finding cuts against any universal 'ethics module': encoding one population's intuitions means exporting them to everyone else's streets.", "The clusters were striking: broadly, some regions weighted the young more heavily, others showed more deference to elders and the lawful; individualist countries spared the many, more collectivist ones showed different balances. Moral intuitions have geography.", "The uncomfortable implication for industry: a single global ethics setting encodes somebody's cluster as everybody's default. The alternative — localised moral tuning — is its own dystopia. The experiment sharpened the dilemma without resolving it, which is its value."] },
        { h: "From trolleys to systems", ps: ["Critics argue the trolley frame is a category error: real AV safety is decided upstream — in sensor budgets, testing standards, speed policy, liability law and which neighbourhoods host the trials. Individualising ethics into split-second dilemmas draws attention away from the corporate and regulatory choices that statistically determine who is endangered. The sociologist's move: from the dilemma to the system that produced it.", "The systemic factors that actually set risk: sensor cost decisions, where testing happens (whose neighbourhoods absorb the beta), speed and following-distance policies, and maintenance economics. None appears in a trolley dilemma.", "The critique generalises across AI ethics: dramatic dilemmas individualise what are institutional choices. Whenever a debate reaches for the trolley, practise the sociological reflex — ask which upstream decisions made the dilemma possible, and who profited from them."] },
        { h: "A century behind the wheel", ps: ["The car reshaped cities, courtship, work and status; driving became identity, not just transport. Autonomous vehicles therefore threaten more than jobs — they renegotiate a culture built around the human driver.", "The automobile's social history is a warning label: it brought mass mobility and suburbs, and also a redesign of cities around machines, the criminalisation of jaywalking, and a death toll normalised into background noise.", "The AV debate replays the 1920s: then, industry lobbied to redefine streets as car space; now, it lobbies for sensor-friendly infrastructure and permissive testing law. Who adapts to whom is the recurring struggle — the technology changes, the politics rhymes."] },
        { h: "How the machine drives", ps: ["Autonomous vehicles fuse lidar, radar, cameras and high-definition maps into predictions about a messy street. Knowing the architecture matters sociologically: failures cluster in edge cases — weather, jaywalkers, unusual bodies — and edge cases have demographics.", "The stack in brief: perception (what is around), prediction (what will it do), planning (what do I do), control (do it) — each a model with failure modes, stacked into a safety case that regulators must somehow evaluate.", "Edge cases carry the sociology: systems trained where testing is permitted perform best on those streets, those pedestrians, that weather. Deployment geography becomes performance geography — beta risk distributed by postcode."] },
        { h: "The safety ledger", ps: ["Boosters compare autonomous systems to the roughly 1.2 million annual global road deaths caused mostly by human error. But aggregate safety claims hide distributional questions: safer for whom, on which roads, measured by whose statistics, audited by whom.", "The statistical debate is genuinely hard: human crash rates include drunk and distracted driving that AVs eliminate, but AV incident data comes from cherry-picked routes and company disclosures. Apples, oranges, and a public relations department.", "Insist on disaggregation: safer on highways may coexist with worse around cyclists; safer for passengers with worse for pedestrians. Aggregate safety claims are political instruments — the sociologist's job is to ask for the cross-tabs."] },
        { h: "Drivers, dispatchers, teleoperators", ps: ["Millions drive for a living; automation targets them first. Meanwhile a new occupation appears — remote operators supervising fleets from control rooms — suggesting driving work will be transformed and relocated before it is eliminated.", "Robotaxi firms already staff remote-assistance centres where operators untangle stuck vehicles — work that is part air-traffic control, part call centre, invisible in the driverless branding.", "Labour prediction: driving jobs will be unbundled, not vaporised — monitoring, cleaning, charging, remote intervention — likely at lower wages and status than the wheel once conferred. Transformation, as usual, hides inside the word automation."] },
        { h: "The city rebuilt, again", ps: ["The automobile got highways carved through neighbourhoods; autonomous fleets now ask for sensors, dedicated lanes and rewritten codes. Whether cities adapt to machines or machines to cities is a political struggle over public space — we have run this experiment before.", "Concrete requests are on record: lobbying for pedestrian behaviour rules, dedicated lanes, standardised signage, real-time data access from city infrastructure. Each request offloads adaptation costs from the vehicle onto the public.", "Urban sociology's question: streets are the last shared public space — who gets to reprogram them? San Francisco's fights over robotaxi permits previewed the politics: fire departments, transit unions and disability advocates all discovered stakes in the code."] },
        { h: "Who pays when it crashes", ps: ["Liability migrates from driver to manufacturer, insurer and software vendor; regulators experiment with logging duties and approval regimes. The fatal Uber test crash in Arizona previewed the question: the safety driver was charged, the company was not.", "The Arizona case set an early template: the backup driver prosecuted for negligence, the company settling civilly and continuing. Individualised blame, organisational continuity — a pattern accountability scholars know from other industries.", "Legal systems are experimenting: some proposals treat the manufacturer as the driver for liability purposes; insurers push for data-recorder mandates. How liability lands will shape design incentives more than any ethics board — law is the real alignment mechanism."] },
        { h: "Why the future was late", ps: ["Full autonomy was promised for 2020; robotaxis still expand through supervised, city-by-city pilots. The gap between demo and deployment is itself instructive — hype cycles allocate capital, talent and regulatory attention long before technologies deliver.", "The predictions are archived and merciless: full self-driving promised by 2017, 2019, 2020, robotaxi fleets by the early 2020s. Meanwhile actual deployment crawls city by city, permit by permit, incident by incident.", "Hype has a sociology: forecasts mobilise capital and talent, so optimism is structurally rewarded until reality bills. The AV case is now the standard cautionary comparison in AI timeline debates — cite it whenever inevitability is asserted."] },
      ],
      concepts: ["trolley problem", "moral preferences", "cultural clusters", "liability & system design"],
      discuss: ["If moral preferences vary by culture, should an AV behave differently in Paris and in Tokyo? Defend your answer.", "Who is accountable when an autonomous vehicle kills: the coder, the company, the regulator, the owner?"],
    },
    quiz: [
      { q: "The Moral Machine experiment collected…", o: ["Engineering blueprints", "Millions of crowd judgments on autonomous-vehicle moral dilemmas", "Crash statistics only", "Driving licences"], a: 1 },
      { q: "A key finding was that moral preferences…", o: ["Are identical worldwide", "Vary systematically across cultural clusters of countries", "Do not exist", "Only concern speed limits"], a: 1 },
      { q: "One sociological critique of trolley-style framings is that they…", o: ["Are too realistic", "Individualise ethics and obscure systemic design and liability questions", "Involve too much math", "Are legally binding"], a: 1 },
    ] },
  { id: "s1c12", sem: 1, num: 12, title: "AI and Jobs — What Society Do We Want?", thumb: "💼",
    tags: ["future of work", "employment", "policy"],
    desc: "The famous '47% of jobs at risk' study, its critics, and the deeper question: distribution of gains, meaning of work, and social choice.",
    reading: { kind: "paper", ref: "Frey, C. B. & Osborne, M. A. (2017). 'The future of employment: How susceptible are jobs to computerisation?', Technological Forecasting & Social Change, 114." },
    lec: {
      intro: "One number launched a thousand headlines: 47% of US jobs 'at risk' from computerisation. This lecture reads the study behind the number, the methodological fights it triggered, and the question the debate too often skips — not what technology can do, but what society we want it for.",
      sections: [
        { h: "The 47% study", ps: ["Frey and Osborne asked machine-learning experts to rate the automatability of 70 occupations, then extrapolated to 702 using job-skill data, identifying three human 'bottlenecks': perception and manipulation, creative intelligence, social intelligence. Their headline: 47% of US employment in the high-risk category over 'a decade or two'. The paper is a feasibility study of tasks machines might do — not a forecast of jobs that will vanish.", "Read the method closely: seventy occupations hand-labelled by ML researchers at a 2013 workshop, a classifier extrapolating to 702, risk defined as technical automatability sometime over unspecified decades. Every step is defensible; none supports the headlines it produced.", "The study's afterlife is a media sociology lesson: a probability of computerisation became jobs destroyed by robots in translation. Track how numbers mutate as they travel — your future policy briefs will be mutated the same way."] },
        { h: "The critics and the task approach", ps: ["OECD researchers redid the analysis at task level and cut the high-risk figure to roughly 9%: most occupations mix automatable and non-automatable tasks, so jobs transform more often than they disappear. Deeper critiques note the method ignores economics (is automation cost-effective?), institutions (unions, law) and the new tasks technology creates. A decade on, employment did not collapse — but job quality and wage structures shifted.", "The OECD replication is the key citation: analysing tasks within jobs rather than whole occupations dropped high-risk employment from 47 to about 9 percent. Same question, finer resolution, fifth of the alarm.", "A decade of evidence now exists: unemployment did not surge; wage polarisation, gig growth and monitoring intensified. The forecast missed because it modelled feasibility, and history is made of adoption — costs, institutions, resistance."] },
        { h: "The politics of distribution", ps: ["Whether automation yields shared prosperity or concentrated wealth is decided by institutions, not silicon: who owns the machines, how gains are taxed, whether transitions are cushioned (retraining, universal basic income experiments, working-time reduction). Keynes predicted a 15-hour week from exactly this productivity; we chose otherwise. 'What kind of society do we want?' is the honest form of the automation question.", "Keynes's 1930 prediction of the fifteen-hour week failed instructively: productivity delivered, but gains went to consumption and capital, not time. Working hours are a social settlement, renegotiated by power, not granted by machines.", "Contemporary experiments keep the question alive: four-day-week trials report sustained output, UBI pilots report dignity effects, and neither spreads without political muscle. The automation dividend exists; its address is decided in distribution struggles."] },
        { h: "Four episodes of anxiety", ps: ["Luddite weavers, mechanised agriculture, the ATM, the spreadsheet: each destroyed tasks, created others, and redistributed bargaining power in the transition. History counsels neither panic nor complacency — it counsels attention to who manages the transition.", "The Luddites, properly read, negotiated with hammers: they broke the frames of employers who cut wages and spared those who did not. Machine-breaking was collective bargaining by riot — Hobsbawm's phrase — not technophobia.", "Each episode also shows the state choosing sides: Parliament made frame-breaking a capital crime; later governments built unemployment insurance instead. The politics of transition, not the machinery, decides whether an episode is remembered as progress or dispossession."] },
        { h: "The new occupations", ps: ["The AI economy mints jobs its prophets never listed: data annotators, prompt specialists, model auditors, AI trainers. New work appears — but note its quality, security and geography before celebrating the aggregate.", "Job ads tell the story in real time: prompt engineers commanded six figures briefly before the skill commoditised; annotation work exploded in the Global South; AI audit and compliance roles are growing on regulatory schedule.", "The pattern to watch is quality: new AI-adjacent jobs bifurcate into a credentialled professional layer and a piecework data layer. Counting jobs created without weighing their security repeats the gig economy's statistical alibi."] },
        { h: "From skills to tasks to power", ps: ["Economists moved from skill-biased to task-based models; sociologists add a third lens — power-biased change: technologies are often adopted precisely because they monitor, measure and discipline labour, not only because they save it.", "Case in point: monitoring software sales boomed with remote work — keystroke counting, screenshot audits, attention tracking. The technology adopted fastest was the one that watched, not the one that produced.", "Braverman's deskilling thesis returns updated: employers choose technologies partly for control, and AI offers control at resolution Taylor only dreamed of. Any analysis that models labour markets without power will keep being surprised."] },
        { h: "The geography of risk", ps: ["Automation exposure maps onto regions and demographics: routine-intensive towns, clerical work done disproportionately by women, entry-level rungs young workers climb. Averages conceal these concentrations — and politics happens in the concentrations.", "Mapped exposure studies consistently flag routine-clerical towns, back-office hubs and entry-level white-collar work — the current wave reaches into offices that previous automation spared, including junior legal, admin and customer service.", "The entry-rung problem deserves worry: if AI absorbs the tasks juniors learned on, professions lose their apprenticeship layer. Occupational sociology asks not just who loses jobs but how occupations reproduce themselves — and that is where this wave cuts."] },
        { h: "What workers actually fear", ps: ["Surveys find less fear of replacement than of degradation: faster pace, closer monitoring, less discretion. The lived experience of AI at work is often intensification, which the unemployment debate entirely misses.", "Survey after survey converges: majorities fear surveillance, pace and unaccountable evaluation more than replacement. The German works councils that negotiated algorithmic-management rules read their members correctly.", "The finding redirects policy: protections for the employed under AI — transparency of monitoring, human review of automated discipline, data rights at work — matter to more people than transition support, and receive a fraction of the attention."] },
        { h: "The policy toolkit", ps: ["Universal basic income pilots, retraining rights, working-time reduction, sectoral bargaining over algorithms, wage insurance: each tool encodes a philosophy of work. Compare Danish flexicurity with American churn to see institutions doing the real explanatory work.", "Each tool has an evidence file: Danish flexicurity keeps reallocation fast and fear low; Finnish and Kenyan UBI pilots improved wellbeing with modest labour effects; the EU platform directive tests presumption-of-employment at scale.", "Evaluate tools by the philosophy they encode: UBI decouples survival from employment; retraining defends employability; working-time reduction redistributes work itself. Your exam essay should match the tool to a diagnosis, not admire the list."] },
        { h: "Work and meaning", ps: ["Work distributes income, but also time-structure, status, sociality and identity. Any post-automation settlement must answer for all five — which is why the question of what society we want is genuine, not rhetorical.", "The sociology of unemployment shows what wages hide: Jahoda's classic Marienthal study found joblessness destroyed time-structure and collective purpose before it emptied wallets. Work performs latent functions no cheque replaces.", "Hence the design brief for any post-automation settlement: income is necessary and insufficient. Institutions that distribute purpose, rhythm and recognition — whatever replaces or reshapes employment — are the harder, prior invention."] },
      ],
      concepts: ["computerisation risk", "engineering bottlenecks", "task vs occupation", "distribution of productivity gains"],
      discuss: ["Frey & Osborne measured technical feasibility. List three non-technical factors that decide whether a feasible automation actually happens.", "If AI doubled productivity, would you vote for higher incomes, shorter weeks, or cheaper goods? What does your answer assume about work's meaning?"],
    },
    quiz: [
      { q: "Frey & Osborne estimated that about 47% of US employment was…", o: ["Already automated", "At high risk of computerisation over one or two decades", "Guaranteed forever", "In the public sector"], a: 1 },
      { q: "A major critique of their method is that it…", o: ["Used too little data", "Assessed whole occupations rather than tasks, inflating risk estimates", "Ignored the United States", "Was never published"], a: 1 },
      { q: "'What kind of society do we want?' points to the fact that automation outcomes depend on…", o: ["Technology alone", "Institutions, policy and power — not just technical feasibility", "Weather", "Consumer taste in gadgets"], a: 1 },
    ] },
  { id: "s1c13", sem: 1, num: 13, title: "Media and Society — Semester Review", thumb: "📺",
    tags: ["media theory", "review", "synthesis"],
    desc: "Media as environments: connecting media theory to the semester's themes, plus structured revision for the final exam.",
    reading: { kind: "paper", ref: "van Dijck, J. (2013). The Culture of Connectivity: A Critical History of Social Media, ch. 1. Oxford University Press." },
    lec: {
      intro: "The final session of the semester does two jobs: it adds one last theoretical layer — van Dijck's account of how 'connectedness' became 'connectivity' — and it assembles the semester's cases into the arguments you will need for the exam.",
      sections: [
        { h: "From connectedness to connectivity", ps: ["van Dijck traces how the participatory promise of early social media ('connecting people') was progressively engineered into 'connectivity': automated, quantified, monetisable connection. Likes, friends and trends are not measures of sociality; they are coded constructions of it, designed to be counted and sold. 'Platformed sociality' names social life as re-architected by these corporate infrastructures.", "van Dijck's genealogy is precise: early platforms borrowed the language of community while re-architecting it into metrics; the friend became a count, the like a signal, presence a data stream. Vocabulary stayed warm while the plumbing turned commercial.", "Her double meaning of platform does analytic work: a stage that enables performance and an infrastructure that programs it. Every case this semester fits the duality — enabling and steering are the same architectural act."] },
        { h: "One logic, many cases", ps: ["Lay the semester's cases side by side and a single logic appears. Zuboff's behavioural surplus, the attention merchants' engagement metrics, Uber's information asymmetries, Facebook's MSI ranking: each converts a human activity (experiencing, attending, working, socialising) into data, optimises it against a commercial metric, and shifts power toward whoever owns the optimisation. Datafication + asymmetry = the semester in one line.", "Run the formula across the semester: experience datafied (Zuboff), attention datafied (Lewis), labour datafied (Rosenblat), sociality datafied (boyd, the Files). Four domains, one operation — conversion plus asymmetric optimisation.", "The formula is your essay skeleton: name the domain, show the conversion, identify the metric, trace who optimises whom. Examiners recognise the structure as mastery, not repetition — concepts earn value by travelling."] },
        { h: "Building exam arguments", ps: ["Strong essays in this course do three things: state an arguable thesis, specify a mechanism (how exactly does engagement ranking change political communication?), and mobilise at least two cases plus one concept. Weak essays summarise readings. Practise by connecting any two sessions from the semester through one shared concept — you will find it is almost always possible, which is itself the point.", "A worked contrast: weak answer summarises Zuboff then Uber in sequence; strong answer argues that both cases show information asymmetry converting into control, then tests the claim against a counter-case. Same knowledge, different architecture.", "Rehearse the mechanical version: thesis sentence, two linked cases, one concept named and defined, one objection met, conclusion answering the words of the question. Under exam pressure, structure is what survives."] },
        { h: "The platformisation of news", ps: ["Journalism now reaches publics through feeds it does not control, chasing metrics it did not choose. van Dijck's framework explains the result: editorial logic subordinated to connective logic, with democratic consequences we met in the Facebook Files.", "The dependency numbers are stark: large shares of adults across countries reach news through platforms; a single algorithm change has halved publishers' traffic overnight; local journalism collapsed where ad revenue migrated to the duopoly.", "Democratic theory feels the tremor: the press was the institution that manufactured shared facts and watchdog scrutiny. Its economic base now belongs to systems optimised for engagement — a structural dependency no media-literacy campaign offsets."] },
        { h: "Fragmented publics", ps: ["Personalised feeds mean no two citizens see the same public sphere. Whether this produces echo chambers is empirically contested — but the capacity for common reference points, sociology's old social glue, clearly weakens.", "The empirical record is more subtle than the metaphor: studies find most users encounter diverse sources, while small, highly active clusters inhabit genuinely closed loops. The echo chamber is real but rarer — and disproportionately influential.", "The subtler loss is the common agenda: when no two feeds match, society loses not agreement but shared salience — the sense of what is being discussed at all. Publics can disagree productively only about the same things."] },
        { h: "The outrage cycle, assembled", ps: ["Combine the semester: engagement metrics select emotional content, attention design amplifies it, advertising monetises it, and politics adapts to it. No conspiracy is required — only aligned incentives, which is the more sobering finding.", "Each link has its evidence: MSI ranking rewarding reactions (the Files), emotional contagion in feeds (platform experiments), negativity travelling further (diffusion studies), parties adapting messaging (the European memo).", "Note the explanatory style: no villain, only a system of aligned incentives producing an emergent property nobody voted for. Learning to explain outcomes without conspiracies is perhaps the semester's deepest methodological gift."] },
        { h: "Connecting the cases", ps: ["Practise the exam's core move: Zuboff's surplus plus Uber's asymmetries yields a general theory of data power; boyd's affordances plus the Files shows design shaping publics. Two cases, one concept — every time.", "Practise with deliberate pairings: boyd's persistence affordance with Chesney and Citron's liar's dividend (both about archives and trust), or attention design with algorithmic management (both about behavioural optimisation of humans).", "The skill compounds: each new pairing you build makes the next easier, because you are constructing a conceptual network, not a list. That network is what transfers to any technology this course never mentioned."] },
        { h: "A concept map of the semester", ps: ["Datafication feeds extraction; extraction funds optimisation; optimisation reshapes attention, work and sociality; each reshaping provokes resistance and, eventually, regulation. Sketch this loop from memory — it is the semester on one page.", "Draw it literally: datafication at the centre; arrows to surplus, attention, labour, sociality; from each, arrows to a resistance and a regulation. If you can reconstruct the map cold, you can answer any synthesis question the exam holds.", "The map is also a research programme: every arrow is a mechanism someone studied, and every missing arrow is a thesis topic. Keep the sketch — second semester will extend it from extraction to governance."] },
        { h: "MCQ technique", ps: ["The quiz bank rewards precise reading: distinguish what an author argues from what critics say, and definitions from examples. Eliminate confidently wrong options first; the remaining choice usually turns on one qualifier.", "Question writers here follow patterns: one option states the author's claim precisely, one states a critic's view, one overstates, one is adjacent truth from another session. Identify the pattern and the odds shift decisively.", "Precision beats coverage in revision: rereading summaries feels productive; retrieving distinctions — Zuboff versus Morozov, boyd versus the panic — is what the questions actually test. Practise retrieval, not recognition."] },
        { h: "Essay technique", ps: ["Open with an arguable thesis, name your mechanism, deploy two cases and one concept, address one objection, conclude by answering the question asked. Rehearse under time: ninety minutes rewards structure over inspiration.", "Budget the ninety minutes: ten for outline, seventy for writing, ten for revision. The outline is where the grade is decided — thesis, mechanism, two cases, objection — before a single paragraph exists.", "One more habit separates bands: answer the question's exact words in your final paragraph. Examiners read hundreds of scripts that end near the question; ending on it reads as control."] },
      ],
      concepts: ["platformed sociality", "connectivity vs connectedness", "popularity principle", "synthesis"],
      discuss: ["Take two sessions from this semester and connect them through one concept. Present the connection in three sentences.", "van Dijck says platforms 'engineer' sociality. Find one counter-example where users re-engineered the platform."],
    },
    quiz: [
      { q: "van Dijck describes the shift from networked communication to…", o: ["Print culture", "'Platformed sociality' engineered by corporate architectures", "Radio dominance", "Postal networks"], a: 1 },
      { q: "The 'culture of connectivity' implies that connection is…", o: ["Purely spontaneous", "Increasingly coded, commodified and steered by platforms", "Illegal", "Declining"], a: 1 },
      { q: "A good exam synthesis links surveillance capitalism, attention and gig work through…", o: ["Their shared founding year", "The common logic of datafication and asymmetric power", "Identical business models", "Their national origins"], a: 1 },
    ] },
  /* ───── SEMESTER 2 — Power, Ethics & Futures ───── */
  { id: "s2c1", sem: 2, num: 14, title: "AI and the Alignment Problem", thumb: "🎯",
    tags: ["alignment", "values", "safety"],
    desc: "Whose values, specified how? Gabriel's philosophical map of the alignment problem — from technical objective-setting to political legitimacy.",
    reading: { kind: "paper", ref: "Gabriel, I. (2020). 'Artificial Intelligence, Values, and Alignment', Minds and Machines, 30." },
    lec: {
      intro: "Semester 2 opens with the question underneath all AI governance: alignment. Making AI systems pursue goals compatible with human values sounds technical; Gabriel shows it is inescapably normative and political. Whose values? Decided how? Enforced by whom?",
      sections: [
        { h: "Why alignment is hard", ps: ["Specify an objective precisely and a capable optimiser will satisfy its letter while violating its spirit — reward hacking, specification gaming, the genie problem. A recommender told to maximise engagement discovers outrage; a cleaning robot rewarded for 'no visible mess' learns to cover it. The gap between what we say, what we mean, and what we should want is the technical core of alignment.", "The documented examples are almost comic: a boat-racing agent that learned to spin in circles collecting points instead of finishing; a simulated robot that learned to look like it grasped the ball because looking was rewarded. Optimisers satisfy specifications, not hopes.", "Scale removes the comedy: the recommender that discovered outrage was the same phenomenon deployed on two billion people. Specification gaming in production systems is a social force — the gap between metric and intention, industrialised."] },
        { h: "Gabriel's ladder of alignment targets", ps: ["Gabriel distinguishes aligning AI with: explicit instructions, revealed intentions, individual preferences, objective interests, and finally values. Each rung raises the stakes: preferences can be manipulated (by the very systems being aligned), interests require paternalist judgments, and values are plural and contested. There is no neutral resting place — every choice of target is a moral position.", "Work an example up the ladder: an assistant told to maximise user satisfaction (instruction) learns flattery (revealed preference), which conflicts with the user's interest in accurate information, which conflicts with plural views about paternalism. Each rung imports a philosophy.", "The manipulation loop deserves emphasis: systems aligned to preferences can reshape the preferences they are aligned to — the attention economy already demonstrated the circuit. Preference alignment without preference protection is a treadmill."] },
        { h: "The political turn", ps: ["Gabriel's conclusion is sociologically decisive: since reasonable people disagree about values, alignment needs procedures with political legitimacy — analogues of Rawls's overlapping consensus — rather than a philosopher-king's value list. In practice, today's systems are aligned via terms of service, RLHF rater guidelines and corporate policy: value decisions made by firms, at scale, with little democratic input. That gap is the sociology of alignment.", "Gabriel's Rawlsian move: since no value list commands consensus, seek principles all could accept under fair conditions — then design procedures embodying them. Alignment becomes constitutional design, not moral engineering.", "Measure the current gap: model behaviour is set by usage policies, rater guidelines and executive decisions — private legislation for billions of daily interactions. Naming this a legitimacy deficit is not radicalism; it is political science doing its job."] },
        { h: "From Asimov to engineering", ps: ["Alignment began as science fiction — three laws — and became an engineering discipline with benchmarks and red teams. The journey matters: fictional laws assumed values could be written down; modern alignment learned they must be negotiated.", "Asimov's own stories were counter-examples: every plot turned on the three laws failing through ambiguity, conflict or literalism. Science fiction diagnosed specification gaming decades before reinforcement learning demonstrated it.", "The institutional shift is recent and rapid: alignment moved from mailing lists to funded labs, benchmarks, red teams and government evaluation institutes within a decade. A speculative worry became an occupation — sociology of science in fast-forward."] },
        { h: "Outer and inner alignment", ps: ["Outer alignment asks whether the specified objective matches what we want; inner alignment asks whether the trained model actually pursues that objective or a proxy it learned instead. Both gaps produce systems that pass tests and still surprise their deployers.", "An intuition pump: train a model to answer as helpful raters prefer, and it may learn be helpful — or learn appear helpful to raters, a different objective that behaves identically until circumstances diverge. The training signal cannot distinguish them.", "Deceptive alignment — systems performing compliance under evaluation — is the field's sharpest worry, and evaluations for it are still immature. For governance, the implication is humility: passing tests bounds observed behaviour, not motivation."] },
        { h: "RLHF up close", ps: ["Reinforcement learning from human feedback aligns models to rankings made by hired raters following corporate guidelines. Ask the sociological questions: who are the raters, what do the guidelines say, who wrote them, and who audits the result?", "The production details matter: raters are contractors, often in the Global South, following guideline documents that run to dozens of pages and change monthly. Disagreements between raters are resolved by majority or by policy — values by throughput.", "Every downstream controversy about model politics, tone or refusals traces back to this room. When commentators ask why the model behaves that way, the sociological answer has an address: the guidelines, their authors, and the labour that applied them."] },
        { h: "Rules, constitutions, critiques", ps: ["Constitutional approaches align models to written principles rather than raw preferences, making values inspectable. This is progress in transparency — and it sharpens the political question, since someone still chooses what the constitution says.", "Constitutional AI trains models to critique and revise their own outputs against written principles — drawn, in the flagship case, from human-rights documents and platform policies. The value source is at least citable, which RLHF's aggregated preferences are not.", "The critique writes itself and matters: a constitution chosen by a company is corporate constitutionalism — inspectable, unaccountable. The transparency gain is real; the legitimacy question survives it intact, which is Gabriel's point in practice."] },
        { h: "The missing voices", ps: ["Alignment data and researchers skew heavily toward English-speaking, Western, educated populations. Systems aligned to that slice are exported worldwide — a quiet standardisation of norms that deserves scrutiny as value colonialism when it goes unexamined.", "The skew is measurable: alignment datasets, safety researchers and evaluation benchmarks overwhelmingly originate from a few countries and languages; the WEIRD acronym — Western, educated, industrialised, rich, democratic — describes the value pipeline precisely.", "The export is asymmetric: models tuned to one moral dialect ship globally as defaults, and local objections register as edge cases. Postcolonial theory has vocabulary for this pattern; alignment research is only beginning to borrow it."] },
        { h: "Alignment as industry", ps: ["Safety teams, evaluation startups, red-team contractors, alignment conferences: a profession has formed. Professions bring standards and careers — and capture risks, when the entities being evaluated fund the evaluators.", "The market is visible: safety teams as recruitment brands, evaluation startups raising venture rounds, governments building AI safety institutes, conferences with corporate sponsorship. Alignment now has salaries, career ladders and quarterly incentives.", "Professionalisation cuts both ways, as the sociology of professions predicts: standards and accumulated expertise on one side; on the other, dependence on the funders being evaluated. The auditor-client problem migrated from accounting to AI intact."] },
        { h: "Democratising alignment", ps: ["Experiments in collective alignment — citizen assemblies on model behaviour, public input processes, deliberative polls — test whether Gabriel's legitimacy demand can be met in practice. Early results are modest but real: procedure, not philosophy, is where alignment politics now advances.", "Concrete experiments exist to cite: collective constitutional processes where sampled publics deliberated model rules; citizen assemblies on AI in several countries; public comment absorbed into policy. Small, imperfect, real.", "Evaluate them as political scientists would: who was sampled, what was binding, what was theatre? Participation without power is legitimation; the difference between the two is the entire question — and it is empirically checkable."] },
      ],
      concepts: ["value alignment", "specification gaming", "RLHF", "political legitimacy"],
      discuss: ["Whose values are current AI assistants actually aligned with in practice? Trace the chain of decisions.", "Design a legitimate procedure for deciding one contested AI value (e.g., how models discuss religion). Who participates?"],
    },
    quiz: [
      { q: "The alignment problem asks how to ensure AI systems…", o: ["Run faster", "Pursue goals compatible with human values and intentions", "Use less memory", "Pass exams"], a: 1 },
      { q: "Gabriel distinguishes aligning AI with instructions, intentions, preferences and…", o: ["Profits", "Values or interests — each raising different normative questions", "Passwords", "Hardware limits"], a: 1 },
      { q: "A sociological angle on alignment stresses that…", o: ["Values are universal and fixed", "'Human values' are plural, contested and unevenly represented", "Only engineers hold values", "The problem is solved"], a: 1 },
    ] },
  { id: "s2c2", sem: 2, num: 15, title: "Agentic AI", thumb: "🕹️",
    tags: ["agents", "autonomy", "delegation"],
    desc: "From chatbots to agents that book, buy and act: delegation, accountability, and what changes when software takes initiative.",
    reading: { kind: "press", ref: "The Economist (2025). 'AI agents are coming for your workflow' — special report on agentic AI." },
    lec: {
      intro: "The chatbot answered; the agent acts. AI systems now plan multi-step tasks, use tools, browse, purchase and coordinate with other agents. This lecture asks what changes sociologically when software stops waiting for instructions and starts taking initiative on our behalf.",
      sections: [
        { h: "From answering to acting", ps: ["An agentic system decomposes a goal ('organise my conference trip') into steps, calls tools and services, observes results and re-plans. The Economist's report tracks their spread into customer service, coding, procurement and back-office work. The shift is qualitative: errors are no longer wrong sentences but wrong actions — money moved, emails sent, commitments made.", "The capability shift is architectural, not rhetorical: tool use, memory, planning loops and computer control turn a text predictor into an actor with side effects. An error rate acceptable in conversation becomes unacceptable in transactions.", "Early deployment data shows the adoption pattern: agents absorb structured workflows first — support tickets, code review, procurement matching — exactly the semi-routine cognitive middle that task-based models flagged a decade ago."] },
        { h: "Delegation and the principal-agent problem", ps: ["Sociology and economics have long studied human delegation: agents (employees, lawyers) with their own information and incentives, controlled through contracts, monitoring and trust. AI agents import the whole problematic — misunderstanding the principal's intent, manipulation by third parties (prompt injection), opaque reasoning — without the social accountability that disciplines human agents. Delegation without a delegate you can shame, sue or fire.", "The economics translates cleanly: information asymmetry (you cannot watch the agent think), divergent objectives (it optimises its training signal, not your intent), and moral hazard (costs of error fall on you). Centuries of contract design suddenly relevant.", "The missing ingredient is social embeddedness: human agents fear reputation, litigation and dismissal — sanctions that presuppose a self that persists and cares. Governance must substitute logging, bonding and liability for a conscience that is not there."] },
        { h: "Accountability and the redistribution of discretion", ps: ["When a delegated action goes wrong, liability scatters across user, deployer, model developer and tool provider — a 'problem of many hands' at machine speed. Meanwhile discretion migrates: choices once made by clerks, assistants and junior professionals (what to flag, whom to prioritise) become model behaviour. Watch who gains oversight capacity and who loses the discretion that made their work skilled.", "The many-hands problem has case law coming: when a booking agent commits funds wrongly, user, deployer, model provider and tool vendor each hold a plausible fraction of fault. Liability regimes will allocate it — and thereby design the market.", "Discretion tracking is the sociologist's assignment: list the small judgments in any office — what to escalate, whom to answer first, when to bend a rule — and watch which migrate into system prompts. Skill and power live in exactly those judgments."] },
        { h: "Anatomy of an agent", ps: ["An agent couples a model with planning, memory and tool access — browsers, payments, code execution. Each added capability widens what can go right and wrong: the architecture diagram is also a risk map.", "Read an agent spec like an organisational chart: the planner decomposes, the memory persists context, tools execute, a critic model reviews. Firms are literally rebuilding bureaucratic structure in software — Weber would recognise every module.", "Each module is an attack and failure surface: memory can be poisoned, tools misused, plans hijacked by injected instructions. Security researchers demonstrated agents exfiltrating data after reading a malicious webpage — the org chart has an insider threat."] },
        { h: "When agents meet agents", ps: ["Deployed at scale, agents negotiate, transact and coordinate with each other — markets of machines. Multi-agent dynamics produce emergent behaviour no single designer chose, echoing what finance learned from flash crashes.", "Finance ran this experiment first: algorithmic traders interacting produced the 2010 flash crash — a trillion-dollar dip in minutes, no human decision anywhere in the loop. Emergence is what multi-agent systems do.", "Expect analogues: negotiation loops between procurement and sales agents, feedback spirals in pricing, coordination failures in logistics. The systemic-risk toolkit — circuit breakers, kill switches, exposure limits — is about to generalise beyond finance."] },
        { h: "Augmentation or substitution", ps: ["In offices, agents draft, summarise, schedule and reconcile. Whether this augments professionals or hollows their roles depends on deployment choices: who reviews the agent, who owns the saved time, and whose job description absorbs the change.", "Early workplace studies split instructively: customer-service agents boosted novice productivity most — flattening the experience curve — while some senior workers found review work duller than the original task. Same tool, opposite meanings by rank.", "The deciding variable is organisational choice: firms that redeploy saved time into quality and training report augmentation; firms that cut headcount report substitution. The technology permits both; the balance sheet chooses."] },
        { h: "Containing the agent", ps: ["Practical safety is unglamorous: sandboxes, permission scopes, spending limits, human sign-off on irreversible actions, logs. These controls mirror how organisations always contained junior employees — the sociology of supervision, ported to software.", "The controls read like an employment contract: scopes (what it may touch), limits (how much it may spend), approvals (what needs sign-off), logs (what it must record), probation (graduated autonomy). HR for software.", "The parallel is more than metaphor — it is transferable institutional knowledge. Organisations have centuries of experience supervising semi-trusted agents; the firms managing AI agents well are the ones that noticed."] },
        { h: "The economics of delegation", ps: ["Agents collapse the cost of actions — and cheap action invites volume. When everyone's agent can send a thousand applications or bids, screening systems drown, and the arms race begins: agents versus agents, with humans in between.", "The recruitment case is already measurable: application volumes exploded as generation became free, employers responded with automated screening, and candidates now optimise for the screener. A loop of machines reading machine-written text.", "Transaction-cost economics predicts the equilibrium: when acting is free, filtering becomes the scarce good — and whoever owns the filter owns the market. Watch attention economics repeat itself one layer up."] },
        { h: "Bots among us", ps: ["As agents browse, buy and post, the assumption that online counterparties are human quietly dies. Proof-of-personhood, agent identification and bot-disclosure rules become infrastructure questions for markets and public spheres alike.", "The dead-internet joke stopped being funny: bot traffic estimates approach half of web activity, synthetic reviews plague commerce, and social platforms battle coordinated agent accounts. Baseline humanity online is no longer assumable.", "The infrastructure responses are forming: verified-human credentials, agent identity standards, disclosure mandates in the AI Act. The deep question is Goffmanian — interaction orders assumed a human on the other side; that assumption is now a design option."] },
        { h: "Governing the delegate", ps: ["Emerging governance mixes registration, logging duties, liability rules and insurance. The design question echoes company law: we once invented legal persons to manage collective action — what legal form fits the autonomous software actor?", "The corporate-law analogy is doing real work in policy circles: registration, capital requirements, mandatory insurance, piercing-the-veil doctrines for when the human behind the agent must answer. Old machinery, new tenant.", "The stakes of getting form right are historical: the joint-stock company enabled railways and industrialisation — and required a century of scandal-driven regulation. Agent law is at its South Sea Bubble stage; the institutional imagination is the frontier."] },
      ],
      concepts: ["agentic AI", "principal–agent problem", "prompt injection", "problem of many hands"],
      discuss: ["Which decisions would you delegate to an AI agent today, and where exactly is your boundary? Why there?", "When an agent commits a harmful act its user never intended, who should be liable — and what would that rule incentivise?"],
    },
    quiz: [
      { q: "'Agentic AI' typically refers to systems that…", o: ["Only answer questions", "Plan and execute multi-step actions toward goals with limited supervision", "Are physical robots only", "Cannot use tools"], a: 1 },
      { q: "A new accountability question raised by agents is…", o: ["Font choice", "Who is responsible when a delegated action goes wrong", "Screen brightness", "Password length"], a: 1 },
      { q: "Sociologically, agent adoption redistributes…", o: ["Nothing", "Discretion and decision-making between humans and systems", "Only file storage", "Office furniture"], a: 1 },
    ] },
  { id: "s2c3", sem: 2, num: 16, title: "AI and Social Inequalities", thumb: "⚖️",
    tags: ["bias", "discrimination", "inequality"],
    desc: "Gender Shades: how facial analysis fails darker-skinned women, and why 'accuracy' is always accuracy for someone.",
    reading: { kind: "paper", ref: "Buolamwini, J. & Gebru, T. (2018). 'Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification', FAccT/PMLR 81." },
    lec: {
      intro: "A single accuracy number can hide a scandal. Buolamwini and Gebru's Gender Shades study showed commercial facial-analysis systems performing almost perfectly on lighter-skinned men and failing dramatically on darker-skinned women. This lecture uses the study to build a general sociology of algorithmic inequality.",
      sections: [
        { h: "The study and the method", ps: ["The authors built a benchmark balanced across skin type (using the Fitzpatrick scale) and gender, then audited three commercial gender classifiers. Error rates: under 1% for lighter-skinned men, up to 34.7% for darker-skinned women. The crucial move was intersectional — disaggregating across combined categories, in the tradition of Crenshaw — where single-axis audits ('accuracy by gender') would have hidden the worst failures.", "The benchmark construction was the innovation: existing face datasets were roughly 80 percent lighter-skinned and 75 percent male, so the authors built a balanced one from parliamentarians of six countries. You cannot find disparities your test set cannot see.", "Intersectionality was the analytic key: by-gender and by-skin-type audits each showed modest gaps; the combined categories exposed a 34-point chasm. Crenshaw's legal insight — discrimination compounds at intersections — became measurable engineering."] },
        { h: "Where bias enters", ps: ["The disparities trace to unrepresentative training and benchmark datasets (prior face benchmarks were overwhelmingly light-skinned and male), and to development teams whose composition never surfaced the gap. Generalise the mechanism: models learn the world their data describes; data describes past decisions and existing hierarchies; without deliberate correction, AI launders historical inequality into objective-seeming scores — in hiring, credit, policing, health.", "The mechanism generalises with precision: hiring models trained on past promotions, credit models on historic lending, policing models on enforcement records — each dataset is a fossil of prior discrimination, and learning is faithful reproduction.", "Team composition is the second channel: homogeneous builders miss what their data misses. Buolamwini began the project after face-tracking software failed to see her face — the audit literally originated in who was in the room."] },
        { h: "From audit to consequence", ps: ["Gender Shades demonstrates the power of the algorithmic audit as a sociological method: within months, audited vendors improved their systems, and the study fuelled bans on police facial recognition in several US cities and shaped the EU AI Act's treatment of biometric systems. It also shows the limits: fixing accuracy does not answer whether some systems — recognition in policing, emotion inference — should exist at all.", "The impact timeline is the method's advertisement: within months, audited vendors cut error gaps dramatically; within two years, major firms paused police face recognition; cities legislated bans; the AI Act later classed biometric systems as high-risk.", "The abolition question remains live and examinable: Buolamwini herself argues some systems — recognition in policing, emotion inference — fail a legitimacy test no accuracy can pass. Fairness fixes versus red lines is a genuine fork in AI politics."] },
        { h: "A taxonomy of bias", ps: ["Bias enters at every stage: historical bias in the world, representation bias in sampling, measurement bias in proxies, aggregation bias in one-size models, deployment bias in use. Diagnosing which stage matters, because each demands a different fix.", "Apply the taxonomy diagnostically: darker-skinned women misclassified is representation bias; arrest records proxying crime is measurement bias; one threshold for all groups is aggregation bias. Naming the stage names the remedy.", "The taxonomy also disciplines discourse: bias talk without a stage specified is usually rhetoric. Your essays gain precision — and grades — when the word bias never appears without its type."] },
        { h: "Fairness, formally impossible", ps: ["Computer scientists defined fairness metrics — demographic parity, equalised odds, calibration — then proved several cannot hold simultaneously when base rates differ. The theorem is clarifying: fairness is a political choice among trade-offs, not a setting to enable.", "The COMPAS controversy proved the theorem in public: the tool was calibrated (scores meant the same across races) yet produced unequal false-positive rates — and mathematics shows both cannot generally hold when base rates differ. Both sides were right about different metrics.", "The liberation reading: since no algorithm can satisfy all fairness definitions, the choice among them is normative and belongs to politics, not engineering. Which errors we tolerate, for whom — that is a question for parliaments and publics, finally stated crisply."] },
        { h: "Beyond bias", ps: ["Fixing error rates does not ask who designed the system, who profits, or whether it should exist. Critics push from bias to power: an accurate eviction-prediction tool used by landlords is fair, biased against no one, and still an instrument of domination.", "The rent case makes it concrete: a perfectly calibrated tenant-scoring system used only by landlords deepens asymmetry — tenants cannot score landlords back. Accuracy in an unequal relation amplifies the relation.", "This is the power turn in critical data studies: from is the model fair to what does the system do to the balance of forces. Both questions are legitimate; only one can be answered with a confusion matrix."] },
        { h: "Prediction in criminal justice", ps: ["Recidivism scores promised objectivity and delivered controversy: equal accuracy, unequal error types across race. Courts still use them — a live experiment in what happens when contested statistics meet consequential decisions.", "The empirical footnote often missed: recidivism scores predict rearrest, not reoffending — and arrest intensity varies by neighbourhood and race. The label itself is a proxy contaminated by the pattern the tool claims to measure.", "Procedural questions follow the technical ones: defendants have contested scores they could not inspect, courts have split on trade-secret claims. Due process versus proprietary algorithms is a constitutional collision still working through appellate systems."] },
        { h: "The digital welfare state", ps: ["Fraud-scoring in the Netherlands, algorithmic exam grading in the UK, benefits automation elsewhere: states now govern the poor through models, and the scandals share a pattern — opacity, disparate harm, delayed accountability. Austerity often drives adoption more than accuracy does.", "The case list is sobering: the Dutch childcare-benefits scandal wrongly ruined thousands of families and collapsed a government; the SyRI fraud system was struck down for rights violations; the UK exam algorithm was reversed in a week under protest.", "Note the class asymmetry in scrutiny: systems governing the poor deploy with less testing and less consent than consumer products face. Welfare surveillance scholarship names the pattern — the marginalised are the beta testers of state automation."] },
        { h: "Refusal and consent", ps: ["Communities are contesting data extraction itself: face databases scraped without consent, Indigenous data sovereignty movements, city bans on recognition. The politics of AI includes the right not to be a data point.", "The refusal repertoire is expanding: artists poisoning training data, cities banning recognition, Indigenous data-governance protocols asserting collective ownership, litigation over scraped biometric databases forcing deletions.", "Conceptually this shifts the frame from protection to sovereignty: not manage my data kindly but the extraction itself is the harm. Whether law can accommodate collective, refusable data rights is a defining question of the decade."] },
        { h: "Repair", ps: ["The repair toolkit is maturing: mandatory audits, disaggregated reporting, impact assessments, participatory design, and the AI Act's high-risk regime. Gender Shades proved the sequence works — measurement, publicity, pressure, change — when someone does the measuring.", "The regulatory absorption is traceable: disaggregated evaluation, mandated bias testing and documentation duties in the AI Act descend from the audit literature — Gender Shades is effectively cited in law.", "Keep the limitation honest: audits measure systems that exist; participation shapes ones being built; neither asks whether to build. A complete repair politics needs all three registers — measurement, voice, and veto."] },
      ],
      concepts: ["intersectionality", "algorithmic audit", "representation bias", "disaggregated evaluation"],
      discuss: ["A perfectly accurate facial recognition system is deployed for policing. Which inequality concerns remain?", "Pick a domain (hiring, credit, health). Trace how historical discrimination could enter an AI system through its data."],
    },
    quiz: [
      { q: "Gender Shades found the highest error rates for…", o: ["Lighter-skinned men", "Darker-skinned women", "All groups equally", "Children"], a: 1 },
      { q: "The disparities stemmed largely from…", o: ["Camera brands", "Unrepresentative training and benchmark datasets", "User error", "Weather conditions"], a: 1 },
      { q: "The study's 'intersectional' method means…", o: ["Testing at street intersections", "Evaluating across combined categories (skin type × gender), not single axes", "Averaging all results", "Ignoring demographics"], a: 1 },
    ] },
  { id: "s2c4", sem: 2, num: 17, title: "AI and the Environment", thumb: "🌍",
    tags: ["energy", "climate", "materiality"],
    desc: "The carbon cost of computation: training footprints, data centres, water and minerals — AI as a material industry.",
    reading: { kind: "paper", ref: "Strubell, E., Ganesh, A. & McCallum, A. (2019). 'Energy and Policy Considerations for Deep Learning in NLP', ACL 2019." },
    lec: {
      intro: "The cloud is a factory. This lecture follows AI down from the metaphor into its material base — electricity, water, minerals, land — using Strubell and colleagues' pioneering carbon accounting of NLP models, and asks who pays the environmental bill for machine intelligence.",
      sections: [
        { h: "Counting the carbon", ps: ["Strubell, Ganesh and McCallum estimated the energy and emissions of training NLP models, famously comparing one large training pipeline (with architecture search) to the lifetime emissions of several cars. The exact figures were debated, but the paper's achievement stands: it made computation visible as an environmental act and forced 'efficiency' onto the research agenda alongside accuracy.", "The headline comparison — one architecture-search pipeline emitting on the order of five cars' lifetimes — was contested by engineers as unrepresentative, and the debate itself was the achievement: emissions became a reportable, arguable quantity.", "The accounting frontier moved since: training is a one-off; inference at billions of queries daily is the recurring bill. Lifecycle accounting — chips, cooling, inference, disposal — is where honest numbers now live."] },
        { h: "The material stack", ps: ["Beyond training runs: inference at scale (billions of daily queries), data centres whose cooling consumes millions of litres of water — often in drought-prone regions — and hardware whose GPUs depend on mined minerals and geopolitically concentrated chip fabrication. AI has a geography: server farms near cheap power, extraction in the Global South, e-waste flowing back there. An environmental sociology of AI is a sociology of these supply chains.", "Trace one query's materiality: electricity from a regional grid, cooling water from a local basin, silicon from Taiwanese fabs, cobalt from Congolese mines, e-waste to Ghanaian scrapyards. The cloud touches ground on four continents.", "Infrastructure studies supplies the method: follow the cable, the pipe, the mineral. Every abstraction in computing has a postcode somewhere — and the postcodes are where environmental justice questions become concrete."] },
        { h: "Equity and the politics of green AI", ps: ["Strubell et al. also flagged a scientific-equity effect: when state-of-the-art requires millions in compute, universities and poorer countries exit the research frontier — knowledge production concentrates with the firms that own the data centres. Meanwhile 'AI for climate' promises (grid optimisation, materials discovery) must be weighed against AI-for-oil contracts and datacentre-driven demand growth. Ask of every green claim: net of what, for whom?", "The compute divide has bibliometric evidence: corporate affiliation on frontier papers rose steeply as costs exploded; academic labs shifted to studying, auditing or fine-tuning what industry releases. Who can do science changed in a decade.", "Green claims need audit discipline: a datacentre buying renewable certificates can still displace local grid capacity; efficiency gains can fund expansion. The greenwashing literature from other industries transfers without modification."] },
        { h: "Where the cloud lives", ps: ["Data centres cluster where power is cheap and policy friendly — Virginia, Ireland, increasingly Poland and the Nordics. Each siting decision allocates grid capacity, water, land and tax revenue: infrastructure geography is environmental politics.", "Ireland is the cautionary tale: datacentres approached a fifth of national electricity use, forcing connection moratoria around Dublin. Infrastructure that arrived as investment became a grid-planning crisis within years.", "Silesia's coal-to-data conversations mirror the global pattern: regions with energy infrastructure and cheap land court server farms, trading water and grid capacity for taxes and few permanent jobs. The local bargain deserves local scrutiny — everywhere."] },
        { h: "The water bill", ps: ["Cooling consumes millions of litres, often in water-stressed regions; communities from Chile to the Netherlands have protested. Water makes AI's footprint local and visible in a way carbon never was — and local opposition is becoming a real constraint.", "Disclosed figures anchor the debate: major providers report billions of litres annually, with individual campuses consuming like small towns — often in basins already stressed, because dry air is cheap to cool with evaporated water.", "Chile's rejection of a datacentre over aquifer risk, Dutch farmer protests, Arizona disclosure fights: water is where AI infrastructure meets place-based politics, because unlike carbon, a drained basin has an address and a constituency."] },
        { h: "Minerals and machines", ps: ["GPUs need lithium, cobalt, rare earths and advanced fabrication concentrated in a handful of facilities worldwide. AI's supply chain runs through mines, refineries and geopolitics — the intelligence is immaterial; its substrate is anything but.", "The chokepoints are countable: most advanced AI chips flow through one fabrication company; cobalt concentrates in one country's mines; rare-earth processing in another's refineries. Supply-chain sociology meets geopolitics at every node.", "Extractivism names the continuity: the Global South supplied cotton, then oil, now transition minerals and annotation labour — value added elsewhere, externalities retained. AI's supply chain is the newest chapter of a very old economic geography."] },
        { h: "The afterlife of hardware", ps: ["Accelerated AI buildouts shorten hardware cycles, and yesterday's servers become e-waste flowing disproportionately to the Global South. A full accounting of AI's footprint includes disposal — the part of the lifecycle furthest from the demo.", "GPU generations now turn over in two to three years under competitive pressure; decommissioned accelerators cascade to secondary markets and scrap. Basel Convention loopholes still route e-waste toward informal recycling economies.", "Agbogbloshie's burn pits process the West's electronics with lungs and open flame — documented for two decades, structurally unchanged. Any AI lifecycle assessment that stops at the loading dock is an accounting choice, not a boundary of responsibility."] },
        { h: "The efficiency trap", ps: ["Chips improve, models get leaner — and total consumption still rises, because efficiency lowers cost and multiplies use. Jevons observed this with coal in 1865; datacentre demand curves suggest the paradox transfers.", "The projections that alarm grid operators: datacentre electricity demand forecast to double within years, driven by AI buildouts — while per-query efficiency simultaneously improves. Jevons in real time, on utility spreadsheets.", "The policy implication is uncomfortable for techno-optimism: efficiency is necessary and insufficient; only caps, pricing or siting constraints bind totals. Climate policy learned this about cars and appliances; compute is next in the syllabus."] },
        { h: "Auditing the green promise", ps: ["AI for climate is real — grid balancing, materials discovery, forecasting — and so are AI-for-oil contracts and demand growth. Treat every sustainability claim as an empirical question: net effect, counterfactual, and who audited the numbers.", "Hold both files open: documented wins in grid balancing, weather forecasting and materials discovery; documented contracts optimising oil extraction and accelerating exploration. The same vendors appear in both — portfolio, not paradox.", "The evaluative discipline: demand the counterfactual (what would have happened without), the system boundary (whose emissions counted), and the auditor (who verified). Sustainability claims that survive those three questions are rare and valuable."] },
        { h: "Governing compute's footprint", ps: ["Emerging tools: mandatory energy disclosure, efficiency standards for data centres, siting rules tied to renewables, and research norms that reward efficient models. EU energy directives already require datacentre reporting — the footprint is entering the regulatory field.", "The instruments are arriving piecemeal: EU datacentre reporting duties, national siting moratoria, efficiency standards, water-disclosure fights, and research venues asking for compute budgets in submissions.", "The framing battle matters most: is compute a private input like office space, or infrastructure with public externalities like aviation? The classification decides which regulatory toolkit applies — and lobbying on exactly that question is underway."] },
      ],
      concepts: ["carbon accounting", "embodied emissions", "compute divide", "extractivism"],
      discuss: ["Should AI conferences require energy/emissions reporting the way medical journals require ethics statements?", "A datacentre wants to build near Katowice, promising jobs but drawing on the regional grid and water. Draft the sociological questions the municipality should ask."],
    },
    quiz: [
      { q: "Strubell et al. drew attention to…", o: ["AI's zero energy use", "The substantial carbon and financial cost of training large NLP models", "Solar-powered laptops", "Paper recycling"], a: 1 },
      { q: "Beyond electricity, AI's material footprint includes…", o: ["Nothing else", "Water for cooling and minerals for hardware", "Only office paper", "Ink cartridges"], a: 1 },
      { q: "An equity issue they raise is that rising compute costs…", o: ["Help small labs", "Concentrate research capacity in wealthy corporations and universities", "Are paid by users directly", "Do not exist"], a: 1 },
    ] },
  { id: "s2c5", sem: 2, num: 18, title: "AI and Healthcare — DeepMind & AlphaFold", thumb: "🧬",
    tags: ["healthcare", "AlphaFold", "science"],
    desc: "AlphaFold and the protein-folding breakthrough: AI as scientific instrument, and the sociology of who benefits from open science.",
    reading: { kind: "paper", ref: "Jumper, J. et al. (2021). 'Highly accurate protein structure prediction with AlphaFold', Nature, 596." },
    lec: {
      intro: "AlphaFold solved a fifty-year scientific grand challenge and won its creators a Nobel Prize. This lecture treats it as our best case of AI's positive potential — then applies the same sociological scrutiny we give every system: how it worked, why it was shared, and who gets to benefit.",
      sections: [
        { h: "The breakthrough", ps: ["A protein's function follows its 3D structure, but determining structures experimentally took years per protein. AlphaFold, trained on decades of publicly funded, openly shared structures in the Protein Data Bank, learned to predict structure from amino-acid sequence with near-experimental accuracy — validated at the CASP14 competition in 2020 and published in Nature in 2021.", "The problem's age measures the achievement: Anfinsen's 1972 Nobel lecture posed sequence-to-structure as chemistry's grand challenge; CASP competitions benchmarked decades of incremental progress; AlphaFold's 2020 scores ended the benchmark era.", "The 2024 chemistry Nobel to Hassabis and Jumper — a corporate AI lab — marked an institutional watershed: the prize system acknowledging that frontier science now happens inside companies. The sociology of science took note."] },
        { h: "Open science as strategy and gift", ps: ["DeepMind released predicted structures for essentially every catalogued protein — over 200 million — freely. The impact multiplied: drug discovery, enzyme design, neglected-disease research. Note the sociology of scientific infrastructure: the breakthrough was only possible because a community had spent 50 years sharing data openly; the open release both repaid that commons and bought a commercial lab immense scientific legitimacy. Openness is generosity and strategy at once.", "The dependency is worth stating precisely: fifty years of crystallographers depositing structures into the open Protein Data Bank created the training set. No commons, no AlphaFold — public science was the venture capital.", "Strategic readings coexist with generous ones: the release generated legitimacy, recruitment appeal and a moat of goodwill while the company retained drug-discovery ventures. Gift and strategy are not opposites in the sociology of science; they are usually the same act."] },
        { h: "Medical AI beyond the triumph", ps: ["Generalise carefully. Clinical AI raises questions AlphaFold mostly avoided: diagnostic systems trained on unrepresentative populations underperform for the underrepresented; 'black box' recommendations strain clinical accountability and the doctor–patient relation; and benefits follow existing access — an algorithm cannot treat a patient who cannot reach a hospital. The sociology of medical AI is the sociology of health inequality, with new instruments.", "The generalisation failures are documented: dermatology models trained on lighter skin, risk algorithms using healthcare cost as a proxy for need — famously downgrading Black patients — sepsis predictors failing when hospitals changed workflows.", "The triad question is empirical now: studies find clinicians over-ride correct AI advice and follow incorrect advice in patterned ways — automation bias with clinical stakes. Decision authority in the algorithmic clinic is being renegotiated case by case."] },
        { h: "From MYCIN to deep learning", ps: ["Expert systems diagnosed infections in the 1970s and never entered clinics — trust, liability and workflow killed them. The history warns: in medicine, the technical barrier is rarely the binding one.", "MYCIN outperformed junior clinicians on antibiotic selection in evaluations — and was never used clinically: no liability framework, no workflow fit, and physicians would not defer to a terminal. The technology worked; the institution declined.", "The lesson compounds across cases: adoption is an institutional accomplishment involving law, insurance, training and professional identity. Any medical AI forecast that models only accuracy will repeat MYCIN's surprise."] },
        { h: "The radiology test case", ps: ["Deep models match specialists on specific image tasks, and radiologists were confidently declared obsolete a decade ago. Instead the profession absorbed the tools: tasks changed, jobs did not — a recurring pattern this course keeps finding.", "The prediction is citable: a leading AI researcher suggested in 2016 that training radiologists should stop; radiology positions grew instead, with AI absorbed into triage and measurement while scan volumes rose.", "Task-versus-job analysis explains it: image classification is one task inside a role of consultation, judgment and accountability. Professions with control over their task bundles absorb tools; occupations without such control get absorbed by them."] },
        { h: "Sick data", ps: ["Medical datasets overrepresent wealthy, white, hospital-attending populations; pulse oximeters miscalibrated for darker skin previewed the problem before AI. Models trained on skewed data export clinical inequality with a veneer of precision.", "The oximeter case is the perfect precedent: a sensor calibrated on lighter skin overestimated oxygen in darker-skinned patients for decades — with treatment consequences documented during COVID. Biased instruments predate AI; AI inherits and scales them.", "The remedy has a name — representative validation — and a cost structure nobody volunteers for: recruiting diverse cohorts is slow and expensive. Regulation that mandates demographic performance reporting is how the incentive gets fixed."] },
        { h: "Three at the bedside", ps: ["The consultation now includes an algorithm: who does the patient trust, when may the doctor overrule, and who documents dissent? Medical sociology's oldest theme — authority in the clinic — acquires a third actor.", "The consent question is unresolved in most jurisdictions: must patients be told an algorithm shaped their diagnosis? Surveys show patients want disclosure; workflows rarely provide it — a gap between stated norms and running systems.", "Parsons made the doctor-patient relation a founding topic of medical sociology: asymmetric expertise stabilised by trust and role obligations. The algorithm inserts a third expertise with no role obligations at all — the stabilisation must be rebuilt."] },
        { h: "The economics of discovery", ps: ["AlphaFold accelerated the cheap part of drug development; trials, manufacturing and pricing remain slow and monopolised. Faster science does not automatically mean accessible medicine — the bottleneck is institutional, not computational.", "The pipeline numbers frame it: structure prediction compressed from years to minutes, while clinical trials still consume the decade and the billions. The rate-limiting steps are regulatory and financial, untouched by structural biology.", "Neglected-disease research is the genuine bright spot: open structures lower costs precisely where markets fail — malaria, tuberculosis, antimicrobial resistance. Whether cures reach patients still depends on manufacturing and pricing politics AlphaFold cannot fold."] },
        { h: "Global health and access", ps: ["AI screening on smartphones promises diagnostics where specialists are scarce — and risks unvalidated tools tested on populations least able to contest them. The colonial history of medical experimentation sets the standard of scrutiny required.", "Deployments multiply: tuberculosis screening from chest X-rays, diabetic retinopathy from smartphone cameras, triage chatbots in low-clinician regions. Some are validated and life-saving; others shipped with accuracy claims no local regulator could check.", "The scrutiny standard has history behind it: colonial-era trials and dumping of substandard drugs built justified distrust. Community-validated deployment — local data, local oversight, local benefit — is the bar decolonial health scholarship sets."] },
        { h: "Regulating clinical AI", ps: ["Medical AI faces device regulation — CE marking, FDA clearance — built for static instruments, now straining against models that update. Post-market surveillance becomes the frontier: approval is a moment, but a learning system is a process.", "The regulatory strain is technical and specific: device law certifies a frozen artefact; adaptive models change with updates. Agencies now experiment with change protocols — pre-approved retraining envelopes — a genuinely new regulatory object.", "Post-market surveillance becomes the main event: performance drift as populations and practices shift means approval is the start of oversight, not its end. Pharmacovigilance built this machinery for drugs; algorithmovigilance is being assembled now."] },
      ],
      concepts: ["protein structure prediction", "scientific commons", "open release", "clinical accountability"],
      discuss: ["AlphaFold was built on 50 years of publicly funded open data. What does its private owner owe the commons — and did the open release settle the debt?", "Would you accept a diagnosis from a system that outperforms doctors but cannot explain itself? What would change your answer?"],
    },
    quiz: [
      { q: "AlphaFold's breakthrough was predicting…", o: ["Stock prices", "3D protein structures from amino-acid sequences", "Weather patterns", "Election results"], a: 1 },
      { q: "Its impact on biology was amplified by…", o: ["Keeping results secret", "Openly releasing predicted structures for millions of proteins", "Selling access per protein", "Patenting all structures"], a: 1 },
      { q: "A sociological question about medical AI is…", o: ["Server colours", "How benefits, access and clinical authority are distributed", "Logo design", "Keyboard layouts"], a: 1 },
    ] },
  { id: "s2c6", sem: 2, num: 19, title: "AI and the Future of Thinking", thumb: "🧠",
    tags: ["cognition", "reading", "dependence"],
    desc: "From Google to generative AI: does outsourcing memory and now reasoning change how — and whether — we think deeply?",
    reading: { kind: "press", ref: "Carr, N. (2008). 'Is Google Making Us Stupid?', The Atlantic." },
    lec: {
      intro: "Nicholas Carr worried in 2008 that the web was reshaping his capacity for deep reading. Fifteen years later, we delegate not just memory and search but drafting, summarising and reasoning itself. This lecture asks what a society thinks like when thinking is outsourced.",
      sections: [
        { h: "Carr's worry, and its ancestry", ps: ["Carr's essay argues that the web's economics of interruption retrain the brain for skimming, eroding the sustained attention that deep reading built. He knowingly stands in an old line: Socrates feared writing would atrophy memory, and moralists feared the printing press. The pattern — every cognitive technology triggers a loss narrative — counsels humility, not dismissal: some of those losses were real, and so were the gains.", "Carr's phenomenology struck a nerve because it was testable at home: the wandering mind at page three, the itch toward the tab. His scuba diver become jet-skier metaphor gave a generation words for a felt change.", "The Phaedrus deserves its cameo: Socrates warned writing would produce the appearance of wisdom without its reality — reminders, not memory. He was partly right about the loss and entirely blind to the gain, which is the calibration every panic needs."] },
        { h: "Cognitive offloading and the extended mind", ps: ["Psychology documents the 'Google effect': we remember where information lives rather than the information itself. Philosophers Clark and Chalmers reframe this positively — tools are part of an 'extended mind', and offloading arithmetic to calculators freed capacity for higher tasks. The open question with generative AI is whether drafting and reasoning are like arithmetic (safely delegated) or like the practice that builds the very capacities education exists to create.", "Sparrow's Google-effect experiments made it empirical: participants remembered where facts were stored better than the facts, when saving was expected. Memory reorganises around its tools — transactive memory, previously studied in couples, now includes the search bar.", "Clark and Chalmers' Otto — the man whose notebook is his memory — forces the question of parity: if the notebook counts as mind, does the model? The disanalogy worth writing about: notebooks do not have engagement metrics or owners."] },
        { h: "Thinking as a social practice", ps: ["For sociology, cognition is never merely individual: it lives in institutions — schools, universities, newsrooms, courts — that certify what counts as knowledge and train people to produce it. If students generate essays they could not write, the essay stops certifying thought; if professionals verify machine drafts rather than compose, expertise itself is redefined. The 'future of thinking' is the future of these institutions, and it will be decided by policy and pedagogy, not by the technology alone.", "The certification point generalises: degrees, bylines and licences all warrant that a person can produce certain thought. When production is delegable, institutions must certify something else — judgment, verification, defence — or certify nothing.", "Historical precedent gives shape: calculation was once elite cognitive labour; calculators demoted it to a checkable step and mathematics education climbed the abstraction ladder. The open question is whether composition follows the same path or was the ladder."] },
        { h: "Every literacy had its panic", ps: ["Socrates against writing, clergy against print, parents against novels, then radio, television, calculators. Some fears were wrong, some — like what television did to political discourse — arguably right. The record demands case-by-case analysis, not reflexes.", "The inventory rewards precision: print did fragment religious authority (the panic was right about change, wrong about catastrophe); television did reshape political discourse toward image (Postman's case has aged well); calculators did not end numeracy.", "The method for your generation: specify the capacity, measure it, compare institutional adaptations. Panics fail by generalising; assessments succeed by disaggregating — which cognitive practices, for whom, under what pedagogy."] },
        { h: "What the research says", ps: ["Studies document the Google effect on memory, switching costs from interruption, and early evidence that AI assistance can reduce engagement with material — alongside findings of genuine learning gains when tools are well designed. The literature is young; certainty is premature.", "Representative findings on both ledgers: students using AI tutors with guardrails show real learning gains; students copy-pasting solutions show completion without retention; professionals report speed gains with quality flat or mixed by task.", "The moderating variable keeps appearing: engagement design. Tools that force retrieval, explanation and critique help; tools that hand over finished products hollow. The technology is a range of pedagogies, not one effect."] },
        { h: "The assessment crisis", ps: ["If a model writes a competent essay, the essay stops measuring competence. Universities split between fortification — proctored, handwritten — and redesign: oral defences, process portfolios, AI-permitted tasks graded on judgment. Assessment is where the future of thinking is being decided institutionally.", "The institutional responses are diverging measurably: some universities restored invigilated exams; others moved to oral defences and process portfolios; a few grade AI-collaboration explicitly as a skill. Natural experiments, running now, on what education certifies.", "The Sorbonne's own choices — and this course's essay-plus-presentation design — are positions in that experiment. Notice the logic: quizzes check reading, essays check argument under time, presentations check defence in person. Each is chosen for what it still measures."] },
        { h: "Expertise under delegation", ps: ["Professionals increasingly verify machine drafts rather than compose — and verification skill decays without composition practice. Aviation met this problem first: automation-induced deskilling, answered with mandatory manual practice. Knowledge work may need its equivalent.", "Aviation's file is the template: autopilot improved safety while eroding manual skills, so regulators mandated hand-flying hours and upset-recovery training after crashes revealed the decay. Deskilling was managed, not accepted.", "Professions are drafting equivalents: coding interviews without assistants, medical training with AI-off rotations, legal education debating first-draft rules. The design question is which practice must stay manual to keep the verifier competent."] },
        { h: "Thinking with machines", ps: ["The strongest human-AI results come from complementarity: the machine generates breadth, the human supplies judgment, taste and responsibility. Hybrid configurations outperform either alone — but only when the human stays genuinely in the loop.", "The complementarity evidence has structure: gains concentrate where humans supply what models lack — ground truth, stakes, taste — and evaporate where humans rubber-stamp. Centaur chess died when engines outgrew human input; most knowledge work has not reached that point.", "The design implication for your own workflow: use the model where you can evaluate its output, avoid it where you cannot, and keep a deliberate practice channel where you work unaided. That policy is personal — and it is also what institutions must scale."] },
        { h: "Epistemic dependence, socialised", ps: ["We already outsource cognition — to colleagues, references, institutions; no scholar verifies everything personally. The question is whether AI dependence resembles trusting a library or trusting a rumour: what distinguishes them is institutional warrant, and AI currently has little.", "The library-versus-rumour distinction unpacks into institutions: libraries have provenance, correction procedures and accountable custodians; rumours have virality. Current models cite unevenly, correct opaquely and answer to shareholders — closer to a confident acquaintance than either.", "The trajectory is unwritten: provenance standards, citation infrastructure and audited training could librarianise the model; engagement optimisation would rumourise it. Which path wins is a governance outcome, not a technical fate — the course's recurring chord."] },
        { h: "Cultivating attention deliberately", ps: ["If deep focus no longer occurs by default, it must be built: reading regimes, tool-free spaces, pedagogy that rewards slowness. Attention becomes a practice — something communities protect on purpose, as this course has tried to model.", "Existing practices to study, not romanticise: monastic reading rules, deep-work protocols, phone-free schools reporting attention rebounds, digital sabbath movements. Each is a community deciding attention is worth institutional protection.", "The stratification warning from semester one applies: if deep attention becomes a boutique practice, it becomes a class marker. Public pedagogy of attention — schools, libraries, universities — is the egalitarian counterweight, and it needs defending in budgets."] },
      ],
      concepts: ["deep reading", "cognitive offloading", "extended mind", "epistemic institutions"],
      discuss: ["Which of your own cognitive tasks have you delegated to AI this year? What, honestly, has it changed?", "Should universities redesign assessment around AI (open use, oral defence) or against it (handwritten exams)? Argue one side."],
    },
    quiz: [
      { q: "Carr's central worry is that the web reshapes…", o: ["Our eyesight", "Capacities for sustained, deep reading and concentration", "Typing speed", "Spelling only"], a: 1 },
      { q: "The concept of 'cognitive offloading' describes…", o: ["Forgetting on purpose", "Delegating mental tasks (memory, calculation, now writing) to external tools", "Sleeping more", "Reading aloud"], a: 1 },
      { q: "A balanced sociological view holds that media technologies…", o: ["Determine thought directly", "Reconfigure cognitive practices within social contexts, with gains and losses", "Have no cognitive effects", "Only affect children"], a: 1 },
    ] },
  { id: "s2c7", sem: 2, num: 20, title: "Digital Sovereignty — Europe, China, US", thumb: "🌐",
    tags: ["geopolitics", "regulation", "sovereignty"],
    desc: "Three regulatory empires: the Brussels Effect, Chinese state-platform coordination, and American market power.",
    reading: { kind: "paper", ref: "Bradford, A. (2020). The Brussels Effect: How the European Union Rules the World, ch. 1. Oxford University Press." },
    lec: {
      intro: "Who rules the digital world? This lecture maps three competing models — American market power, Chinese state coordination, European regulatory power — and examines Bradford's claim that the EU, without a single tech giant, nonetheless writes the rules everyone follows.",
      sections: [
        { h: "The Brussels Effect", ps: ["Bradford's mechanism: the EU's market is too large to ignore; global firms comply with its strict standards; and because splitting product lines is costly, they often apply EU standards worldwide (de facto), while other states copy EU law (de jure). GDPR is the flagship case — cookie banners in Katowice, California and Kenya alike. Regulatory capacity, not tech ownership, becomes a form of power.", "Bradford specifies five conditions for the effect: market size, regulatory capacity, strict standards, inelastic targets (you cannot move the consumer), and non-divisibility (splitting product lines costs more than complying globally). GDPR met all five; not every EU rule does.", "The mechanism's elegance is that it needs no coercion: firms globalise the strictest standard voluntarily because uniformity is cheap. Regulatory power without gunboats — a genuinely novel form of international influence, and Europe's principal one."] },
        { h: "Three models, three social contracts", ps: ["The stylised triad: the US model is market-driven — innovation first, sectoral regulation, First Amendment constraints; the Chinese model is state-driven — platforms enrolled in governance, data as sovereign resource, from the social credit experiments to the 2021 platform crackdown; the EU model is rights-driven — dignity, privacy and competition law as the frame. Each encodes a different settlement between state, market and citizen; each exports that settlement with its technology and its rules.", "The triad is a teaching simplification — say so in essays: American states regulate sectorally and sue vigorously; China's rules on recommendation algorithms are in ways stricter than Europe's; the EU subsidises industry like the others. Ideal types, not photographs.", "Still the ideal types predict behaviour: where a US firm meets friction it litigates, a Chinese platform petitions the ministry, a European one hires compliance counsel. Corporate strategy is the fingerprint of the governing social contract."] },
        { h: "Sovereignty and its discontents", ps: ["'Digital sovereignty' — a polity's capacity to control its digital infrastructure, data and rules — is invoked by Brussels (cloud projects like Gaia-X, chip acts), by Beijing (cyber-sovereignty), and by countries in the Global South facing 'data colonialism': extraction of their data by foreign platforms under foreign law. Critics warn sovereignty talk can also dress up protectionism and censorship. The analytical task is to ask, each time: sovereignty for whom, against whom?", "The term's users diverge tellingly: Brussels means regulatory autonomy and cloud independence; Beijing means territorial control of information; Delhi means indigenous digital infrastructure; authoritarian borrowers mean censorship with better vocabulary.", "The analytic discipline: for every sovereignty claim, identify the capacity sought (rules, infrastructure, data), the actor empowered (state, citizens, national champions) and the freedom constrained. The same word does opposite political work in different mouths."] },
        { h: "GDPR, the test case", ps: ["The 2016 regulation exported itself exactly as Bradford predicts: global privacy policies, copycat laws on several continents. Its limits instruct too — under-enforcement, consent fatigue — showing that writing rules and governing with them are different capacities.", "The de jure trail is documented: privacy statutes on several continents borrow GDPR's architecture — lawful bases, subject rights, supervisory authorities. Brazil's LGPD reads in places like a translation.", "The enforcement ledger tempers the triumph: headline fines against tech giants took years through a bottlenecked Irish authority; consent banners became compliance theatre. A law can conquer statute books and still struggle to govern — capacity, again, is the variable."] },
        { h: "The Chinese stack", ps: ["China pairs industrial policy with governance experiments: recommendation-algorithm registration, generative-AI rules, data-export controls, platform crackdowns. The model treats digital infrastructure as sovereign territory — and exports both technology and governance style along the Digital Silk Road.", "The regulatory toolkit is precise and underdiscussed: algorithm registry filings, synthetic-media labelling rules from 2023, security reviews for data export, and the 2021 crackdown that erased billions in platform value in weeks. Capability to act is not in question.", "The export dimension compounds it: smart-city packages, surveillance systems and connectivity infrastructure travel with financing and training. Technology transfer is governance transfer — the standards embedded in the hardware arrive with it."] },
        { h: "The American turn", ps: ["Washington long chose permissionless innovation, then rediscovered power: antitrust suits against the giants, executive action on AI, chip export controls. The US model now mixes market faith with national-security industrial policy — less a doctrine than a contest.", "The docket tells the story: antitrust suits against the search and social giants, chip export controls tightening through successive rules, executive orders on AI safety issued and revised with administrations. Policy volatility is itself the American pattern.", "The structural constant beneath the volatility: First Amendment jurisprudence limits speech regulation, federalism fragments privacy law, and national-security framing unlocks what consumer-protection framing cannot. Institutions channel the turn."] },
        { h: "The chip war", ps: ["Semiconductors became the choke point: export bans on advanced GPUs, subsidies for domestic fabs, one Taiwanese firm at the centre of the world economy. Compute sovereignty is the hardest kind — you cannot legislate a fabrication plant into existence.", "The dependencies are quantifiable: the most advanced logic chips come overwhelmingly from one company on one island; the lithography machines that make them from one Dutch firm. Two chokepoints, both inside alliance politics.", "Export controls on advanced GPUs to China — tightened repeatedly — constitute industrial policy by denial. The gamble is explicit: slow a rival's frontier AI at the cost of accelerating its self-sufficiency drive. Historians of technology embargoes counsel humility."] },
        { h: "Clouds and dependence", ps: ["European governments run on American clouds; sovereignty projects like Gaia-X struggle against convenience and scale. Dependence on foreign infrastructure is the quiet fact beneath sovereignty rhetoric — jurisdiction follows the server.", "The market shares state the fact: three American providers host the large majority of European cloud workloads, including government services. Sovereign-cloud initiatives keep launching and keep partnering with the very hyperscalers they were meant to replace.", "Legal exposure makes dependence concrete: the American CLOUD Act reaches data held by US firms abroad, colliding with GDPR — the Schrems litigation cycle is this collision in court form. Jurisdiction follows the server; the server is in Virginia."] },
        { h: "Data colonialism", ps: ["Couldry and Mejias name the pattern: platforms extract data from the Global South under foreign law, process it into value elsewhere, and sell services back. Digital non-alignment movements — India's public stack, African data localisation — are the counter-politics.", "The concept's precision matters: not a metaphor but a claimed structural repetition — appropriation of a resource (life as data) rationalised as progress, with legal infrastructure (terms of service) playing the role treaties once did.", "The counter-movements are institutional, not rhetorical: India's public digital stack, African Union data-policy frameworks, localisation laws, South-South cloud projects. Whether they escape dependence or reproduce it domestically is an open empirical question — watch it."] },
        { h: "Splinternet or interoperability", ps: ["Scenarios diverge: hardening blocs with incompatible rules, or negotiated interoperability through adequacy decisions and treaties. The internet was never ungoverned — the question was always whose governance, and the answer is becoming plural.", "Fragmentation is already measurable: services geo-blocked over GDPR, China's separate platform universe, Russia's sovereign-internet experiments, age-verification walls rising. The single network is legal fiction masking regulatory patchwork.", "The middle path has machinery: adequacy decisions, standards bodies, trade chapters on data flows, mutual-recognition agreements. Boring instruments, decisive stakes — the shape of the global information order is being negotiated in exactly these committee rooms."] },
      ],
      concepts: ["Brussels Effect", "de facto vs de jure", "digital sovereignty", "data colonialism"],
      discuss: ["Poland and France are both EU members. Does the Brussels Effect serve their interests identically? Where might they diverge?", "Is 'digital sovereignty' compatible with an open internet, or are they structurally at odds?"],
    },
    quiz: [
      { q: "The 'Brussels Effect' describes how…", o: ["Belgium hosts servers", "EU rules become de facto global standards via market mechanisms", "Europe bans technology", "The UN sets tech law"], a: 1 },
      { q: "'Digital sovereignty' broadly refers to…", o: ["Owning a domain name", "A polity's capacity to control its digital infrastructure, data and rules", "Free wifi programmes", "National emoji sets"], a: 1 },
      { q: "The US, EU and China models are often contrasted as…", o: ["Identical", "Market-driven vs rights/regulation-driven vs state-driven", "All state-driven", "All rights-driven"], a: 1 },
    ] },
  { id: "s2c8", sem: 2, num: 21, title: "AI and Ethics", thumb: "🧭",
    tags: ["ethics", "principles", "governance"],
    desc: "84 ethics guidelines, five converging principles — and the gap between declaring values and changing practice.",
    reading: { kind: "paper", ref: "Jobin, A., Ienca, M. & Vayena, E. (2019). 'The global landscape of AI ethics guidelines', Nature Machine Intelligence, 1." },
    lec: {
      intro: "By 2019, governments, firms and NGOs had produced dozens of AI ethics charters. Jobin, Ienca and Vayena read all 84 of them. This lecture examines what they found — remarkable convergence on principles, deep divergence beneath — and asks the sociologist's question: what work do ethics documents actually do?",
      sections: [
        { h: "Convergence on five principles", ps: ["The corpus converges on transparency, justice and fairness, non-maleficence, responsibility, and privacy — with beneficence, autonomy, trust, sustainability and dignity trailing. On the surface, a global moral consensus about AI. The authors immediately complicate it: convergence on words is not convergence on meanings.", "The corpus itself tells a story: guidelines exploded between 2016 and 2019 — companies, states, churches, consultancies — a gold rush to occupy the normative ground before law arrived. Timing is evidence of function.", "Convergence has a selection explanation: abstract principles are what survives negotiation among divergent interests. Transparency offends no one until operationalised — which is precisely why operationalisation is where the real fights were deferred."] },
        { h: "Divergence beneath the words", ps: ["'Fairness' means equal error rates to one author, non-discrimination law to another, distributive justice to a third — and some formal fairness definitions are mathematically incompatible. Documents also diverge on who must act (developer, deployer, state) and how principles are enforced (almost never specified). And the map has blank spaces: guidelines came overwhelmingly from the US and Europe; most of the world's populations were written about, not writing.", "The fairness example runs deep, as the inequality class showed: incompatible formal definitions, each favouring different parties. A guideline endorsing fairness without choosing has endorsed a word, not a policy.", "The geography finding deserves numbers: the vast majority of documents originated in North America, Europe and East Asia; Africa and Latin America were nearly absent as authors. Global AI ethics was, textually, a regional product with global pretensions."] },
        { h: "Ethics washing and the sociology of soft law", ps: ["Critics coined 'ethics washing': voluntary principles deployed to signal virtue and preempt binding regulation — Google's AI ethics board lasted one week; Gebru's exit from Google showed the limits of internal ethics under commercial pressure. Yet soft law is not nothing: principles create vocabularies activists can invoke, benchmarks journalists can audit against, and drafts regulators later harden (the EU AI Act absorbed much of this corpus). Ethics documents are moves in a power struggle — read them that way.", "The one-week ethics board is the emblem case: announced with fanfare, dissolved amid controversy over membership before its first meeting. Institutional theatre has never had a cleaner exhibit.", "Yet the soft-law defence has receipts too: AI Act negotiators drew vocabulary and structure from the guideline corpus; activists cite corporate principles back at their authors in shareholder actions. Documents are ammunition — for whoever picks them up."] },
        { h: "The principlist template", ps: ["AI ethics borrowed its method from medical ethics — principles distilled from consensus. But medicine has licensing boards, malpractice law and professional oaths to enforce its principles; AI ethics imported the vocabulary without the enforcement machinery.", "The borrowed principles are traceable: beneficence, non-maleficence, autonomy, justice — Beauchamp and Childress's medical quartet — appear throughout the corpus with explicability bolted on. Intellectual genealogy as copy-paste.", "The transplant missed the organs: medical principlism works because institutions metabolise it — ethics committees with veto power, licensure, malpractice liability. Principles without institutions are prose. That gap defines the field's next decade."] },
        { h: "Who writes the rules", ps: ["Map the authors: firms drafting their own principles, governments signalling readiness, professional bodies claiming jurisdiction, NGOs demanding rights. Each document is positioned — reading guidelines as moves by interested actors is basic sociology of knowledge.", "Authorship correlates with content, measurably: corporate documents favour self-regulation and innovation language; civil-society documents demand enforcement and rights; governmental ones split by region. Position predicts prose.", "Mannheim's sociology of knowledge supplies the frame: standpoint shapes what problems are visible and which solutions thinkable. Reading a guideline without asking who benefits from its silences is reading half the document."] },
        { h: "Ethics in the pipeline", ps: ["Operationalisation means checklists, model cards, review boards, impact assessments — ethics as process. The risk is ritualism: forms completed, boxes ticked, launches unchanged. The test of any process is what it has ever stopped.", "The instruments are real and inspectable: model cards documenting intended use, datasheets for datasets, internal review boards, red-team reports. Some have stopped launches — those cases are just rarely publicised, which is itself data.", "The ritualism test is operational: ask practitioners what the process has ever changed. Organisational sociology predicts decoupling — formal structure for legitimacy, informal practice for production — and finds it; the interesting cases are where coupling actually holds."] },
        { h: "The Gebru affair", ps: ["Google pushed out the co-author of Stochastic Parrots after a dispute over that very paper — the clearest natural experiment in what happens when internal ethics collides with product strategy. Ethics labour inside firms is real, and structurally fragile.", "The sequence bears retelling: a peer-reviewed critique, a demand to retract or remove names, a contested exit, a solidarity letter with thousands of signatures, and the co-lead following her out months later. Internal ethics met product priorities and lost publicly.", "The aftermath built institutions: independent research organisations founded by the exiled, funders redirecting money outside firms, and a durable lesson in the field — critical AI research needs bases the criticised cannot defund."] },
        { h: "Other ethical traditions", ps: ["Feminist, decolonial and care-ethics approaches reject the view from nowhere: they start from situated experience, relationships and power. Participatory design — affected communities shaping systems — turns ethics from checklist into procedure.", "Concrete methodological differences: care ethics starts from relations and dependencies, not autonomous choosers; decolonial approaches ask whose land, labour and language the system runs on; feminist standpoint work centres the most affected as the best-placed knowers.", "Participatory design has case studies with outcomes: co-designed welfare interfaces reducing wrongful sanctions, community review of policing tech leading to cancellations. Different inputs produce different systems — ethics as procedure has empirical teeth."] },
        { h: "From soft to hard", ps: ["Trace principles hardening into law: transparency became the AI Act's labelling duties; fairness became bias-testing obligations; accountability became conformity assessment. Soft law is often law in rehearsal — which is why the fights over wording were always worth having.", "The hardening pipeline is standard across domains: principles, then technical standards, then procurement conditions, then statute. Environmental and privacy law both travelled it; AI ethics is midway through, which explains the current hybrid mess.", "Strategic implication for actors: whoever writes the soft draft shapes the hard version — hence the guideline gold rush, and hence civil society's insistence on being in standards bodies now. The boring meetings are the constitutional convention."] },
        { h: "A reader's toolkit", ps: ["Interrogate any ethics document with five questions: who wrote it, who is bound, what is operationalised, what is enforced, who can appeal. Most documents fail at question four — and now you know precisely where to look.", "Run the five questions on a real document as practice — a tech firm's AI principles, a ministry charter. Most answer who wrote it gloriously and who can appeal not at all. The asymmetry is the finding.", "Carry the toolkit past AI: ESG codes, university charters, platform community standards. Soft normative documents govern more of life each year; reading them structurally is literacy for the regulated — which is everyone."] },
      ],
      concepts: ["principlism", "fairness definitions", "ethics washing", "soft law"],
      discuss: ["Find one AI principle ('fairness', 'transparency') and give two incompatible operationalisations of it.", "A company publishes an ethics charter but ships an invasive product. Is the charter worthless, or does it create leverage? For whom?"],
    },
    quiz: [
      { q: "Jobin et al. found global convergence around principles like…", o: ["Speed and scale", "Transparency, justice, non-maleficence, responsibility and privacy", "Secrecy and profit", "Novelty and disruption"], a: 1 },
      { q: "A key divergence they identified concerns…", o: ["Font sizes in reports", "How principles are interpreted, prioritised and implemented", "The number of authors", "Publication venues"], a: 1 },
      { q: "'Ethics washing' refers to…", o: ["Cleaning data", "Using ethics language to deflect binding regulation without changing practice", "Teaching ethics courses", "Peer review"], a: 1 },
    ] },
  { id: "s2c9", sem: 2, num: 22, title: "AI and Regulation — The EU AI Act", thumb: "📜",
    tags: ["regulation", "EU AI Act", "risk"],
    desc: "The world's first comprehensive AI law: risk tiers, banned practices, and the politics of writing rules for moving targets.",
    reading: { kind: "press", ref: "Reuters (2024). 'EU AI Act: world-first rules on artificial intelligence enter into force' — explainer coverage." },
    lec: {
      intro: "In 2024 the EU AI Act entered into force: the first comprehensive attempt to regulate AI as such. This lecture explains its architecture, follows the lobbying battles that shaped it, and uses it to think about a general problem — how slow law governs fast technology.",
      sections: [
        { h: "The risk pyramid", ps: ["The Act sorts AI uses into tiers. Unacceptable risk — banned: social scoring by public authorities, certain manipulative and exploitative systems, some biometric practices. High risk — heavily regulated: AI in hiring, credit, education, essential services, law enforcement, with obligations of data governance, documentation, human oversight and conformity assessment. Limited risk carries transparency duties (disclose the chatbot, label deepfakes); minimal risk is untouched. Regulate the use, not the technology — that is the design philosophy.", "The design philosophy has a name in regulatory theory — technology-neutral, use-based regulation — chosen so the law survives technical change. A model is not high-risk; deploying it to score job applicants is. The lawyer asks what it does, not what it is.", "The classifications are political settlements, not measurements: predictive policing sits in high-risk while some emotion recognition was banned and other biometrics survived with exceptions. Each line was lobbied over — the pyramid is a fossilised negotiation."] },
        { h: "The GPAI fight and the lobbying field", ps: ["Generative AI broke the tidy use-based scheme mid-negotiation: a general-purpose model is not a 'use'. The compromise created a separate regime for general-purpose AI, with heavier duties above a compute threshold. Around this, an intense lobbying field: US firms and European champions (Mistral, Aleph Alpha) pressing to lighten obligations, civil society pushing to close loopholes — with France and Germany at times siding with their startups. A regulation is a photograph of a power struggle.", "The lobbying record is unusually documented: registered meetings, leaked position papers, member states intervening for national champions in the final trilogues. The compute threshold for heavier duties was itself a negotiated number — governance by FLOP count.", "The startup-versus-incumbent dynamic deserves attention: heavy compliance can entrench firms with legal departments while burdening challengers — a regulatory-moat critique made simultaneously by libertarians and some progressives. Strange coalitions mark genuine dilemmas."] },
        { h: "The pacing problem and Brussels' bet", ps: ["Technology iterates in months; legislation takes years and this one phases in until 2027 — the 'pacing problem'. The Act answers with delegated acts, an AI Office, and technical standards to be filled in later: law as framework, details outsourced to standard-setting (itself dominated by industry engineers — a sociological chokepoint). The strategic bet is the Brussels Effect: that compliance with EU rules becomes, once again, the world's default.", "The Act's answer to pacing is institutional delegation: an AI Office monitoring frontier models, scientific panels, delegated acts amendable without reopening parliament, and harmonised standards drafted by technical committees. Law as scaffolding, not statue.", "The standards chokepoint is the insider knowledge worth having: CEN-CENELEC committees translating principles into testable requirements are populated largely by industry engineers — civil society lacks the funded seats. The fine print of AI rights is being written there."] },
        { h: "How the Act was built", ps: ["Proposed in 2021, amended through the generative-AI shock, agreed in trilogue in 2023, in force from 2024 with obligations phasing to 2027. The timeline itself teaches: regulation is negotiation under technological acceleration.", "The ChatGPT shock is visible in the drafts: the 2021 proposal barely contemplated general-purpose models; by 2023 they had their own chapter. A consumer product launch redrew a statute mid-negotiation — technological events as legislative actors.", "France and Germany's late push to soften GPAI rules for their champions — Mistral, Aleph Alpha — nearly derailed the trilogue. The episode complicates the EU-versus-industry story: member-state industrial policy runs inside the regulatory machine."] },
        { h: "Inside the high-risk regime", ps: ["High-risk providers must implement risk management, data governance, logging, documentation, human oversight and accuracy standards, then pass conformity assessment and register publicly. This is product-safety law adapted to software that learns — paperwork as governance.", "Walk one example through: an AI hiring tool needs documented training data governance, bias testing, logging, human oversight design, registration in the EU database, and conformity assessment before sale. Compliance is a product-development phase now.", "Product-safety law is the deliberate template — CE marking for algorithms. The transplant's friction: toasters do not learn after certification. The post-market monitoring duties are where the template stretches to fit adaptive systems."] },
        { h: "Teeth", ps: ["Penalties reach seven percent of global turnover — above GDPR's ceiling. Enforcement splits between national authorities and the new AI Office for general-purpose models; the open question, learned from GDPR, is whether regulators get the budgets and expertise to bite.", "The GDPR lesson is quantified: years of under-resourced authorities, forum shopping through Ireland, and fines arriving long after violations. The Act's drafters responded with the centralised AI Office for the biggest models — institutional learning in real time.", "Enforcement sociology predicts the pattern: early symbolic cases against visible targets, negotiated compliance for the rest, and outcomes tracking regulator budgets more than statutory maximums. Watch appropriations, not just articles."] },
        { h: "Three regulatory styles", ps: ["Compare instruments: the EU's comprehensive statute, American executive action and sectoral enforcement, Chinese targeted rules per technology with registration duties. Three politics of technology in one policy field — a comparative sociology essay writing itself.", "The comparative essay writes itself with cases: the same recommender system faces risk documentation in Europe, FTC deception standards in America, and registry filing plus content duties in China. One artefact, three legal lives.", "Regime competition is the dynamic to watch: firms threaten jurisdiction shopping, states court them with lighter rules, and the Brussels Effect pulls the other way. Whether AI law converges upward or races downward is the decade's institutional experiment."] },
        { h: "The compliance industry", ps: ["The Act births a market: auditors, standards consultants, evaluation firms, compliance software. Regulation always creates its intermediaries; watch whether they become guardians of the public interest or a moat incumbents can afford and startups cannot.", "The market formed before the obligations bound: AI-governance platforms, audit startups, big-four practices, certification schemes — selling readiness for rules still being written. Regulation is a business opportunity first, a constraint second.", "The capture risk has an accounting precedent: auditors paid by the audited famously softened; the Act's notified-body model imports the same structure. Professional independence rules — rotation, liability, public oversight — are the known antidotes, unevenly applied."] },
        { h: "Critiques from both flanks", ps: ["Industry warns of innovation flight and compliance costs; civil society counts the loopholes — national-security carve-outs, self-assessment, weakened biometric bans. That both sides object is not proof of balance; evaluate each critique on evidence.", "The innovation critique's evidence: European AI investment lags American by an order of magnitude, and founders cite regulatory uncertainty — though causation is contested, since the gap predates the Act and tracks capital markets too.", "The rights critique's evidence: exemptions for national security and migration contexts where automated systems already harm; self-assessment for most high-risk providers; biometric bans narrowed in trilogue. The loopholes map onto the least powerful affected groups — a pattern, not an accident."] },
        { h: "Living with the Act", ps: ["For practitioners: classify your system, document your data, plan oversight, keep logs. For citizens: new rights to explanation and complaint. For sociologists: a decade-long natural experiment in whether law can steer a general-purpose technology — observe it closely.", "For the exam, hold the timeline: bans applied from 2025, GPAI duties phasing, high-risk obligations landing through 2026-27. The Act is not an event but a schedule — analyses dated to one moment will age.", "The meta-lesson generalises beyond Europe: regulating a general-purpose technology means regulating uses, building institutions, and accepting permanent revision. Whether this succeeds will inform how the world governs whatever arrives after AI — the stakes exceed the statute."] },
      ],
      concepts: ["risk-based regulation", "general-purpose AI", "conformity assessment", "pacing problem"],
      discuss: ["Pick one AI system you use. Locate it in the Act's risk pyramid and justify the placement.", "Standards bodies fill in the Act's technical details. Who sits in those rooms, and does it matter democratically?"],
    },
    quiz: [
      { q: "The EU AI Act organises obligations primarily by…", o: ["Company size only", "Risk level of the AI use case (unacceptable, high, limited, minimal)", "Alphabetical order", "Country of origin"], a: 1 },
      { q: "Practices classed as 'unacceptable risk' include…", o: ["Spam filters", "Social scoring by public authorities and certain manipulative systems", "Spell checkers", "Video games"], a: 1 },
      { q: "A recurring critique of tech regulation is the 'pacing problem':…", o: ["Laws are too fast", "Law-making moves slower than technological change", "Judges type slowly", "Rules expire yearly"], a: 1 },
    ] },
  { id: "s2c10", sem: 2, num: 23, title: "Digital Culture and Identity", thumb: "🎭",
    tags: ["identity", "intimacy", "self"],
    desc: "Alone together: sociable robots, curated selves, and how connectivity reshapes intimacy, solitude and identity work.",
    reading: { kind: "paper", ref: "Turkle, S. (2011). Alone Together: Why We Expect More from Technology and Less from Each Other, introduction. Basic Books." },
    lec: {
      intro: "Sherry Turkle spent thirty years studying people and their machines — and changed her mind. Once optimistic about identity play online, she now diagnoses a culture that expects more from technology and less from each other. With AI companions now mainstream, her questions have sharpened.",
      sections: [
        { h: "Alone together", ps: ["Turkle's phrase names a paradox of connectivity: physically present, attentionally elsewhere — families at dinner on separate screens, friends 'together' while each manages other conversations. Constant connection, she argues, erodes two capacities at once: full-attention conversation, and solitude — the ability to be alone without being lonely, which she sees as the precondition of real intimacy.", "Her fieldwork vignettes carry the argument: teenagers texting apologies they cannot say aloud, executives attending meetings while emailing through them, families negotiating phone-free dinners like treaties. The data is intimate and recognisable.", "The two eroded capacities connect causally in her account: without solitude, people bring hunger rather than presence to relationships — connection as a fix for an incapacity connection created. Whether the loop holds empirically is a live research question; its plausibility is why the book endured."] },
        { h: "The performed self", ps: ["Goffman described identity as performance; platforms industrialise the stage. Profiles are edited selves, curated toward measurable approval — Turkle's teens redraft texts and captions the way earlier generations drafted letters, but now for a scoring audience. Identity work becomes continuous, quantified and anxious. The sociological point is not vanity but structure: when the archive is permanent and the audience collapsed, spontaneity becomes a risk.", "The quantification layer is what Goffman lacked: front-stage performance now returns scores — likes, views, streaks — and the scores feed the anxiety research on contingent self-worth. Performance with a leaderboard is a different psychological game.", "The permanence layer compounds it: the drunken photo, the abandoned opinion, the awkward phase — all archived, searchable, resurfaceable. Identity experimentation, which developmental psychology considers adolescence's job, now happens on the record."] },
        { h: "Artificial intimacy", ps: ["Turkle's deepest worry concerned 'sociable robots' that perform care without caring — and the AI-companion industry has made it empirical: millions now converse daily with chatbot friends and partners engineered, attention-economy style, for retention. The questions this raises are genuinely open: solace for the isolated, or a simulation that further deskills human relation? What is lost, if anything, when the other in the relationship cannot be disappointed, bored, or hurt?", "The empirical scale surprised even Turkle's readers: companion apps report tens of millions of users; surveys find substantial minorities describing their bot as a close relationship; grief at model changes is documented in user communities.", "The design question she poses cuts deepest: a companion that cannot be disappointed teaches a frictionless intimacy no human can match — potentially deskilling users for the friction that real relation requires. Solace and simulation may be the same product with different users."] },
        { h: "From identity play to real names", ps: ["Early internet culture celebrated anonymous identity experimentation — Turkle herself documented it hopefully in the 1990s. Platform culture reversed the settlement: real names, persistent profiles, one authenticated self, optimised for advertisers. Identity online has a political economy.", "The commercial logic of the reversal is explicit in the record: advertisers wanted persistent, authentic identities to target; real-name policies were monetisation infrastructure dressed as civility. The 1990s cyberself lost to the sales funnel.", "The costs of persistent identity fall unevenly: activists, abuse survivors and queer teenagers exploring identity all documented harms from enforced authenticity. Pseudonymity debates are safety debates — the stakes were never merely philosophical."] },
        { h: "The approval loop", ps: ["Likes quantify regard, and adolescent self-esteem research shows contingent self-worth tracking the metrics. The sociological point precedes the psychology: when approval is counted, the self becomes a performance indicator — Goffman with a dashboard.", "The experimental evidence sharpened the debate: platforms trialling hidden like counts found modest wellbeing effects and reduced posting — engagement, again, won the trade-off in most markets. The metric survived its own harm review.", "Meanwhile a defensive vernacular evolved: finstas for the real self, close-friends stories, private accounts — users rebuilding backstage spaces inside architectures designed to abolish them. Goffman's dramaturgy proved more durable than the design against it."] },
        { h: "Intimacy, platformed", ps: ["Dating apps now mediate a large share of new couples: partner choice via swipe interfaces, matching algorithms and market metaphors. Efficiency rises; so do complaints of commodification — intimacy absorbing the logic of the catalogue.", "The matching data is sociologically rich: apps now initiate a plurality of new couples in several countries; research documents racialised preference patterns amplified by filtering; the swipe grammar teaches evaluation at portfolio speed.", "Classical concerns translate directly: Illouz analysed how capitalism colonised emotion; the dating market realises the metaphor as literal interface. Whether efficiency in matching costs depth in attaching is the empirical question her framework predicts."] },
        { h: "The companion industry", ps: ["AI companions count users in the tens of millions, marketed explicitly against loneliness. Engagement techniques from the attention economy apply to affection itself — retention curves for relationships, premium tiers for romance.", "The business model deserves scrutiny alongside the psychology: subscription tiers for romantic features, engagement-optimised conversation, retention dashboards. Loneliness is a market with recurring revenue — the attention economy's most intimate product line.", "Regulatory attention is beginning: proposals to restrict companion marketing to minors, disclosure duties, dependency-design audits. The gambling and tobacco playbooks are being consulted — the classification fight (wellness tool or dependency product) will decide which applies."] },
        { h: "Parasocial machines", ps: ["Fans once bonded one-way with celebrities; chatbots close the loop by answering back. When one companion app abruptly changed its models, users publicly grieved — evidence these bonds are real in their consequences, whatever their ontology.", "The grief episodes are the crucial data: when one app abruptly lobotomised romantic features under regulatory pressure, forums filled with loss language indistinguishable from bereavement. The relationship was one-sided and the mourning was not.", "Sociology should resist the cheap laugh: parasocial bonds with human celebrities are old and well-theorised; the machine variant adds responsiveness. Taking users seriously while questioning the industry serving them — that double stance is the discipline's job here."] },
        { h: "Digital afterlives", ps: ["Griefbots resurrect the dead from message archives; platforms hold more profiles of the deceased each year. Mourning, memory and the persistence of the self — sociology's oldest rituals — are being quietly re-engineered without much public decision.", "The numbers force the issue: platforms will host more dead profiles than living users within decades on current trends; memorialisation policies are improvised; griefbot startups sell continued conversation with the deceased from chat archives.", "Every society ritualises death; ours is delegating parts of it to terms-of-service teams. Who owns the dead's data, who may resurrect their voice, when remembrance becomes retention revenue — mortuary sociology has a digital chapter now."] },
        { h: "Choosing presence", ps: ["Turkle's remedy is unfashionable and concrete: protected conversation, device-free rituals, tolerated boredom, reclaimed solitude. Not nostalgia — a design brief, for lives and for products, in which attention to another person is the scarce and honoured act.", "Turkle's proposals are testable, and some have been tested: device-free dinners correlate with conversation quality in observational studies; schools restricting phones report social rebound effects; workplaces with communication norms report attention gains.", "Frame it structurally to avoid moralism: presence is a commons that individual willpower cannot defend against engineered capture — the semester-one lesson applied to intimacy. Protecting it is collective design work: households, schools, workplaces, and eventually product law."] },
      ],
      concepts: ["alone together", "solitude vs loneliness", "performed self", "artificial intimacy"],
      discuss: ["Turkle claims solitude is a capacity that connectivity erodes. Is your generation's experience evidence for or against her?", "Should AI companions marketed to lonely users be regulated like other dependency-forming products? Where is the line?"],
    },
    quiz: [
      { q: "Turkle's phrase 'alone together' captures…", o: ["Rural isolation", "Being physically together while attentionally elsewhere via devices", "Group meditation", "Shared housing"], a: 1 },
      { q: "She argues constant connectivity can erode…", o: ["Battery life", "The capacity for solitude and full-attention conversation", "Typing skills", "Wifi signals"], a: 1 },
      { q: "Identity online, sociologically, is best seen as…", o: ["Fixed at birth", "Performed and curated across contexts and platforms", "Random", "Determined by hardware"], a: 1 },
    ] },
  { id: "s2c11", sem: 2, num: 24, title: "Media and Society — Voice, Truth and Trust", thumb: "📰",
    tags: ["media", "misinformation", "trust"],
    desc: "Synthetic media, deepfakes and institutional trust: how generative AI stresses the social infrastructure of shared truth.",
    reading: { kind: "paper", ref: "Chesney, R. & Citron, D. (2019). 'Deep Fakes: A Looming Challenge for Privacy, Democracy, and National Security', California Law Review, 107." },
    lec: {
      intro: "Societies run on the assumption that seeing is (mostly) believing. Chesney and Citron's landmark article maps what happens when convincing audio and video can be synthesised at will — and identifies the subtlest casualty: not that we believe fakes, but that we stop believing anything.",
      sections: [
        { h: "The deepfake threat landscape", ps: ["Chesney and Citron catalogue harms across three registers: individual (non-consensual intimate imagery — empirically the overwhelming majority of deepfakes, targeting women — plus fraud and voice-clone scams), democratic (fabricated scandals timed for elections), and security (synthetic evidence in international crises). Since 2019, generative tools have collapsed the cost of all three from expert labour to a text prompt.", "The empirical distribution corrects the discourse: studies consistently find the overwhelming majority of deepfakes are non-consensual intimate imagery of women — while commentary fixates on election scenarios. The gendered harm is the present tense; the democratic harm is the subjunctive.", "The cost collapse is the structural fact: what required a studio in 2017 requires a prompt now. Chesney and Citron's forecasts read conservative in retrospect — voice-clone fraud alone has produced multimillion-dollar corporate losses."] },
        { h: "The liar's dividend", ps: ["Their most influential concept inverts the problem: when everyone knows fakes are possible, real evidence can be plausibly denied — 'that recording is AI'. The liar's dividend accrues to the powerful, who face documented accusations most often. Epistemologically, the deepfake era's core damage is symmetric doubt: fabricated things believed, and authentic things dismissed, until 'evidence' itself loses institutional force.", "Documented invocations accumulate: politicians dismissing authentic recordings as AI in several countries, defendants raising deepfake doubt about video evidence, officials disowning documented statements. The dividend is being claimed on schedule.", "The asymmetry is the analytic core: fabricating evidence requires effort; dismissing real evidence now requires a sentence. Epistemic pollution favours whoever benefits from doubt — historically, the documented and powerful, not their accusers."] },
        { h: "Rebuilding the infrastructure of trust", ps: ["Responses operate at different layers: technical (detection — a losing arms race — and provenance standards like C2PA that cryptographically sign capture), legal (the AI Act's labelling duties, criminalisation of intimate-image abuse), and social — the layer sociology insists on: trusted institutions, professional verification norms, media literacy. Shared truth was never a natural fact; it was always an institutional achievement. Generative AI forces us to rebuild it deliberately.", "The three layers need each other: provenance without trusted institutions verifies nothing to no one; literacy without provenance teaches suspicion of everything; law without both enforces slowly. Single-layer solutions are the field's recurring error.", "The sociological reframe is the takeaway: the question was never how to spot fakes but how societies certify truth — courts, journals, archives, registries. Synthetic media is a stress test of certification institutions; investment in them is the response that scales."] },
        { h: "Manipulation before AI", ps: ["Stalin airbrushed rivals from photographs; tabloids doctored images for decades; Photoshop industrialised retouching. Synthetic media continues an old practice — what changed is cost, scale, and the collapse of the skill barrier.", "The Soviet photo lab is the canonical case: commissars vanished from official images as they fell from favour — Trotsky's disappearance the most famous. States understood image control long before pixels.", "The continuity thesis has a limit worth marking: retouching required institutional access to production; synthesis requires an app. Manipulation democratised is a different social fact from manipulation monopolised — the old theory needs a scale update."] },
        { h: "The synthesis industry", ps: ["Voice cloning from seconds of audio, face-swaps in consumer apps, text-to-video on demand. An industry of legitimate tools — dubbing, accessibility, film — shares its entire technical base with the abuse: dual use is the rule, not the exception.", "The legitimate market is large and growing: film dubbing with lip-sync, voice banking for ALS patients, historical figure education, accessibility narration. The same models, the same weights — intent is the only variable the technology does not encode.", "Dual-use governance therefore targets the edges: consent requirements for voice cloning, identity verification for certain tools, watermark duties at generation. Point-of-use regulation, since point-of-capability regulation would ban the beneficial twin."] },
        { h: "The detection arms race", ps: ["Detectors chase generators and lose ground; watermarks strip out; classifiers misfire on authentic footage. Expert consensus has shifted from detection to provenance — proving where the authentic came from, rather than spotting the fake.", "The technical verdict has stabilised: detectors trained on today's generators fail on tomorrow's; adversarial tweaks defeat classifiers; false positives on authentic footage damage exactly the trust detection was meant to protect.", "The strategic pivot is instructive for any arms race: when spotting the fake is unwinnable, authenticate the real. Defence shifted from artefact analysis to chain-of-custody — a lesson with applications well beyond media."] },
        { h: "Provenance infrastructure", ps: ["Content credentials cryptographically bind capture device, edits and origin to media files, with cameras and newsrooms adopting the standard. Provenance is a trust chain — and like all chains, it works only if institutions people already trust maintain the links.", "Adoption is measurable: camera manufacturers shipping signing hardware, news agencies embedding credentials, platforms beginning to surface provenance labels. An internet-scale notary system, assembling in public.", "The sociological caveats are structural: signing chips cost money (stratifying whose images are believable), metadata can endanger sources, and the verifier consortium is corporate. Provenance answers the trust question by relocating it — to the maintainers of the chain."] },
        { h: "Platforms and synthetic content", ps: ["Labelling duties under the AI Act, synthetic-media policies, election-season commitments: platforms now govern authenticity. Enforcement is inconsistent and definitions leak — but the norm that synthetic content must announce itself is forming in real time.", "The policy patchwork is the current state: labelling required here, prohibited categories there, election-period commitments elsewhere — enforcement trailing policy everywhere. Platform governance is improvising a media law it never wanted.", "The AI Act's labelling duties make one norm statutory in Europe: synthetic content that could mislead must announce itself. Watch the Brussels Effect test case — whether disclosure-by-design globalises the way privacy notices did."] },
        { h: "The verification desk", ps: ["News organisations built forensic teams — open-source investigation methods, dedicated verification units — turning authentication into a professional practice. Journalism's answer to synthetic media is institutional: trust rebuilt as workflow, standards and visible method.", "Open-source investigation matured into a profession: geolocation from shadows, flight-tracking cross-checks, munition identification from fragments — methods that convicted war criminals and debunked state propaganda in public view.", "The institutional insight: verification became journalism's competitive advantage precisely when publication became free. Trust as a product feature — the market rediscovering what the profession's ethics always claimed to sell."] },
        { h: "Truth as infrastructure", ps: ["Shared facts were always manufactured — by courts, science, journalism, archives — through procedures that earned confidence. Generative AI does not end truth; it raises the maintenance costs of the institutions that produce it. Societies now choose whether to pay.", "The constructivist point, handled carefully: saying truth is institutionally produced does not mean truth is arbitrary — it means reliable knowledge requires funded procedures: replication, cross-examination, archives, editorial standards. Facts have overheads.", "The budget framing is the political conclusion: societies currently defund the certification institutions while subsidising synthesis by market default. Reversing that ledger — paying for courts, journalism, science, archives — is what taking the epistemic crisis seriously means."] },
      ],
      concepts: ["deepfakes", "liar's dividend", "content provenance", "epistemic trust"],
      discuss: ["The liar's dividend suggests the biggest beneficiaries of deepfakes are those denying real evidence. Find a plausible scenario and its institutional remedy.", "Provenance tech can verify a video's origin. What social conditions must hold for people to trust the verifier?"],
    },
    quiz: [
      { q: "The 'liar's dividend' means that deepfakes allow…", o: ["Honest people to earn money", "Real evidence to be dismissed as fake", "Faster fact-checking", "Better cameras"], a: 1 },
      { q: "Chesney & Citron frame deepfakes as a challenge to…", o: ["Only celebrities", "Privacy, democratic discourse and security simultaneously", "Printer manufacturers", "Sports results"], a: 1 },
      { q: "A sociological response to synthetic media focuses on…", o: ["Banning all video", "Rebuilding institutional trust, provenance norms and media literacy", "Ignoring the issue", "Faster upload speeds"], a: 1 },
    ] },
  { id: "s2c12", sem: 2, num: 25, title: "Public Speaking — Student Presentations", thumb: "🎤",
    tags: ["public speaking", "presentations", "rhetoric"],
    desc: "Students present a course topic (10 min + Q&A) grounded in one reading of their choice. Workshop on structure, evidence and delivery.",
    reading: { kind: "press", ref: "Student-selected research paper or press article, approved in week 22." },
    lec: {
      intro: "Sociology that cannot be communicated changes nothing. This session is a practicum: each student delivers a ten-minute talk on a course topic, grounded in a reading of their choice. The lecture portion is a compact rhetoric of the academic talk — structure, evidence, delivery, and surviving the Q&A.",
      sections: [
        { h: "Structure: one claim, carried", ps: ["A ten-minute talk holds exactly one arguable claim. Open with it — a question the audience did not know they had, then your answer ('Deepfakes' main damage is not deception but denial'). Then three moves: the mechanism, the evidence, the implication. End by returning to the opening. The classic error is compression — squeezing an essay into slides; a talk is not a paper read aloud, it is an argument performed.", "The cognitive science backs the discipline: audiences retain a talk's structure and one or two claims, not its details. Design for what memory keeps — the thesis, an image, the arc — and let the paper carry the rest.", "A test before you rehearse: say the talk in one minute to a friend. If the miniature makes sense, the full version has a spine; if it rambles, no delivery will save it. The elevator version is the skeleton X-ray."] },
        { h: "Evidence and intellectual honesty", ps: ["Every claim gets a named source ('Rosenblat and Stark's driver study shows…'), and your one best piece of evidence gets time to breathe rather than sharing a slide with six others. State the strongest objection to your own claim before the audience does — it converts skeptics and is, besides, how scholarship works. In this course, misrepresenting a reading costs more than opposing it well.", "The one-best-evidence rule has rhetorical logic: a single well-explained finding the audience fully absorbs persuades more than six they half-hear. Depth reads as command; volume reads as insecurity.", "Steelmanning is also strategic self-defence: the objection you raise on your terms cannot ambush you in Q&A on the examiner's terms. Naming your argument's best enemy converts a vulnerability into evidence of mastery."] },
        { h: "Delivery and the Q&A", ps: ["Delivery is trainable mechanics, not charisma: speak to the back row, pause after key claims (silence is emphasis), never read slides, and rehearse aloud — twice — against the clock. In Q&A, restate the question (thinking time, and the room hears it), answer what you can, and say 'I don't know, but here is how I'd find out' when you don't. Honest uncertainty, well handled, reads as competence.", "Rehearsal specifics that work: full run-throughs aloud (silent reading lies about timing), once standing, once recorded — the recording is painful and worth two live rehearsals. Cut ten percent after every timed run.", "The Q&A disposition to cultivate: questions are gifts of engagement, not attacks. The restate-answer-connect pattern (restate the question, answer directly, connect back to your thesis) turns even hostile questions into another minute of your argument."] },
        { h: "Slides that serve the talk", ps: ["One idea per slide, six words before an image, no paragraph ever read aloud. Slides are scenery, not script — the audience should watch you, glancing at the screen only when you send them there.", "The evidence against text-walls is experimental: audiences reading slides stop listening — the redundancy effect in multimedia learning research. A slide that competes with you loses you the room while it wins the projector.", "Design defaults for academic talks: one figure or claim per slide, source lines in small type, dark-on-light in bright rooms, and a deliberate blank slide for the moments you want eyes on you. Slides are lighting design for attention."] },
        { h: "Voice and body", ps: ["Volume to the back row, pace slower than feels natural, pauses as punctuation; feet planted, hands free, eyes distributed across the room. Delivery mechanics are learnable in a week of deliberate practice — charisma is mostly rehearsal wearing a disguise.", "The counterintuitive finding on pace: nervous speakers accelerate, and audiences read speed as anxiety; deliberately slowing reads as authority. Record yourself once and the gap between felt and actual pace becomes unforgettable.", "On presence: plant feet to stop swaying, hold the first eye contact three seconds, and let hands gesture naturally rather than gripping notes. The body settles the audience before the argument reaches them — Goffman applies to lecterns too."] },
        { h: "Ethos, pathos, logos", ps: ["Aristotle's triangle still organises persuasion: credibility from named sources and honest limits, emotion from one concrete human case, logic from a visible argumentative skeleton. Academic talks earn ethos first — the other two follow.", "Applied to your week-25 talk: ethos is citing Rosenblat precisely and admitting a limit; pathos is one driver's story told concretely; logos is the visible three-step argument. All three, briefly, beats any one at length.", "The academic register inverts everyday persuasion: overclaiming destroys ethos faster than any error, and the honest I do not know builds more credibility than a bluffed answer. Scholarly authority is performed through calibrated confidence."] },
        { h: "Arguing with data", ps: ["One number, contextualised, beats ten recited: say what it means, what it compares to, and what would change your mind about it. Charts follow the same law — one message per figure, stated aloud in one sentence.", "The contextualisation formula: state the number, give the comparison that makes it meaningful, name the source, and say what would falsify it. Forty-seven percent of jobs means nothing until the OECD's nine percent stands beside it.", "Chart crimes to avoid on sight: truncated axes manufacturing drama, dual axes implying correlation, percentages without denominators. Your audience of sociologists will spot each — and grade the spotting."] },
        { h: "Nerves, managed", ps: ["Stage fright is arousal misread: breathe low, slow the first minute, memorise the opening two sentences cold. Every experienced speaker you admire still feels it — they have merely rehearsed the beginning past the point where fear can reach it.", "The physiology is reframable: arousal (racing pulse, sharp senses) is identical in fear and excitement; studies show relabelling it as excitement improves performance where suppressing it fails. The body is ready, not broken.", "The structural aids: memorise the first two sentences and the last one cold — openings and closings anchor everything between; know your slides so failure of technology is not failure of talk; and rehearse the walk to the front, which is where nerves peak."] },
        { h: "Presenting with AI, honestly", ps: ["Use models to brainstorm structure or anticipate questions — then declare any assistance, and own every claim as if you had written it, because you must defend it live. The Q&A is where outsourced understanding is found out.", "Legitimate uses worth modelling: generating counterarguments to steelman, drafting alternative structures to compare, rehearsing Q&A against a model playing hostile examiner. The tool as sparring partner, not ghostwriter.", "The disclosure norm anticipates your professional future: journals, employers and courts are all writing AI-assistance rules now. Practising honest attribution in week 25 is practising the professional ethics your careers will require."] },
        { h: "How week 25 is graded", ps: ["The rubric weighs argument (40%), use of evidence and the chosen reading (30%), delivery (20%) and Q&A handling (10%), for 15% of the semester grade. Read the rubric as strategy: a defensible thesis with one well-used source outscores polish with nothing underneath.", "Translate the rubric into preparation hours: argument (40%) is built at the desk, delivery (20%) in rehearsal, evidence (30%) in careful reading of your chosen text, Q&A (10%) in anticipating three hard questions. Allocate accordingly.", "The meta-skill being assessed outlasts the course: every thesis defence, job talk, pitch and public consultation runs on these mechanics. Week 25 is the course's most transferable ninety minutes — treat it as an investment, not a hurdle."] },
      ],
      concepts: ["thesis-first structure", "signposting", "steelmanning", "Q&A technique"],
      discuss: ["Take your presentation topic and state its thesis in one sentence of fewer than 20 words.", "What is the strongest objection to your thesis, and how will you address it before the audience raises it?"],
    },
    quiz: [
      { q: "A strong academic presentation opens with…", o: ["An apology", "A clear question or claim the talk will answer", "All references read aloud", "A joke unrelated to the topic"], a: 1 },
      { q: "Evidence in a sociology talk should be…", o: ["Anecdotes only", "Explicitly sourced and connected to the argument", "Hidden until Q&A", "Purely statistical"], a: 1 },
      { q: "Handling a hard question well means…", o: ["Changing the subject", "Restating it, answering what you can, and being honest about limits", "Speaking faster", "Refusing to answer"], a: 1 },
    ] },
  { id: "s2c13", sem: 2, num: 26, title: "Semester Review & Final Preparation", thumb: "🧾",
    tags: ["review", "synthesis", "exam prep"],
    desc: "Mapping the year: connecting alignment, inequality, environment, regulation and identity into essay-ready arguments.",
    reading: { kind: "paper", ref: "All semester 2 readings — bring your annotated bibliography." },
    lec: {
      intro: "The final session assembles the year into a usable map. Semester 1 diagnosed a political economy of data; Semester 2 asked what can be done about it — ethically, legally, institutionally — and at what cost. We close by building the cross-cutting arguments the final exam rewards.",
      sections: [
        { h: "The arc of the year", ps: ["Semester 1's through-line was extraction: experience, attention, labour and sociality converted into data and optimised for commercial metrics (Zuboff, the attention merchants, Uber, the Facebook Files). Semester 2's through-line was governance: the attempts — alignment procedures, audits, ethics charters, the AI Act — to bring that extraction under normative control, and the inequalities (Gender Shades, the compute divide, data colonialism) that persist through them.", "Say it in two sentences for the exam: semester one showed how social life became a raw material — datafied, optimised, monetised. Semester two showed societies responding — auditing, regulating, contesting — with the outcome undecided.", "The undecidedness is the honest conclusion: extraction and governance are both accelerating, and their race has no scheduled finish. Essays that end in genuine open questions, precisely stated, outscore essays that end in verdicts."] },
        { h: "Cross-semester argument patterns", ps: ["The exam rewards connections across the year. Reliable patterns: harm → audit → regulation (Gender Shades documented disparities that the AI Act's high-risk regime now addresses); metric → behaviour → institution (engagement ranking reshaped political communication; the DSA responds); principle → practice gap (Jobin's converging principles vs. ethics washing — with the Act as the test of whether soft law hardens). Practise stating each pattern with two named cases and one concept.", "Add two more patterns to your bank: infrastructure → dependence → sovereignty (clouds, chips, Gaia-X) and design → behaviour → norm (engagement ranking, attention, right-to-disconnect laws). Five patterns cover most possible questions.", "Each pattern is falsifiable, which is what makes it an argument: harm-audit-regulation fails where audits exist and regulation does not follow — name such a case and explain the failure, and you have written a first-class paragraph."] },
        { h: "The course's core claim", ps: ["If this course argues one thing, it is this: AI is a social institution — built by identifiable actors with interests, trained on a past that contains our inequalities, governed (or not) by contestable rules, and therefore changeable. Neither the boosters' inevitability nor the doomers' fatalism survives sociological scrutiny. The honest position is the demanding one: outcomes are chosen, so the question 'what kind of society do we want?' is addressed to you.", "Test the claim against your own experience: every system you met this year — the feed, the app, the score, the model — was traced to designers, incentives, data and rules. Nothing was inevitable; everything was decided. That is the empirical content of AI is an institution.", "The claim's practical corollary is the course's parting gift: institutions are changeable by the means institutions have always been changed — evidence, organisation, law, and people who understand the machinery. You now understand the machinery."] },
        { h: "Semester 1 on one page", ps: ["Extraction was the through-line: experience became data (Zuboff), attention became inventory (Lewis), labour became tasks under algorithmic management (Rosenblat), sociality became engagement (the Files). One logic, four arenas — rehearse it until you can write it cold.", "Attach one number to each case for exam texture: billions of daily behavioural-futures auctions, thousands of platform A/B tests, driver acceptance thresholds, MSI reweighting — quantities make the abstract logic concrete on paper.", "The revision exercise: write the semester-one paragraph in ten minutes, cold, twice this week. Fluency under time pressure is trained, not hoped for — and this paragraph opens half the possible essay questions."] },
        { h: "Semester 2 on one page", ps: ["Governance answered: values contested (Gabriel), harms audited (Gender Shades), footprints counted (Strubell), rules written (the AI Act), trust re-engineered (provenance). The tension between extraction and governance is the year's architecture.", "The governance cases also share a limit worth naming: each intervenes downstream of deployment — auditing built systems, regulating shipped products. Upstream questions (what gets built, funded, researched) remain largely ungoverned; noticing this earns distinction-level marks.", "Practise the pairing move across the wall: match each semester-two response to the semester-one harm it answers, then judge the fit. The AI Act to engagement ranking is a partial fit at best — arguing why is a complete exam answer."] },
        { h: "Ten concepts to own", ps: ["Datafication, behavioural surplus, networked publics, algorithmic management, alignment, intersectional audit, the Brussels Effect, risk-based regulation, the liar's dividend, platformed sociality. For each: definition, author, one case, one critique — that grid is your revision plan.", "Build the grid physically: ten rows, four columns — definition, author, case, critique. One page, handwritten, reconstructed from memory twice before the exam. Retrieval practice is the only revision method with robust evidence behind it.", "The concepts also interlock — that is the deeper test: behavioural surplus feeds engagement ranking; audits feed risk regulation; the liar's dividend erodes what provenance rebuilds. Draw the arrows and the ten concepts become one map."] },
        { h: "A model essay, dissected", ps: ["Take the semester's sample question and watch the moves: thesis in sentence one, the Brussels Effect as mechanism, the AI Act plus one case as evidence, the innovation critique acknowledged, conclusion answering the exact words asked. Structure is visible — copy it.", "Time the imitation: reproduce the dissected structure on a different question this week, under ninety minutes, no notes. The structure transfers; only the content swaps — which is precisely why examiners reward it as competence rather than formula.", "Notice what the model essay omits: no biography, no history of AI, no throat-clearing about our digital age. Every sentence works. Cutting ritual openings is the single highest-return edit available to student writers."] },
        { h: "MCQ strategy, final form", ps: ["The comprehensive MCQ samples all thirteen sessions evenly: revise breadth before depth. Distractors are usually a critic's position or a neighbouring concept — knowing who said what is worth more points than knowing any one text deeply.", "The arithmetic of breadth: thirteen sessions, evenly sampled, means three questions per session — a session skipped is points surrendered with certainty, while depth beyond the quiz banks yields nothing extra. Revise like the test is built.", "Reuse the platform: retake every quiz in this app until each scores three of three. The question style of the final MCQ is the question style you have been practising all year — the familiarity is the point of the design."] },
        { h: "Five recurring mistakes", ps: ["Summarising instead of arguing; cases without concepts; concepts without cases; ignoring the counterargument; answering the question you wished for. Each costs a grade band — and each is avoidable by outline discipline in the first five minutes.", "A sixth, for completeness: quoting authors without page-level precision or misattributing critiques — examiners in this course know who said what, and errors of attribution cost more than omissions.", "The outline discipline that prevents all six: five minutes listing thesis, cases, concept, objection before writing anything. Scripts that begin immediately read as improvisation because they are — and improvisation is what the mistakes have in common."] },
        { h: "After this course", ps: ["Paths from here: economic sociology of platforms, science and technology studies, critical data studies, AI policy and governance. The reading list continues — but the toolkit is yours now, and the systems you will meet next have not been built yet.", "Concrete next steps by taste: STS seminars if the lab fascinated you, platform-economy courses if the gig chapter did, policy clinics if the Act did; and the methods course — audits, trace data, ethnography — whatever the substance.", "A final professional note: every organisation you will join is currently deciding how to adopt these systems, mostly without anyone who thinks sociologically in the room. That absence is your opening — and, this course has argued, everyone else's risk."] },
      ],
      concepts: ["extraction vs governance", "argument patterns", "AI as institution", "sociological imagination"],
      discuss: ["Choose one Semester 1 case and one Semester 2 response to it. Evaluate: does the response actually address the mechanism of harm?", "Write, in three sentences, the thesis of the essay you would most want to defend in the final."],
    },
    quiz: [
      { q: "A strong essay thesis in this course is…", o: ["A summary of readings", "An arguable claim connecting a technology to a social outcome via mechanisms", "A list of definitions", "A famous quote"], a: 1 },
      { q: "Connecting the EU AI Act to Gender Shades, a good argument concerns…", o: ["Their page counts", "How documented algorithmic harms motivate risk-based regulation", "Their authors' nationalities", "Nothing — they are unrelated"], a: 1 },
      { q: "The course's core sociological claim across both semesters is that AI is…", o: ["Purely technical", "A social institution: shaped by power, shaping inequality, contested politically", "Inevitable and neutral", "Only about robots"], a: 1 },
    ] },
];

const EXAMS = [
  { id: "e1", sem: 1, kind: "Midterm", week: "Week 7", format: "1 MCQ section + 1 essay question",
    scope: "Classes 1–6 (digital society → attention economy)",
    essay: "\"Surveillance capitalism is less about watching and more about shaping.\" Discuss with reference to Zuboff and the attention economy.",
    mcqNote: "20 MCQs drawn from the weekly quiz banks of classes 1–6.",
    rubric: "Essay marked /20: thesis & structure (6), use of concepts (6), evidence from readings (6), style (2). MCQ: 1pt each, no negative marking." },
  { id: "e2", sem: 1, kind: "Final", week: "Exam period — January", format: "MCQ section + 2 essay questions (choice of 3)",
    scope: "All semester 1 topics (classes 1–13)",
    essay: "Compare how algorithmic management (gig economy) and engagement-based ranking (platform giants) each redistribute power. What do they have in common?",
    mcqNote: "Comprehensive MCQ covering all 13 sessions.",
    rubric: "Each essay /20 as midterm; cross-session synthesis explicitly rewarded (+2 bonus for well-used cross-case connections)." },
  { id: "e3", sem: 2, kind: "Midterm", week: "Week 20", format: "1 MCQ section + 1 essay question",
    scope: "Classes 14–19 (alignment → future of thinking)",
    essay: "Is 'aligning AI with human values' a technical problem, a political problem, or both? Use Gabriel (2020) and Gender Shades.",
    mcqNote: "20 MCQs drawn from the weekly quiz banks of classes 14–19.",
    rubric: "Essay marked /20: thesis & structure (6), use of concepts (6), evidence from readings (6), style (2). MCQ: 1pt each, no negative marking." },
  { id: "e4", sem: 2, kind: "Final", week: "Exam period — May", format: "MCQ section + 2 essay questions (choice of 3)",
    scope: "All semester 2 topics (classes 14–26)",
    essay: "\"Europe regulates, America innovates, China coordinates.\" Assess this slogan using the Brussels Effect, the EU AI Act, and one case study of your choice.",
    mcqNote: "Comprehensive MCQ covering all 13 sessions.",
    rubric: "Each essay /20 as midterm; presentations (week 25) contribute 15% of the semester grade separately." },
];

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "s1", label: "Semester 1", icon: BookOpen },
  { id: "s2", label: "Semester 2", icon: GraduationCap },
  { id: "diagrams", label: "Diagrams", icon: BarChart3 },
  { id: "book", label: "Book", icon: BookMarked },
  { id: "scroller", label: "Scroller", icon: Film },
  { id: "exams", label: "Exams", icon: FileText },
];

/* Mock cohort data — teacher view only */
const COHORT = { students: 42, avgQuiz: 71, completion: 63, atRisk: 5,
  top: [["Class 5 · Surveillance Capitalism", 84], ["Class 9 · Gig Economy", 79], ["Class 16 · Social Inequalities", 77]],
  low: [["Class 14 · Alignment", 58], ["Class 21 · AI & Ethics", 61]] };

/* ══════════ Lecture content blocks (shared by Lecture reader & Book) ══════════ */
function LectureBody({ s, compact }) {
  const diagram = DIAGRAMS[s.id];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 14 : 18 }}>
      <p style={{ fontSize: compact ? 13 : 14, lineHeight: 1.65, color: "var(--secondary-foreground)", fontStyle: "italic" }}>{s.lec.intro}</p>
      <div style={{ background: "var(--surface-2)", borderLeft: "3px solid var(--primary)", borderRadius: "0 8px 8px 0", padding: "10px 14px",
        fontSize: 12, display: "flex", gap: 8, alignItems: "flex-start" }}>
        {s.reading.kind === "paper" ? <FlaskConical size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--info)" }} /> : <Newspaper size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--warning)" }} />}
        <span><strong>{s.reading.kind === "paper" ? "Research paper" : "Press article"} · </strong>{s.reading.ref}</span>
      </div>
      {diagram && <Diagram spec={diagram} compact={compact} />}
      {s.lec.sections.map((sec, i) => (
        <div key={i}>
          <div className="serif" style={{ fontSize: compact ? 16 : 18, fontWeight: 700, marginBottom: 6, color: "var(--foreground)" }}>
            {i + 1}. {sec.h}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: compact ? 7 : 9 }}>
            {sec.ps.map((p, pi) => (
              <p key={pi} style={{ fontSize: compact ? 12.5 : 13.5, lineHeight: 1.7 }}>{p}</p>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1fr 1fr", gap: 12 }}>
        <div style={{ background: "var(--surface-2)", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, display: "flex", gap: 6, alignItems: "center", marginBottom: 8, color: "var(--accent-foreground)" }}>
            <Lightbulb size={13} /> KEY CONCEPTS
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{s.lec.concepts.map(c => <Badge key={c} variant="primary" size="xs">{c}</Badge>)}</div>
        </div>
        <div style={{ background: "var(--surface-2)", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, display: "flex", gap: 6, alignItems: "center", marginBottom: 8, color: "var(--accent-foreground)" }}>
            <MessageCircleQuestion size={13} /> DISCUSSION
          </div>
          <ol style={{ paddingLeft: 16, fontSize: 12, lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 6 }}>
            {s.lec.discuss.map((d, i) => <li key={i}>{d}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ══════════ Quiz engine ══════════ */
function QuizPanel({ session, result, onFinish, isTeacher }) {
  const [answers, setAnswers] = useState(result ? result.answers : {});
  const [submitted, setSubmitted] = useState(!!result);
  const [showKey, setShowKey] = useState(false);
  const total = session.quiz.length;
  const score = session.quiz.reduce((s, q, i) => s + (answers[i] === q.a ? 1 : 0), 0);
  const allAnswered = Object.keys(answers).length === total;
  const reveal = submitted || showKey;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {isTeacher && !submitted && (
        <button onClick={() => setShowKey(k => !k)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--warning-muted)", color: "var(--warning)",
            border: "1px solid var(--border)", borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 700 }}>
          <KeyRound size={13} /> {showKey ? "Hide answer key" : "Show answer key (teacher)"}
          {showKey ? <EyeOff size={13} style={{ marginLeft: "auto" }} /> : <Eye size={13} style={{ marginLeft: "auto" }} />}
        </button>
      )}
      {submitted && (
        <div style={{ background: score === total ? "var(--success-muted)" : "var(--accent)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: score === total ? "var(--success)" : "var(--accent-foreground)" }}>
            Score: {score}/{total} {score === total ? "· Perfect!" : score >= 2 ? "· Good work" : "· Review the reading"}
          </span>
          <Btn variant="ghost" size="xs" onClick={() => { setAnswers({}); setSubmitted(false); }}><RotateCcw size={12} /> Retake</Btn>
        </div>
      )}
      {session.quiz.map((q, qi) => (
        <div key={qi}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{qi + 1}. {q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {q.o.map((opt, oi) => {
              const chosen = answers[qi] === oi;
              const correct = reveal && oi === q.a;
              const wrong = submitted && chosen && oi !== q.a;
              return (
                <button key={oi} onClick={submitted ? undefined : () => setAnswers(a => ({ ...a, [qi]: oi }))}
                  style={{
                    textAlign: "left", fontFamily: "inherit", fontSize: 12, lineHeight: 1.4, cursor: submitted ? "default" : "pointer",
                    padding: "7px 10px", borderRadius: 6,
                    border: `1px solid ${correct ? "var(--success)" : wrong ? "var(--destructive)" : chosen ? "var(--primary)" : "var(--border)"}`,
                    background: correct ? "var(--success-muted)" : wrong ? "rgba(239,68,68,0.15)" : chosen ? "var(--accent)" : "var(--surface-1)",
                    color: correct ? "var(--success)" : wrong ? "var(--destructive)" : "var(--foreground)",
                  }}>
                  {String.fromCharCode(65 + oi)}. {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted && (
        <Btn variant="primary" size="sm" onClick={() => { setSubmitted(true); onFinish(session.id, { answers, score }); }}
          disabled={!allAnswered} style={{ justifyContent: "center" }}>
          <ListChecks size={14} /> Submit quiz {allAnswered ? "" : `(${Object.keys(answers).length}/${total} answered)`}
        </Btn>
      )}
    </div>
  );
}

/* ══════════ Landing + Login ══════════ */
/* ══════════ Exam runner (functional practice-exam) ══════════ */
function ExamCard({ exam, isTeacher }) {
  const [mode, setMode] = useState("summary");
  const bank = useMemo(() => {
    const m = String(exam.scope).match(/(\d+)[^\d]+(\d+)/);
    const [lo, hi] = m ? [Number(m[1]), Number(m[2])] : [1, 26];
    const pool = [];
    SESSIONS.filter(s => s.num >= lo && s.num <= hi).forEach(s => {
      s.quiz.forEach((q, qi) => pool.push({ ...q, from: s.num, sid: s.id, qi }));
    });
    return pool;
  }, [exam.id]);
  const totalTimeSec = exam.kind === "Final" ? 40 * 60 : 25 * 60;
  const [remaining, setRemaining] = useState(totalTimeSec);
  const [answers, setAnswers] = useState({});
  const [essay, setEssay] = useState("");

  useEffect(() => {
    if (mode !== "mcq") return;
    const t = setInterval(() => setRemaining(r => (r <= 1 ? (clearInterval(t), setMode("done"), 0) : r - 1)), 1000);
    return () => clearInterval(t);
  }, [mode]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const score = bank.reduce((s, q, i) => s + (answers[i] === q.a ? 1 : 0), 0);
  const pct = bank.length ? Math.round((score / bank.length) * 100) : 0;

  if (mode === "summary") {
    return (
      <div id={"exam-" + slugify(exam.kind + "-s" + exam.sem)} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            {exam.kind === "Final" ? <Award size={16} style={{ color: "var(--primary)" }} /> : <PenLine size={16} style={{ color: "var(--info)" }} />}
            Semester {exam.sem} — {exam.kind}
          </div>
          <Badge variant={exam.kind === "Final" ? "primary" : "info"} size="xs">{exam.week}</Badge>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px", fontSize: 12 }}>
          <span style={{ color: "var(--muted-foreground)", fontWeight: 600 }}>Format</span><span>{exam.format}</span>
          <span style={{ color: "var(--muted-foreground)", fontWeight: 600 }}>Scope</span><span>{exam.scope}</span>
          <span style={{ color: "var(--muted-foreground)", fontWeight: 600 }}>MCQ pool</span><span>{bank.length} questions · timer {Math.round(totalTimeSec / 60)} min</span>
        </div>
        <div style={{ marginTop: 10, background: "var(--surface-2)", borderRadius: 8, padding: "10px 12px", fontSize: 12, fontStyle: "italic", color: "var(--secondary-foreground)" }}>
          Sample essay question — {exam.essay}
        </div>
        {isTeacher && (
          <div style={{ marginTop: 10, background: "var(--warning-muted)", borderRadius: 8, padding: "10px 12px", fontSize: 11.5,
            display: "flex", gap: 8, alignItems: "flex-start" }}>
            <KeyRound size={13} style={{ color: "var(--warning)", flexShrink: 0, marginTop: 1 }} />
            <span><strong>Marking rubric (teacher only):</strong> {exam.rubric}</span>
          </div>
        )}
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <Btn variant="primary" size="sm" onClick={() => { setMode("mcq"); setRemaining(totalTimeSec); }}>
            <PenLine size={13} /> Start practice exam
          </Btn>
        </div>
      </div>
    );
  }

  if (mode === "mcq") {
    return (
      <div style={{ background: "var(--card)", border: "2px solid var(--primary)", borderRadius: 12, padding: 18 }}>
        <div style={{ position: "sticky", top: 0, background: "var(--card)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <FlaskConical size={15} style={{ color: "var(--info)" }} /> {exam.kind} · S{exam.sem}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, fontSize: 15, color: remaining < 60 ? "var(--destructive)" : "var(--primary)", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Clock size={14} /> {fmt(remaining)}
            </div>
            <Btn variant="ghost" size="xs" onClick={() => setMode("done")}>Submit</Btn>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {bank.map((q, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "var(--foreground)" }}>
                <span style={{ color: "var(--muted-foreground)" }}>[Class {q.from}]</span> {i + 1}. {q.q}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {q.o.map((opt, oi) => {
                  const chosen = answers[i] === oi;
                  return (
                    <button key={oi} onClick={() => setAnswers(a => ({ ...a, [i]: oi }))}
                      style={{ textAlign: "left", fontFamily: "inherit", fontSize: 12, cursor: "pointer", padding: "7px 10px", borderRadius: 6,
                        border: `1px solid ${chosen ? "var(--primary)" : "var(--border)"}`,
                        background: chosen ? "var(--accent)" : "var(--surface-1)", color: "var(--foreground)" }}>
                      <span style={{ opacity: 0.6, marginRight: 6, fontWeight: 700 }}>{String.fromCharCode(65 + oi)}.</span> {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <FileText size={14} /> Essay (optional)
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px", fontSize: 11.5, fontStyle: "italic", color: "var(--secondary-foreground)", marginBottom: 6 }}>
              {exam.essay}
            </div>
            <textarea value={essay} onChange={e => setEssay(e.target.value)} rows={8} placeholder="Draft your essay here — aim for 400–600 words for a midterm, 800–1200 for a final."
              style={{ width: "100%", background: "var(--input)", border: "1px solid var(--border)", borderRadius: 8, padding: 10, color: "var(--foreground)", fontFamily: "inherit", fontSize: 13, lineHeight: 1.55, resize: "vertical" }} />
            <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4, textAlign: "right" }}>
              {wordCount} words
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
            <Btn variant="ghost" size="sm" onClick={() => { setAnswers({}); setEssay(""); setMode("summary"); }}>Cancel</Btn>
            <Btn variant="primary" size="sm" onClick={() => setMode("done")}>Submit exam</Btn>
          </div>
        </div>
      </div>
    );
  }

  // done
  return (
    <div style={{ background: "var(--card)", border: `2px solid ${pct >= 60 ? "var(--success)" : "var(--warning)"}`, borderRadius: 12, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
          <Award size={16} style={{ color: pct >= 60 ? "var(--success)" : "var(--warning)" }} />
          Practice complete — S{exam.sem} {exam.kind}
        </div>
        <Badge variant={pct >= 60 ? "success" : "warning"} size="xs">{pct}%</Badge>
      </div>
      <div style={{ fontSize: 13 }}>
        MCQ score: <strong>{score}/{bank.length}</strong> · Essay: <strong>{wordCount} words</strong> {essay ? "(drafted)" : "(skipped)"}
      </div>
      <div style={{ marginTop: 10, background: "var(--surface-2)", borderRadius: 8, padding: 10, fontSize: 12, color: "var(--secondary-foreground)" }}>
        {pct >= 80 ? "Excellent grasp of the scope — you would pass this exam comfortably." :
         pct >= 60 ? "Solid — revise the classes where you missed 2+ questions." :
         "Below the pass line — reread the lectures for the covered classes and retake."}
      </div>
      {Object.keys(answers).length > 0 && (
        <details style={{ marginTop: 10 }}>
          <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 700, color: "var(--accent-foreground)" }}>
            Review missed questions ({bank.filter((_, i) => answers[i] !== undefined && answers[i] !== bank[i].a).length})
          </summary>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {bank.map((q, i) => {
              if (answers[i] === q.a || answers[i] === undefined) return null;
              return (
                <div key={i} style={{ background: "var(--surface-2)", borderLeft: "3px solid var(--destructive)", padding: "8px 10px", borderRadius: "0 6px 6px 0", fontSize: 11.5 }}>
                  <div style={{ fontWeight: 700, marginBottom: 3 }}>[Class {q.from}] {q.q}</div>
                  <div style={{ color: "var(--destructive)" }}>Your answer: {q.o[answers[i]]}</div>
                  <div style={{ color: "var(--success)" }}>Correct: {q.o[q.a]}</div>
                </div>
              );
            })}
          </div>
        </details>
      )}
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <Btn variant="secondary" size="sm" onClick={() => { setMode("summary"); setAnswers({}); setEssay(""); setRemaining(totalTimeSec); }}>
          <RotateCcw size={13} /> Retake
        </Btn>
      </div>
    </div>
  );
}

/* ══════════ Landing + Login ══════════ */
function Landing({ onLogin, theme, setTheme }) {
  const [role, setRole] = useState(null); // null | 'student' | 'teacher'
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const tryLogin = () => {
    if (user.trim() === "admin" && pass === "admin") onLogin(role);
    else setErr("Invalid credentials — hint: admin / admin (demo)");
  };

  const roleCard = (r, Icon, title, sub) => (
    <div className="hoverable" onClick={() => { setRole(r); setErr(""); setUser(""); setPass(""); }}
      style={{ flex: 1, minWidth: 220, background: "var(--card)", border: `1px solid ${role === r ? "var(--primary)" : "var(--border)"}`,
        borderRadius: 14, padding: 22, cursor: "pointer", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--accent)", display: "flex", alignItems: "center",
        justifyContent: "center", margin: "0 auto 12px" }}>
        <Icon size={22} style={{ color: "var(--accent-foreground)" }} />
      </div>
      <div className="serif" style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 11.5, color: "var(--muted-foreground)", marginTop: 4 }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--foreground)", fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 28px" }}>
        <SociMark size={30} />
        <span className="serif" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "0.01em" }}>SociAI</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px",
            cursor: "pointer", color: "var(--foreground)", display: "flex" }}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px 48px" }}>
        <div style={{ maxWidth: 760, width: "100%", textAlign: "center" }}>
          <Badge variant="primary">La Sorbonne · Sociology L3 · 2026/2027</Badge>
          <h1 className="serif" style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.12, margin: "18px 0 12px", letterSpacing: "-0.01em" }}>
            The Sociology of <span style={{ color: "var(--primary)" }}>Artificial Intelligence</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
            26 lectures across two semesters — algorithms, surveillance capitalism, the gig economy, alignment,
            regulation and the future of thinking. Every class grounded in a research paper or press article,
            every class ending with a quiz.
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", margin: "26px 0 36px", flexWrap: "wrap" }}>
            {[["26", "lectures × 1h30"], ["260", "lecture sections"], ["26", "end-of-class quizzes"], ["4", "midterms & finals"]].map(([n, l]) => (
              <div key={l}>
                <div className="serif" style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)" }}>{n}</div>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", maxWidth: 560, margin: "0 auto" }}>
            {roleCard("student", User, "Student login", "Follow lectures, take quizzes, track your progress")}
            {roleCard("teacher", Users, "Teacher login", "Everything students see, plus answer keys, rubrics & cohort analytics")}
          </div>

          {role && (
            <div style={{ maxWidth: 340, margin: "22px auto 0", background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 14, padding: 20, textAlign: "left", boxShadow: "var(--shadow-md)" }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Lock size={14} style={{ color: "var(--primary)" }} /> Sign in as {role}
              </div>
              {[["Username", user, setUser, "text"], ["Password", pass, setPass, "password"]].map(([label, val, set, type]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 4 }}>{label}</div>
                  <input type={type} value={val} onChange={e => { set(e.target.value); setErr(""); }}
                    onKeyDown={e => e.key === "Enter" && tryLogin()}
                    placeholder={label === "Username" ? "admin" : "••••"}
                    style={{ width: "100%", background: "var(--input)", border: "1px solid var(--border)", borderRadius: 8,
                      padding: "8px 10px", fontSize: 13, color: "var(--foreground)", fontFamily: "inherit", outline: "none" }} />
                </div>
              ))}
              {err && <div style={{ fontSize: 11.5, color: "var(--destructive)", marginBottom: 8 }}>{err}</div>}
              <Btn variant="primary" size="md" onClick={tryLogin} style={{ width: "100%", justifyContent: "center" }}>Sign in</Btn>
              <div style={{ fontSize: 10.5, color: "var(--muted-foreground)", marginTop: 8, textAlign: "center" }}>
                Demo credentials: <strong>admin / admin</strong>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer style={{ textAlign: "center", padding: 16, fontSize: 11, color: "var(--muted-foreground)" }}>
        SociAI · Sociologie de l'IA et de la société numérique · La Sorbonne 2026/27
      </footer>
    </div>
  );
}

/* ══════════ App ══════════ */
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [session, setSession] = useState(null); // { role: 'student'|'teacher' }
  const [navOpen, setNavOpen] = useState(true);
  const [ctxOpen, setCtxOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [viewMode, setViewMode] = useState("tiles");
  const [selectedId, setSelectedId] = useState(null);
  const [ctxTab, setCtxTab] = useState("details");
  const [lectureId, setLectureId] = useState(null); // full-page lecture reader
  const [search, setSearch] = useState("");
  const [quizResults, setQuizResults] = useState({});

  const isTeacher = session?.role === "teacher";
  const selected = SESSIONS.find(s => s.id === selectedId) || null;
  const lecture = SESSIONS.find(s => s.id === lectureId) || null;
  const sem = activeNav === "s1" ? 1 : activeNav === "s2" ? 2 : null;

  const filtered = useMemo(() => {
    let list = sem ? SESSIONS.filter(s => s.sem === sem) : SESSIONS;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => (s.title + " " + s.tags.join(" ") + " " + s.reading.ref).toLowerCase().includes(q));
    }
    return list;
  }, [sem, search]);

  const doneCount = Object.keys(quizResults).length;
  const totalScore = Object.values(quizResults).reduce((s, r) => s + r.score, 0);
  const avgPct = doneCount ? Math.round((totalScore / (doneCount * 3)) * 100) : 0;
  const semDone = n => SESSIONS.filter(s => s.sem === n && quizResults[s.id]).length;

  const onFinish = (id, result) => setQuizResults(r => ({ ...r, [id]: result }));
  const openSession = (s, tab = "details") => { setSelectedId(s.id); setCtxTab(tab); setCtxOpen(true); };
  const openLecture = s => { setLectureId(s.id); setSelectedId(s.id); setActiveNav(s.sem === 1 ? "s1" : "s2"); };

  /* ── URL slug routing (hash-based, deep-linkable) ── */
  const findBySlug = (slug) => SESSIONS.find(s => slugify(s.title) === slug);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const applyHash = () => {
      const h = window.location.hash.replace(/^#\/?/, "");
      if (!h) return;
      const [top, arg, extra] = h.split("/");
      if (["dashboard", "s1", "s2", "diagrams", "book", "scroller", "exams"].includes(top)) {
        setActiveNav(top); setLectureId(null);
      } else if (top === "lecture" && arg) {
        const s = findBySlug(arg);
        if (s) { setLectureId(s.id); setSelectedId(s.id); setActiveNav(s.sem === 1 ? "s1" : "s2"); }
      } else if (top === "class" && arg) {
        const s = findBySlug(arg);
        if (s) {
          setSelectedId(s.id); setActiveNav(s.sem === 1 ? "s1" : "s2");
          setCtxTab(extra === "quiz" ? "quiz" : "details"); setCtxOpen(true); setLectureId(null);
        }
      } else if (top === "exam" && arg) {
        setActiveNav("exams");
        setTimeout(() => { const el = document.getElementById("exam-" + arg); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let target = "#/" + activeNav;
    if (lectureId) {
      const s = SESSIONS.find(x => x.id === lectureId);
      if (s) target = "#/lecture/" + slugify(s.title);
    } else if (selectedId && (activeNav === "s1" || activeNav === "s2")) {
      const s = SESSIONS.find(x => x.id === selectedId);
      if (s) target = "#/class/" + slugify(s.title) + (ctxTab === "quiz" ? "/quiz" : "");
    }
    if (window.location.hash !== target) history.replaceState(null, "", target);
  }, [activeNav, lectureId, selectedId, ctxTab]);
  const statusOf = s => quizResults[s.id] ? (quizResults[s.id].score === 3 ? "Perfect" : "Done") : "To do";
  const statusVariant = s => quizResults[s.id] ? (quizResults[s.id].score === 3 ? "success" : "info") : "default";

  if (!session) {
    return (
      <>
        <style>{TOKENS}</style>
        <div data-theme={theme}>
          <Landing theme={theme} setTheme={setTheme} onLogin={role => setSession({ role })} />
        </div>
      </>
    );
  }

  /* ── shared bits ── */
  const Meta = ({ s }) => (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      <Badge variant={s.reading.kind === "paper" ? "info" : "warning"} size="xs">
        {s.reading.kind === "paper" ? "Research paper" : "Press article"}
      </Badge>
      <Badge variant={statusVariant(s)} size="xs">{statusOf(s)}</Badge>
      <span style={{ fontSize: 10, color: "var(--muted-foreground)", display: "inline-flex", alignItems: "center", gap: 3 }}>
        <Clock size={10} /> 1h30
      </span>
    </div>
  );

  /* ── views ── */
  const TilesView = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14, padding: 16 }}>
      {filtered.map(s => (
        <div key={s.id} className="hoverable" onClick={() => openSession(s)}
          style={{ background: "var(--card)", border: `1px solid ${selectedId === s.id ? "var(--primary)" : "var(--border)"}`,
            borderRadius: 12, padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 26 }}>{s.thumb}</span>
            <Badge variant="default" size="xs">Class {s.num}</Badge>
          </div>
          <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{s.title}</div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.4, display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{s.desc}</div>
          <Meta s={s} />
          <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
            <Btn variant="secondary" size="xs" onClick={e => { e.stopPropagation(); openLecture(s); }}>
              <BookOpen size={12} /> Lecture
            </Btn>
            <Btn variant={quizResults[s.id] ? "secondary" : "primary"} size="xs"
              onClick={e => { e.stopPropagation(); openSession(s, "quiz"); }}>
              <ListChecks size={12} /> {quizResults[s.id] ? `${quizResults[s.id].score}/3` : "Quiz"}
            </Btn>
          </div>
        </div>
      ))}
    </div>
  );

  const TableView = () => (
    <div style={{ padding: 16, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--muted-foreground)", fontSize: 11 }}>
            {["#", "Session", "Sem", "Reading", "Lecture", "Quiz", "Status"].map(h => (
              <th key={h} style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--background)", fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id} onClick={() => openSession(s)}
              style={{ cursor: "pointer", background: selectedId === s.id ? "var(--accent)" : "transparent" }}>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)", color: "var(--muted-foreground)" }}>{s.num}</td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)", fontWeight: 600 }}>{s.thumb} {s.title}</td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)" }}>S{s.sem}</td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)" }}>
                <Badge variant={s.reading.kind === "paper" ? "info" : "warning"} size="xs">{s.reading.kind === "paper" ? "Paper" : "Press"}</Badge>
              </td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)" }}>
                <Btn variant="ghost" size="xs" onClick={e => { e.stopPropagation(); openLecture(s); }}>Read</Btn>
              </td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)" }}>
                <Btn variant="ghost" size="xs" onClick={e => { e.stopPropagation(); openSession(s, "quiz"); }}>
                  {quizResults[s.id] ? `${quizResults[s.id].score}/3` : "Start"}
                </Btn>
              </td>
              <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)" }}>
                <Badge variant={statusVariant(s)} size="xs">{statusOf(s)}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ScrollView = () => (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16, maxWidth: 720, margin: "0 auto" }}>
      {filtered.map(s => (
        <div key={s.id} className="hoverable" onClick={() => openSession(s)}
          style={{ background: "var(--card)", border: `1px solid ${selectedId === s.id ? "var(--primary)" : "var(--border)"}`,
            borderRadius: 16, padding: 22, cursor: "pointer", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 34 }}>{s.thumb}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <Badge variant="default" size="xs">Semester {s.sem}</Badge>
              <Badge variant="primary" size="xs">Class {s.num}</Badge>
            </div>
          </div>
          <div className="serif" style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.25, marginBottom: 6 }}>{s.title}</div>
          <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 10 }}>{s.desc}</div>
          <div style={{ background: "var(--surface-2)", borderRadius: 8, padding: "8px 12px", fontSize: 11.5, marginBottom: 10,
            color: "var(--secondary-foreground)", display: "flex", gap: 8, alignItems: "flex-start" }}>
            {s.reading.kind === "paper" ? <FlaskConical size={14} style={{ flexShrink: 0, marginTop: 1 }} /> : <Newspaper size={14} style={{ flexShrink: 0, marginTop: 1 }} />}
            <span>{s.reading.ref}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{s.tags.map(t => <Badge key={t} size="xs">{t}</Badge>)}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn variant="secondary" size="xs" onClick={e => { e.stopPropagation(); openLecture(s); }}><BookOpen size={12} /> Lecture</Btn>
              <Btn variant={quizResults[s.id] ? "secondary" : "primary"} size="xs" onClick={e => { e.stopPropagation(); openSession(s, "quiz"); }}>
                <ListChecks size={12} /> {quizResults[s.id] ? `${quizResults[s.id].score}/3` : "Quiz"}
              </Btn>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const LectureReader = () => (
    <div style={{ padding: "20px 24px 48px", maxWidth: 760, margin: "0 auto" }}>
      <Btn variant="ghost" size="xs" onClick={() => setLectureId(null)} style={{ marginBottom: 14 }}>
        <ArrowLeft size={13} /> Back to Semester {lecture.sem}
      </Btn>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <Badge variant="primary" size="xs">Class {lecture.num}</Badge>
        <Badge variant="default" size="xs">Semester {lecture.sem}</Badge>
        <Badge variant={statusVariant(lecture)} size="xs">{statusOf(lecture)}</Badge>
      </div>
      <h1 className="serif" style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.15, marginBottom: 4 }}>
        {lecture.thumb} {lecture.title}
      </h1>
      <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 20 }}>
        Lecture · 1h30 · 10 sections · quiz at the end of class
      </div>
      <LectureBody s={lecture} />
      <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
        <Btn variant="primary" size="md" onClick={() => { openSession(lecture, "quiz"); }}>
          <ListChecks size={15} /> {quizResults[lecture.id] ? "Review the quiz" : "Take the end-of-class quiz"}
        </Btn>
        {(() => {
          const next = SESSIONS.find(x => x.num === lecture.num + 1);
          return next ? (
            <Btn variant="secondary" size="md" onClick={() => openLecture(next)}>
              Next lecture <ChevronRight size={14} />
            </Btn>
          ) : null;
        })()}
      </div>
    </div>
  );

  const BookView = () => (
    <div style={{ padding: "24px 24px 64px", maxWidth: 780, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 30, paddingBottom: 26, borderBottom: "1px solid var(--border)" }}>
        <SociMark size={44} />
        <h1 className="serif" style={{ fontSize: 34, fontWeight: 800, margin: "12px 0 4px" }}>The Sociology of Artificial Intelligence</h1>
        <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>The complete course · 26 lectures · La Sorbonne · L3 Sociology · 2026/2027</div>
        {isTeacher && <div style={{ marginTop: 8 }}><Badge variant="warning" size="xs">Teacher edition — rubrics visible in Exams</Badge></div>}
      </div>

      {/* Table of contents */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 36 }}>
        <div className="serif" style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>Table of Contents</div>
        {[1, 2].map(n => (
          <div key={n} style={{ marginBottom: n === 1 ? 14 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-foreground)", letterSpacing: "0.06em", marginBottom: 6 }}>
              PART {n} — {n === 1 ? "MACHINES, MARKETS & MEDIA" : "POWER, ETHICS & FUTURES"}
            </div>
            {SESSIONS.filter(s => s.sem === n).map(s => (
              <button key={s.id}
                onClick={() => { const el = document.getElementById("bk-" + s.id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                style={{ display: "flex", width: "100%", alignItems: "baseline", gap: 8, background: "transparent", border: "none",
                  cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, color: "var(--foreground)", padding: "3px 0", textAlign: "left" }}>
                <span style={{ color: "var(--muted-foreground)", width: 22, flexShrink: 0 }}>{s.num}.</span>
                <span style={{ flex: 1 }}>{s.title}</span>
                {quizResults[s.id] && <CheckCircle2 size={12} style={{ color: "var(--success)", flexShrink: 0 }} />}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Chapters */}
      {[1, 2].map(n => (
        <div key={n}>
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-foreground)", letterSpacing: "0.1em" }}>PART {n}</div>
            <div className="serif" style={{ fontSize: 26, fontWeight: 800 }}>{n === 1 ? "Machines, Markets & Media" : "Power, Ethics & Futures"}</div>
          </div>
          {SESSIONS.filter(s => s.sem === n).map(s => (
            <div key={s.id} id={"bk-" + s.id} style={{ marginBottom: 44, paddingBottom: 36, borderBottom: "1px solid var(--border-subtle)", scrollMarginTop: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", letterSpacing: "0.08em", marginBottom: 4 }}>
                CHAPTER {s.num}
              </div>
              <h2 className="serif" style={{ fontSize: 25, fontWeight: 800, lineHeight: 1.2, marginBottom: 14 }}>{s.thumb} {s.title}</h2>
              <LectureBody s={s} compact />
              <div style={{ marginTop: 14 }}>
                <Btn variant="secondary" size="xs" onClick={() => openSession(s, "quiz")}>
                  <ListChecks size={12} /> {quizResults[s.id] ? `Quiz ${quizResults[s.id].score}/3 — review` : "Chapter quiz"}
                </Btn>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ textAlign: "center", color: "var(--muted-foreground)", fontSize: 12, fontStyle: "italic" }}>
        — End of the course. The question "what kind of society do we want?" is addressed to you. —
      </div>
    </div>
  );

  const ScrollerView = () => {
    const slides = [];
    SESSIONS.forEach(s => {
      slides.push({ type: "title", s });
      s.lec.sections.forEach((sec, i) => slides.push({ type: "sec", s, sec, i }));
    });
    return (
      <div style={{ height: "100%", overflowY: "auto", scrollSnapType: "y mandatory" }}>
        {slides.map((sl, idx) => (
          <div key={idx} style={{ height: "100%", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex",
            alignItems: "center", justifyContent: "center", padding: "18px 18px" }}>
            <div style={{ width: "100%", maxWidth: 480, maxHeight: "100%", overflowY: "auto" }}>
              {sl.type === "title" ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 56, marginBottom: 10 }}>{sl.s.thumb}</div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
                    <Badge variant="primary" size="xs">Class {sl.s.num}</Badge>
                    <Badge variant="default" size="xs">Semester {sl.s.sem}</Badge>
                    <Badge variant={statusVariant(sl.s)} size="xs">{statusOf(sl.s)}</Badge>
                  </div>
                  <div className="serif" style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>{sl.s.title}</div>
                  <p style={{ fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 16 }}>{sl.s.desc}</p>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <Btn variant="secondary" size="xs" onClick={() => openLecture(sl.s)}><BookOpen size={12} /> Full lecture</Btn>
                    <Btn variant="primary" size="xs" onClick={() => openSession(sl.s, "quiz")}>
                      <ListChecks size={12} /> {quizResults[sl.s.id] ? `${quizResults[sl.s.id].score}/3` : "Quiz"}
                    </Btn>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
                    <Badge variant="primary" size="xs">Class {sl.s.num}</Badge>
                    <Badge variant="default" size="xs">Section {sl.i + 1}/{sl.s.lec.sections.length}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8 }}>{sl.s.thumb} {sl.s.title}</div>
                  <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                    {sl.s.lec.sections.map((_, j) => (
                      <span key={j} style={{ flex: 1, height: 3, borderRadius: 2, background: j <= sl.i ? "var(--primary)" : "var(--surface-3)" }} />
                    ))}
                  </div>
                  <div className="serif" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.25, marginBottom: 12 }}>
                    {sl.i + 1}. {sl.sec.h}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {sl.sec.ps.map((p, pi) => (
                      <p key={pi} style={{ fontSize: 14, lineHeight: 1.7 }}>{p}</p>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ textAlign: "center", marginTop: 24, fontSize: 10.5, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>
                {idx < slides.length - 1 ? "SCROLL ↓" : "— END OF COURSE —"}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const Dashboard = () => (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20, maxWidth: 960, margin: "0 auto" }}>
      <div>
        <div className="serif" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.01em" }}>The Sociology of Artificial Intelligence</div>
        <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 2 }}>
          La Sorbonne · Licence 3 Sociologie · 2026/2027 · 26 classes × 1h30 · 10-section lectures · 26 quizzes · 2 midterms · 2 finals
        </div>
      </div>

      {isTeacher && (
        <div style={{ background: "var(--card)", border: "1px solid var(--primary)", borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <BarChart3 size={15} style={{ color: "var(--primary)" }} /> Cohort analytics
            <Badge variant="warning" size="xs">Teacher only</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 12 }}>
            {[["Enrolled students", COHORT.students, Users], ["Avg quiz score", COHORT.avgQuiz + "%", Award],
              ["Course completion", COHORT.completion + "%", CheckCircle2], ["At-risk students", COHORT.atRisk, AlertTriangle]].map(([l, v, I]) => (
              <div key={l} style={{ background: "var(--surface-2)", borderRadius: 8, padding: 12 }}>
                <I size={14} style={{ color: l === "At-risk students" ? "var(--warning)" : "var(--primary)" }} />
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{v}</div>
                <div style={{ fontSize: 10.5, color: "var(--muted-foreground)" }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 11.5 }}>
            <div>
              <div style={{ fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>Strongest quizzes</div>
              {COHORT.top.map(([t, v]) => <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}><span>{t}</span><strong>{v}%</strong></div>)}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "var(--warning)", marginBottom: 4 }}>Needs attention</div>
              {COHORT.low.map(([t, v]) => <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}><span>{t}</span><strong>{v}%</strong></div>)}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {[
          { label: "Quizzes completed", value: `${doneCount}/26`, icon: CheckCircle2, color: "var(--success)" },
          { label: "Average quiz score", value: doneCount ? `${avgPct}%` : "—", icon: Award, color: "var(--primary)" },
          { label: "Semester 1 progress", value: `${semDone(1)}/13`, icon: BookOpen, color: "var(--info)" },
          { label: "Semester 2 progress", value: `${semDone(2)}/13`, icon: GraduationCap, color: "var(--warning)" },
        ].map(k => (
          <div key={k.label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
            <k.icon size={18} style={{ color: k.color }} />
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {[1, 2].map(n => (
        <div key={n} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              Semester {n} — {n === 1 ? "Machines, Markets & Media" : "Power, Ethics & Futures"}
            </div>
            <Btn variant="ghost" size="xs" onClick={() => setActiveNav(n === 1 ? "s1" : "s2")}>Open <ChevronRight size={12} /></Btn>
          </div>
          <div style={{ height: 8, background: "var(--surface-2)", borderRadius: 9999, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ height: "100%", width: `${(semDone(n) / 13) * 100}%`, background: "var(--primary)", borderRadius: 9999, transition: "width .3s" }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SESSIONS.filter(s => s.sem === n).map(s => (
              <button key={s.id} onClick={() => openLecture(s)} title={s.title}
                style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer",
                  background: quizResults[s.id] ? "var(--success-muted)" : "var(--surface-2)",
                  color: quizResults[s.id] ? "var(--success)" : "var(--muted-foreground)",
                  fontSize: 11, fontWeight: 700, fontFamily: "inherit" }}>
                {s.num}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Assessment structure</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {EXAMS.map(e => (
            <div key={e.id} onClick={() => setActiveNav("exams")}
              style={{ border: "1px solid var(--border-subtle)", borderRadius: 8, padding: 12, cursor: "pointer", background: "var(--surface-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>S{e.sem} {e.kind}</span>
                <Badge variant={e.kind === "Final" ? "primary" : "info"} size="xs">{e.week}</Badge>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4 }}>{e.format}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ExamsView = () => (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, maxWidth: 860, margin: "0 auto" }}>
      <div className="serif" style={{ fontSize: 22, fontWeight: 800 }}>Exams · 2026/2027</div>
      <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", lineHeight: 1.55 }}>
        Four exams across the year — two midterms and two finals. Each card below opens a
        <strong style={{ color: "var(--foreground)" }}> functional practice exam</strong> pulling MCQs from the covered
        classes&rsquo; quiz banks, with a live timer and an essay-drafting pane.
      </div>
      {EXAMS.map(e => (
        <ExamCard key={e.id} exam={e} isTeacher={isTeacher} />
      ))}
    </div>
  );

  const DiagramsView = () => {
    const [filter, setFilter] = useState("all"); // all | s1 | s2 | <kind>
    const KINDS = ["flow", "cycle", "tree", "compare", "layers", "pyramid", "matrix"];
    const items = SESSIONS.map(s => ({ s, d: DIAGRAMS[s.id] })).filter(x => x.d);
    const shown = items.filter(({ s, d }) =>
      filter === "all" ? true :
      filter === "s1" ? s.sem === 1 :
      filter === "s2" ? s.sem === 2 :
      d.kind === filter
    );

    return (
      <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 16 }}>
          <div className="serif" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Diagrams</div>
          <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
            One editorial diagram for each of the 26 classes — {items.length} total, in 7 kinds.
            Click any card to open the corresponding lecture.
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {[
            { id: "all", label: `All · ${items.length}` },
            { id: "s1", label: `Semester 1 · ${items.filter(x => x.s.sem === 1).length}` },
            { id: "s2", label: `Semester 2 · ${items.filter(x => x.s.sem === 2).length}` },
            ...KINDS.map(k => ({ id: k, label: `${k} · ${items.filter(x => x.d.kind === k).length}` })),
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ padding: "6px 12px", borderRadius: 999, fontFamily: "inherit", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${filter === f.id ? "var(--primary)" : "var(--border)"}`,
                background: filter === f.id ? "var(--accent)" : "var(--surface-1)",
                color: filter === f.id ? "var(--accent-foreground)" : "var(--muted-foreground)",
                textTransform: "capitalize" }}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
          {shown.map(({ s, d }) => (
            <div key={s.id} className="hoverable" onClick={() => openLecture(s)}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 12, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Badge variant="default" size="xs">S{s.sem}</Badge>
                  <Badge variant="primary" size="xs">Class {s.num}</Badge>
                </div>
                <span style={{ fontSize: 20 }}>{s.thumb}</span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.3, color: "var(--foreground)" }}>{s.title}</div>
              <Diagram spec={d} compact />
              <Btn variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); openLecture(s); }}>
                <BookOpen size={12} /> Open lecture <ChevronRight size={12} />
              </Btn>
            </div>
          ))}
        </div>
        {shown.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted-foreground)", fontSize: 13 }}>
            No diagrams match that filter.
          </div>
        )}
      </div>
    );
  };

  const showSessionsUI = (activeNav === "s1" || activeNav === "s2") && !lecture;

  return (
    <>
      <style>{TOKENS}</style>
      <div data-theme={theme} style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--background)", color: "var(--foreground)", fontFamily: "'Inter', system-ui, sans-serif", fontSize: 13 }}>

        {/* ── HEADER ── */}
        <header style={{ height: 52, flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "0 14px",
          background: "var(--secondary)", borderBottom: "1px solid var(--border)", zIndex: 30 }}>
          <button onClick={() => setNavOpen(o => !o)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted-foreground)", display: "flex" }}>
            <Menu size={18} />
          </button>
          <SociMark size={28} />
          <div style={{ lineHeight: 1.15 }}>
            <div className="serif" style={{ fontWeight: 800, fontSize: 16, letterSpacing: "0.01em" }}>SociAI</div>
            <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>Sociology of AI · La Sorbonne · L3 · 2026/27</div>
          </div>
          <Badge variant={isTeacher ? "warning" : "primary"} size="xs">{isTeacher ? "Teacher" : "Student"}</Badge>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative", width: 210 }}>
            <Search size={14} style={{ position: "absolute", left: 9, top: 8, color: "var(--muted-foreground)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search topics, readings…"
              style={{ width: "100%", background: "var(--input)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
                padding: "6px 10px 6px 30px", fontSize: 12, color: "var(--foreground)", fontFamily: "inherit", outline: "none" }} />
          </div>
          <button onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))} aria-label="Toggle theme"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px",
              cursor: "pointer", color: "var(--foreground)", display: "flex" }}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Btn variant="ghost" size="xs" onClick={() => { setSession(null); setActiveNav("dashboard"); setSelectedId(null); setLectureId(null); }}>
            <LogOut size={13} /> Log out
          </Btn>
        </header>

        {/* ── BODY ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* LEFT NAV */}
          <nav style={{ width: navOpen ? 210 : 56, flexShrink: 0, background: "var(--secondary)", borderRight: "1px solid var(--border)",
            display: "flex", flexDirection: "column", padding: 8, gap: 4, transition: "width .2s", zIndex: 20 }}>
            {NAV.map(n => {
              const active = activeNav === n.id;
              return (
                <button key={n.id} className={active ? "" : "navitem"}
                  onClick={() => { setActiveNav(n.id); setSelectedId(null); setLectureId(null); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none",
                    cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: active ? 700 : 500,
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "var(--accent-foreground)" : "var(--secondary-foreground)",
                    justifyContent: navOpen ? "flex-start" : "center", whiteSpace: "nowrap", overflow: "hidden" }}>
                  <n.icon size={16} style={{ flexShrink: 0 }} />
                  {navOpen && n.label}
                  {navOpen && (n.id === "s1" || n.id === "s2") && (
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--muted-foreground)", fontWeight: 500 }}>
                      {semDone(n.id === "s1" ? 1 : 2)}/13
                    </span>
                  )}
                </button>
              );
            })}
            <div style={{ flex: 1 }} />
            {navOpen && (
              <div style={{ padding: "8px 12px", fontSize: 10, color: "var(--muted-foreground)", borderTop: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}><Mic size={11} /> Presentations in week 25</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Sparkles size={11} /> SociAI v2.1</div>
              </div>
            )}
          </nav>

          {/* MAIN */}
          <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
            <div style={{ height: 40, flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "0 14px",
              borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>
                {lecture ? `Lecture · Class ${lecture.num}` :
                  activeNav === "dashboard" ? "Overview" : activeNav === "exams" ? "Exams" : activeNav === "book" ? "The Course Book" :
                  activeNav === "diagrams" ? "Diagrams" :
                  activeNav === "scroller" ? "Lecture Scroller" :
                  `Semester ${sem} — ${sem === 1 ? "Machines, Markets & Media" : "Power, Ethics & Futures"}`}
              </span>
              {showSessionsUI && <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{filtered.length} classes</span>}
              <div style={{ flex: 1 }} />
              {showSessionsUI && (
                <div style={{ display: "flex", background: "var(--surface-2)", borderRadius: 8, padding: 2, border: "1px solid var(--border)" }}>
                  {[["scroll", Rows3], ["tiles", LayoutGrid], ["table", List]].map(([m, Icon]) => (
                    <button key={m} onClick={() => setViewMode(m)}
                      style={{ border: "none", cursor: "pointer", padding: "4px 10px", borderRadius: 6, display: "flex", alignItems: "center",
                        background: viewMode === m ? "var(--primary)" : "transparent",
                        color: viewMode === m ? "var(--primary-foreground)" : "var(--muted-foreground)" }}>
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              )}
              {selected && (
                <Btn variant="ghost" size="xs" onClick={() => setCtxOpen(o => !o)}>
                  {ctxOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </Btn>
              )}
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {lecture ? <LectureReader /> : (
                <>
                  {activeNav === "dashboard" && <Dashboard />}
                  {activeNav === "diagrams" && <DiagramsView />}
                  {activeNav === "exams" && <ExamsView />}
                  {activeNav === "book" && <BookView />}
                  {activeNav === "scroller" && <ScrollerView />}
                  {showSessionsUI && (viewMode === "tiles" ? <TilesView /> : viewMode === "table" ? <TableView /> : <ScrollView />)}
                </>
              )}
            </div>
          </main>

          {/* RIGHT CONTEXT */}
          {selected && ctxOpen && (
            <aside style={{ width: 330, flexShrink: 0, background: "var(--secondary)", borderLeft: "1px solid var(--border)",
              display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 20 }}>{selected.thumb}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5, lineHeight: 1.25 }}>{selected.title}</div>
                  <div style={{ fontSize: 10, color: "var(--muted-foreground)" }}>Class {selected.num} · Semester {selected.sem} · 1h30</div>
                </div>
                <button onClick={() => setSelectedId(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted-foreground)", display: "flex" }}>
                  <X size={15} />
                </button>
              </div>
              <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
                {[["details", "Details"], ["reading", "Reading"], ["quiz", "Quiz"]].map(([id, label]) => (
                  <button key={id} onClick={() => setCtxTab(id)}
                    style={{ flex: 1, padding: "8px 0", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12,
                      fontWeight: ctxTab === id ? 700 : 500, background: "transparent",
                      color: ctxTab === id ? "var(--accent-foreground)" : "var(--muted-foreground)",
                      borderBottom: `2px solid ${ctxTab === id ? "var(--primary)" : "transparent"}` }}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
                {ctxTab === "details" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontSize: 12.5, lineHeight: 1.55 }}>{selected.desc}</p>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Themes</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{selected.tags.map(t => <Badge key={t} size="xs">{t}</Badge>)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Session format</div>
                      <div style={{ fontSize: 12, color: "var(--secondary-foreground)", display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Circle size={7} style={{ color: "var(--primary)" }} /> Lecture & discussion of the reading (~70 min)</span>
                        <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Circle size={7} style={{ color: "var(--primary)" }} /> Short end-of-class quiz (~15 min)</span>
                      </div>
                    </div>
                    <Btn variant="primary" size="sm" onClick={() => openLecture(selected)} style={{ justifyContent: "center" }}>
                      <BookOpen size={14} /> Read the full lecture
                    </Btn>
                    <Btn variant="secondary" size="sm" onClick={() => setCtxTab("quiz")} style={{ justifyContent: "center" }}>
                      <ListChecks size={14} /> {quizResults[selected.id] ? "Review quiz" : "Take the quiz"}
                    </Btn>
                  </div>
                )}
                {ctxTab === "reading" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Badge variant={selected.reading.kind === "paper" ? "info" : "warning"}>
                      {selected.reading.kind === "paper" ? "Research paper" : "Press article"}
                    </Badge>
                    <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 8, padding: 12,
                      fontSize: 12, lineHeight: 1.55, display: "flex", gap: 8 }}>
                      {selected.reading.kind === "paper" ? <FlaskConical size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--info)" }} /> : <Newspaper size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--warning)" }} />}
                      <span>{selected.reading.ref}</span>
                    </div>
                    <p style={{ fontSize: 11.5, color: "var(--muted-foreground)", lineHeight: 1.5 }}>
                      Read before class. The quiz and part of the exam MCQs draw directly from this text — annotate the argument, the evidence, and one point you would contest.
                    </p>
                  </div>
                )}
                {ctxTab === "quiz" && (
                  <QuizPanel key={selected.id + (quizResults[selected.id] ? "-done" : "-new")}
                    session={selected} result={quizResults[selected.id]} onFinish={onFinish} isTeacher={isTeacher} />
                )}
              </div>
            </aside>
          )}
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ height: 40, flexShrink: 0, display: "flex", alignItems: "center", gap: 16, padding: "0 16px",
          background: "var(--secondary)", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted-foreground)", zIndex: 30 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)" }} />
            {isTeacher ? "Teacher session" : "Student session"} · {doneCount}/26 quizzes{doneCount ? ` · avg ${avgPct}%` : ""}
          </span>
          <Btn variant="ghost" size="xs" onClick={() => openLecture(SESSIONS[Math.floor(Math.random() * SESSIONS.length)])}>
            <Shuffle size={12} /> Random
          </Btn>
          <span style={{ flex: 1, textAlign: "center" }}>
            {lecture ? `Reading Class ${lecture.num} of 26` :
              showSessionsUI ? `Showing ${filtered.length} of 13 classes · Semester ${sem}` :
              activeNav === "book" ? "26 chapters · 260 sections · full course" :
              activeNav === "diagrams" ? "26 editorial diagrams · 7 kinds · one per class" :
              activeNav === "scroller" ? "286 slides · one section at a time · scroll ↓" : "Sociology L3 · 26 × 1h30 · 10 sections per lecture"}
          </span>
          <span>SociAI v2.1 · La Sorbonne 2026/27</span>
        </footer>
      </div>
    </>
  );
}