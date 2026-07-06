import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, GraduationCap, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Prodigy Tutor" },
      { name: "description", content: "Simple pricing. Curious (free, 3 messages/day). Solo ($10/mo unlimited). Family ($20/mo, up to 4 kids)." },
      { property: "og:title", content: "Prodigy Pricing" },
      { property: "og:description", content: "From free to $20/mo. Cancel anytime." },
    ],
  }),
  component: PricingPage,
});

type Plan = {
  id: "free" | "solo" | "family";
  priceId?: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Curious",
    price: "$0",
    tagline: "Try the tutor — no card needed",
    features: [
      "3 tutor messages per day",
      "Math, physics, writing, code",
      "LaTeX math rendering",
      "1 saved session",
    ],
    cta: "Start free",
  },
  {
    id: "solo",
    priceId: "prodigy_solo_monthly",
    name: "Prodigy Solo",
    price: "$10",
    tagline: "One learner, unlimited depth",
    features: [
      "Unlimited tutor messages",
      "Stuck-topic tracking across sessions",
      "Full session history",
      "Adaptive difficulty & retention loops",
      "Cancel anytime",
    ],
    cta: "Get Solo",
    highlight: true,
  },
  {
    id: "family",
    priceId: "prodigy_family_monthly",
    name: "Family",
    price: "$20",
    tagline: "Up to 4 kids, one plan",
    features: [
      "Everything in Solo",
      "Up to 4 child profiles",
      "Parent/teacher progress reports",
      "Per-child stuck-topic tracking",
    ],
    cta: "Get Family",
  },
];

function PricingPage() {
  const navigate = useNavigate();
  const { openCheckout, loading } = usePaddleCheckout();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ id: data.user.id, email: data.user.email ?? undefined });
    });
  }, []);

  async function handleSelect(plan: Plan) {
    if (plan.id === "free") {
      navigate({ to: user ? "/app" : "/auth", search: user ? undefined : { redirect: "/app" } });
      return;
    }
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/pricing" } });
      return;
    }
    try {
      await openCheckout({
        priceId: plan.priceId!,
        userId: user.id,
        customerEmail: user.email,
        successUrl: `${window.location.origin}/app?checkout=success`,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />
      <Toaster theme="dark" position="top-center" />
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-semibold tracking-tight text-lg">PRODIGY</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Pricing</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Pick your plan.</h1>
          <p className="mt-4 text-muted-foreground text-lg">Start free. Upgrade when your kid asks for the tutor by name. Cancel anytime — full refund within 30 days.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 flex flex-col ${plan.highlight ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border bg-card"}`}
            >
              {plan.highlight && (
                <div className="inline-block text-[10px] font-mono uppercase tracking-widest text-primary border border-primary/40 rounded px-2 py-0.5 self-start mb-2">
                  Most popular
                </div>
              )}
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.id !== "free" && <span className="text-sm text-muted-foreground">/month</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
              <ul className="mt-6 space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelect(plan)}
                disabled={loading}
                className={`mt-6 h-11 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border hover:bg-accent"
                } disabled:opacity-50`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted-foreground text-center">
          Payments processed by Paddle (Merchant of Record). By subscribing you agree to our{" "}
          <Link to="/legal/terms" className="underline hover:text-foreground">Terms</Link>,{" "}
          <Link to="/legal/refund" className="underline hover:text-foreground">Refund Policy</Link>, and{" "}
          <Link to="/legal/privacy" className="underline hover:text-foreground">Privacy Notice</Link>.
        </p>
      </main>
    </div>
  );
}