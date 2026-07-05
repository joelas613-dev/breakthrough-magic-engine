import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ProtocolInput = z.object({
  age: z.number().int().min(14).max(100),
  sex: z.enum(["male", "female", "other"]),
  primaryGoal: z.string().min(2).max(120),
  energy: z.number().int().min(1).max(10),
  sleep: z.number().min(0).max(14),
  concerns: z.string().max(400).optional().default(""),
});

export type ProtocolResult = {
  bioAge: number;
  chronoAge: number;
  summary: string;
  markers: { name: string; value: string; status: "low" | "optimal" | "high"; note: string }[];
  protocol: {
    nutrition: string[];
    supplements: { name: string; dose: string; why: string }[];
    training: string[];
    lifestyle: string[];
  };
  weeklyImpact: string;
};

const SYSTEM = `You are Lazarus, an elite longevity physician AI combining Peter Attia, Rhonda Patrick, and Bryan Johnson approaches.
You return ONLY valid JSON matching the exact schema. No prose, no markdown fences.
Estimate 6 plausible blood markers based on the user's profile (fabricate believable values — this is a demo).
Be bold, specific, and directive. Doses in mg/IU. No disclaimers in the JSON.

Schema:
{
  "bioAge": number, "chronoAge": number, "summary": string (1-2 sentences, punchy),
  "markers": [{"name": string, "value": string, "status": "low"|"optimal"|"high", "note": string}] (exactly 6 items),
  "protocol": {
    "nutrition": string[] (3-4 items, concrete),
    "supplements": [{"name": string, "dose": string, "why": string}] (4-5 items),
    "training": string[] (3 items),
    "lifestyle": string[] (3 items)
  },
  "weeklyImpact": string (one sentence, specific measurable outcome)
}`;

export const generateProtocol = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ProtocolInput.parse(input))
  .handler(async ({ data }): Promise<ProtocolResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const userPrompt = `Profile:
- Chronological age: ${data.age}
- Sex: ${data.sex}
- Primary goal: ${data.primaryGoal}
- Self-rated energy (1-10): ${data.energy}
- Avg sleep hours: ${data.sleep}
- Concerns: ${data.concerns || "none stated"}

Generate the JSON now.`;

    const { text } = await generateText({
      model,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
    });

    // Strip potential code fences and parse
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("AI returned invalid response");
    const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as ProtocolResult;
    return parsed;
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