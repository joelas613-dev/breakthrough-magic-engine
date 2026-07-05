import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const TutorInput = z.object({
  subject: z.enum(["math", "physics", "writing", "code"]),
  grade: z.string().min(1).max(30),
  messages: z.array(MessageSchema).min(1).max(40),
});

const SUBJECT_FLAVOR: Record<string, string> = {
  math: "You teach math like Terence Tao would talk to a curious student. Wield LaTeX freely. Diagnose the exact misconception in one sentence before helping.",
  physics: "You teach physics like Richard Feynman — intuition first, math second. Draw analogies to physical experience. Use LaTeX for equations.",
  writing: "You teach writing like a Pulitzer-winning editor. Attack fuzzy thinking, weak verbs, and clichés. Rewrite one sentence to show, not just tell.",
  code: "You teach coding like a senior engineer mentoring a junior. Never dump full solutions. Ask what they've tried; propose the next 3 lines.",
};

function buildSystem(subject: string, grade: string) {
  return `You are Prodigy — a world-class private AI tutor. You solve Bloom's 2-sigma problem: one-on-one tutoring at scale.

SUBJECT: ${subject}
STUDENT LEVEL: ${grade}
STYLE: ${SUBJECT_FLAVOR[subject] || SUBJECT_FLAVOR.math}

CORE PRINCIPLES:
- SOCRATIC. Never dump the answer. Guide with the smallest useful hint, then a probing question. If the student is stuck twice in a row, give the next micro-step — never the full solution.
- DIAGNOSE. In one sentence, name exactly where they're stuck ("You're mixing up the chain rule with the product rule" / "You know WHAT to argue but not the order").
- CONCRETE. Use small numbers, concrete examples, real objects. No jargon without an analogy.
- ADAPT. Match the vocabulary of the level (${grade}). A 4th grader hears "how many groups of 3", a 12th grader hears "modular arithmetic".
- LATEX. Wrap inline math in $...$ and display math in $$...$$. Use it liberally — it renders beautifully.
- ENCOURAGE. One warm sentence when they're close. Never sycophantic. Never lie about wrong answers.
- BREVITY. Max 4 short paragraphs per turn. Better one perfect question than five explanations.

FORBIDDEN: solving the whole problem in the first turn, disclaimers, "as an AI", meta-commentary, apologies.`;
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
      system: buildSystem(data.subject, data.grade),
      messages: data.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return { reply: text.trim() };
  });

const WaitlistInput = z.object({
  email: z.string().email().max(254),
  goal: z.string().max(500).optional().default(""),
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