import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { PricingCards } from "@/components/sections/pricing-cards";

export function PricingPreview() {
  return (
    <section className="relative border-t-2 border-ink bg-paper-deep py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          align="center"
          kicker="Pricing"
          title={
            <>
              Start free. <span className="marker">Upgrade when it clicks.</span>
            </>
          }
          lead="Two free generations to feel the magic — then plans that scale with how much you make."
        />
        <div className="mt-14">
          <PricingCards />
        </div>
        <p className="mt-10 text-center text-sm text-ink-soft">
          Need teams, seats or a custom volume?{" "}
          <Link href="/pricing" className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-2">
            See full pricing →
          </Link>
        </p>
      </div>
    </section>
  );
}
