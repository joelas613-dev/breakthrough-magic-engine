import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { GraduationCap, Loader2, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
});

function safeRedirect(raw: string | undefined): string {
  if (!raw) return "/app";
  try {
    const url = new URL(raw, typeof window !== "undefined" ? window.location.origin : "http://x");
    if (typeof window !== "undefined" && url.origin !== window.location.origin) return "/app";
    return url.pathname + url.search + url.hash;
  } catch {
    return raw.startsWith("/") ? raw : "/app";
  }
}

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const target = safeRedirect(search.redirect);

  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // If already signed in, bounce
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: target, replace: true });
    });
  }, [navigate, target]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${target}`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created! Signing you in…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: target, replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth" + (search.redirect ? `?redirect=${encodeURIComponent(search.redirect)}` : ""),
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: target, replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <Toaster theme="dark" position="top-center" />
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight text-lg">PRODIGY</span>
        </Link>

        <div className="border border-border rounded-2xl bg-card p-8">
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "signup" ? "Start learning" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signup" ? "Create your Prodigy account — first sessions are free." : "Sign in to continue your tutor sessions."}
          </p>

          <button
            onClick={google}
            disabled={loading}
            className="mt-6 w-full h-11 rounded-md border border-border bg-background hover:bg-accent text-sm font-medium flex items-center justify-center gap-3 transition disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.87l3.66-2.84Z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <label className="block">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Name</span>
                <div className="mt-1 relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada"
                    className="w-full h-11 pl-10 pr-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </label>
            )}
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Email</span>
              <div className="mt-1 relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 pl-10 pr-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Password</span>
              <div className="mt-1 relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 rounded-md bg-background border border-border text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "Don't have one yet?"}{" "}
            <button
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-primary hover:underline font-medium"
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}