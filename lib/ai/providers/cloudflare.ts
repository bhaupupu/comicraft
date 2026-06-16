import type { ImageProvider, GenImage } from "@/lib/ai/provider";

/**
 * Cloudflare Workers AI — a genuinely free image tier (FLUX.1 [schnell] / SDXL).
 * Needs CF_ACCOUNT_ID + CF_API_TOKEN. Returns base64 directly.
 * Note: does not take reference images, so it can't do ref-based consistency.
 */
const MODEL = process.env.CF_IMAGE_MODEL || "@cf/black-forest-labs/flux-1-schnell";

export const cloudflareImage: ImageProvider = {
  name: "cloudflare-flux",
  async generate(prompt) {
    const account = process.env.CF_ACCOUNT_ID;
    const token = process.env.CF_API_TOKEN;
    if (!account || !token) throw new Error("Cloudflare Workers AI is not configured");

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${MODEL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt, steps: 6 }),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      throw new Error(`Cloudflare AI ${res.status}: ${(await res.text()).slice(0, 160)}`);
    }
    const data = (await res.json()) as { result?: { image?: string } };
    const b64 = data.result?.image;
    if (!b64) throw new Error("Cloudflare AI returned no image");
    return { mimeType: "image/jpeg", dataBase64: b64 } satisfies GenImage;
  },
};
