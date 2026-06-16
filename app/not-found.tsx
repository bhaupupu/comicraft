import { Button } from "@/components/ui/button";
import { SpeechBubble } from "@/components/comic/speech-bubble";

export default function NotFound() {
  return (
    <section className="container-page grid min-h-[70vh] place-items-center py-20 text-center">
      <div className="flex flex-col items-center gap-6">
        <SpeechBubble tone="accent" tail="bl" className="font-display !text-2xl">
          Panel not found!
        </SpeechBubble>
        <h1 className="font-display text-7xl font-extrabold sm:text-8xl">404</h1>
        <p className="max-w-sm text-ink-soft">
          This page got left on the cutting-room floor. Let&apos;s get you back to making comics.
        </p>
        <div className="flex gap-3">
          <Button href="/" variant="primary" size="lg">
            Back home
          </Button>
          <Button href="/studio" variant="outline" size="lg">
            Open the Studio
          </Button>
        </div>
      </div>
    </section>
  );
}
