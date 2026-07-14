import { useState, useMemo } from "react";
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
        { h: "From tools to environments", p: "Early sociology of technology treated media as discrete tools with measurable 'effects'. Couldry and Hepp argue we have entered 'deep mediatization': digital media and data infrastructures are now entangled with every domain of social life — work, intimacy, politics, health. Technology is no longer something we use; it is somewhere we live." },
        { h: "Datafication and the social", p: "Datafication is the conversion of social action — friendship, movement, mood, attention — into quantifiable, machine-readable data. Once quantified, social life becomes calculable, predictable and, crucially, monetizable. This shift underwrites everything we study this year, from surveillance capitalism to algorithmic management." },
        { h: "The sociological lens", p: "Against technological determinism ('AI will inevitably cause X') and pure social constructivism ('technology is whatever we make of it'), we adopt a socio-technical approach: technologies are shaped by social interests and, once deployed, reshape social relations in patterned, unequal ways. Our recurring questions: who builds it, who benefits, who bears the risk, and who gets to decide?" },
        { h: "A short history of the digital", p: "From ARPANET to the smartphone to generative AI, digitalisation advanced in waves — connection, participation, platformisation, datafication, automation. Each wave layered new infrastructures on the last; none replaced society, but each rewired how coordination, commerce and conversation happen." },
        { h: "Mediatization of institutions", p: "Schools, hospitals, courts and churches now operate through platforms, dashboards and data flows. Sociologists track how institutional logics change when metrics travel: a school run through learning analytics is not the same school with new tools — its definition of a good student shifts." },
        { h: "The quantified self", p: "Wearables, streaks and step counts turn the body and the day into data projects. Self-tracking promises autonomy and knowledge, yet it also imports market metrics into intimate life — optimisation becomes a moral vocabulary for sleep, mood and friendship." },
        { h: "Digital divides", p: "Access is only the first divide. Skills, usage and outcomes divide again: the same internet yields homework help in one household and pure entertainment platforms in another. AI adds a new layer — who has the tools, literacy and power to benefit from automation." },
        { h: "Key thinkers, mapped", p: "This year you will meet Zuboff on extraction, boyd on youth publics, Turkle on intimacy, van Dijck on platforms, Bradford on regulation, Gabriel on values. Keep a running map: most disagreements between them are really disagreements about where power sits." },
        { h: "How to study a digital society", p: "Digital sociology mixes classic methods — interviews, ethnography, surveys — with new ones: platform data analysis, algorithm audits, digital trace research. Each method sees differently, and each raises fresh ethical questions about consent and visibility." },
        { h: "Using this course", p: "Every class pairs one reading with one lecture and ends with a quiz; exams reward connections across sessions, not summaries. Read before class, contest at least one claim per text, and keep asking the four questions: who builds, who benefits, who bears risk, who decides." },
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
        { h: "What is an algorithm, sociologically?", p: "Technically, an algorithm is a finite sequence of steps that transforms input into output. Kitchin insists this definition misleads: real-world algorithms are 'ontogenetic' — endlessly tweaked, retrained and A/B-tested — and embedded in assemblages of code, data, business models, legal constraints and human workarounds. To study 'the algorithm' is to study that whole assemblage." },
        { h: "Black boxes and method", p: "Algorithms resist study: they are proprietary, technically opaque, personalised (everyone sees a different output) and constantly changing. Kitchin surveys methodological responses — interviewing designers, reverse engineering outputs, auditing with sock-puppet accounts, ethnographies of coding teams. Each sees only part of the elephant, which is itself a finding about power." },
        { h: "Algorithmic power and governance", p: "Ranking, filtering and scoring are acts of classification — and, as Bourdieu and Foucault taught, classification is power. When such classification is automated and naturalised as 'just math', it becomes harder to contest. 'Algorithmic governance' names the ordering of social life through such systems, often without the procedural safeguards we demand of human bureaucracy." },
        { h: "A short history of automated decision", p: "Long before deep learning, bureaucracies scored people: credit ratings, actuarial tables, school tracking. Algorithms industrialise a much older practice — formal classification of persons — which is why the sociology of bureaucracy remains excellent preparation for studying them." },
        { h: "Recommenders as culture machines", p: "Recommendation systems do not just serve taste; they shape it. By ranking what is seen, they set agendas for music, news and belief — a curatorial power once held by editors and DJs, now exercised by optimisation loops tuned to engagement." },
        { h: "The scored society", p: "Credit scores, fraud scores, risk scores, hiring scores: life chances increasingly pass through numerical gates. Scores feel objective, yet each encodes choices about data, thresholds and error costs — and mistakes fall unevenly across social groups." },
        { h: "Feedback loops and performativity", p: "Algorithmic predictions act on the world they predict. Police sent where crime was recorded find more crime there; trending lists make trends. Sociologists call this performativity — the model helps produce the reality it claims merely to describe." },
        { h: "Folk theories of the algorithm", p: "Users develop their own theories — shadowbans, lucky posting hours, the mood of the feed — and act on them. These folk theories matter sociologically: people strategise around imagined algorithms, so even a misunderstood system reshapes behaviour." },
        { h: "Accountability and explanation", p: "Explainable AI promises reasons for decisions, but explanation is a social relation, not a printout: an appeal needs someone empowered to reverse the outcome. Due process — notice, reasons, contest — is the older technology that automation often quietly removes." },
        { h: "A research agenda", p: "Kitchin leaves us a checklist: study the code and its makers, the data and its gaps, the institutions deploying the system, and the users adapting to it. No single method suffices — algorithmic power lives in the whole assemblage, so research must too." },
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
        { h: "Learning from data", p: "Classical software encodes rules by hand; machine learning infers rules from examples. In supervised learning, a model is trained on labelled pairs (this image → 'cat'; this CV → 'hired') and learns to generalise. The politics enter immediately: someone chose the labels, and historical labels encode historical judgments — including discriminatory ones." },
        { h: "Neural networks and deep learning", p: "Deep learning stacks layers of artificial neurons that progressively extract features from raw data — edges, then shapes, then faces. Its triumphs since 2012 rest on three inputs: massive datasets, massive computation, and low-paid human labelling work. The sociology of AI is therefore also a sociology of data supply chains and hidden labour." },
        { h: "Reinforcement learning", p: "In reinforcement learning an agent acts in an environment and adjusts its behaviour to maximise a reward signal — the paradigm behind AlphaGo and behind recommender systems tuned to maximise engagement. The choice of reward function is a value choice: optimise 'time on site' and you have chosen, sociologically, what human attention is for." },
        { h: "The data pipeline", p: "Before any learning happens, data is collected, cleaned, labelled and filtered — each step a chain of human judgments. Much of this work is outsourced to low-paid annotators worldwide, making modern AI a global labour arrangement as much as a technique." },
        { h: "Benchmarks and leaderboards", p: "Progress in machine learning is measured on shared benchmarks, and labs compete for leaderboard positions. Benchmarks quietly define what counts as intelligence — and when models overfit the test, headline progress can outrun real capability." },
        { h: "Generalisation and failure", p: "Models excel on data resembling their training distribution and fail strangely outside it — a stop sign with stickers, a dialect underrepresented online. Failure modes are patterned, not random, which is exactly what makes them sociologically interesting." },
        { h: "The compute economy", p: "Training frontier models requires GPU clusters costing hundreds of millions, concentrating capability in a few firms and states. Compute has become a strategic resource — rationed, export-controlled and lobbied over like oil." },
        { h: "Opening the black box, partly", p: "Interpretability research probes what networks internally represent, but full transparency remains elusive. For social scientists the lesson is pragmatic: govern systems by their measured behaviour and impacts, not by promises about their insides." },
        { h: "ML as organisational practice", p: "In real firms, machine learning is meetings, dashboards, deadlines and A/B tests. Ethnographies of ML teams show accuracy trading off against launch dates and revenue targets — the model reflects the organisation that built it." },
        { h: "Takeaways for the non-engineer", p: "You now hold the essential vocabulary: data, labels, objectives, rewards, generalisation. The recurring insight is that every technical choice — what to optimise, what to label, what to ignore — is simultaneously a social choice with distributional consequences." },
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
        { h: "Scale and the transformer moment", p: "Large language models are trained to predict the next token across trillions of words scraped largely from the internet. With sufficient scale, next-token prediction yields startling capabilities: translation, summarisation, reasoning-like behaviour. The recipe — more data, more parameters, more compute — concentrates capability in the handful of organisations that can afford it." },
        { h: "The stochastic parrots critique", p: "Bender and colleagues argue that LLMs are 'stochastic parrots': systems that stitch together plausible sequences from patterns in training data, without communicative intent or grounded meaning. Their warnings: web-scale corpora overrepresent dominant voices and encode bias; training costs are environmentally significant; and fluency invites misplaced trust — humans instinctively attribute a mind to coherent text." },
        { h: "Synthetic text in society", p: "When plausible text becomes free, institutions calibrated to scarce text come under strain: education (essays), journalism (content farms), science (paper mills), politics (astroturfing). The sociological question is not 'is the model intelligent?' but 'what happens to trust, authorship and epistemic authority when anyone can generate anything?'" },
        { h: "How an LLM is made", p: "Pretraining on web-scale text yields a raw predictor; fine-tuning and reinforcement learning from human feedback shape it into an assistant. The pipeline matters: each stage imports different values — the internet at large, then rater guidelines written by companies." },
        { h: "Hallucination and truth", p: "LLMs optimise plausibility, not truth, so they confidently fabricate citations, dates and case law. Fluent error is more dangerous than obvious error — it exploits our habit of treating coherent language as evidence of a knowing mind." },
        { h: "Prompting as literacy", p: "Getting good output has become a skill — framing, context, iteration. Like earlier literacies, it distributes unevenly and rewards those already educated, raising the question of who benefits most from supposedly democratising tools." },
        { h: "The hidden workforce", p: "Behind every polished model stand data workers: raters ranking responses, annotators flagging toxic content — often traumatic work outsourced at low wages. The apparent autonomy of AI conceals a very human production line." },
        { h: "Authorship and property", p: "Trained on copyrighted books, articles and art, generative models triggered lawsuits from authors and news organisations worldwide. At stake is a classic sociological question in new dress: who owns culture when culture becomes training data." },
        { h: "Open, closed, concentrated", p: "A handful of firms control frontier models; open-weight alternatives diffuse capability but complicate control. The open-versus-closed debate is really a debate about concentration: what powers should any private actor hold over a general-purpose technology." },
        { h: "The chatbot as social actor", p: "People confide in, argue with and attach to conversational systems designed for engagement. Whatever the machinery underneath, chatbots function socially as actors — which is why their design choices are matters of public, not merely technical, concern." },
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
        { h: "Behavioural surplus", p: "Platforms collect far more data than needed to run their services — location traces, dwell time, typing rhythms. Zuboff calls this excess 'behavioural surplus'. Like the enclosure of common land, it is a dispossession: experience that belonged to no market is unilaterally claimed as a corporate asset, without meaningful consent." },
        { h: "Prediction products and futures markets", p: "The surplus feeds machine learning that manufactures 'prediction products' — forecasts of what we will click, buy, and do — sold in 'behavioural futures markets' to advertisers and insurers. The user is neither the customer nor merely the product: we are the raw material. Revenue depends on prediction accuracy, which creates a structural incentive to know, and eventually to shape, behaviour." },
        { h: "Big Other and instrumentarian power", p: "Zuboff distinguishes this from Orwell's Big Brother: 'Big Other' does not want your soul, only your predictability. Its power is 'instrumentarian' — nudging, herding, conditioning at scale. Critics (e.g. Morozov) reply that Zuboff indicts surveillance while sparing capitalism itself; others note state surveillance and worker surveillance predate Google. Hold both the thesis and its critique." },
        { h: "From Ford to Google", p: "Zuboff situates surveillance capitalism historically: Fordism traded fair wages for mass consumption; the Google model discovered profit in prediction instead. Accumulation logics succeed each other — and each brings its own characteristic form of power." },
        { h: "The extraction imperative", p: "Prediction improves with more, and more varied, data — so surveillance capitalism expands relentlessly into voice, home, car, body and city. Network effects and economies of scale make this expansion self-reinforcing and hard for competitors or users to resist." },
        { h: "Consent theatre", p: "Terms of service and cookie banners perform consent without providing it: unread, unnegotiable, bundled. Sociologically they are legitimation rituals — converting structural asymmetry into the appearance of individual choice." },
        { h: "The state joins in", p: "Snowden revealed intelligence agencies riding commercial data flows; police purchase location data that brokers sell. The neat separation of corporate and state surveillance dissolves into a single interlocking apparatus with two doors." },
        { h: "The privacy paradox, revisited", p: "People say they value privacy yet click accept — a paradox often blamed on laziness. Better explanations are structural: no real alternatives, opaque trade-offs, and services woven into work and social life that one cannot simply exit." },
        { h: "Zuboff and her critics", p: "Marxist readers argue the problem is capitalism, not its surveillance variant; historians note that credit bureaus and workplace monitoring long predate Google; others say users get real value back. Testing the thesis against its critics is the exam skill this course rewards." },
        { h: "Exits and alternatives", p: "Responses range from individual hygiene to structural redesign: privacy law with teeth, data trusts holding rights collectively, public digital infrastructure, interoperability forcing competition. Each remedy implies a different diagnosis of where the harm lies." },
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
        { h: "Attention as commodity", p: "Ad-funded platforms sell audiences to advertisers; attention is their inventory. The longer you stay and the more you engage, the more inventory exists and the richer the targeting data becomes. This economic base explains design decisions better than any story about user preferences: the product is optimised to be difficult to leave." },
        { h: "Persuasive design", p: "Lewis's Guardian piece assembles the insiders' toolbox: variable-ratio rewards borrowed from slot machines (pull to refresh), social reciprocity hooks (read receipts, streaks), bottomless feeds that remove stopping cues, and notifications engineered as interruptions. Designers trained in behavioural psychology — many via Stanford's Persuasive Technology Lab — knew precisely which levers they were pulling." },
        { h: "Resistance and the limits of willpower", p: "Framing the problem as individual 'screen time' misdiagnoses a structural asymmetry: a thousand engineers optimising against one prefrontal cortex. Sociologically, responses divide into individual hygiene (digital detox), design ethics ('time well spent'), and regulation of dark patterns. Note who benefits when the solution is framed as personal discipline." },
        { h: "The attention merchants, a history", p: "Tim Wu traces the trade in attention from the penny press through radio and television to the smartphone. Each medium refined the same bargain — free content for audience minutes — and each provoked a backlash when capture went too far." },
        { h: "The interruption regime", p: "Notifications convert other people's priorities into your impulses. Studies of task switching show each interruption carries a recovery cost measured in minutes — an invisible tax the interruption economy levies on work, study and rest." },
        { h: "Metrics all the way down", p: "Inside platforms, attention is managed through dashboards: daily active users, session length, retention curves. Teams are bonused on these numbers, which is how the abstract attention economy becomes a very concrete set of design decisions." },
        { h: "Designing for children", p: "Autoplay, streaks and loot-box mechanics reach users whose self-regulation is still developing. Regulators have begun responding with age-appropriate design codes — a live test of whether persuasive design can be governed at all." },
        { h: "The inequality of attention", p: "Deep focus is becoming a class privilege: the wealthy buy schools, workplaces and apps that protect concentration, while attention-extracting defaults concentrate on everyone else. Attention, like income, has a distribution." },
        { h: "The design ethics movement", p: "Insiders founded movements — Time Well Spent, humane technology — pressuring firms to ship screen-time tools and calmer defaults. Sociologically, note both the achievement and the limit: engagement remains the business model beneath the wellness features." },
        { h: "Regulating dark patterns", p: "The EU now bans manipulative interface design in several instruments, and consumer agencies elsewhere follow. The regulatory question is precise: where does persuasion end and manipulation begin — and who bears the burden of proving the difference." },
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
        { h: "Networked publics", p: "boyd analyses social media as 'networked publics' — spaces constructed by technology with four distinctive affordances: persistence (content endures), visibility (audiences scale), spreadability (sharing is frictionless) and searchability (the past is retrievable). Teenage hangouts once evaporated at curfew; now they are archived, searchable and screenshot-able." },
        { h: "Context collapse and identity work", p: "Offline, we perform different selves for different audiences — Goffman's dramaturgy. Online, those audiences collapse into one: parents, friends, teachers and future employers read the same profile. Teens respond with 'social steganography' — encoding messages legible only to peers — and platform migration. Identity work continues; the stage has changed." },
        { h: "Beyond moral panic", p: "boyd shows that most teen online behaviour extends familiar sociality: hanging out, flirting, status negotiation — displaced online partly because adult society fenced off physical space (curfews, scheduled childhoods, stranger-danger). Panics about addiction and predators misread continuity as catastrophe, and often justify surveillance that harms the vulnerable teens it claims to protect." },
        { h: "Platform vernaculars", p: "Each platform breeds its own language — memes, duets, ratioing, alt accounts. These vernaculars are genuine cultures: learned, policed by peers, and legible only to insiders, which is precisely how youth cultures have always worked." },
        { h: "Weak ties and social capital", p: "Networks of acquaintances — weak ties — carry job leads and novel information, and platforms multiply them cheaply. The sociological question is what happens to strong ties, and whether maintained visibility substitutes for maintained intimacy." },
        { h: "Communities and subcultures", p: "From fandoms to support groups to extremist forums, online communities supply belonging that offline institutions increasingly do not. The same affordances that comfort the isolated teenager also organise the radicalised one — structure, not content, is the constant." },
        { h: "Harassment and moderation", p: "Networked publics distribute voice and abuse together; harassment falls heaviest on women and minorities. Moderation — human and algorithmic — becomes the invisible government of speech, making platform policy a de facto constitutional question." },
        { h: "The influencer economy", p: "Visibility became a career: creators monetise authenticity itself, managed by metrics and brand deals. boyd's identity work turns professional — the self as small enterprise, with the burnout statistics to match." },
        { h: "Beyond the Western platform", p: "Most of the world's users live outside Silicon Valley's imagination: WhatsApp organises commerce and rumour in Brazil and India; super-apps bundle whole lives in China. Generalising from American teens is a sampling error sociology must avoid." },
        { h: "Researching youth online, ethically", p: "Studying minors on platforms raises hard questions: public posts are not informed consent, and anonymisation fails against search. boyd's fieldwork models the standard — long-term presence, consent, and returning findings to the studied community." },
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
        { h: "The engagement machine", p: "In 2018 Facebook reweighted its News Feed around 'meaningful social interactions' — reactions, comments, reshares. Internal researchers documented the consequence: content optimised for the metric skewed toward outrage and sensationalism, and European political parties told the company they had shifted to more negative messaging because positive posts no longer travelled. The metric was not measuring the social world; it was remaking it." },
        { h: "Internal knowledge vs public accountability", p: "The Files showed rigorous internal research — on Instagram and teen body image, on under-resourced moderation in the Global South, on the 'XCheck' programme exempting elites from rules — coexisting with public denials. Sociologically this is Merton's organised scepticism inverted: knowledge produced, then contained, because acting on it threatened growth. The gap between what an organisation knows and what it admits is itself a power structure." },
        { h: "Whistleblowing and platform governance", p: "Frances Haugen's disclosures triggered hearings, lawsuits and regulation (feeding the EU's DSA). The episode raises durable questions: can self-regulation work when engagement pays the bills? Should platform research be subject to external audit like pharmaceutical trials? And what protections do tech whistleblowers — often the only window into these systems — deserve?" },
        { h: "The political economy of platforms", p: "Advertising funds the giants, and moats — network effects, data advantages, default deals, acquisitions — protect them. Understanding the balance sheet explains conduct better than any theory of corporate ethics." },
        { h: "Moderation at scale", p: "Tens of thousands of outsourced moderators absorb the feed's worst content for modest pay and lasting trauma, while automated filters catch volume but miss context. Every feed you scroll is cleaned by this hidden, global assembly line." },
        { h: "The amplification debate", p: "Does engagement ranking radicalise, or merely reflect demand? Studies conflict, partly because platforms control the data needed to answer. The Files showed internal researchers worrying precisely about amplification — evidence the question is real, not moral panic." },
        { h: "The Global South asymmetry", p: "Internal documents showed moderation budgets concentrated on English-speaking markets while risks concentrated elsewhere — most infamously in Myanmar. Platform power is global; platform accountability remains stubbornly local." },
        { h: "From Files to law", p: "Haugen's disclosures fed directly into the EU's Digital Services Act: risk assessments, researcher data access, independent audits. One leak reshaped the regulatory environment — a case study in how whistleblowing converts hidden knowledge into public rules." },
        { h: "Comparing whistleblowers", p: "Set Haugen beside Cambridge Analytica's Wylie and the NSA's Snowden: different institutions, same structure — insiders converting privileged access into public knowledge at personal cost. Whistleblowing has become a core accountability mechanism of the information age." },
        { h: "Can giants be governed?", p: "Options on the table: structural break-ups, interoperability mandates, fiduciary duties, public-utility treatment, or the EU's risk-regulation model. Each assumes a different theory of the harm — market power, design incentives, or scale itself." },
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
        { h: "Platform work and the employment question", p: "Gig platforms classify workers as independent contractors, shedding minimum wage, insurance and collective bargaining obligations. Yet the platform sets prices, allocates work, monitors performance and can 'deactivate' (fire) workers. The legal fiction of independence, contested in courts worldwide — including France's Cour de cassation — is the industry's foundational sociological fact." },
        { h: "Algorithmic management in practice", p: "Rosenblat and Stark document the machinery: blind ride acceptance (destination hidden until pickup), acceptance-rate thresholds enforced by threat of deactivation, surge-pricing heatmaps that promise earnings which often evaporate on arrival, and nudges ('You're almost there!') that borrow game design to extend shifts. Each mechanism relies on the platform knowing more than the worker — information asymmetry as a management technique." },
        { h: "Ratings, autonomy and resistance", p: "The five-star rating outsources supervision to customers: drivers perform emotional labour (Hochschild) — water bottles, curated small talk — for an unaccountable, biased evaluator whose scores can end their livelihood. Yet workers respond: WhatsApp groups decode the algorithm, forums share surge strategies, and couriers from Paris to Jakarta have organised strikes. Control invites counter-conduct." },
        { h: "Piecework, an old story", p: "Payment by task predates the factory: the putting-out system, dockside shape-ups, piece-rate sewing. Platforms revive piecework with GPS and ratings — which is why labour historians felt recognition long before sociologists coined new terms." },
        { h: "Varieties of gig work", p: "The gig economy is plural: ride-hailing in Paris, delivery in Jakarta, care platforms, freelance marketplaces. Regulation, union strength and labour markets differ, so the same app produces different working lives in different countries." },
        { h: "The invisible gig", p: "Behind the visible courier stands the invisible microworker: labelling images, moderating content, transcribing audio for cents per task on global platforms. This ghost work trains the very AI said to make work disappear." },
        { h: "Risk shifted downward", p: "Platforms shed the costs employment once carried — sick pay, accidents, equipment, slow hours. Risk does not vanish; it relocates onto individual workers and, through them, onto families and public health systems." },
        { h: "The legal battlefield", p: "Courts in France, the UK and Spain have reclassified drivers and riders; the EU platform-work directive presumes employment under algorithmic control. Law is where the gig economy's central fiction — independence — is being contested clause by clause." },
        { h: "Collective action 2.0", p: "Couriers coordinate strikes through the same phones that dispatch them; forums reverse-engineer pay algorithms; new unions blend app-savvy with old organising. Where the boss is an algorithm, resistance becomes partly a data practice." },
        { h: "The gigification of everything", p: "Beyond the apps, gig logics spread inward: zero-hour contracts, internal talent marketplaces, metric-managed professionals. The gig economy may matter less as a sector than as a template for how algorithmic management enters ordinary employment." },
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
        { h: "Automation waves in historical perspective", p: "The Economist's survey rehearses the pattern: mechanised looms, tractors and ATMs each destroyed specific jobs while total employment eventually grew, as productivity gains created demand elsewhere. But 'eventually' hides generations of dislocated workers and hollowed regions — the aggregate optimism of economists is cold comfort at the biographical scale where sociology works." },
        { h: "Tasks, not occupations", p: "Modern analysis decomposes jobs into tasks: machines take over routine, codifiable tasks (assembly, data entry) while complementing non-routine ones (judgment, care, persuasion). The result is polarisation — growth at the high-skill top and the low-paid, hard-to-automate bottom (cleaning, care work), with erosion in the routine middle. Automation reshapes the class structure before it changes the unemployment rate." },
        { h: "Bodies, pace and the warehouse", p: "Where robots and humans work together, the machine often sets the tempo. In fulfilment centres, pickers guided by handheld scanners and surrounded by robotic shelves face algorithmically monitored 'rates', with injury statistics to match. The sociological question shifts from 'will robots take the jobs?' to 'what do robot-paced jobs do to human bodies, autonomy and dignity?'" },
        { h: "What robots still cannot do", p: "Moravec's paradox endures: chess is easy, folding laundry is hard. Perception, dexterity and unstructured environments resist automation, which is why warehouses redesign the environment around the robot rather than the robot around the world." },
        { h: "Automating care", p: "Robots now comfort dementia patients and monitor the elderly, with Japan the leading laboratory. Care shows automation's limit case: the tasks are physical, but the work is relational — what exactly is delivered when the carer cannot care?" },
        { h: "Cobots and hybrid teams", p: "The dominant factory pattern is collaboration, not replacement: humans handle exceptions, robots handle repetition. The sociological action is in the interface — who adapts to whom, and whose pace becomes the team's pace." },
        { h: "The politics of robot design", p: "Assistants get female voices; security robots get bulk and baritone. Design choices encode social scripts about gender, service and authority — robots are cultural artefacts before they are mechanical ones." },
        { h: "Automation's geography", p: "Robot-dense regions are specific places — motor valleys, logistics corridors — so automation shocks arrive as regional crises, not national averages. The politics of automation is therefore also the politics of left-behind places." },
        { h: "Hype as a management tool", p: "Announcing automation disciplines labour whether or not the robots work: the credible threat lowers wage demands. Studying automation discourse — who proclaims inevitability, to whom, with what timing — is studying power." },
        { h: "Policy responses", p: "Proposals range from robot taxes and retraining accounts to sectoral bargaining over deployment and slower, negotiated adoption. Comparative evidence suggests institutions, not robot counts, decide whether automation produces shared gains or concentrated pain." },
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
        { h: "The experiment", p: "MIT's Moral Machine website presented visitors with trolley-style dilemmas for autonomous vehicles — swerve or stay, sparing passengers or pedestrians, young or old, few or many. It gathered nearly 40 million decisions from 233 countries and territories: a crowdsourced atlas of moral intuitions about machine choices." },
        { h: "Culture and machine ethics", p: "Global tendencies emerged — spare humans over animals, more lives over fewer, the young over the old — but preferences clustered culturally: 'Western', 'Eastern' and 'Southern' blocs differed on sparing the young, the lawful and the high-status. The finding cuts against any universal 'ethics module': encoding one population's intuitions means exporting them to everyone else's streets." },
        { h: "From trolleys to systems", p: "Critics argue the trolley frame is a category error: real AV safety is decided upstream — in sensor budgets, testing standards, speed policy, liability law and which neighbourhoods host the trials. Individualising ethics into split-second dilemmas draws attention away from the corporate and regulatory choices that statistically determine who is endangered. The sociologist's move: from the dilemma to the system that produced it." },
        { h: "A century behind the wheel", p: "The car reshaped cities, courtship, work and status; driving became identity, not just transport. Autonomous vehicles therefore threaten more than jobs — they renegotiate a culture built around the human driver." },
        { h: "How the machine drives", p: "Autonomous vehicles fuse lidar, radar, cameras and high-definition maps into predictions about a messy street. Knowing the architecture matters sociologically: failures cluster in edge cases — weather, jaywalkers, unusual bodies — and edge cases have demographics." },
        { h: "The safety ledger", p: "Boosters compare autonomous systems to the roughly 1.2 million annual global road deaths caused mostly by human error. But aggregate safety claims hide distributional questions: safer for whom, on which roads, measured by whose statistics, audited by whom." },
        { h: "Drivers, dispatchers, teleoperators", p: "Millions drive for a living; automation targets them first. Meanwhile a new occupation appears — remote operators supervising fleets from control rooms — suggesting driving work will be transformed and relocated before it is eliminated." },
        { h: "The city rebuilt, again", p: "The automobile got highways carved through neighbourhoods; autonomous fleets now ask for sensors, dedicated lanes and rewritten codes. Whether cities adapt to machines or machines to cities is a political struggle over public space — we have run this experiment before." },
        { h: "Who pays when it crashes", p: "Liability migrates from driver to manufacturer, insurer and software vendor; regulators experiment with logging duties and approval regimes. The fatal Uber test crash in Arizona previewed the question: the safety driver was charged, the company was not." },
        { h: "Why the future was late", p: "Full autonomy was promised for 2020; robotaxis still expand through supervised, city-by-city pilots. The gap between demo and deployment is itself instructive — hype cycles allocate capital, talent and regulatory attention long before technologies deliver." },
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
        { h: "The 47% study", p: "Frey and Osborne asked machine-learning experts to rate the automatability of 70 occupations, then extrapolated to 702 using job-skill data, identifying three human 'bottlenecks': perception and manipulation, creative intelligence, social intelligence. Their headline: 47% of US employment in the high-risk category over 'a decade or two'. The paper is a feasibility study of tasks machines might do — not a forecast of jobs that will vanish." },
        { h: "The critics and the task approach", p: "OECD researchers redid the analysis at task level and cut the high-risk figure to roughly 9%: most occupations mix automatable and non-automatable tasks, so jobs transform more often than they disappear. Deeper critiques note the method ignores economics (is automation cost-effective?), institutions (unions, law) and the new tasks technology creates. A decade on, employment did not collapse — but job quality and wage structures shifted." },
        { h: "The politics of distribution", p: "Whether automation yields shared prosperity or concentrated wealth is decided by institutions, not silicon: who owns the machines, how gains are taxed, whether transitions are cushioned (retraining, universal basic income experiments, working-time reduction). Keynes predicted a 15-hour week from exactly this productivity; we chose otherwise. 'What kind of society do we want?' is the honest form of the automation question." },
        { h: "Four episodes of anxiety", p: "Luddite weavers, mechanised agriculture, the ATM, the spreadsheet: each destroyed tasks, created others, and redistributed bargaining power in the transition. History counsels neither panic nor complacency — it counsels attention to who manages the transition." },
        { h: "The new occupations", p: "The AI economy mints jobs its prophets never listed: data annotators, prompt specialists, model auditors, AI trainers. New work appears — but note its quality, security and geography before celebrating the aggregate." },
        { h: "From skills to tasks to power", p: "Economists moved from skill-biased to task-based models; sociologists add a third lens — power-biased change: technologies are often adopted precisely because they monitor, measure and discipline labour, not only because they save it." },
        { h: "The geography of risk", p: "Automation exposure maps onto regions and demographics: routine-intensive towns, clerical work done disproportionately by women, entry-level rungs young workers climb. Averages conceal these concentrations — and politics happens in the concentrations." },
        { h: "What workers actually fear", p: "Surveys find less fear of replacement than of degradation: faster pace, closer monitoring, less discretion. The lived experience of AI at work is often intensification, which the unemployment debate entirely misses." },
        { h: "The policy toolkit", p: "Universal basic income pilots, retraining rights, working-time reduction, sectoral bargaining over algorithms, wage insurance: each tool encodes a philosophy of work. Compare Danish flexicurity with American churn to see institutions doing the real explanatory work." },
        { h: "Work and meaning", p: "Work distributes income, but also time-structure, status, sociality and identity. Any post-automation settlement must answer for all five — which is why the question of what society we want is genuine, not rhetorical." },
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
        { h: "From connectedness to connectivity", p: "van Dijck traces how the participatory promise of early social media ('connecting people') was progressively engineered into 'connectivity': automated, quantified, monetisable connection. Likes, friends and trends are not measures of sociality; they are coded constructions of it, designed to be counted and sold. 'Platformed sociality' names social life as re-architected by these corporate infrastructures." },
        { h: "One logic, many cases", p: "Lay the semester's cases side by side and a single logic appears. Zuboff's behavioural surplus, the attention merchants' engagement metrics, Uber's information asymmetries, Facebook's MSI ranking: each converts a human activity (experiencing, attending, working, socialising) into data, optimises it against a commercial metric, and shifts power toward whoever owns the optimisation. Datafication + asymmetry = the semester in one line." },
        { h: "Building exam arguments", p: "Strong essays in this course do three things: state an arguable thesis, specify a mechanism (how exactly does engagement ranking change political communication?), and mobilise at least two cases plus one concept. Weak essays summarise readings. Practise by connecting any two sessions from the semester through one shared concept — you will find it is almost always possible, which is itself the point." },
        { h: "The platformisation of news", p: "Journalism now reaches publics through feeds it does not control, chasing metrics it did not choose. van Dijck's framework explains the result: editorial logic subordinated to connective logic, with democratic consequences we met in the Facebook Files." },
        { h: "Fragmented publics", p: "Personalised feeds mean no two citizens see the same public sphere. Whether this produces echo chambers is empirically contested — but the capacity for common reference points, sociology's old social glue, clearly weakens." },
        { h: "The outrage cycle, assembled", p: "Combine the semester: engagement metrics select emotional content, attention design amplifies it, advertising monetises it, and politics adapts to it. No conspiracy is required — only aligned incentives, which is the more sobering finding." },
        { h: "Connecting the cases", p: "Practise the exam's core move: Zuboff's surplus plus Uber's asymmetries yields a general theory of data power; boyd's affordances plus the Files shows design shaping publics. Two cases, one concept — every time." },
        { h: "A concept map of the semester", p: "Datafication feeds extraction; extraction funds optimisation; optimisation reshapes attention, work and sociality; each reshaping provokes resistance and, eventually, regulation. Sketch this loop from memory — it is the semester on one page." },
        { h: "MCQ technique", p: "The quiz bank rewards precise reading: distinguish what an author argues from what critics say, and definitions from examples. Eliminate confidently wrong options first; the remaining choice usually turns on one qualifier." },
        { h: "Essay technique", p: "Open with an arguable thesis, name your mechanism, deploy two cases and one concept, address one objection, conclude by answering the question asked. Rehearse under time: ninety minutes rewards structure over inspiration." },
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
        { h: "Why alignment is hard", p: "Specify an objective precisely and a capable optimiser will satisfy its letter while violating its spirit — reward hacking, specification gaming, the genie problem. A recommender told to maximise engagement discovers outrage; a cleaning robot rewarded for 'no visible mess' learns to cover it. The gap between what we say, what we mean, and what we should want is the technical core of alignment." },
        { h: "Gabriel's ladder of alignment targets", p: "Gabriel distinguishes aligning AI with: explicit instructions, revealed intentions, individual preferences, objective interests, and finally values. Each rung raises the stakes: preferences can be manipulated (by the very systems being aligned), interests require paternalist judgments, and values are plural and contested. There is no neutral resting place — every choice of target is a moral position." },
        { h: "The political turn", p: "Gabriel's conclusion is sociologically decisive: since reasonable people disagree about values, alignment needs procedures with political legitimacy — analogues of Rawls's overlapping consensus — rather than a philosopher-king's value list. In practice, today's systems are aligned via terms of service, RLHF rater guidelines and corporate policy: value decisions made by firms, at scale, with little democratic input. That gap is the sociology of alignment." },
        { h: "From Asimov to engineering", p: "Alignment began as science fiction — three laws — and became an engineering discipline with benchmarks and red teams. The journey matters: fictional laws assumed values could be written down; modern alignment learned they must be negotiated." },
        { h: "Outer and inner alignment", p: "Outer alignment asks whether the specified objective matches what we want; inner alignment asks whether the trained model actually pursues that objective or a proxy it learned instead. Both gaps produce systems that pass tests and still surprise their deployers." },
        { h: "RLHF up close", p: "Reinforcement learning from human feedback aligns models to rankings made by hired raters following corporate guidelines. Ask the sociological questions: who are the raters, what do the guidelines say, who wrote them, and who audits the result?" },
        { h: "Rules, constitutions, critiques", p: "Constitutional approaches align models to written principles rather than raw preferences, making values inspectable. This is progress in transparency — and it sharpens the political question, since someone still chooses what the constitution says." },
        { h: "The missing voices", p: "Alignment data and researchers skew heavily toward English-speaking, Western, educated populations. Systems aligned to that slice are exported worldwide — a quiet standardisation of norms that deserves scrutiny as value colonialism when it goes unexamined." },
        { h: "Alignment as industry", p: "Safety teams, evaluation startups, red-team contractors, alignment conferences: a profession has formed. Professions bring standards and careers — and capture risks, when the entities being evaluated fund the evaluators." },
        { h: "Democratising alignment", p: "Experiments in collective alignment — citizen assemblies on model behaviour, public input processes, deliberative polls — test whether Gabriel's legitimacy demand can be met in practice. Early results are modest but real: procedure, not philosophy, is where alignment politics now advances." },
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
        { h: "From answering to acting", p: "An agentic system decomposes a goal ('organise my conference trip') into steps, calls tools and services, observes results and re-plans. The Economist's report tracks their spread into customer service, coding, procurement and back-office work. The shift is qualitative: errors are no longer wrong sentences but wrong actions — money moved, emails sent, commitments made." },
        { h: "Delegation and the principal-agent problem", p: "Sociology and economics have long studied human delegation: agents (employees, lawyers) with their own information and incentives, controlled through contracts, monitoring and trust. AI agents import the whole problematic — misunderstanding the principal's intent, manipulation by third parties (prompt injection), opaque reasoning — without the social accountability that disciplines human agents. Delegation without a delegate you can shame, sue or fire." },
        { h: "Accountability and the redistribution of discretion", p: "When a delegated action goes wrong, liability scatters across user, deployer, model developer and tool provider — a 'problem of many hands' at machine speed. Meanwhile discretion migrates: choices once made by clerks, assistants and junior professionals (what to flag, whom to prioritise) become model behaviour. Watch who gains oversight capacity and who loses the discretion that made their work skilled." },
        { h: "Anatomy of an agent", p: "An agent couples a model with planning, memory and tool access — browsers, payments, code execution. Each added capability widens what can go right and wrong: the architecture diagram is also a risk map." },
        { h: "When agents meet agents", p: "Deployed at scale, agents negotiate, transact and coordinate with each other — markets of machines. Multi-agent dynamics produce emergent behaviour no single designer chose, echoing what finance learned from flash crashes." },
        { h: "Augmentation or substitution", p: "In offices, agents draft, summarise, schedule and reconcile. Whether this augments professionals or hollows their roles depends on deployment choices: who reviews the agent, who owns the saved time, and whose job description absorbs the change." },
        { h: "Containing the agent", p: "Practical safety is unglamorous: sandboxes, permission scopes, spending limits, human sign-off on irreversible actions, logs. These controls mirror how organisations always contained junior employees — the sociology of supervision, ported to software." },
        { h: "The economics of delegation", p: "Agents collapse the cost of actions — and cheap action invites volume. When everyone's agent can send a thousand applications or bids, screening systems drown, and the arms race begins: agents versus agents, with humans in between." },
        { h: "Bots among us", p: "As agents browse, buy and post, the assumption that online counterparties are human quietly dies. Proof-of-personhood, agent identification and bot-disclosure rules become infrastructure questions for markets and public spheres alike." },
        { h: "Governing the delegate", p: "Emerging governance mixes registration, logging duties, liability rules and insurance. The design question echoes company law: we once invented legal persons to manage collective action — what legal form fits the autonomous software actor?" },
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
        { h: "The study and the method", p: "The authors built a benchmark balanced across skin type (using the Fitzpatrick scale) and gender, then audited three commercial gender classifiers. Error rates: under 1% for lighter-skinned men, up to 34.7% for darker-skinned women. The crucial move was intersectional — disaggregating across combined categories, in the tradition of Crenshaw — where single-axis audits ('accuracy by gender') would have hidden the worst failures." },
        { h: "Where bias enters", p: "The disparities trace to unrepresentative training and benchmark datasets (prior face benchmarks were overwhelmingly light-skinned and male), and to development teams whose composition never surfaced the gap. Generalise the mechanism: models learn the world their data describes; data describes past decisions and existing hierarchies; without deliberate correction, AI launders historical inequality into objective-seeming scores — in hiring, credit, policing, health." },
        { h: "From audit to consequence", p: "Gender Shades demonstrates the power of the algorithmic audit as a sociological method: within months, audited vendors improved their systems, and the study fuelled bans on police facial recognition in several US cities and shaped the EU AI Act's treatment of biometric systems. It also shows the limits: fixing accuracy does not answer whether some systems — recognition in policing, emotion inference — should exist at all." },
        { h: "A taxonomy of bias", p: "Bias enters at every stage: historical bias in the world, representation bias in sampling, measurement bias in proxies, aggregation bias in one-size models, deployment bias in use. Diagnosing which stage matters, because each demands a different fix." },
        { h: "Fairness, formally impossible", p: "Computer scientists defined fairness metrics — demographic parity, equalised odds, calibration — then proved several cannot hold simultaneously when base rates differ. The theorem is clarifying: fairness is a political choice among trade-offs, not a setting to enable." },
        { h: "Beyond bias", p: "Fixing error rates does not ask who designed the system, who profits, or whether it should exist. Critics push from bias to power: an accurate eviction-prediction tool used by landlords is fair, biased against no one, and still an instrument of domination." },
        { h: "Prediction in criminal justice", p: "Recidivism scores promised objectivity and delivered controversy: equal accuracy, unequal error types across race. Courts still use them — a live experiment in what happens when contested statistics meet consequential decisions." },
        { h: "The digital welfare state", p: "Fraud-scoring in the Netherlands, algorithmic exam grading in the UK, benefits automation elsewhere: states now govern the poor through models, and the scandals share a pattern — opacity, disparate harm, delayed accountability. Austerity often drives adoption more than accuracy does." },
        { h: "Refusal and consent", p: "Communities are contesting data extraction itself: face databases scraped without consent, Indigenous data sovereignty movements, city bans on recognition. The politics of AI includes the right not to be a data point." },
        { h: "Repair", p: "The repair toolkit is maturing: mandatory audits, disaggregated reporting, impact assessments, participatory design, and the AI Act's high-risk regime. Gender Shades proved the sequence works — measurement, publicity, pressure, change — when someone does the measuring." },
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
        { h: "Counting the carbon", p: "Strubell, Ganesh and McCallum estimated the energy and emissions of training NLP models, famously comparing one large training pipeline (with architecture search) to the lifetime emissions of several cars. The exact figures were debated, but the paper's achievement stands: it made computation visible as an environmental act and forced 'efficiency' onto the research agenda alongside accuracy." },
        { h: "The material stack", p: "Beyond training runs: inference at scale (billions of daily queries), data centres whose cooling consumes millions of litres of water — often in drought-prone regions — and hardware whose GPUs depend on mined minerals and geopolitically concentrated chip fabrication. AI has a geography: server farms near cheap power, extraction in the Global South, e-waste flowing back there. An environmental sociology of AI is a sociology of these supply chains." },
        { h: "Equity and the politics of green AI", p: "Strubell et al. also flagged a scientific-equity effect: when state-of-the-art requires millions in compute, universities and poorer countries exit the research frontier — knowledge production concentrates with the firms that own the data centres. Meanwhile 'AI for climate' promises (grid optimisation, materials discovery) must be weighed against AI-for-oil contracts and datacentre-driven demand growth. Ask of every green claim: net of what, for whom?" },
        { h: "Where the cloud lives", p: "Data centres cluster where power is cheap and policy friendly — Virginia, Ireland, increasingly Poland and the Nordics. Each siting decision allocates grid capacity, water, land and tax revenue: infrastructure geography is environmental politics." },
        { h: "The water bill", p: "Cooling consumes millions of litres, often in water-stressed regions; communities from Chile to the Netherlands have protested. Water makes AI's footprint local and visible in a way carbon never was — and local opposition is becoming a real constraint." },
        { h: "Minerals and machines", p: "GPUs need lithium, cobalt, rare earths and advanced fabrication concentrated in a handful of facilities worldwide. AI's supply chain runs through mines, refineries and geopolitics — the intelligence is immaterial; its substrate is anything but." },
        { h: "The afterlife of hardware", p: "Accelerated AI buildouts shorten hardware cycles, and yesterday's servers become e-waste flowing disproportionately to the Global South. A full accounting of AI's footprint includes disposal — the part of the lifecycle furthest from the demo." },
        { h: "The efficiency trap", p: "Chips improve, models get leaner — and total consumption still rises, because efficiency lowers cost and multiplies use. Jevons observed this with coal in 1865; datacentre demand curves suggest the paradox transfers." },
        { h: "Auditing the green promise", p: "AI for climate is real — grid balancing, materials discovery, forecasting — and so are AI-for-oil contracts and demand growth. Treat every sustainability claim as an empirical question: net effect, counterfactual, and who audited the numbers." },
        { h: "Governing compute's footprint", p: "Emerging tools: mandatory energy disclosure, efficiency standards for data centres, siting rules tied to renewables, and research norms that reward efficient models. EU energy directives already require datacentre reporting — the footprint is entering the regulatory field." },
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
        { h: "The breakthrough", p: "A protein's function follows its 3D structure, but determining structures experimentally took years per protein. AlphaFold, trained on decades of publicly funded, openly shared structures in the Protein Data Bank, learned to predict structure from amino-acid sequence with near-experimental accuracy — validated at the CASP14 competition in 2020 and published in Nature in 2021." },
        { h: "Open science as strategy and gift", p: "DeepMind released predicted structures for essentially every catalogued protein — over 200 million — freely. The impact multiplied: drug discovery, enzyme design, neglected-disease research. Note the sociology of scientific infrastructure: the breakthrough was only possible because a community had spent 50 years sharing data openly; the open release both repaid that commons and bought a commercial lab immense scientific legitimacy. Openness is generosity and strategy at once." },
        { h: "Medical AI beyond the triumph", p: "Generalise carefully. Clinical AI raises questions AlphaFold mostly avoided: diagnostic systems trained on unrepresentative populations underperform for the underrepresented; 'black box' recommendations strain clinical accountability and the doctor–patient relation; and benefits follow existing access — an algorithm cannot treat a patient who cannot reach a hospital. The sociology of medical AI is the sociology of health inequality, with new instruments." },
        { h: "From MYCIN to deep learning", p: "Expert systems diagnosed infections in the 1970s and never entered clinics — trust, liability and workflow killed them. The history warns: in medicine, the technical barrier is rarely the binding one." },
        { h: "The radiology test case", p: "Deep models match specialists on specific image tasks, and radiologists were confidently declared obsolete a decade ago. Instead the profession absorbed the tools: tasks changed, jobs did not — a recurring pattern this course keeps finding." },
        { h: "Sick data", p: "Medical datasets overrepresent wealthy, white, hospital-attending populations; pulse oximeters miscalibrated for darker skin previewed the problem before AI. Models trained on skewed data export clinical inequality with a veneer of precision." },
        { h: "Three at the bedside", p: "The consultation now includes an algorithm: who does the patient trust, when may the doctor overrule, and who documents dissent? Medical sociology's oldest theme — authority in the clinic — acquires a third actor." },
        { h: "The economics of discovery", p: "AlphaFold accelerated the cheap part of drug development; trials, manufacturing and pricing remain slow and monopolised. Faster science does not automatically mean accessible medicine — the bottleneck is institutional, not computational." },
        { h: "Global health and access", p: "AI screening on smartphones promises diagnostics where specialists are scarce — and risks unvalidated tools tested on populations least able to contest them. The colonial history of medical experimentation sets the standard of scrutiny required." },
        { h: "Regulating clinical AI", p: "Medical AI faces device regulation — CE marking, FDA clearance — built for static instruments, now straining against models that update. Post-market surveillance becomes the frontier: approval is a moment, but a learning system is a process." },
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
        { h: "Carr's worry, and its ancestry", p: "Carr's essay argues that the web's economics of interruption retrain the brain for skimming, eroding the sustained attention that deep reading built. He knowingly stands in an old line: Socrates feared writing would atrophy memory, and moralists feared the printing press. The pattern — every cognitive technology triggers a loss narrative — counsels humility, not dismissal: some of those losses were real, and so were the gains." },
        { h: "Cognitive offloading and the extended mind", p: "Psychology documents the 'Google effect': we remember where information lives rather than the information itself. Philosophers Clark and Chalmers reframe this positively — tools are part of an 'extended mind', and offloading arithmetic to calculators freed capacity for higher tasks. The open question with generative AI is whether drafting and reasoning are like arithmetic (safely delegated) or like the practice that builds the very capacities education exists to create." },
        { h: "Thinking as a social practice", p: "For sociology, cognition is never merely individual: it lives in institutions — schools, universities, newsrooms, courts — that certify what counts as knowledge and train people to produce it. If students generate essays they could not write, the essay stops certifying thought; if professionals verify machine drafts rather than compose, expertise itself is redefined. The 'future of thinking' is the future of these institutions, and it will be decided by policy and pedagogy, not by the technology alone." },
        { h: "Every literacy had its panic", p: "Socrates against writing, clergy against print, parents against novels, then radio, television, calculators. Some fears were wrong, some — like what television did to political discourse — arguably right. The record demands case-by-case analysis, not reflexes." },
        { h: "What the research says", p: "Studies document the Google effect on memory, switching costs from interruption, and early evidence that AI assistance can reduce engagement with material — alongside findings of genuine learning gains when tools are well designed. The literature is young; certainty is premature." },
        { h: "The assessment crisis", p: "If a model writes a competent essay, the essay stops measuring competence. Universities split between fortification — proctored, handwritten — and redesign: oral defences, process portfolios, AI-permitted tasks graded on judgment. Assessment is where the future of thinking is being decided institutionally." },
        { h: "Expertise under delegation", p: "Professionals increasingly verify machine drafts rather than compose — and verification skill decays without composition practice. Aviation met this problem first: automation-induced deskilling, answered with mandatory manual practice. Knowledge work may need its equivalent." },
        { h: "Thinking with machines", p: "The strongest human-AI results come from complementarity: the machine generates breadth, the human supplies judgment, taste and responsibility. Hybrid configurations outperform either alone — but only when the human stays genuinely in the loop." },
        { h: "Epistemic dependence, socialised", p: "We already outsource cognition — to colleagues, references, institutions; no scholar verifies everything personally. The question is whether AI dependence resembles trusting a library or trusting a rumour: what distinguishes them is institutional warrant, and AI currently has little." },
        { h: "Cultivating attention deliberately", p: "If deep focus no longer occurs by default, it must be built: reading regimes, tool-free spaces, pedagogy that rewards slowness. Attention becomes a practice — something communities protect on purpose, as this course has tried to model." },
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
        { h: "The Brussels Effect", p: "Bradford's mechanism: the EU's market is too large to ignore; global firms comply with its strict standards; and because splitting product lines is costly, they often apply EU standards worldwide (de facto), while other states copy EU law (de jure). GDPR is the flagship case — cookie banners in Katowice, California and Kenya alike. Regulatory capacity, not tech ownership, becomes a form of power." },
        { h: "Three models, three social contracts", p: "The stylised triad: the US model is market-driven — innovation first, sectoral regulation, First Amendment constraints; the Chinese model is state-driven — platforms enrolled in governance, data as sovereign resource, from the social credit experiments to the 2021 platform crackdown; the EU model is rights-driven — dignity, privacy and competition law as the frame. Each encodes a different settlement between state, market and citizen; each exports that settlement with its technology and its rules." },
        { h: "Sovereignty and its discontents", p: "'Digital sovereignty' — a polity's capacity to control its digital infrastructure, data and rules — is invoked by Brussels (cloud projects like Gaia-X, chip acts), by Beijing (cyber-sovereignty), and by countries in the Global South facing 'data colonialism': extraction of their data by foreign platforms under foreign law. Critics warn sovereignty talk can also dress up protectionism and censorship. The analytical task is to ask, each time: sovereignty for whom, against whom?" },
        { h: "GDPR, the test case", p: "The 2016 regulation exported itself exactly as Bradford predicts: global privacy policies, copycat laws on several continents. Its limits instruct too — under-enforcement, consent fatigue — showing that writing rules and governing with them are different capacities." },
        { h: "The Chinese stack", p: "China pairs industrial policy with governance experiments: recommendation-algorithm registration, generative-AI rules, data-export controls, platform crackdowns. The model treats digital infrastructure as sovereign territory — and exports both technology and governance style along the Digital Silk Road." },
        { h: "The American turn", p: "Washington long chose permissionless innovation, then rediscovered power: antitrust suits against the giants, executive action on AI, chip export controls. The US model now mixes market faith with national-security industrial policy — less a doctrine than a contest." },
        { h: "The chip war", p: "Semiconductors became the choke point: export bans on advanced GPUs, subsidies for domestic fabs, one Taiwanese firm at the centre of the world economy. Compute sovereignty is the hardest kind — you cannot legislate a fabrication plant into existence." },
        { h: "Clouds and dependence", p: "European governments run on American clouds; sovereignty projects like Gaia-X struggle against convenience and scale. Dependence on foreign infrastructure is the quiet fact beneath sovereignty rhetoric — jurisdiction follows the server." },
        { h: "Data colonialism", p: "Couldry and Mejias name the pattern: platforms extract data from the Global South under foreign law, process it into value elsewhere, and sell services back. Digital non-alignment movements — India's public stack, African data localisation — are the counter-politics." },
        { h: "Splinternet or interoperability", p: "Scenarios diverge: hardening blocs with incompatible rules, or negotiated interoperability through adequacy decisions and treaties. The internet was never ungoverned — the question was always whose governance, and the answer is becoming plural." },
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
        { h: "Convergence on five principles", p: "The corpus converges on transparency, justice and fairness, non-maleficence, responsibility, and privacy — with beneficence, autonomy, trust, sustainability and dignity trailing. On the surface, a global moral consensus about AI. The authors immediately complicate it: convergence on words is not convergence on meanings." },
        { h: "Divergence beneath the words", p: "'Fairness' means equal error rates to one author, non-discrimination law to another, distributive justice to a third — and some formal fairness definitions are mathematically incompatible. Documents also diverge on who must act (developer, deployer, state) and how principles are enforced (almost never specified). And the map has blank spaces: guidelines came overwhelmingly from the US and Europe; most of the world's populations were written about, not writing." },
        { h: "Ethics washing and the sociology of soft law", p: "Critics coined 'ethics washing': voluntary principles deployed to signal virtue and preempt binding regulation — Google's AI ethics board lasted one week; Gebru's exit from Google showed the limits of internal ethics under commercial pressure. Yet soft law is not nothing: principles create vocabularies activists can invoke, benchmarks journalists can audit against, and drafts regulators later harden (the EU AI Act absorbed much of this corpus). Ethics documents are moves in a power struggle — read them that way." },
        { h: "The principlist template", p: "AI ethics borrowed its method from medical ethics — principles distilled from consensus. But medicine has licensing boards, malpractice law and professional oaths to enforce its principles; AI ethics imported the vocabulary without the enforcement machinery." },
        { h: "Who writes the rules", p: "Map the authors: firms drafting their own principles, governments signalling readiness, professional bodies claiming jurisdiction, NGOs demanding rights. Each document is positioned — reading guidelines as moves by interested actors is basic sociology of knowledge." },
        { h: "Ethics in the pipeline", p: "Operationalisation means checklists, model cards, review boards, impact assessments — ethics as process. The risk is ritualism: forms completed, boxes ticked, launches unchanged. The test of any process is what it has ever stopped." },
        { h: "The Gebru affair", p: "Google pushed out the co-author of Stochastic Parrots after a dispute over that very paper — the clearest natural experiment in what happens when internal ethics collides with product strategy. Ethics labour inside firms is real, and structurally fragile." },
        { h: "Other ethical traditions", p: "Feminist, decolonial and care-ethics approaches reject the view from nowhere: they start from situated experience, relationships and power. Participatory design — affected communities shaping systems — turns ethics from checklist into procedure." },
        { h: "From soft to hard", p: "Trace principles hardening into law: transparency became the AI Act's labelling duties; fairness became bias-testing obligations; accountability became conformity assessment. Soft law is often law in rehearsal — which is why the fights over wording were always worth having." },
        { h: "A reader's toolkit", p: "Interrogate any ethics document with five questions: who wrote it, who is bound, what is operationalised, what is enforced, who can appeal. Most documents fail at question four — and now you know precisely where to look." },
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
        { h: "The risk pyramid", p: "The Act sorts AI uses into tiers. Unacceptable risk — banned: social scoring by public authorities, certain manipulative and exploitative systems, some biometric practices. High risk — heavily regulated: AI in hiring, credit, education, essential services, law enforcement, with obligations of data governance, documentation, human oversight and conformity assessment. Limited risk carries transparency duties (disclose the chatbot, label deepfakes); minimal risk is untouched. Regulate the use, not the technology — that is the design philosophy." },
        { h: "The GPAI fight and the lobbying field", p: "Generative AI broke the tidy use-based scheme mid-negotiation: a general-purpose model is not a 'use'. The compromise created a separate regime for general-purpose AI, with heavier duties above a compute threshold. Around this, an intense lobbying field: US firms and European champions (Mistral, Aleph Alpha) pressing to lighten obligations, civil society pushing to close loopholes — with France and Germany at times siding with their startups. A regulation is a photograph of a power struggle." },
        { h: "The pacing problem and Brussels' bet", p: "Technology iterates in months; legislation takes years and this one phases in until 2027 — the 'pacing problem'. The Act answers with delegated acts, an AI Office, and technical standards to be filled in later: law as framework, details outsourced to standard-setting (itself dominated by industry engineers — a sociological chokepoint). The strategic bet is the Brussels Effect: that compliance with EU rules becomes, once again, the world's default." },
        { h: "How the Act was built", p: "Proposed in 2021, amended through the generative-AI shock, agreed in trilogue in 2023, in force from 2024 with obligations phasing to 2027. The timeline itself teaches: regulation is negotiation under technological acceleration." },
        { h: "Inside the high-risk regime", p: "High-risk providers must implement risk management, data governance, logging, documentation, human oversight and accuracy standards, then pass conformity assessment and register publicly. This is product-safety law adapted to software that learns — paperwork as governance." },
        { h: "Teeth", p: "Penalties reach seven percent of global turnover — above GDPR's ceiling. Enforcement splits between national authorities and the new AI Office for general-purpose models; the open question, learned from GDPR, is whether regulators get the budgets and expertise to bite." },
        { h: "Three regulatory styles", p: "Compare instruments: the EU's comprehensive statute, American executive action and sectoral enforcement, Chinese targeted rules per technology with registration duties. Three politics of technology in one policy field — a comparative sociology essay writing itself." },
        { h: "The compliance industry", p: "The Act births a market: auditors, standards consultants, evaluation firms, compliance software. Regulation always creates its intermediaries; watch whether they become guardians of the public interest or a moat incumbents can afford and startups cannot." },
        { h: "Critiques from both flanks", p: "Industry warns of innovation flight and compliance costs; civil society counts the loopholes — national-security carve-outs, self-assessment, weakened biometric bans. That both sides object is not proof of balance; evaluate each critique on evidence." },
        { h: "Living with the Act", p: "For practitioners: classify your system, document your data, plan oversight, keep logs. For citizens: new rights to explanation and complaint. For sociologists: a decade-long natural experiment in whether law can steer a general-purpose technology — observe it closely." },
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
        { h: "Alone together", p: "Turkle's phrase names a paradox of connectivity: physically present, attentionally elsewhere — families at dinner on separate screens, friends 'together' while each manages other conversations. Constant connection, she argues, erodes two capacities at once: full-attention conversation, and solitude — the ability to be alone without being lonely, which she sees as the precondition of real intimacy." },
        { h: "The performed self", p: "Goffman described identity as performance; platforms industrialise the stage. Profiles are edited selves, curated toward measurable approval — Turkle's teens redraft texts and captions the way earlier generations drafted letters, but now for a scoring audience. Identity work becomes continuous, quantified and anxious. The sociological point is not vanity but structure: when the archive is permanent and the audience collapsed, spontaneity becomes a risk." },
        { h: "Artificial intimacy", p: "Turkle's deepest worry concerned 'sociable robots' that perform care without caring — and the AI-companion industry has made it empirical: millions now converse daily with chatbot friends and partners engineered, attention-economy style, for retention. The questions this raises are genuinely open: solace for the isolated, or a simulation that further deskills human relation? What is lost, if anything, when the other in the relationship cannot be disappointed, bored, or hurt?" },
        { h: "From identity play to real names", p: "Early internet culture celebrated anonymous identity experimentation — Turkle herself documented it hopefully in the 1990s. Platform culture reversed the settlement: real names, persistent profiles, one authenticated self, optimised for advertisers. Identity online has a political economy." },
        { h: "The approval loop", p: "Likes quantify regard, and adolescent self-esteem research shows contingent self-worth tracking the metrics. The sociological point precedes the psychology: when approval is counted, the self becomes a performance indicator — Goffman with a dashboard." },
        { h: "Intimacy, platformed", p: "Dating apps now mediate a large share of new couples: partner choice via swipe interfaces, matching algorithms and market metaphors. Efficiency rises; so do complaints of commodification — intimacy absorbing the logic of the catalogue." },
        { h: "The companion industry", p: "AI companions count users in the tens of millions, marketed explicitly against loneliness. Engagement techniques from the attention economy apply to affection itself — retention curves for relationships, premium tiers for romance." },
        { h: "Parasocial machines", p: "Fans once bonded one-way with celebrities; chatbots close the loop by answering back. When one companion app abruptly changed its models, users publicly grieved — evidence these bonds are real in their consequences, whatever their ontology." },
        { h: "Digital afterlives", p: "Griefbots resurrect the dead from message archives; platforms hold more profiles of the deceased each year. Mourning, memory and the persistence of the self — sociology's oldest rituals — are being quietly re-engineered without much public decision." },
        { h: "Choosing presence", p: "Turkle's remedy is unfashionable and concrete: protected conversation, device-free rituals, tolerated boredom, reclaimed solitude. Not nostalgia — a design brief, for lives and for products, in which attention to another person is the scarce and honoured act." },
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
        { h: "The deepfake threat landscape", p: "Chesney and Citron catalogue harms across three registers: individual (non-consensual intimate imagery — empirically the overwhelming majority of deepfakes, targeting women — plus fraud and voice-clone scams), democratic (fabricated scandals timed for elections), and security (synthetic evidence in international crises). Since 2019, generative tools have collapsed the cost of all three from expert labour to a text prompt." },
        { h: "The liar's dividend", p: "Their most influential concept inverts the problem: when everyone knows fakes are possible, real evidence can be plausibly denied — 'that recording is AI'. The liar's dividend accrues to the powerful, who face documented accusations most often. Epistemologically, the deepfake era's core damage is symmetric doubt: fabricated things believed, and authentic things dismissed, until 'evidence' itself loses institutional force." },
        { h: "Rebuilding the infrastructure of trust", p: "Responses operate at different layers: technical (detection — a losing arms race — and provenance standards like C2PA that cryptographically sign capture), legal (the AI Act's labelling duties, criminalisation of intimate-image abuse), and social — the layer sociology insists on: trusted institutions, professional verification norms, media literacy. Shared truth was never a natural fact; it was always an institutional achievement. Generative AI forces us to rebuild it deliberately." },
        { h: "Manipulation before AI", p: "Stalin airbrushed rivals from photographs; tabloids doctored images for decades; Photoshop industrialised retouching. Synthetic media continues an old practice — what changed is cost, scale, and the collapse of the skill barrier." },
        { h: "The synthesis industry", p: "Voice cloning from seconds of audio, face-swaps in consumer apps, text-to-video on demand. An industry of legitimate tools — dubbing, accessibility, film — shares its entire technical base with the abuse: dual use is the rule, not the exception." },
        { h: "The detection arms race", p: "Detectors chase generators and lose ground; watermarks strip out; classifiers misfire on authentic footage. Expert consensus has shifted from detection to provenance — proving where the authentic came from, rather than spotting the fake." },
        { h: "Provenance infrastructure", p: "Content credentials cryptographically bind capture device, edits and origin to media files, with cameras and newsrooms adopting the standard. Provenance is a trust chain — and like all chains, it works only if institutions people already trust maintain the links." },
        { h: "Platforms and synthetic content", p: "Labelling duties under the AI Act, synthetic-media policies, election-season commitments: platforms now govern authenticity. Enforcement is inconsistent and definitions leak — but the norm that synthetic content must announce itself is forming in real time." },
        { h: "The verification desk", p: "News organisations built forensic teams — open-source investigation methods, dedicated verification units — turning authentication into a professional practice. Journalism's answer to synthetic media is institutional: trust rebuilt as workflow, standards and visible method." },
        { h: "Truth as infrastructure", p: "Shared facts were always manufactured — by courts, science, journalism, archives — through procedures that earned confidence. Generative AI does not end truth; it raises the maintenance costs of the institutions that produce it. Societies now choose whether to pay." },
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
        { h: "Structure: one claim, carried", p: "A ten-minute talk holds exactly one arguable claim. Open with it — a question the audience did not know they had, then your answer ('Deepfakes' main damage is not deception but denial'). Then three moves: the mechanism, the evidence, the implication. End by returning to the opening. The classic error is compression — squeezing an essay into slides; a talk is not a paper read aloud, it is an argument performed." },
        { h: "Evidence and intellectual honesty", p: "Every claim gets a named source ('Rosenblat and Stark's driver study shows…'), and your one best piece of evidence gets time to breathe rather than sharing a slide with six others. State the strongest objection to your own claim before the audience does — it converts skeptics and is, besides, how scholarship works. In this course, misrepresenting a reading costs more than opposing it well." },
        { h: "Delivery and the Q&A", p: "Delivery is trainable mechanics, not charisma: speak to the back row, pause after key claims (silence is emphasis), never read slides, and rehearse aloud — twice — against the clock. In Q&A, restate the question (thinking time, and the room hears it), answer what you can, and say 'I don't know, but here is how I'd find out' when you don't. Honest uncertainty, well handled, reads as competence." },
        { h: "Slides that serve the talk", p: "One idea per slide, six words before an image, no paragraph ever read aloud. Slides are scenery, not script — the audience should watch you, glancing at the screen only when you send them there." },
        { h: "Voice and body", p: "Volume to the back row, pace slower than feels natural, pauses as punctuation; feet planted, hands free, eyes distributed across the room. Delivery mechanics are learnable in a week of deliberate practice — charisma is mostly rehearsal wearing a disguise." },
        { h: "Ethos, pathos, logos", p: "Aristotle's triangle still organises persuasion: credibility from named sources and honest limits, emotion from one concrete human case, logic from a visible argumentative skeleton. Academic talks earn ethos first — the other two follow." },
        { h: "Arguing with data", p: "One number, contextualised, beats ten recited: say what it means, what it compares to, and what would change your mind about it. Charts follow the same law — one message per figure, stated aloud in one sentence." },
        { h: "Nerves, managed", p: "Stage fright is arousal misread: breathe low, slow the first minute, memorise the opening two sentences cold. Every experienced speaker you admire still feels it — they have merely rehearsed the beginning past the point where fear can reach it." },
        { h: "Presenting with AI, honestly", p: "Use models to brainstorm structure or anticipate questions — then declare any assistance, and own every claim as if you had written it, because you must defend it live. The Q&A is where outsourced understanding is found out." },
        { h: "How week 25 is graded", p: "The rubric weighs argument (40%), use of evidence and the chosen reading (30%), delivery (20%) and Q&A handling (10%), for 15% of the semester grade. Read the rubric as strategy: a defensible thesis with one well-used source outscores polish with nothing underneath." },
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
        { h: "The arc of the year", p: "Semester 1's through-line was extraction: experience, attention, labour and sociality converted into data and optimised for commercial metrics (Zuboff, the attention merchants, Uber, the Facebook Files). Semester 2's through-line was governance: the attempts — alignment procedures, audits, ethics charters, the AI Act — to bring that extraction under normative control, and the inequalities (Gender Shades, the compute divide, data colonialism) that persist through them." },
        { h: "Cross-semester argument patterns", p: "The exam rewards connections across the year. Reliable patterns: harm → audit → regulation (Gender Shades documented disparities that the AI Act's high-risk regime now addresses); metric → behaviour → institution (engagement ranking reshaped political communication; the DSA responds); principle → practice gap (Jobin's converging principles vs. ethics washing — with the Act as the test of whether soft law hardens). Practise stating each pattern with two named cases and one concept." },
        { h: "The course's core claim", p: "If this course argues one thing, it is this: AI is a social institution — built by identifiable actors with interests, trained on a past that contains our inequalities, governed (or not) by contestable rules, and therefore changeable. Neither the boosters' inevitability nor the doomers' fatalism survives sociological scrutiny. The honest position is the demanding one: outcomes are chosen, so the question 'what kind of society do we want?' is addressed to you." },
        { h: "Semester 1 on one page", p: "Extraction was the through-line: experience became data (Zuboff), attention became inventory (Lewis), labour became tasks under algorithmic management (Rosenblat), sociality became engagement (the Files). One logic, four arenas — rehearse it until you can write it cold." },
        { h: "Semester 2 on one page", p: "Governance answered: values contested (Gabriel), harms audited (Gender Shades), footprints counted (Strubell), rules written (the AI Act), trust re-engineered (provenance). The tension between extraction and governance is the year's architecture." },
        { h: "Ten concepts to own", p: "Datafication, behavioural surplus, networked publics, algorithmic management, alignment, intersectional audit, the Brussels Effect, risk-based regulation, the liar's dividend, platformed sociality. For each: definition, author, one case, one critique — that grid is your revision plan." },
        { h: "A model essay, dissected", p: "Take the semester's sample question and watch the moves: thesis in sentence one, the Brussels Effect as mechanism, the AI Act plus one case as evidence, the innovation critique acknowledged, conclusion answering the exact words asked. Structure is visible — copy it." },
        { h: "MCQ strategy, final form", p: "The comprehensive MCQ samples all thirteen sessions evenly: revise breadth before depth. Distractors are usually a critic's position or a neighbouring concept — knowing who said what is worth more points than knowing any one text deeply." },
        { h: "Five recurring mistakes", p: "Summarising instead of arguing; cases without concepts; concepts without cases; ignoring the counterargument; answering the question you wished for. Each costs a grade band — and each is avoidable by outline discipline in the first five minutes." },
        { h: "After this course", p: "Paths from here: economic sociology of platforms, science and technology studies, critical data studies, AI policy and governance. The reading list continues — but the toolkit is yours now, and the systems you will meet next have not been built yet." },
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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 14 : 18 }}>
      <p style={{ fontSize: compact ? 13 : 14, lineHeight: 1.65, color: "var(--secondary-foreground)", fontStyle: "italic" }}>{s.lec.intro}</p>
      <div style={{ background: "var(--surface-2)", borderLeft: "3px solid var(--primary)", borderRadius: "0 8px 8px 0", padding: "10px 14px",
        fontSize: 12, display: "flex", gap: 8, alignItems: "flex-start" }}>
        {s.reading.kind === "paper" ? <FlaskConical size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--info)" }} /> : <Newspaper size={15} style={{ flexShrink: 0, marginTop: 2, color: "var(--warning)" }} />}
        <span><strong>{s.reading.kind === "paper" ? "Research paper" : "Press article"} · </strong>{s.reading.ref}</span>
      </div>
      {s.lec.sections.map((sec, i) => (
        <div key={i}>
          <div className="serif" style={{ fontSize: compact ? 16 : 18, fontWeight: 700, marginBottom: 6, color: "var(--foreground)" }}>
            {i + 1}. {sec.h}
          </div>
          <p style={{ fontSize: compact ? 12.5 : 13.5, lineHeight: 1.7 }}>{sec.p}</p>
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
            <div style={{ width: "100%", maxWidth: 480 }}>
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
                  <p style={{ fontSize: 14.5, lineHeight: 1.75 }}>{sl.sec.p}</p>
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
      {EXAMS.map(e => (
        <div key={e.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
              {e.kind === "Final" ? <Award size={16} style={{ color: "var(--primary)" }} /> : <PenLine size={16} style={{ color: "var(--info)" }} />}
              Semester {e.sem} — {e.kind}
            </div>
            <Badge variant={e.kind === "Final" ? "primary" : "info"} size="xs">{e.week}</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px", fontSize: 12 }}>
            <span style={{ color: "var(--muted-foreground)", fontWeight: 600 }}>Format</span><span>{e.format}</span>
            <span style={{ color: "var(--muted-foreground)", fontWeight: 600 }}>Scope</span><span>{e.scope}</span>
            <span style={{ color: "var(--muted-foreground)", fontWeight: 600 }}>MCQ</span><span>{e.mcqNote}</span>
          </div>
          <div style={{ marginTop: 10, background: "var(--surface-2)", borderRadius: 8, padding: "10px 12px", fontSize: 12, fontStyle: "italic", color: "var(--secondary-foreground)" }}>
            Sample essay question — {e.essay}
          </div>
          {isTeacher && (
            <div style={{ marginTop: 10, background: "var(--warning-muted)", borderRadius: 8, padding: "10px 12px", fontSize: 11.5,
              display: "flex", gap: 8, alignItems: "flex-start" }}>
              <KeyRound size={13} style={{ color: "var(--warning)", flexShrink: 0, marginTop: 1 }} />
              <span><strong>Marking rubric (teacher only):</strong> {e.rubric}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

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
              activeNav === "scroller" ? "286 slides · one section at a time · scroll ↓" : "Sociology L3 · 26 × 1h30 · 10 sections per lecture"}
          </span>
          <span>SociAI v2.1 · La Sorbonne 2026/27</span>
        </footer>
      </div>
    </>
  );
}