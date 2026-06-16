import type { TextProvider, ImageProvider, GenImage } from "@/lib/ai/provider";

const BASE = "https://generativelanguage.googleapis.com/v1beta";
const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
const IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

function key(): string {
  const k = process.env.GEMINI_API_KEY;
  if (!k) throw new Error("GEMINI_API_KEY is not set");
  return k;
}

type Json = Record<string, unknown>;

async function callGemini(model: string, body: Json): Promise<Json> {
  const res = await fetch(`${BASE}/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key(),
    },
    body: JSON.stringify(body),
    // Generation can take a while; let it run.
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini ${model} ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

export const geminiText: TextProvider = {
  name: "gemini-text",
  async generate(prompt, opts) {
    const data = await callGemini(TEXT_MODEL, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      ...(opts?.system ? { systemInstruction: { parts: [{ text: opts.system }] } } : {}),
      generationConfig: {
        responseMimeType: "application/json",
        temperature: opts?.temperature ?? 0.9,
      },
    });
    const d = data as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const parts = d.candidates?.[0]?.content?.parts ?? [];
    return parts.map((p) => p.text ?? "").join("");
  },
};

export const geminiImage: ImageProvider = {
  name: "gemini-image",
  async generate(prompt, refs) {
    type Part = { text?: string; inlineData?: { mimeType?: string; data?: string } };
    const parts: Part[] = [{ text: prompt }];
    for (const ref of refs ?? []) {
      parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.dataBase64 } });
    }
    const data = await callGemini(IMAGE_MODEL, {
      contents: [{ role: "user", parts }],
    });
    const d = data as { candidates?: { content?: { parts?: Part[] } }[] };
    const out = d.candidates?.[0]?.content?.parts ?? [];
    const image = out.find((p) => p.inlineData?.data);
    if (!image || !image.inlineData?.data) {
      const text = out.map((p) => p.text).filter(Boolean).join(" ");
      throw new Error(`Gemini returned no image${text ? `: ${text.slice(0, 160)}` : ""}`);
    }
    return {
      mimeType: image.inlineData.mimeType || "image/png",
      dataBase64: image.inlineData.data,
    } satisfies GenImage;
  },
};
