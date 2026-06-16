import type { TextProvider } from "@/lib/ai/provider";

// Optional text brain. Recommended for production story/script quality; the app
// works fine without it (Gemini or the mock cover text). See docs/06-ai-architecture.md.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export const anthropicText: TextProvider = {
  name: "anthropic-text",
  async generate(prompt, opts) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        temperature: opts?.temperature ?? 0.8,
        system:
          (opts?.system ? opts.system + "\n\n" : "") +
          "Respond with ONLY a single valid JSON object. No prose, no markdown fences.",
        messages: [{ role: "user", content: prompt }],
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Anthropic ${res.status}: ${detail.slice(0, 300)}`);
    }
    const data = (await res.json()) as { content?: { text?: string }[] };
    const blocks = data.content ?? [];
    return blocks.map((b) => b.text ?? "").join("");
  },
};
