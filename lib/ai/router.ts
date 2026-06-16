import type { TextProvider, ImageProvider } from "@/lib/ai/provider";
import { geminiText, geminiImage } from "@/lib/ai/providers/gemini";
import { anthropicText } from "@/lib/ai/providers/anthropic";
import { cloudflareImage } from "@/lib/ai/providers/cloudflare";
import { pollinationsImage } from "@/lib/ai/providers/pollinations";
import { mockText, mockImage } from "@/lib/ai/providers/mock";

/**
 * The model router. "Don't hardcode an image model" — pick the engine(s) by which
 * keys are configured, as an ordered fallback chain that ALWAYS ends at the mock
 * provider, so generation can never fail outright. Add fal.ai / Replicate / FLUX
 * adapters here to extend the open-source tier.
 */

export function getTextProvider(): TextProvider {
  if (process.env.GEMINI_API_KEY) return geminiText;
  if (process.env.ANTHROPIC_API_KEY) return anthropicText;
  return mockText;
}

/** Try each configured image provider in order; the mock fallback never fails. */
function makeFallback(providers: ImageProvider[]): ImageProvider {
  if (providers.length === 1) return providers[0];
  return {
    name: providers[0].name,
    async generate(prompt, refs) {
      let lastErr: unknown;
      for (const p of providers) {
        try {
          return await p.generate(prompt, refs);
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr instanceof Error ? lastErr : new Error("All image providers failed");
    },
  };
}

export function getImageProvider(): ImageProvider {
  const chain: ImageProvider[] = [];
  if (process.env.GEMINI_API_KEY) chain.push(geminiImage); // Nano Banana
  if (process.env.CF_ACCOUNT_ID && process.env.CF_API_TOKEN) chain.push(cloudflareImage); // free FLUX
  if (process.env.POLLINATIONS_TOKEN) chain.push(pollinationsImage);
  chain.push(mockImage); // guaranteed fallback
  return makeFallback(chain);
}

const LABELS: Record<string, string> = {
  "gemini-image": "Nano Banana",
  "cloudflare-flux": "FLUX schnell (free)",
  "pollinations-flux": "Pollinations (free)",
  "mock-image": "Mock (free)",
};

/** Which engines are live — surfaced in the UI so users know what's running. */
export function providerStatus() {
  const image = getImageProvider().name;
  return {
    text: getTextProvider().name,
    image,
    live: image !== "mock-image",
    label: LABELS[image] ?? image,
  };
}
