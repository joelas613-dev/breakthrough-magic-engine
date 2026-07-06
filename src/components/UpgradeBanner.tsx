import { Link } from "@tanstack/react-router";
import { Sparkles, Check } from "lucide-react";
import { t } from "@/lib/i18n";

type Usage = { isPaid: boolean; tier: string; messagesToday: number; dailyLimit: number };

export function UpgradeBanner({ usage, locale }: { usage: Usage; locale: string }) {
  if (usage.isPaid) return null;
  const tr = t(locale);
  const remaining = Math.max(0, usage.dailyLimit - usage.messagesToday);
  const outOfMessages = remaining === 0;

  return (
    <div
      className={`border-b px-4 py-2.5 flex items-center gap-3 text-sm ${
        outOfMessages
          ? "bg-destructive/10 border-destructive/30 text-foreground"
          : "bg-primary/5 border-primary/20"
      }`}
    >
      <Sparkles className="w-4 h-4 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        {outOfMessages ? (
          <span>{tr.freeExhausted}</span>
        ) : (
          <span className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-primary" />
            {tr.freeRemaining(remaining)}
          </span>
        )}
      </div>
      <Link
        to="/pricing"
        className="shrink-0 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition"
      >
        {tr.upgrade}
      </Link>
    </div>
  );
}