import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, GraduationCap, Brain, Sigma, Atom, PenLine, Code2, Check, Loader2, Sparkles, Clock, Send, Trophy, Zap, Target } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import heroImg from "@/assets/prodigy-hero.jpg";
import { tutorReply, joinWaitlist } from "@/lib/prodigy.functions";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/he")({
  component: ProdigyLandingHE,
  head: () => ({
    meta: [
      { title: "Prodigy — מורה פרטי AI ברמת אולימפיאדה" },
      { name: "description", content: "מורה AI שמלמד מתמטיקה, פיזיקה וכתיבה ברמה של מורה פרטי מ-MIT. בשיטה סוקרטית, עם LaTeX ובעברית." },
      { property: "og:title", content: "Prodigy — מורה פרטי AI לכל ילד" },
      { property: "og:description", content: "פותרים את בעיית 2-Sigma של בלום. מורה פרטי לכל ילד, ב-₪35 לחודש." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ProdigyLandingHE() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
  );
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight text-lg">PRODIGY</span>
          <span className="mx-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-primary/40 text-primary rounded">בטא</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#method" className="hover:text-foreground transition">השיטה</a>
          <a href="#tutor" className="hover:text-foreground transition">נסה את המורה</a>
          <a href="#subjects" className="hover:text-foreground transition">מקצועות</a>
          <a href="#pricing" className="hover:text-foreground transition">מחירים</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition border border-border rounded px-2 py-1">
            English
          </Link>
          <Link to="/app" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition whitespace-nowrap">
            פתח מורה
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 radial-fade">
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs font-mono text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-ring" />
            חי • 24,109 ילדים לומדים עכשיו
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
            מורה פרטי מ-MIT.<br />
            <span className="text-primary text-glow">לכל ילד.</span><br />
            ב-₪35 לחודש.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
            Prodigy פותר את בעיית ה-2-Sigma של בלום. מורה AI שמאתר <em>בדיוק</em> איפה הילד תקוע, מוליך אותו החוצה — ומעלה אותו ל-1% העליון עם שאלה סוקרטית אחת בכל פעם.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#tutor" className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition">
              נסו את המורה עכשיו <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
            </a>
            <a href="#method" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border rounded-md font-medium hover:bg-surface transition">
              איך זה עובד
            </a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> תוצאות ב-1% העליון ב-PISA</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> מגיל 6–18</div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <img src={heroImg} alt="קונסטלציה של דיאגרמות מתמטיות ופיזיקליות זוהרות בזהב" className="relative w-full aspect-square object-cover rounded-2xl border border-border" width={1024} height={1024} />
          <div className="absolute -bottom-4 -right-4 bg-surface border border-border rounded-lg p-3 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">שיפור ממוצע</div>
            <div className="text-2xl font-semibold text-primary text-glow">+2.0σ</div>
          </div>
          <div className="absolute -top-4 -left-4 bg-surface border border-border rounded-lg p-3 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">עלות מול מורה אנושי</div>
            <div className="text-2xl font-semibold text-primary text-glow">1/400</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = ["חשבון דיפרנציאלי", "מכניקה ניוטונית", "מבנה חיבור", "אלגברה לינארית", "רקורסיה", "כימיה אורגנית", "הסתברות", "רטוריקה", "בסיס קוונטים", "תורת המספרים", "מבני נתונים", "טריגונומטריה"];
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
  const steps = [
    { icon: Target, title: "אבחון.", body: "בפחות מ-3 שאלות, Prodigy מזהה את הרעיון המדויק שחסר לילד — לא מה שהמבחן אמר שהוא טעה בו, אלא את התפיסה השגויה שמתחת." },
    { icon: Brain, title: "לולאה סוקרטית.", body: "בלי לתת תשובות מוכנות. Prodigy שואל את השאלה הקטנה ביותר שפותחת את הצעד הבא. הילד עושה את החשיבה. ככה נבנית שליטה אמיתית." },
    { icon: Zap, title: "שליטה.", body: "כל מפגש נגמר רק כשהרעיון באמת פנימי — נבדק דרך שאלות חדשות שה-AI מייצר במקום. לא שינון. הבנה." },
  ];
  return (
    <section id="method" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">01 · שיטת ה-2-Sigma</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">בנג'מין בלום הוכיח את זה ב-1984. אנחנו סוף סוף בנינו את זה.</h2>
          <p className="mt-4 text-muted-foreground text-lg">ילדים עם מורה פרטי 1-על-1 עוברים 98% מחבריהם לכיתה. הבעיה: מורה פרטי עולה ₪300 לשעה. Prodigy מספק את אותה שיטה ב-₪35 לחודש.</p>
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
  math: { label: "מתמטיקה", icon: Sigma, seed: "אני לא מבין למה הנגזרת של x² היא 2x. מאיפה בא ה-2?", placeholder: "שאל שאלה במתמטיקה…" },
  physics: { label: "פיזיקה", icon: Atom, seed: "למה עצם כבד נופל באותה מהירות כמו עצם קל?", placeholder: "שאל שאלה בפיזיקה…" },
  writing: { label: "כתיבה", icon: PenLine, seed: "אני צריך לכתוב חיבור על מתי מותר לשקר. אני לא יודע איך להתחיל.", placeholder: "הדבק טקסט או שאל…" },
  code: { label: "קוד", icon: Code2, seed: "הקוד שלי בפייתון אמור להפוך רשימה אבל מדפיס אותה כמו שהיא. עזרה.", placeholder: "הדבק קוד או שאל…" },
};

function LiveTutor() {
  const [subject, setSubject] = useState<Subject>("math");
  const [grade, setGrade] = useState("כיתה ח׳");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const mutation = useMutation({
    mutationFn: async (userText: string) => {
      const next: ChatMsg[] = [...messages, { role: "user", content: userText }];
      setMessages(next);
      setInput("");
      const res = await tutorReply({ data: { subject, grade, messages: next, locale: "he" } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
      return res;
    },
    onError: (e: Error) => toast.error(e.message || "המורה חושב חזק מדי. נסה שוב."),
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
            <Sparkles className="w-3.5 h-3.5" /> 02 · מורה חי
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">שאלו את Prodigy כל דבר. עכשיו.</h2>
          <p className="mt-4 text-muted-foreground text-lg">בחרו מקצוע, ציינו את הכיתה, וצפו במורה עובד. הוא לא רק ייתן תשובה — הוא ילמד.</p>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-5 h-fit md:sticky md:top-24">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">מקצוע</label>
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
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">כיתה / רמה</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)}
                className="mt-2 w-full bg-background border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition">
                {["כיתה ב׳", "כיתה ד׳", "כיתה ו׳", "כיתה ח׳", "כיתה י׳", "כיתה י״ב", "שנה א׳ באוניברסיטה", "לומד בוגר"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">שאלה לדוגמה</label>
              <button onClick={() => send(SUBJECT_META[subject].seed)}
                disabled={mutation.isPending}
                className="mt-2 w-full text-right text-xs p-3 bg-background border border-border rounded-md hover:border-primary transition text-muted-foreground hover:text-foreground disabled:opacity-50">
                {SUBJECT_META[subject].seed}
              </button>
            </div>
            {messages.length > 0 && (
              <button onClick={() => setMessages([])}
                className="w-full py-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border rounded-md transition">
                איפוס שיחה
              </button>
            )}
          </div>

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
                dir="rtl"
                className="flex-1 bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-primary transition disabled:opacity-50" />
              <button type="submit" disabled={mutation.isPending || !input.trim()}
                className="px-5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2">
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl:rotate-180" />}
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
      <h4 className="font-display text-xl font-semibold">המורה שלך מוכן</h4>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">כתוב שאלה, הדבק בעיה, או השתמש בשאלה לדוגמה מהצד. המורה ידריך — לא רק ייתן תשובה.</p>
    </div>
  );
}

function Bubble({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-mono ${isUser ? "bg-surface-2 border border-border" : "bg-primary/10 border border-primary/40 text-primary"}`}>
        {isUser ? "את/ה" : <GraduationCap className="w-4 h-4" />}
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
    ["מתמטיקה", "חשבון · אלגברה · גיאומטריה · טריגונומטריה · חשבון דיפרנציאלי · אלגברה לינארית · סטטיסטיקה · תורת המספרים · הכנה לאולימפיאדות"],
    ["פיזיקה", "מכניקה · אלקטרומגנטיות · תרמודינמיקה · גלים · אופטיקה · פיזיקה מודרנית וקוונטית · 5 יח״ל / בגרות"],
    ["כתיבה", "מבנה · טיעון · קול · דקדוק · חיבור בגרות · הגשה לאוניברסיטה · פרוזה יוצרת"],
    ["קוד", "פייתון · JavaScript · מבני נתונים · אלגוריתמים · הכנה לאולימפיאדת מחשבים · מבוא ל-ML"],
    ["כימיה", "כללית · אורגנית · סטויכיומטריה · מנגנוני תגובה · בגרות"],
    ["היסטוריה ומדעי הרוח", "קריאה אנליטית · ניסוח טענה · ניתוח מקורות · חינוך לדיבייט"],
  ];
  return (
    <section id="subjects" className="py-24 md:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">03 · תוכנית הלימודים</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">כל מקצוע. כל רמה. מורה אחד.</h2>
          <p className="mt-4 text-muted-foreground text-lg">מ״למה השמיים כחולים״ ועד ״הוכח את השערת רימן״ (טוב — ננסה). Prodigy סקלבילי מגיל 6 ועד הכנה לאולימפיאדות, וזוכר את הילד שלכם בין מפגשים.</p>
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
    { name: "סקרן", price: "חינם", tag: "לחקרנים", features: ["10 מפגשים בחודש", "כל המקצועות", "מעקב התקדמות בסיסי"], cta: "התחל בחינם", primary: false },
    { name: "Prodigy", price: "₪35", per: "/חודש לילד", tag: "רוב המשפחות", features: ["מפגשים ללא הגבלה", "דוח שליטה שבועי להורים", "מסלול לימוד מותאם", "הכנה לאולימפיאדות ותחרויות", "תרגולי פסיכומטרי / בגרות"], cta: "התחל Prodigy", primary: true },
    { name: "משפחה", price: "₪89", per: "/חודש · 4 ילדים", tag: "לאחים", features: ["הכל בפרודיג׳י × 4 ילדים", "תובנות חוצות-ילדים להורים", "תמיכה מועדפת", "העברה למורה אנושי (שעה בחודש)"], cta: "בחר משפחה", primary: false },
  ];
  return (
    <section id="pricing" className="py-24 md:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">04 · מחירים</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">מורה אנושי — ₪300 לשעה. Prodigy — ₪35 לחודש.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div key={t.name} className={`rounded-xl p-8 border ${t.primary ? "border-primary bg-primary/5 relative" : "border-border bg-surface"}`}>
              {t.primary && <div className="absolute -top-3 right-8 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest rounded">{t.tag}</div>}
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
              <a href="#waitlist" className={`mt-8 block w-full py-3 rounded-md text-center font-medium transition ${t.primary ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border hover:bg-surface-2"}`}>{t.cta}</a>
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
      toast.success(r.duplicate ? "כבר רשומים. המקום נשמר." : "נרשמת בהצלחה. מקום #24,110.");
    },
    onError: (e: Error) => toast.error(e.message || "משהו השתבש. נסו שוב."),
  });

  return (
    <section id="waitlist" className="py-24 md:py-32 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">05 · משפחות מייסדות</div>
        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">גדלו <span className="text-primary text-glow">פרודיג׳י.</span></h2>
        <p className="mt-6 text-muted-foreground text-lg">10,000 המשפחות הראשונות מקבלות את Prodigy לכל החיים ב-<span className="text-primary font-mono">₪17 לחודש לילד</span> — חצי מחיר, לתמיד. נותרו רק <span className="text-primary font-mono">3,472 מקומות</span>.</p>

        {done ? (
          <div className="mt-10 inline-flex items-center gap-3 px-6 py-4 bg-primary/10 border border-primary/40 rounded-xl">
            <Check className="w-5 h-5 text-primary" />
            <span className="font-medium">נרשמת. נהיה בקשר.</span>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="mt-10 space-y-3 max-w-md mx-auto">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" dir="ltr"
              className="w-full bg-surface border border-border rounded-md px-4 py-3.5 focus:outline-none focus:border-primary transition text-right" />
            <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="גיל הילד והקושי הגדול ביותר (רשות)"
              className="w-full bg-surface border border-border rounded-md px-4 py-3.5 focus:outline-none focus:border-primary transition" />
            <button type="submit" disabled={mutation.isPending}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {mutation.isPending ? (<><Loader2 className="w-4 h-4 animate-spin" /> שומר מקום…</>) : (<>קבל מחיר משפחה מייסדת <ArrowLeft className="w-4 h-4" /></>)}
            </button>
            <p className="text-xs text-muted-foreground font-mono flex items-center justify-center gap-2 pt-2">
              <Clock className="w-3 h-3" /> בלי ספאם. בלי מכירת נתונים.
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
          <span className="text-xs text-muted-foreground mx-2 font-mono">© 2026 · גדלו פרודיג׳י.</span>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          גילאים 6–18 · לא תחליף ללימודים מוסדיים.
        </div>
      </div>
    </footer>
  );
}
