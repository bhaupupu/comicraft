import { Halftone } from "@/components/comic/halftone";
import { SpeechBubble } from "@/components/comic/speech-bubble";

export function AuthScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative grid min-h-[calc(100vh-var(--nav-h))] place-items-center overflow-hidden px-5 py-12">
      <Halftone className="absolute -left-20 top-6 h-64 w-64 opacity-[0.1]" dot={11} />
      <Halftone className="absolute -right-20 bottom-6 h-64 w-64 opacity-[0.1]" dot={11} />

      <div className="relative w-full max-w-md">
        <div className="mb-4 flex justify-center">
          <SpeechBubble tone="accent" tail="bl" className="font-display !text-base">
            Let&apos;s make something.
          </SpeechBubble>
        </div>
        <div className="panel p-7 sm:p-9">
          <h1 className="font-display text-3xl font-extrabold text-ink">{title}</h1>
          <p className="mt-1.5 text-ink-soft">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}
