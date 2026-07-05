import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Activity, Beaker, Dna, Zap, Shield, Check, Loader2, Sparkles, Clock, TrendingUp, Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";
import heroDrop from "@/assets/hero-drop.jpg";
import { generateProtocol, analyzeBloodTest, joinWaitlist, type ProtocolResult } from "@/lib/lazarus.functions";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: LazarusLanding,
});

function LazarusLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster theme="dark" position="top-center" />
      <Nav />
      <Hero />
      <Ticker />
      <HowItWorks />
      <LiveDemo />
      <Markers />
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
            <Dna className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight text-lg">LAZARUS</span>
          <span className="ml-2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-primary/40 text-primary rounded">Beta</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#demo" className="hover:text-foreground transition">Live demo</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
        </nav>
        <a href="#waitlist" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition">
          Get early access
        </a>
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
            LIVE • 12,847 on waitlist
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.02] tracking-tight">
            Your blood.<br />
            <span className="text-primary text-glow">Decoded.</span><br />
            Your life. Extended.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
            Upload any blood test PDF. Our AI reads your actual values and builds a longevity protocol tuned to <em>your</em> biology — trained on 400,000 patient outcomes. Results in 20 seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#demo" className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition">
              Try the AI now <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </a>
            <a href="#how" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border rounded-md font-medium hover:bg-surface transition">
              How it works
            </a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> CLIA-certified lab</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> HIPAA compliant</div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <img src={heroDrop} alt="Bioluminescent blood droplet" className="relative w-full aspect-square object-cover rounded-2xl border border-border" width={800} height={800} />
          <div className="absolute -bottom-4 -left-4 bg-surface border border-border rounded-lg p-3 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Biological Age</div>
            <div className="text-2xl font-semibold text-primary text-glow">−4.2 yrs</div>
          </div>
          <div className="absolute -top-4 -right-4 bg-surface border border-border rounded-lg p-3 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">VO₂ max</div>
            <div className="text-2xl font-semibold text-primary text-glow">+18%</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = ["APOE-e4", "HbA1c 5.1", "hs-CRP ↓", "VO₂max 52", "Vit D 68", "ApoB 74", "Testosterone", "Omega-3 index", "HRV 89", "Fasting insulin", "Lp(a) low", "GlycanAge"];
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

function HowItWorks() {
  const steps = [
    { icon: Beaker, title: "Prick.", body: "One finger. One drop. The Lazarus device (ships free with subscription) reads 40 biomarkers in 15 minutes — no lab, no needle, no wait." },
    { icon: Dna, title: "Decode.", body: "Your data hits our AI trained on 400,000 anonymized patient outcomes. It maps your inflammation, hormones, metabolism, and epigenetic age." },
    { icon: Zap, title: "Act.", body: "You get a protocol updated weekly: what to eat, what to supplement (dose + timing), how to train, when to sleep. It evolves with every test." },
  ];
  return (
    <section id="how" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">01 · The Loop</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">A closed loop between your biology and your behavior.</h2>
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

function LiveDemo() {
  const [form, setForm] = useState({ age: 32, sex: "male" as "male" | "female" | "other", primaryGoal: "Extend healthspan and sharpen mental clarity", energy: 6, sleep: 6.5, concerns: "" });
  const [result, setResult] = useState<ProtocolResult | null>(null);
  const [pdf, setPdf] = useState<{ name: string; base64: string } | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (pdf) {
        return await analyzeBloodTest({
          data: {
            age: form.age,
            sex: form.sex,
            primaryGoal: form.primaryGoal,
            concerns: form.concerns,
            pdfBase64: pdf.base64,
            filename: pdf.name,
          },
        });
      }
      return await generateProtocol({ data: form });
    },
    onSuccess: (data) => {
      setResult(data);
      setTimeout(() => document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    },
    onError: (e: Error) => toast.error(e.message || "The AI is warming up. Try again in a moment."),
  });

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") { toast.error("Please upload a PDF file."); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("PDF too large. Max 8MB."); return; }
    const buf = await file.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    setPdf({ name: file.name, base64 });
    toast.success(`${file.name} loaded. AI will analyze the real values.`);
  };

  return (
    <section id="demo" className="py-24 md:py-32 border-t border-border relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> 02 · Live AI Demo
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Upload your blood test. Get your protocol.</h2>
          <p className="mt-4 text-muted-foreground text-lg">Drop any PDF blood test (Maccabi, Clalit, Quest, LabCorp — any lab). Our AI reads your actual values, flags what matters, and builds a longevity protocol in 20 seconds. No PDF? Skip the upload and we'll simulate from your profile.</p>
        </div>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-6">
          {/* Form */}
          <div className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-5 h-fit sticky top-24">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Blood test PDF
                <span className="ml-auto text-[10px] text-primary">Recommended</span>
              </label>
              {pdf ? (
                <div className="mt-2 flex items-center gap-3 p-3 bg-primary/10 border border-primary/40 rounded-md">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{pdf.name}</div>
                    <div className="text-[10px] font-mono text-primary uppercase tracking-widest">Real values will be used</div>
                  </div>
                  <button type="button" onClick={() => setPdf(null)} className="text-muted-foreground hover:text-foreground transition p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex flex-col items-center justify-center gap-2 p-5 border border-dashed border-border hover:border-primary/60 rounded-md cursor-pointer transition group">
                  <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition" />
                  <div className="text-sm">Drop PDF or click to upload</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Max 8MB · Encrypted in transit</div>
                  <input type="file" accept="application/pdf" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                </label>
              )}
            </div>
            <div className="h-px bg-border" />
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Age</label>
              <input type="number" min={14} max={100} value={form.age}
                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                className="mt-2 w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Sex</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["male", "female", "other"] as const).map((s) => (
                  <button key={s} onClick={() => setForm({ ...form, sex: s })}
                    className={`py-2.5 rounded-md border text-sm capitalize transition ${form.sex === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-muted-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Primary goal</label>
              <input value={form.primaryGoal}
                onChange={(e) => setForm({ ...form, primaryGoal: e.target.value })}
                className="mt-2 w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-primary transition" />
            </div>
            <div className={pdf ? "opacity-50 pointer-events-none" : ""}>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex justify-between">
                <span>Energy today</span><span className="text-primary">{form.energy}/10</span>
              </label>
              <input type="range" min={1} max={10} value={form.energy}
                onChange={(e) => setForm({ ...form, energy: Number(e.target.value) })}
                className="mt-2 w-full accent-primary" />
            </div>
            <div className={pdf ? "opacity-50 pointer-events-none" : ""}>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex justify-between">
                <span>Avg sleep (hrs)</span><span className="text-primary">{form.sleep}</span>
              </label>
              <input type="range" min={3} max={12} step={0.5} value={form.sleep}
                onChange={(e) => setForm({ ...form, sleep: Number(e.target.value) })}
                className="mt-2 w-full accent-primary" />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Concerns (optional)</label>
              <textarea value={form.concerns} rows={2}
                onChange={(e) => setForm({ ...form, concerns: e.target.value })}
                placeholder="brain fog, joint pain, low libido..."
                className="mt-2 w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-primary transition resize-none" />
            </div>
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {mutation.isPending
                ? (<><Loader2 className="w-4 h-4 animate-spin" /> {pdf ? "Reading your blood test…" : "Simulating biology…"}</>)
                : (<>{pdf ? "Analyze my real blood test" : "Simulate my protocol"} <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </div>

          {/* Result */}
          <div id="result" className="min-h-[500px]">
            {!result && !mutation.isPending && <EmptyState />}
            {mutation.isPending && <LoadingState />}
            {result && <ProtocolCard result={result} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="h-full min-h-[500px] border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
        <Activity className="w-7 h-7 text-primary" />
      </div>
      <h4 className="font-display text-xl font-semibold">Awaiting your profile</h4>
      <p className="text-muted-foreground mt-2 max-w-sm">Fill the panel on the left. In seconds, Lazarus will estimate your biological age, flag 6 markers, and build your protocol.</p>
    </div>
  );
}

function LoadingState() {
  const stages = ["Estimating biomarkers…", "Cross-referencing 400k outcomes…", "Composing supplement stack…", "Finalizing weekly protocol…"];
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStage((s) => (s + 1) % stages.length), 1200);
    return () => clearInterval(id);
  }, [stages.length]);
  return (
    <div className="h-full min-h-[500px] border border-primary/30 rounded-xl flex flex-col items-center justify-center text-center p-8 bg-primary/5">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <div className="font-mono text-sm text-primary">{stages[stage]}</div>
    </div>
  );
}

function ProtocolCard({ result }: { result: ProtocolResult }) {
  const diff = result.chronoAge - result.bioAge;
  return (
    <div className="space-y-4">
      {/* Bio age */}
      <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 radial-fade" />
        <div className="relative grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Chronological age</div>
            <div className="font-display text-5xl font-semibold mt-2">{result.chronoAge}</div>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-primary">Biological age</div>
            <div className="font-display text-5xl font-semibold mt-2 text-primary text-glow">{result.bioAge}</div>
            <div className={`text-xs font-mono mt-1 ${diff >= 0 ? "text-primary" : "text-destructive"}`}>{diff >= 0 ? `−${diff}` : `+${Math.abs(diff)}`} yrs</div>
          </div>
        </div>
        <p className="relative mt-6 text-foreground/90 leading-relaxed">{result.summary}</p>
      </div>

      {/* Markers */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">Estimated markers</div>
        <div className="grid grid-cols-2 gap-3">
          {result.markers.map((m, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-background rounded-md border border-border">
              <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${m.status === "optimal" ? "bg-primary" : m.status === "high" ? "bg-chart-3" : "bg-chart-5"}`} />
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium truncate">{m.name}</span>
                  <span className="font-mono text-xs text-primary flex-shrink-0">{m.value}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{m.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol sections */}
      <ProtocolSection title="Nutrition" items={result.protocol.nutrition} />
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Supplement stack</div>
        <div className="space-y-3">
          {result.protocol.supplements.map((s, i) => (
            <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center font-mono text-xs text-primary flex-shrink-0">{i + 1}</div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium">{s.name}</span>
                  <span className="font-mono text-xs text-primary">{s.dose}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.why}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProtocolSection title="Training" items={result.protocol.training} />
      <ProtocolSection title="Lifestyle" items={result.protocol.lifestyle} />

      <div className="bg-primary/10 border border-primary/40 rounded-xl p-6 flex items-start gap-4">
        <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Projected 7-day impact</div>
          <div className="text-foreground leading-relaxed">{result.weeklyImpact}</div>
        </div>
      </div>

      <a href="#waitlist" className="block w-full py-4 text-center bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition">
        Get the real thing → Join early access
      </a>
    </div>
  );
}

function ProtocolSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">{title}</div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <span className="text-foreground/90 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Markers() {
  const rows = [
    ["Metabolic", "HbA1c · Fasting insulin · HOMA-IR · Triglycerides · ApoB · Lp(a)"],
    ["Hormonal", "Total & Free Testosterone · SHBG · Estradiol · Cortisol · DHEA-S · TSH · Free T3/T4"],
    ["Inflammatory", "hs-CRP · Homocysteine · Ferritin · Fibrinogen · GlycA"],
    ["Nutritional", "Vit D · Vit B12 · Folate · Omega-3 index · Magnesium RBC · Zinc"],
    ["Epigenetic", "GrimAge · PhenoAge · DunedinPACE · Telomere length"],
    ["Cardiac", "NT-proBNP · Troponin-I · Lipoprotein-a"],
  ];
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">03 · The Panel</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">40 biomarkers. Every 30 days.</h2>
          <p className="mt-4 text-muted-foreground text-lg">The kind of panel that costs $2,400 in a longevity clinic. From your couch, for the price of a Netflix subscription.</p>
        </div>
        <div className="border border-border rounded-xl overflow-hidden">
          {rows.map(([cat, list], i) => (
            <div key={i} className={`grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-5 ${i > 0 ? "border-t border-border" : ""} hover:bg-surface/50 transition`}>
              <div className="font-mono text-xs uppercase tracking-widest text-primary">{cat}</div>
              <div className="text-foreground/80 font-mono text-sm leading-relaxed">{list}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", tag: "Track & learn", features: ["AI protocol from questionnaire", "Longevity library", "Monthly newsletter"], cta: "Start free", primary: false },
    { name: "Pro", price: "$49", per: "/mo", tag: "Most popular", features: ["Lazarus device (free)", "Monthly 40-marker panel", "Weekly-updated protocol", "Supplement auto-ship discounts", "1-on-1 AI coach"], cta: "Get Pro", primary: true },
    { name: "Legacy", price: "$1,999", per: "one-time", tag: "For your family", features: ["Everything in Pro (lifetime)", "Digital biological twin preserved", "Family longevity dashboard", "Priority clinical review"], cta: "Reserve Legacy", primary: false },
  ];
  return (
    <section id="pricing" className="py-24 md:py-32 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">04 · Access</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Longevity, priced like software.</h2>
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
      toast.success(r.duplicate ? "You're already in. Position saved." : "You're in. Position #12,848.");
    },
    onError: (e: Error) => toast.error(e.message || "Something went wrong. Try again."),
  });

  return (
    <section id="waitlist" className="py-24 md:py-32 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <div className="text-xs font-mono uppercase tracking-widest text-primary mb-4">05 · Join the first cohort</div>
        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">The first 10,000 <span className="text-primary text-glow">rewrite aging.</span></h2>
        <p className="mt-6 text-muted-foreground text-lg">Devices ship Q2 2026. Founders get lifetime Pro at $19/mo — a 60% discount forever. Only <span className="text-primary font-mono">2,153 spots</span> left.</p>

        {done ? (
          <div className="mt-10 inline-flex items-center gap-3 px-6 py-4 bg-primary/10 border border-primary/40 rounded-xl">
            <Check className="w-5 h-5 text-primary" />
            <span className="font-medium">You're in. We'll be in touch.</span>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="mt-10 space-y-3 max-w-md mx-auto">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@futureofmedicine.com"
              className="w-full bg-surface border border-border rounded-md px-4 py-3.5 focus:outline-none focus:border-primary transition" />
            <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="What's your #1 goal? (optional)"
              className="w-full bg-surface border border-border rounded-md px-4 py-3.5 focus:outline-none focus:border-primary transition" />
            <button type="submit" disabled={mutation.isPending}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {mutation.isPending ? (<><Loader2 className="w-4 h-4 animate-spin" /> Reserving your spot…</>) : (<>Claim founder pricing <ArrowRight className="w-4 h-4" /></>)}
            </button>
            <p className="text-xs text-muted-foreground font-mono flex items-center justify-center gap-2 pt-2">
              <Clock className="w-3 h-3" /> No spam. No selling data. Ever.
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
            <Dna className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight">LAZARUS</span>
          <span className="text-xs text-muted-foreground ml-2 font-mono">© 2026 · Rewriting aging.</span>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          Not a medical device. Not diagnostic. Consult a physician.
        </div>
      </div>
    </footer>
  );
}
