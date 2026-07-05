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

const SYSTEM_REAL = `You are Lazarus, an elite longevity physician AI combining Peter Attia, Rhonda Patrick, and Bryan Johnson.
You will receive a REAL blood test PDF plus a user profile. Extract the actual values from the PDF.
Return ONLY valid JSON matching the schema. No prose, no markdown fences.
Pick the 6 MOST clinically important markers found in the PDF (prioritize: ApoB, hs-CRP, HbA1c, Vitamin D, LDL, HDL, Triglycerides, Fasting Insulin, TSH, Ferritin, Testosterone, Homocysteine, Lp(a)).
Use the ACTUAL numeric values and units from the PDF. Set status by standard optimal ranges (not just lab reference ranges — longevity optimal is tighter).
Estimate biological age from the markers + profile. Be bold, specific, directive. Doses in mg/IU. No disclaimers.

Schema:
{
  "bioAge": number, "chronoAge": number, "summary": string (1-2 sentences, punchy, reference 1-2 actual findings),
  "markers": [{"name": string, "value": string (actual value + unit), "status": "low"|"optimal"|"high", "note": string (why it matters + what to do)}] (exactly 6 items from the PDF),
  "protocol": {
    "nutrition": string[] (3-4 items, targeted at the actual findings),
    "supplements": [{"name": string, "dose": string, "why": string (tie to a specific marker)}] (4-5 items),
    "training": string[] (3 items),
    "lifestyle": string[] (3 items)
  },
  "weeklyImpact": string (one measurable outcome tied to the worst marker)
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
      system: SYSTEM,
      prompt: userPrompt,
    });

    // Strip potential code fences and parse
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("AI returned invalid response");
    const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as ProtocolResult;
    return parsed;
  });

const AnalyzeInput = z.object({
  age: z.number().int().min(14).max(100),
  sex: z.enum(["male", "female", "other"]),
  primaryGoal: z.string().min(2).max(120),
  concerns: z.string().max(400).optional().default(""),
  pdfBase64: z.string().min(100).max(12_000_000),
  filename: z.string().max(200).optional().default("blood_test.pdf"),
});

export const analyzeBloodTest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data }): Promise<ProtocolResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const userText = `Patient profile:
- Chronological age: ${data.age}
- Sex: ${data.sex}
- Primary longevity goal: ${data.primaryGoal}
- Concerns: ${data.concerns || "none stated"}

The attached PDF is this patient's blood test. Extract the 6 most clinically important markers with their ACTUAL values from the PDF, estimate biological age, and generate the JSON protocol now.`;

    const { text } = await generateText({
      model,
      system: SYSTEM_REAL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: userText },
            {
              type: "file",
              data: data.pdfBase64,
              mediaType: "application/pdf",
              filename: data.filename,
            },
          ],
        },
      ],
    });

    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("AI could not read the PDF. Try a clearer scan.");
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