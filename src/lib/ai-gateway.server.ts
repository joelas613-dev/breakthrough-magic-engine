import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Now routed to OpenRouter (external AI). Signature kept for compatibility.
export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://prodigy.lovable.app",
      "X-Title": "Prodigy Tutor",
    },
  });
}