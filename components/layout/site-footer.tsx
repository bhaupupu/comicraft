import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Halftone } from "@/components/comic/halftone";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t-2 border-ink bg-paper-deep">
      <Halftone className="absolute inset-x-0 top-0 h-24 opacity-[0.12]" dot={10} />

      {/* CTA band */}
      <div className="container-page relative pt-16">
        <div className="relative overflow-hidden rounded-panel border-2 border-ink bg-ink px-6 py-12 text-center shadow-panel sm:px-12">
          <Halftone className="absolute inset-0 opacity-[0.08]" dot={12} color="#FAF6EE" />
          <p className="relative font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-[1.02] text-paper">
            Your story. Your world.
            <br />
            <span className="text-accent">Your comic.</span>
          </p>
          <p className="relative mx-auto mt-4 max-w-md text-paper/70">
            Start with two free generations. No credit card, no setup — just an idea.
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Button href="/studio" variant="accent" size="lg">
              Start creating free
            </Button>
            <Button
              href="/features"
              size="lg"
              className="border-paper bg-transparent text-paper hover:bg-paper/10"
            >
              Explore the studio
            </Button>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-page relative grid grid-cols-2 gap-8 py-14 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-ink-soft">{site.description}</p>
        </div>
        {footerNav.map((col) => (
          <div key={col.heading} className="flex flex-col gap-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              {col.heading}
            </h3>
            <ul className="flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-ink/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-ink-faint sm:flex-row">
          <p>
            © {site.name} {new Date().getFullYear()}. Built for storytellers.
          </p>
          <p className="font-mono text-xs">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
