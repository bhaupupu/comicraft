/** Provider-agnostic generation contracts. Swap engines without touching product code. */

export interface GenImage {
  mimeType: string;
  /** raw base64 (no data: prefix) */
  dataBase64: string;
}

export interface TextProvider {
  readonly name: string;
  /** Returns the model's raw text (the orchestrator asks for JSON). */
  generate(prompt: string, opts?: { temperature?: number; system?: string }): Promise<string>;
}

export interface ImageProvider {
  readonly name: string;
  /** `refs` are reference images (e.g. a character sheet) for consistency. */
  generate(prompt: string, refs?: GenImage[]): Promise<GenImage>;
}

/** Parse a data: URL back into a GenImage (used to feed character refs into panels). */
export function dataUrlToGenImage(url: string | null | undefined): GenImage | null {
  if (!url || !url.startsWith("data:")) return null;
  const match = url.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) return null;
  return { mimeType: match[1], dataBase64: match[2] };
}
