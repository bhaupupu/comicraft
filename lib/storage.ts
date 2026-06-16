import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { GenImage } from "@/lib/ai/provider";

export type StoredAsset = { url: string };

function extFor(mime: string) {
  if (mime.includes("svg")) return "svg";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  return "png";
}

/**
 * Persist a generated image and return a renderable URL.
 *  - default  → data: URL (zero config, works everywhere; great for the free path)
 *  - "local"  → writes to public/generated (set ASSET_STORAGE=local)
 *  - R2/S3    → uploads when ASSET_BUCKET_* is configured (recommended for prod)
 */
export async function storeImage(img: GenImage, key: string): Promise<StoredAsset> {
  const driver = process.env.ASSET_BUCKET_NAME
    ? "r2"
    : process.env.ASSET_STORAGE === "local"
      ? "local"
      : "dataurl";

  if (driver === "local") {
    const ext = extFor(img.mimeType);
    const dir = path.join(process.cwd(), "public", "generated");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${key}.${ext}`), Buffer.from(img.dataBase64, "base64"));
    return { url: `/generated/${key}.${ext}` };
  }

  if (driver === "r2") {
    return uploadToBucket(img, key);
  }

  return { url: `data:${img.mimeType};base64,${img.dataBase64}` };
}

async function uploadToBucket(img: GenImage, key: string): Promise<StoredAsset> {
  const { AwsClient } = await import("aws4fetch");
  const endpoint = (process.env.ASSET_BUCKET_ENDPOINT ?? "").replace(/\/$/, "");
  const bucket = process.env.ASSET_BUCKET_NAME!;
  const ext = extFor(img.mimeType);
  const objectKey = `${key}.${ext}`;

  const client = new AwsClient({
    accessKeyId: process.env.ASSET_BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.ASSET_BUCKET_SECRET_KEY!,
    service: "s3",
    region: "auto",
  });

  const url = `${endpoint}/${bucket}/${objectKey}`;
  const res = await client.fetch(url, {
    method: "PUT",
    body: Buffer.from(img.dataBase64, "base64"),
    headers: { "Content-Type": img.mimeType },
  });
  if (!res.ok) throw new Error(`Asset upload failed: ${res.status}`);

  const publicBase = process.env.ASSET_PUBLIC_BASE?.replace(/\/$/, "") ?? `${endpoint}/${bucket}`;
  return { url: `${publicBase}/${objectKey}` };
}
