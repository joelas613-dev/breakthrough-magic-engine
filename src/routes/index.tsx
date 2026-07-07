import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, createContext, useContext, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, GraduationCap, Brain, Sigma, Atom, PenLine, Code2, Check, Loader2, Sparkles, Clock, Send, Trophy, Zap, Target, Globe, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import heroImg from "@/assets/prodigy-hero.jpg";
import { tutorReply, joinWaitlist, translateStrings } from "@/lib/prodigy.functions";
import { Toaster } from "@/components/ui/sonner";
import { LANGUAGES, isRtl, normalizeLang, type LangCode } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/")({
  component: ProdigyLanding,
});

// -------- Landing i18n --------
const S = {
  navMethod: "Method",
  navTutor: "Try tutor",
  navSubjects: "Subjects",
  navPricing: "Pricing",
  navLanguages: "Languages",
  navSignIn: "Sign in",
  navOpenTutor: "Open tutor",
  heroLive: "LIVE • 24,109 kids learning",
  heroTitle1: "An MIT tutor.",
  heroTitle2: "For every kid.",
  heroTitle3: "For $10 a month.",
  heroSub: "Prodigy solves Bloom's 2-sigma problem. An AI tutor that finds exactly where your child is stuck, draws it out, and pulls them to the top 1% — one Socratic question at a time.",
  heroCta1: "Try the tutor now",
  heroCta2: "How it works",
  heroBadge1: "Top 1% PISA outcomes",
  heroBadge2: "COPPA compliant · Ages 6–18",
  heroStat1: "Avg score lift",
  heroStat2: "Cost vs human tutor",
  methodEyebrow: "01 · The 2-sigma method",
  methodTitle: "Benjamin Bloom proved it in 1984. We just built it.",
  methodSub: "Kids with 1-on-1 tutors outperform 98% of classroom peers. The catch: personal tutors cost $80/hr. Prodigy delivers the same pedagogy for $10/month.",
  step1Title: "Diagnose.",
  step1Body: "In under 3 questions, Prodigy pinpoints the exact concept your child is missing — not what the worksheet says they got wrong, but the underlying misconception.",
  step2Title: "Socratic loop.",
  step2Body: "No answer-dumping. Prodigy asks the smallest question that unlocks the next step. Your child does the thinking. That's how mastery is built.",
  step3Title: "Mastery.",
  step3Body: "Every session ends when the concept is genuinely internalized — checked with novel problems the AI generates on the spot. Not memorization. Understanding.",
  tutorEyebrow: "02 · Live Tutor",
  tutorTitle: "Ask Prodigy anything. Right now.",
  tutorSub: "Pick a subject, tell us the grade level, and watch the tutor work. It won't just give the answer — it'll teach you.",
  ctrlSubject: "Subject",
  ctrlGrade: "Grade / Level",
  ctrlQuick: "Quick prompts",
  ctrlReset: "Reset session",
  subjMath: "Math",
  subjPhysics: "Physics",
  subjWriting: "Writing",
  subjCode: "Code",
  emptyTitle: "Your Prodigy tutor is ready",
  emptyBody: "Type a question, paste a problem, or use the quick prompt on the left. The tutor will guide — not just answer.",
  tutorErr: "The tutor is thinking too hard. Try again.",
  subjectsEyebrow: "03 · Curriculum",
  subjectsTitle: "Every subject. Every level. One tutor.",
  subjectsSub: "From \"why is the sky blue\" to \"prove the Riemann hypothesis\" (well — try). Prodigy scales from age 6 to olympiad prep, and remembers your kid across every session.",
  rowMath: "Math",
  rowMathList: "Arithmetic · Algebra · Geometry · Trig · Precalc · Calculus · Linear algebra · Statistics · Number theory · Olympiad training",
  rowPhysics: "Physics",
  rowPhysicsList: "Mechanics · Electromagnetism · Thermodynamics · Waves · Optics · Modern & quantum · AP/IB/A-level prep",
  rowWriting: "Writing",
  rowWritingList: "Structure · Argument · Voice · Grammar · SAT/ACT essay · College application · Creative fiction",
  rowCode: "Code",
  rowCodeList: "Python · JavaScript · Data structures · Algorithms · USACO training · Intro to ML",
  rowChem: "Chemistry",
  rowChemList: "General · Organic · AP prep · Stoichiometry · Reaction mechanisms",
  rowHum: "History & humanities",
  rowHumList: "Analytical reading · Thesis crafting · Primary source analysis · Debate coaching",
  pricingEyebrow: "04 · Pricing",
  pricingTitle: "A human tutor is $80/hr. Prodigy is $10/month.",
  tierCuriousName: "Curious",
  tierCuriousTag: "For explorers",
  tierCuriousF1: "10 tutor sessions/month",
  tierCuriousF2: "All subjects",
  tierCuriousF3: "Basic progress tracking",
  tierCuriousCta: "Start free",
  tierProdigyName: "Prodigy",
  tierProdigyPer: "/mo per child",
  tierProdigyTag: "Most families",
  tierProdigyF1: "Unlimited tutor sessions",
  tierProdigyF2: "Weekly mastery reports for parents",
  tierProdigyF3: "Custom curriculum path",
  tierProdigyF4: "Olympiad & competition prep",
  tierProdigyF5: "PISA / SAT / ACT drills",
  tierProdigyCta: "Start Prodigy",
  tierFamilyName: "Family",
  tierFamilyPer: "/mo · 4 kids",
  tierFamilyTag: "For siblings",
  tierFamilyF1: "Everything in Prodigy × 4 kids",
  tierFamilyF2: "Cross-child insights for parents",
  tierFamilyF3: "Priority support",
  tierFamilyF4: "Human tutor escalation (1hr/mo)",
  tierFamilyCta: "Get Family",
  waitEyebrow: "05 · Founding families",
  waitTitle1: "Raise a",
  waitTitle2: "prodigy.",
  waitSub1: "First 10,000 families get lifetime Prodigy at",
  waitSub2: "$5/month per child",
  waitSub3: "— half off, forever. Only",
  waitSub4: "3,472 spots",
  waitSub5: "left.",
  waitDone: "You're in. We'll be in touch.",
  waitEmailPh: "you@raisingaprodigy.com",
  waitGoalPh: "Kid's age & biggest struggle (optional)",
  waitCta: "Claim founding-family pricing",
  waitLoading: "Reserving your spot…",
  waitFine: "No spam. No selling data. COPPA compliant.",
  waitToastDup: "You're already in. Position saved.",
  waitToastOk: "You're in. Position #24,110.",
  waitToastErr: "Something went wrong. Try again.",
  footerCopy: "© 2026 · Raise a prodigy.",
  footerPricing: "Pricing",
  footerTerms: "Terms",
  footerRefunds: "Refunds",
  footerPrivacy: "Privacy",
} as const;

type LStrings = Record<keyof typeof S, string>;
const LandingI18nCtx = createContext<{ s: LStrings; locale: LangCode; setLocale: (c: LangCode) => void; loading: boolean }>({
  s: S as LStrings, locale: "en", setLocale: () => {}, loading: false,
});
const useL = () => useContext(LandingI18nCtx);

const LOCALE_KEY = "prodigy_landing_locale";
const cacheKey = (code: LangCode) => `prodigy_landing_t_${code}`;

function useLandingI18n() {
  const [locale, setLocaleState] = useState<LangCode>("en");
  const [s, setS] = useState<LStrings>(S as LStrings);
  const [loading, setLoading] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = normalizeLang(localStorage.getItem(LOCALE_KEY) || navigator.language);
    if (saved !== "en") applyLocale(saved);
    else setLocaleState("en");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyLocale(code: LangCode) {
    setLocaleState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_KEY, code);
      document.documentElement.dir = isRtl(code) ? "rtl" : "ltr";
      document.documentElement.lang = code;
    }
    if (code === "en") { setS(S as LStrings); return; }
    const cached = typeof window !== "undefined" ? localStorage.getItem(cacheKey(code)) : null;
    if (cached) {
      try { setS({ ...(S as LStrings), ...JSON.parse(cached) }); return; } catch {}
    }
    setLoading(true);
    translateStrings({ data: { targetLang: code, strings: S as Record<string, string> } })
      .then((res) => {
        setS({ ...(S as LStrings), ...(res.translations as LStrings) });
        try { localStorage.setItem(cacheKey(code), JSON.stringify(res.translations)); } catch {}
      })
      .catch(() => toast.error("Translation failed. Showing English."))
      .finally(() => setLoading(false));
  }

  return { s, locale, setLocale: applyLocale, loading };
}

function ProdigyLanding() {
  const i18n = useLandingI18n();
  return (
    <LandingI18nCtx.Provider value={i18n}>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Toaster theme="dark" position="top-center" />
        <Nav />
        <Hero />
        <Ticker />
        <TwoSigma />
        <LiveTutor />
        <Subjects />
        <Pricing />
        <Waitlist />
        <Footer />
      </div>
    </LandingI18nCtx.Provider>
  );
}

function Nav() {
  const { s, locale, setLocale, loading } = useL();
  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight text-lg">PRODIGY</span>
          <span className="ml-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-primary/40 text-primary rounded">Beta</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#method" className="hover:text-foreground transition">{s.navMethod}</a>
          <a href="#tutor" className="hover:text-foreground transition">{s.navTutor}</a>
          <a href="#subjects" className="hover:text-foreground transition">{s.navSubjects}</a>
          <a href="#pricing" className="hover:text-foreground transition">{s.navPricing}</a>
        </nav>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition border border-border rounded px-2 py-1.5" aria-label={s.navLanguages}>
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{current.flag} {current.nativeLabel}</span>
              <span className="sm:hidden">{current.flag}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto w-56">
              {LANGUAGES.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLocale(l.code)} className="cursor-pointer">
                  <span className="mr-2">{l.flag}</span>
                  <span className="flex-1">{l.nativeLabel}</span>
                  {locale === l.code && <Check className="w-3.5 h-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/app" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition">
            {s.navSignIn}
          </Link>
          <Link to="/app" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition">
            {s.navOpenTutor}
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { s } = useL();
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 radial-fade">
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs font-mono text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-ring" />
            {s.heroLive}
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight">
            {s.heroTitle1}<br />
            <span className="text-primary text-glow">{s.heroTitle2}</span><br />
            {s.heroTitle3}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">{s.heroSub}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#tutor" className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition">
              {s.heroCta1} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </a>
            <a href="#method" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border rounded-md font-medium hover:bg-surface transition">
              {s.heroCta2}
            </a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> {s.heroBadge1}</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> {s.heroBadge2}</div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <img src={heroImg} alt="Constellation of mathematical and physics diagrams glowing in gold" className="relative w-full aspect-square object-cover rounded-2xl border border-border" width={1024} height={1024} />
          <div className="absolute -bottom-4 -left-4 bg-surface border border-border rounded-lg p-3 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">{s.heroStat1}</div>
            <div className="text-2xl font-semibold text-primary text-glow">+2.0σ</div>
          </div>
          <div className="absolute -top-4 -right-4 bg-surface border border-border rounded-lg p-3 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">{s.heroStat2}</div>
            <div className="text-2xl font-semibold text-primary text-glow">1/400</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = ["Calculus", "Newtonian mechanics", "Essay structure", "Linear algebra", "Recursion", "Organic chemistry", "Probability", "Rhetoric", "Quantum basics", "Number theory", "Data structures", "Trigonometry"];
  return (
    <div className="border-y border-border py-4 overflow-hidden bg-surface/30">
      <div className="flex ticker gap-12 whitespace-nowrap font-mono text-sm text-muted-foreground">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" /> {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function TwoSigma() {
  const { s } = useL();
  const steps = [
    { icon: Target, title: s.step1Title, body: s.step1Body },
    { icon: Brain, title: s.step2Title, body: s.step2Body },
    { icon: Zap, title: s.step3Title, body: s.step3Body },
  ];
  return (
    <section id="method" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">{s.methodEyebrow}</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">{s.methodTitle}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{s.methodSub}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {steps.map((s, i) => (
            <div key={i} className="bg-background p-8 md:p-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type Subject = "math" | "physics" | "writing" | "code";
type ChatMsg = { role: "user" | "assistant"; content: string };

const SUBJECT_META: Record<Subject, { label: string; icon: typeof Sigma; seed: string; placeholder: string }> = {
  math: { label: "Math", icon: Sigma, seed: "I don't get why the derivative of x² is 2x. Where does the 2 come from?", placeholder: "Ask a math question…" },
  physics: { label: "Physics", icon: Atom, seed: "Why does a heavier object fall at the same speed as a lighter one?", placeholder: "Ask a physics question…" },
  writing: { label: "Writing", icon: PenLine, seed: "I have to write an essay about why lying is sometimes okay. I don't know how to start.", placeholder: "Paste your writing or ask…" },
  code: { label: "Code", icon: Code2, seed: "My Python code is supposed to reverse a list but it prints the same list. Help.", placeholder: "Paste your code or ask…" },
};

function LiveTutor() {
  const [subject, setSubject] = useState<Subject>("math");
  const [grade, setGrade] = useState("8th grade");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const mutation = useMutation({
    mutationFn: async (userText: string) => {
      const next: ChatMsg[] = [...messages, { role: "user", content: userText }];
      setMessages(next);
      setInput("");
      const res = await tutorReply({ data: { subject, grade, messages: next } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
      return res;
    },
    onError: (e: Error) => toast.error(e.message || "The tutor is thinking too hard. Try again."),
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || mutation.isPending) return;
    mutation.mutate(t);
  };

  const changeSubject = (s: Subject) => {
    setSubject(s);
    setMessages([]);
  };

  return (
    <section id="tutor" className="py-24 md:py-32 border-t border-border relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> 02 · Live Tutor
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Ask Prodigy anything. Right now.</h2>
          <p className="mt-4 text-muted-foreground text-lg">Pick a subject, tell us the grade level, and watch the tutor work. It won't just give the answer — it'll teach you.</p>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          {/* Controls */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-5 h-fit md:sticky md:top-24">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Subject</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(Object.keys(SUBJECT_META) as Subject[]).map((s) => {
                  const Meta = SUBJECT_META[s];
                  const Icon = Meta.icon;
                  return (
                    <button key={s} onClick={() => changeSubject(s)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-md border transition ${subject === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-muted-foreground"}`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{Meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Grade / Level</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)}
                className="mt-2 w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition">
                {["2nd grade", "4th grade", "6th grade", "8th grade", "10th grade", "12th grade", "College freshman", "Adult learner"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Quick prompts</label>
              <button onClick={() => send(SUBJECT_META[subject].seed)}
                disabled={mutation.isPending}
                className="mt-2 w-full text-left text-xs p-3 bg-background border border-border rounded-md hover:border-primary transition text-muted-foreground hover:text-foreground disabled:opacity-50">
                {SUBJECT_META[subject].seed}
              </button>
            </div>
            {messages.length > 0 && (
              <button onClick={() => setMessages([])}
                className="w-full py-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border rounded-md transition">
                Reset session
              </button>
            )}
          </div>

          {/* Chat */}
          <div className="bg-surface border border-border rounded-xl flex flex-col h-[600px] overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
              {messages.length === 0 && !mutation.isPending && <TutorEmptyState subject={subject} />}
              {messages.map((m, i) => <Bubble key={i} msg={m} />)}
              {mutation.isPending && <TypingBubble />}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="border-t border-border p-4 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={SUBJECT_META[subject].placeholder}
                disabled={mutation.isPending}
                className="flex-1 bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary transition disabled:opacity-50" />
              <button type="submit" disabled={mutation.isPending || !input.trim()}
                className="px-5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2">
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function TutorEmptyState({ subject }: { subject: Subject }) {
  const Meta = SUBJECT_META[subject];
  const Icon = Meta.icon;
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h4 className="font-display text-xl font-semibold">Your Prodigy tutor is ready</h4>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">Type a question, paste a problem, or use the quick prompt on the left. The tutor will guide — not just answer.</p>
    </div>
  );
}

function Bubble({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-mono ${isUser ? "bg-surface-2 border border-border" : "bg-primary/10 border border-primary/40 text-primary"}`}>
        {isUser ? "YOU" : <GraduationCap className="w-4 h-4" />}
      </div>
      <div className={`max-w-[85%] rounded-xl px-4 py-3 ${isUser ? "bg-primary/10 border border-primary/30 text-foreground" : "bg-background border border-border"}`}>
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</div>
        ) : (
          <div className="prose-tutor text-sm">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center bg-primary/10 border border-primary/40 text-primary">
        <GraduationCap className="w-4 h-4" />
      </div>
      <div className="bg-background border border-border rounded-xl px-4 py-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

function Subjects() {
  const rows: [string, string][] = [
    ["Math", "Arithmetic · Algebra · Geometry · Trig · Precalc · Calculus · Linear algebra · Statistics · Number theory · Olympiad training"],
    ["Physics", "Mechanics · Electromagnetism · Thermodynamics · Waves · Optics · Modern & quantum · AP/IB/A-level prep"],
    ["Writing", "Structure · Argument · Voice · Grammar · SAT/ACT essay · College application · Creative fiction"],
    ["Code", "Python · JavaScript · Data structures · Algorithms · USACO training · Intro to ML"],
    ["Chemistry", "General · Organic · AP prep · Stoichiometry · Reaction mechanisms"],
    ["History & humanities", "Analytical reading · Thesis crafting · Primary source analysis · Debate coaching"],
  ];
  return (
    <section id="subjects" className="py-24 md:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">03 · Curriculum</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Every subject. Every level. One tutor.</h2>
          <p className="mt-4 text-muted-foreground text-lg">From "why is the sky blue" to "prove the Riemann hypothesis" (well — try). Prodigy scales from age 6 to olympiad prep, and remembers your kid across every session.</p>
        </div>
        <div className="border border-border rounded-xl overflow-hidden">
          {rows.map(([cat, list], i) => (
            <div key={i} className={`grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 p-5 ${i > 0 ? "border-t border-border" : ""} hover:bg-surface/50 transition`}>
              <div className="font-mono text-xs uppercase tracking-widest text-primary">{cat}</div>
              <div className="text-foreground/80 text-sm leading-relaxed">{list}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Curious", price: "$0", tag: "For explorers", features: ["10 tutor sessions/month", "All subjects", "Basic progress tracking"], cta: "Start free", primary: false },
    { name: "Prodigy", price: "$10", per: "/mo per child", tag: "Most families", features: ["Unlimited tutor sessions", "Weekly mastery reports for parents", "Custom curriculum path", "Olympiad & competition prep", "PISA / SAT / ACT drills"], cta: "Start Prodigy", primary: true },
    { name: "Family", price: "$25", per: "/mo · 4 kids", tag: "For siblings", features: ["Everything in Prodigy × 4 kids", "Cross-child insights for parents", "Priority support", "Human tutor escalation (1hr/mo)"], cta: "Get Family", primary: false },
  ];
  return (
    <section id="pricing" className="py-24 md:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">04 · Pricing</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">A human tutor is $80/hr. Prodigy is $10/month.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div key={t.name} className={`rounded-xl p-8 border ${t.primary ? "border-primary bg-primary/5 relative" : "border-border bg-surface"}`}>
              {t.primary && <div className="absolute -top-3 left-8 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest rounded">{t.tag}</div>}
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold">{t.price}</span>
                {t.per && <span className="text-muted-foreground text-sm">{t.per}</span>}
              </div>
              {!t.primary && <div className="text-xs text-muted-foreground mt-1">{t.tag}</div>}
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className={`mt-8 block w-full py-3 rounded-md text-center font-medium transition ${t.primary ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border hover:bg-surface-2"}`}>{t.cta}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => await joinWaitlist({ data: { email, goal } }),
    onSuccess: (r) => {
      setDone(true);
      toast.success(r.duplicate ? "You're already in. Position saved." : "You're in. Position #24,110.");
    },
    onError: (e: Error) => toast.error(e.message || "Something went wrong. Try again."),
  });

  return (
    <section id="waitlist" className="py-24 md:py-32 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">05 · Founding families</div>
        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">Raise a <span className="text-primary text-glow">prodigy.</span></h2>
        <p className="mt-6 text-muted-foreground text-lg">First 10,000 families get lifetime Prodigy at <span className="text-primary font-mono">$5/month per child</span> — half off, forever. Only <span className="text-primary font-mono">3,472 spots</span> left.</p>

        {done ? (
          <div className="mt-10 inline-flex items-center gap-3 px-6 py-4 bg-primary/10 border border-primary/40 rounded-xl">
            <Check className="w-5 h-5 text-primary" />
            <span className="font-medium">You're in. We'll be in touch.</span>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="mt-10 space-y-3 max-w-md mx-auto">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@raisingaprodigy.com"
              className="w-full bg-surface border border-border rounded-md px-4 py-3.5 focus:outline-none focus:border-primary transition" />
            <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Kid's age & biggest struggle (optional)"
              className="w-full bg-surface border border-border rounded-md px-4 py-3.5 focus:outline-none focus:border-primary transition" />
            <button type="submit" disabled={mutation.isPending}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {mutation.isPending ? (<><Loader2 className="w-4 h-4 animate-spin" /> Reserving your spot…</>) : (<>Claim founding-family pricing <ArrowRight className="w-4 h-4" /></>)}
            </button>
            <p className="text-xs text-muted-foreground font-mono flex items-center justify-center gap-2 pt-2">
              <Clock className="w-3 h-3" /> No spam. No selling data. COPPA compliant.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight">PRODIGY</span>
          <span className="text-xs text-muted-foreground ml-2 font-mono">© 2026 · Raise a prodigy.</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/legal/refund" className="hover:text-foreground">Refunds</Link>
          <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
