import type { TextProvider, ImageProvider, GenImage } from "@/lib/ai/provider";

/**
 * Zero-dependency, zero-cost providers so the entire pipeline runs without any
 * API key (the free dev path). Text returns a deterministic story shaped to the
 * schema; images return an on-brand SVG "panel" placeholder.
 */

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function hashHue(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

function xml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const mockText: TextProvider = {
  name: "mock-text",
  async generate(prompt) {
    const premise = (prompt.match(/PREMISE:\s*"([^"]+)"/)?.[1] ?? "An untitled idea").trim();
    const core = premise.replace(/[.?!]+$/, "");
    const story = {
      title: capitalize(core).slice(0, 60),
      logline: capitalize(premise),
      theme: "Identity, belonging, and second chances.",
      style:
        "Premium editorial comic — bold ink line-art, warm flat color, halftone shading.",
      acts: [
        { title: "Setup", summary: `We meet the lead and the world of "${core}".` },
        { title: "Confrontation", summary: "A choice forces them into conflict." },
        { title: "Resolution", summary: "They face the turn and are changed by it." },
      ],
      characters: [
        {
          name: "The Lead",
          role: "Lead",
          description: `Protagonist of "${core}" — determined, expressive, a distinctive silhouette.`,
        },
        {
          name: "The Foil",
          role: "Antagonist",
          description: "A sharp counterpart who challenges the lead at every turn.",
        },
      ],
      panels: [
        {
          description: `Establishing shot of the world of "${core}".`,
          shot: "Wide establishing, golden light",
          dialogue: [{ speaker: "Caption", text: "Every story starts somewhere." }],
        },
        {
          description: "The lead, introduced in their element.",
          shot: "Medium hero shot",
          dialogue: [{ speaker: "The Lead", text: "This is where it begins." }],
        },
        {
          description: "The foil appears; tension rises.",
          shot: "Two-shot, low angle",
          dialogue: [{ speaker: "The Foil", text: "You don't belong here." }],
        },
        {
          description: "The turn — a decisive, dramatic moment.",
          shot: "Tight close-up, high contrast",
          dialogue: [{ speaker: "The Lead", text: "Watch me." }],
        },
      ],
    };
    return JSON.stringify(story);
  },
};

export const mockImage: ImageProvider = {
  name: "mock-image",
  async generate(prompt) {
    const hue = hashHue(prompt);
    const label = xml(prompt.slice(0, 110));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="2.2" fill="rgba(24,20,16,0.18)"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="hsl(${hue} 70% 88%)"/>
  <rect width="800" height="600" fill="url(#dots)"/>
  <rect x="40" y="40" width="720" height="520" rx="18" fill="hsl(${hue} 80% 78%)" stroke="#181410" stroke-width="6"/>
  <circle cx="600" cy="180" r="70" fill="hsl(${(hue + 40) % 360} 85% 70%)" stroke="#181410" stroke-width="6"/>
  <path d="M120 470 L260 300 L380 470 Z M340 470 L500 280 L640 470 Z" fill="#FAF6EE" stroke="#181410" stroke-width="6" stroke-linejoin="round"/>
  <rect x="60" y="500" width="680" height="44" rx="8" fill="#FFD23F" stroke="#181410" stroke-width="4"/>
  <text x="80" y="529" font-family="Inter, sans-serif" font-size="20" font-weight="700" fill="#181410">${label}</text>
  <rect x="60" y="58" width="148" height="30" rx="6" fill="#181410"/>
  <text x="74" y="79" font-family="monospace" font-size="15" font-weight="700" fill="#FAF6EE">MOCK RENDER</text>
</svg>`;
    return {
      mimeType: "image/svg+xml",
      dataBase64: Buffer.from(svg).toString("base64"),
    } satisfies GenImage;
  },
};
