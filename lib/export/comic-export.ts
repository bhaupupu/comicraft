/**
 * Client-side comic export. Composes the finished page onto a <canvas> (panel art
 * + lettering + title) and downloads it as PNG, a vertical webtoon strip, or PDF.
 * All generated images are data: URLs, so the canvas stays untainted (toBlob works).
 */

export type ExportPanel = {
  imageUrl: string | null;
  label: string;
  dialogue: { speaker: string; text: string }[];
};
export type ExportOpts = { title: string; panels: ExportPanel[]; watermark?: boolean };
export type ExportKind = "png" | "webtoon" | "pdf";

const INK = "#181410";
const PAPER = "#FAF6EE";
const PAPER_DEEP = "#F2EADB";
const ACCENT = "#FFD23F";

function fam(varName: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image failed to load"));
    img.src = src;
  });
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function coverDraw(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const iw = img.naturalWidth || img.width || 800;
  const ih = img.naturalHeight || img.height || 600;
  const ir = iw / ih;
  const dr = w / h;
  let sx = 0, sy = 0, sw = iw, sh = ih;
  if (ir > dr) {
    sw = ih * dr;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / dr;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

type Cell = { x: number; y: number; w: number; h: number; i: number };

function layout(panels: ExportPanel[], mode: "page" | "webtoon", iw: number, top: number, pad: number, gap: number) {
  const cells: Cell[] = [];
  let y = top;
  if (mode === "webtoon") {
    panels.forEach((_, i) => {
      const h = iw * 0.62;
      cells.push({ x: pad, y, w: iw, h, i });
      y += h + gap;
    });
  } else {
    if (panels.length) {
      const fh = iw * 0.5;
      cells.push({ x: pad, y, w: iw, h: fh, i: 0 });
      y += fh + gap;
      for (let i = 1; i < panels.length; i += 2) {
        if (i + 1 < panels.length) {
          const cw = (iw - gap) / 2;
          const ch = cw * 0.75;
          cells.push({ x: pad, y, w: cw, h: ch, i });
          cells.push({ x: pad + cw + gap, y, w: cw, h: ch, i: i + 1 });
          y += ch + gap;
        } else {
          const ch = iw * 0.4;
          cells.push({ x: pad, y, w: iw, h: ch, i });
          y += ch + gap;
        }
      }
    }
  }
  return { cells, totalH: y - gap + pad };
}

async function compose(opts: ExportOpts, mode: "page" | "webtoon"): Promise<HTMLCanvasElement> {
  if (document.fonts?.ready) await document.fonts.ready;
  const DISPLAY = fam("--font-display", "Georgia, serif");
  const COMIC = fam("--font-comic", "'Comic Sans MS', cursive");
  const MONO = fam("--font-mono", "monospace");

  const W = 1240;
  const pad = 44;
  const gap = 22;
  const iw = W - pad * 2;
  const headerH = 132;

  const { cells, totalH } = layout(opts.panels, mode, iw, headerH + 8, pad, gap);

  const dpr = 2;
  const canvas = document.createElement("canvas");
  canvas.width = W * dpr;
  canvas.height = totalH * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  // page background + outer frame
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, totalH);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, W - 6, totalH - 6);

  // header
  ctx.fillStyle = INK;
  ctx.font = `800 11px ${MONO}`;
  ctx.fillText("COMICRAFT · AI COMIC", pad, 40);
  ctx.font = `800 ${opts.title.length > 30 ? 38 : 48}px ${DISPLAY}`;
  ctx.fillText(opts.title.slice(0, 42), pad, 92);
  // yellow underline
  const tw = Math.min(ctx.measureText(opts.title.slice(0, 42)).width, iw);
  ctx.fillStyle = ACCENT;
  ctx.fillRect(pad, 104, tw, 10);

  // panels
  for (const cell of cells) {
    const panel = opts.panels[cell.i];
    ctx.save();
    roundRectPath(ctx, cell.x, cell.y, cell.w, cell.h, 12);
    ctx.clip();
    if (panel?.imageUrl) {
      try {
        const img = await loadImage(panel.imageUrl);
        coverDraw(ctx, img, cell.x, cell.y, cell.w, cell.h);
      } catch {
        ctx.fillStyle = PAPER_DEEP;
        ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
      }
    } else {
      ctx.fillStyle = PAPER_DEEP;
      ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
      ctx.fillStyle = INK;
      ctx.font = `700 16px ${MONO}`;
      ctx.fillText((panel?.label ?? "").slice(0, 40), cell.x + 16, cell.y + 28);
    }
    ctx.restore();

    // ink border
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    roundRectPath(ctx, cell.x, cell.y, cell.w, cell.h, 12);
    ctx.stroke();

    // lettering — first dialogue line as a speech bubble
    const line = panel?.dialogue?.[0];
    if (line?.text) {
      ctx.font = `700 18px ${COMIC}`;
      const maxW = Math.min(cell.w * 0.72, 360);
      const lines = wrapText(ctx, line.text, maxW - 28);
      const bw = Math.min(maxW, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 28);
      const bh = lines.length * 24 + 18;
      const bx = cell.x + 14;
      const by = cell.y + 14;
      ctx.fillStyle = "#ffffff";
      roundRectPath(ctx, bx, by, bw, bh, 12);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = INK;
      lines.forEach((l, k) => ctx.fillText(l, bx + 14, by + 26 + k * 24));
    }
  }

  // watermark (free plan)
  if (opts.watermark) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = INK;
    ctx.font = `800 120px ${DISPLAY}`;
    ctx.translate(W / 2, totalH / 2);
    ctx.rotate(-Math.PI / 9);
    ctx.textAlign = "center";
    ctx.fillText("COMICRAFT", 0, 0);
    ctx.restore();
    ctx.fillStyle = INK;
    ctx.font = `700 13px ${MONO}`;
    ctx.textAlign = "right";
    ctx.fillText("Made with Comicraft · Free plan", W - pad, totalH - 18);
    ctx.textAlign = "left";
  }

  return canvas;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "comicraft-comic";
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportComic(kind: ExportKind, opts: ExportOpts): Promise<void> {
  const slug = slugify(opts.title);

  if (kind === "pdf") {
    const canvas = await compose(opts, "page");
    const { jsPDF } = await import("jspdf");
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const w = canvas.width / 2;
    const h = canvas.height / 2;
    const pdf = new jsPDF({ orientation: h > w ? "portrait" : "landscape", unit: "px", format: [w, h] });
    pdf.addImage(imgData, "JPEG", 0, 0, w, h);
    pdf.save(`${slug}.pdf`);
    return;
  }

  const canvas = await compose(opts, kind === "webtoon" ? "webtoon" : "page");
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
  if (!blob) throw new Error("Export failed");
  downloadBlob(blob, `${slug}${kind === "webtoon" ? "-webtoon" : ""}.png`);
}
