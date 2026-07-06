import { Link } from "@tanstack/react-router";
import { GraduationCap, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function LegalShell({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
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
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">Last updated {updated}</p>
        <article className="prose prose-invert mt-8 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-8 prose-p:leading-relaxed prose-a:text-primary">
          {children}
        </article>
        <div className="mt-16 text-sm text-muted-foreground flex flex-wrap gap-4 border-t border-border pt-6">
          <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/legal/refund" className="hover:text-foreground">Refund Policy</Link>
          <Link to="/legal/privacy" className="hover:text-foreground">Privacy Notice</Link>
          <Link to="/pricing" className="hover:text-foreground ml-auto">Pricing</Link>
        </div>
      </main>
    </div>
  );
}