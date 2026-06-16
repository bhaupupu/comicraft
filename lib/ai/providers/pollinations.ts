import type { ImageProvider, GenImage } from "@/lib/ai/provider";

/**
 * Pollinations (FLUX-based). As of 2026 the open endpoint requires a token
 * (it returns HTTP 402 otherwise), so this provider only activates when
 * POLLINATIONS_TOKEN is set. No reference-image support.
 */
export const pollinationsImage: ImageProvider = {
  name: "pollinations-flux",
  async generate(prompt) {
    const token = process.env.POLLINATIONS_TOKEN;
    const model = process.env.POLLINATIONS_MODEL || "flux";
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt,
    )}?width=1024&height=768&model=${model}&nologo=true`;

    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Pollinations ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length) throw new Error("Pollinations returned an empty image");
    return {
      mimeType: res.headers.get("content-type") || "image/jpeg",
      dataBase64: buf.toString("base64"),
    } satisfies GenImage;
  },
};
