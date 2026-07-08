import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { GraduationCap, ArrowLeft, Globe, ChevronDown, Loader2, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, isRtl, normalizeLang, type LangCode } from "@/lib/i18n";
import { translateStrings } from "@/lib/prodigy.functions";

// Shared with the landing-page language picker so the choice persists across the site.
const LOCALE_KEY = "prodigy_landing_locale";
const cacheKey = (page: string, code: LangCode) => `prodigy_legal_t_${page}_${code}`;

// Very small allowlist sanitizer for translated HTML strings. The source strings
// are authored by us and only pass through our own translator, but we still block
// anything scripty just in case.
function safeHtml(s: string): string {
  if (/<\s*script|javascript:|on[a-z]+\s*=/i.test(s)) {
    return s.replace(/<[^>]+>/g, "");
  }
  return s;
}

function useAutoTranslate<T extends Record<string, string>>(page: string, base: T) {
  const [locale, setLocale] = useState<LangCode>("en");
  const [s, setS] = useState<T>(base);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = normalizeLang(
      localStorage.getItem(LOCALE_KEY) || navigator.language,
    );
    apply(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function apply(code: LangCode) {
    setLocale(code);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_KEY, code);
      document.documentElement.dir = isRtl(code) ? "rtl" : "ltr";
      document.documentElement.lang = code;
    }
    if (code === "en") {
      setS(base);
      return;
    }
    const cached =
      typeof window !== "undefined"
        ? localStorage.getItem(cacheKey(page, code))
        : null;
    if (cached) {
      try {
        setS({ ...base, ...JSON.parse(cached) });
        return;
      } catch {
        /* fall through to fetch */
      }
    }
    setLoading(true);
    translateStrings({ data: { targetLang: code, strings: base } })
      .then((res) => {
        setS({ ...base, ...(res.translations as T) });
        try {
          localStorage.setItem(cacheKey(page, code), JSON.stringify(res.translations));
        } catch {
          /* ignore quota */
        }
      })
      .catch(() => {
        /* stay on English silently */
      })
      .finally(() => setLoading(false));
  }

  return { s, locale, setLocale: apply, loading };
}

type BaseChrome = {
  title: string;
  updatedLabel: string;
  homeLabel: string;
  termsLabel: string;
  refundLabel: string;
  privacyLabel: string;
  pricingLabel: string;
};

export function LegalPage<T extends BaseChrome & Record<string, string>>({
  pageKey,
  updated,
  strings,
  children,
}: {
  pageKey: string;
  updated: string;
  strings: T;
  children: (helpers: { s: T; html: (key: keyof T) => { __html: string } }) => ReactNode;
}) {
  const { s, locale, setLocale, loading } = useAutoTranslate(pageKey, strings);
  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];
  const html = (key: keyof T) => ({ __html: safeHtml(String(s[key] ?? "")) });

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
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition border border-border rounded px-2 py-1.5"
                aria-label="Language"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Globe className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">
                  {current.flag} {current.nativeLabel}
                </span>
                <span className="sm:hidden">{current.flag}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto w-56">
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLocale(l.code)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{l.flag}</span>
                    <span className="flex-1" dir={l.dir}>
                      {l.nativeLabel}
                    </span>
                    {locale === l.code && <Check className="w-3.5 h-3.5 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> {s.homeLabel}
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
          {s.title}
        </h1>
        <p className="mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {s.updatedLabel} {updated}
        </p>
        <article className="prose prose-invert mt-8 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-8 prose-p:leading-relaxed prose-a:text-primary">
          {children({ s, html })}
        </article>
        <div className="mt-16 text-sm text-muted-foreground flex flex-wrap gap-4 border-t border-border pt-6">
          <Link to="/legal/terms" className="hover:text-foreground">
            {s.termsLabel}
          </Link>
          <Link to="/legal/refund" className="hover:text-foreground">
            {s.refundLabel}
          </Link>
          <Link to="/legal/privacy" className="hover:text-foreground">
            {s.privacyLabel}
          </Link>
          <Link to="/pricing" className="hover:text-foreground ms-auto">
            {s.pricingLabel}
          </Link>
        </div>
      </main>
    </div>
  );
}