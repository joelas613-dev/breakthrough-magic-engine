import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { LANGUAGE_NAMES, normalizeLang, isRtl, type LangCode } from "./i18n";

const NEW_SESSION_TITLE: Record<string, string> = {
  en: "New session", he: "שיחה חדשה", ar: "جلسة جديدة", es: "Nueva sesión",
  fr: "Nouvelle session", de: "Neue Sitzung", pt: "Nova sessão", it: "Nuova sessione",
  nl: "Nieuwe sessie", ru: "Новая сессия", tr: "Yeni oturum", zh: "新会话",
  ja: "新しいセッション", ko: "새 세션", hi: "नया सत्र",
};

function defaultTitleFor(locale: string): string {
  return NEW_SESSION_TITLE[normalizeLang(locale)] || "New session";
}

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const SUBJECT_ENUM = z.enum([
  "math", "physics", "writing", "code",
  "english", "science", "hebrew", "chemistry", "biology",
]);

const TutorInput = z.object({
  subject: SUBJECT_ENUM,
  grade: z.string().min(1).max(30),
  messages: z.array(MessageSchema).min(1).max(40),
  locale: z.string().min(2).max(10).optional().default("en"),
});

const SUBJECT_FLAVOR: Record<string, string> = {
  math: "You teach math like Terence Tao would talk to a curious student. Wield LaTeX freely. Diagnose the exact misconception in one sentence before helping.",
  physics: "You teach physics like Richard Feynman — intuition first, math second. Draw analogies to physical experience. Use LaTeX for equations.",
  writing: "You teach writing like a Pulitzer-winning editor. Attack fuzzy thinking, weak verbs, and clichés. Rewrite one sentence to show, not just tell.",
  code: "You teach coding like a senior engineer mentoring a junior. Never dump full solutions. Ask what they've tried; propose the next 3 lines.",
  english: "You teach English (as a foreign / second language) like a warm, exacting language coach. Correct grammar gently, give example sentences, teach idioms and pronunciation cues. Adapt to the student's level.",
  science: "You teach general science like a curious lab teacher — biology, chemistry, physics and earth science woven together. Start from everyday observations, then give the mechanism and, when useful, the equation.",
  hebrew: "You teach Hebrew language studies (לשון) — grammar (בניינים, גזרות), morphology, syntax, and reading comprehension — like a top-tier Israeli tutor. Use Hebrew examples with vowel marks (ניקוד) where helpful.",
  chemistry: "You teach chemistry like a patient graduate TA. Balance equations, explain mechanisms with arrows, and always tie symbols back to what atoms are actually doing. Use LaTeX for equations and formulas.",
  biology: "You teach biology like a David Attenborough-meets-Khan-Academy tutor — always start with the living organism / phenomenon, then zoom into cells and molecules. Use vivid analogies.",
};

function buildSystem(
  subject: string,
  grade: string,
  locale: string,
  stuckTopics: string[] = [],
  displayName: string | null = null,
) {
  const code: LangCode = normalizeLang(locale);
  const langName = LANGUAGE_NAMES[code];
  const rtlHint = isRtl(code) ? " Text direction is right-to-left." : "";
  const langLine =
    code === "en"
      ? "LANGUAGE: Reply in English."
      : `LANGUAGE: Reply in fluent, natural ${langName}.${rtlHint} Keep LaTeX math in $...$ / $$...$$ exactly as-is — do NOT translate math symbols. Technical loanwords in English are fine when natural.`;
  const stuckLine = stuckTopics.length
    ? `KNOWN STUCK POINTS for this student (from prior sessions): ${stuckTopics.join(", ")}. When relevant, gently loop back and check retention — do not re-teach unprompted.`
    : "";
  const nameLine = displayName ? `STUDENT NAME: ${displayName}. Address them by name occasionally, warmly.` : "";
  return `You are Prodigy — a world-class private AI tutor. You solve Bloom's 2-sigma problem: one-on-one tutoring at scale.

SUBJECT: ${subject}
STUDENT LEVEL: ${grade}
STYLE: ${SUBJECT_FLAVOR[subject] || SUBJECT_FLAVOR.math}
${langLine}
${nameLine}
${stuckLine}

CORE PRINCIPLES:
- ADAPT to level ${grade}. A 4th grader hears "how many groups of 3"; a 12th grader hears "modular arithmetic".
- CONCRETE. Real numbers, real analogies. No jargon without unpacking it.
- LATEX. Inline math in $...$, display math in $$...$$. Use liberally.
- ENCOURAGE. Warm, honest, never sycophantic. Never lie about wrong answers.
- FORBIDDEN: disclaimers, "as an AI", meta-commentary, apologies.

MANDATORY OUTPUT STRUCTURE — every reply MUST use these four sections in this exact order, with these exact markdown headings (translated into the reply language, but keeping the emoji + bold):

**📚 Topic**
One short line naming the exact topic/concept the student's question is about (e.g. "The chain rule in differential calculus").

**🧠 Detailed explanation**
2–4 paragraphs. Explain the topic from the ground up at the student's level: intuition, definitions, key formulas (LaTeX), and ONE fully worked mini-example that mirrors their question. This is where you actually teach.

**🎯 Now you try**
A short Socratic nudge tailored to their specific question — the smallest useful hint + one probing question. Do NOT solve their exact problem for them; guide them to the next step.

**📝 10 practice problems with solutions**
Exactly 10 numbered problems on the same topic, ranging from easy to challenging. Under each problem, on the next line, write "*Solution:*" and give the full worked solution (with LaTeX). Format:
1. <problem>
   *Solution:* <full worked solution>
2. <problem>
   *Solution:* <full worked solution>
... through 10.

Never skip a section. Never fewer than 10 practice problems. Never omit a solution.`;
}

export const tutorReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TutorInput.parse(input))
  .handler(async ({ data }): Promise<{ reply: string }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const { text } = await generateText({
      model,
      system: buildSystem(data.subject, data.grade, data.locale),
      messages: data.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return { reply: text.trim() };
  });

const WaitlistInput = z.object({
  email: z.string().email().max(254),
  goal: z.string().max(500).optional().default(""),
});

const TranscribeInput = z.object({
  audio: z.string().min(10).max(20 * 1024 * 1024), // base64
  mime: z.string().max(80).default("audio/webm"),
  language: z.string().min(2).max(10).optional(),
});

export const transcribeAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TranscribeInput.parse(input))
  .handler(async ({ data }): Promise<{ text: string }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    // Decode base64 -> bytes
    const bin = atob(data.audio);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

    const ext =
      data.mime.includes("mp4") || data.mime.includes("m4a") ? "mp4"
      : data.mime.includes("mpeg") || data.mime.includes("mp3") ? "mp3"
      : data.mime.includes("wav") ? "wav"
      : data.mime.includes("ogg") ? "ogg"
      : "webm";

    const blob = new Blob([bytes], { type: data.mime || `audio/${ext}` });
    const fd = new FormData();
    fd.append("model", "openai/gpt-4o-mini-transcribe");
    fd.append("file", blob, `recording.${ext}`);
    if (data.language) fd.append("language", data.language.slice(0, 2));

    const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { "Lovable-API-Key": key },
      body: fd,
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Transcription failed: ${res.status} ${errText.slice(0, 200)}`);
    }
    const json = (await res.json()) as { text?: string };
    return { text: (json.text ?? "").trim() };
  });

const TranslateInput = z.object({
  targetLang: z.string().min(2).max(10),
  strings: z.record(z.string(), z.string()).refine((r) => Object.keys(r).length <= 200, "too many keys"),
});

export const translateStrings = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data }): Promise<{ translations: Record<string, string> }> => {
    const code = normalizeLang(data.targetLang);
    if (code === "en") return { translations: data.strings };
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");
    const langName = LANGUAGE_NAMES[code];
    const payload = JSON.stringify(data.strings);
    let text: string;
    try {
      const res = await generateText({
        model,
        system: `You are a professional marketing translator. Translate every VALUE in the given JSON object into fluent, natural ${langName}. KEEP KEYS UNCHANGED. Keep the same JSON shape. Preserve emojis, $ symbols, numbers, and any HTML/markdown as-is. Return ONLY the JSON object, no code fences, no commentary.`,
        messages: [{ role: "user", content: payload }],
      });
      text = res.text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[translateStrings] AI gateway error:", msg);
      // Graceful fallback (e.g. 402 Payment Required / rate limit) — return source strings
      return { translations: data.strings };
    }
    let cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
    try {
      const parsed = JSON.parse(cleaned) as Record<string, string>;
      // ensure all keys present
      const out: Record<string, string> = {};
      for (const k of Object.keys(data.strings)) {
        out[k] = typeof parsed[k] === "string" ? parsed[k] : data.strings[k];
      }
      return { translations: out };
    } catch {
      return { translations: data.strings };
    }
  });

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => WaitlistInput.parse(input))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: data.email, goal: data.goal || null });
    if (error) {
      if (error.code === "23505") return { ok: true, duplicate: true };
      throw new Error(error.message);
    }
    return { ok: true, duplicate: false };
  });

// ---------- Authenticated tutor app ----------

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, display_name, grade, preferred_subject, locale")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? { id: context.userId, display_name: null, grade: null, preferred_subject: null, locale: "en" };
  });

const ProfileUpdate = z.object({
  display_name: z.string().min(1).max(60).optional(),
  grade: z.string().min(1).max(30).optional(),
  preferred_subject: SUBJECT_ENUM.optional(),
  locale: z.string().min(2).max(10).optional(),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ProfileUpdate.parse(input))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, ...data }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("conversations")
      .select("id, subject, title, locale, grade, updated_at, created_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const CreateConv = z.object({
  subject: SUBJECT_ENUM,
  grade: z.string().min(1).max(30),
  locale: z.string().min(2).max(10).default("en"),
  title: z.string().max(120).optional(),
});

export const createConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => CreateConv.parse(input))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("conversations")
      .insert({
        user_id: context.userId,
        subject: data.subject,
        grade: data.grade,
        locale: data.locale,
        title: data.title || defaultTitleFor(data.locale),
      })
      .select("id, subject, title, locale, grade, updated_at, created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("conversations")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getConversation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: conv, error: convErr } = await context.supabase
      .from("conversations")
      .select("id, subject, title, locale, grade")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (convErr) throw new Error(convErr.message);
    if (!conv) throw new Error("Not found");
    const { data: msgs, error: msgErr } = await context.supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", data.id)
      .order("created_at", { ascending: true });
    if (msgErr) throw new Error(msgErr.message);
    return { conversation: conv, messages: (msgs ?? []) as { id: string; role: "user" | "assistant"; content: string; created_at: string }[] };
  });

export const listStuckTopics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("stuck_topics")
      .select("id, subject, topic, hit_count, last_seen")
      .eq("user_id", context.userId)
      .order("last_seen", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getUsageStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const today = new Date().toISOString().slice(0, 10);
    const [{ data: usage }, { data: subs }] = await Promise.all([
      context.supabase
        .from("daily_usage")
        .select("message_count")
        .eq("user_id", context.userId)
        .eq("day", today)
        .maybeSingle(),
      context.supabase
        .from("subscriptions")
        .select("status, current_period_end, product_id")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);
    const now = Date.now();
    const activeSub = (subs ?? []).find((s: { status: string; current_period_end: string | null }) =>
      (["active", "trialing", "past_due"].includes(s.status) && (!s.current_period_end || new Date(s.current_period_end).getTime() > now))
      || (s.status === "canceled" && s.current_period_end && new Date(s.current_period_end).getTime() > now)
    );
    return {
      isPaid: !!activeSub,
      tier: activeSub ? (activeSub.product_id === "prodigy_family" ? "family" : "solo") : "free",
      messagesToday: (usage?.message_count as number | undefined) ?? 0,
      dailyLimit: 3,
    };
  });

const SendMessage = z.object({
  conversation_id: z.string().uuid(),
  content: z.string().max(4000).default(""),
  attachments: z
    .array(
      z.object({
        data: z.string().min(10).max(10 * 1024 * 1024), // base64, ~7.5MB raw
        mime: z.string().regex(/^image\/(png|jpeg|jpg|webp|gif)$/i),
      }),
    )
    .max(4)
    .optional()
    .default([]),
});

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SendMessage.parse(input))
  .handler(async ({ context, data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    if (!data.content.trim() && (!data.attachments || data.attachments.length === 0)) {
      throw new Error("Empty message");
    }

    // ---- Paywall enforcement ----
    const env = (process.env.PAYMENTS_ENVIRONMENT as "sandbox" | "live") || "live";
    // Try both envs (published=live, preview=sandbox) — grant access if ANY active subscription exists
    const { data: subs } = await context.supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(5);
    const now = Date.now();
    const isPaid = (subs ?? []).some((s: { status: string; current_period_end: string | null }) =>
      (["active", "trialing", "past_due"].includes(s.status) && (!s.current_period_end || new Date(s.current_period_end).getTime() > now))
      || (s.status === "canceled" && s.current_period_end && new Date(s.current_period_end).getTime() > now)
    );
    void env;
    const FREE_DAILY_LIMIT = 3;
    if (!isPaid) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: newCount, error: incErr } = await supabaseAdmin.rpc("increment_daily_usage", { user_uuid: context.userId });
      if (incErr) throw new Error(incErr.message);
      if ((newCount as unknown as number) > FREE_DAILY_LIMIT) {
        throw new Error(`FREE_LIMIT_REACHED:${FREE_DAILY_LIMIT}`);
      }
    }

    // Load conversation + verify ownership
    const { data: conv, error: convErr } = await context.supabase
      .from("conversations")
      .select("id, subject, locale, grade, title")
      .eq("id", data.conversation_id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (convErr) throw new Error(convErr.message);
    if (!conv) throw new Error("Conversation not found");

    // Profile + stuck topics for context
    const [{ data: profile }, { data: stuck }] = await Promise.all([
      context.supabase.from("profiles").select("display_name").eq("id", context.userId).maybeSingle(),
      context.supabase
        .from("stuck_topics")
        .select("topic")
        .eq("user_id", context.userId)
        .eq("subject", conv.subject)
        .order("last_seen", { ascending: false })
        .limit(6),
    ]);

    // Load prior messages (last 30)
    const { data: prior, error: priorErr } = await context.supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true })
      .limit(30);
    if (priorErr) throw new Error(priorErr.message);

    // Insert user message
    const attachmentNote =
      data.attachments && data.attachments.length > 0
        ? (data.content.trim() ? "\n\n" : "") + `📷 ${data.attachments.length} image${data.attachments.length === 1 ? "" : "s"} attached`
        : "";
    const { data: userMsg, error: insErr } = await context.supabase
      .from("messages")
      .insert({
        conversation_id: conv.id,
        user_id: context.userId,
        role: "user",
        content: (data.content || "").trim() + attachmentNote,
      })
      .select("id, role, content, created_at")
      .single();
    if (insErr) throw new Error(insErr.message);

    // Build multimodal content for the newest user turn if attachments are present.
    const latestUserContent =
      data.attachments && data.attachments.length > 0
        ? [
            {
              type: "text" as const,
              text: data.content.trim() || "Please analyze the attached image(s) and help me with this problem.",
            },
            ...data.attachments.map((a) => ({
              type: "image" as const,
              image: `data:${a.mime};base64,${a.data}`,
            })),
          ]
        : data.content;

    const history = [
      ...(prior ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: latestUserContent as unknown as string },
    ];

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const stuckList = (stuck ?? []).map((s) => s.topic);
    const { text } = await generateText({
      model,
      system: buildSystem(
        conv.subject,
        conv.grade || "middle school",
        conv.locale || "en",
        stuckList,
        profile?.display_name ?? null,
      ),
      messages: history,
    });
    const reply = text.trim();

    // Persist assistant
    const { data: asstMsg, error: asstErr } = await context.supabase
      .from("messages")
      .insert({
        conversation_id: conv.id,
        user_id: context.userId,
        role: "assistant",
        content: reply,
      })
      .select("id, role, content, created_at")
      .single();
    if (asstErr) throw new Error(asstErr.message);

    // Auto-title on first exchange
    if ((prior?.length ?? 0) === 0) {
      const title = data.content.slice(0, 60).replace(/\s+/g, " ").trim() || conv.title;
      await context.supabase.from("conversations").update({ title }).eq("id", conv.id);
    } else {
      await context.supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conv.id);
    }

    // Fire-and-await topic extraction (small; keeps API contract simple)
    try {
      const topicRes = await generateText({
        model,
        system:
          "You extract the single concrete academic topic the student is struggling with in this exchange, if any. Reply with EXACTLY one short lowercase topic phrase (2-5 words, English, no punctuation) like 'chain rule' or 'thesis statements'. If the student is NOT stuck, reply with the single word: none.",
        messages: [
          {
            role: "user",
            content: `Subject: ${conv.subject}\nStudent said: ${data.content}\nTutor replied: ${reply}\n\nStuck topic (or 'none'):`,
          },
        ],
      });
      const topic = topicRes.text.trim().toLowerCase().split("\n")[0].slice(0, 60);
      if (topic && topic !== "none" && topic.length >= 3) {
        // upsert increment
        const { data: existing } = await context.supabase
          .from("stuck_topics")
          .select("id, hit_count")
          .eq("user_id", context.userId)
          .eq("subject", conv.subject)
          .eq("topic", topic)
          .maybeSingle();
        if (existing) {
          await context.supabase
            .from("stuck_topics")
            .update({ hit_count: existing.hit_count + 1, last_seen: new Date().toISOString() })
            .eq("id", existing.id);
        } else {
          await context.supabase.from("stuck_topics").insert({
            user_id: context.userId,
            subject: conv.subject,
            topic,
          });
        }
      }
    } catch (e) {
      console.error("topic extraction failed", e);
    }

    return {
      user: userMsg as { id: string; role: "user"; content: string; created_at: string },
      assistant: asstMsg as { id: string; role: "assistant"; content: string; created_at: string },
    };
  });