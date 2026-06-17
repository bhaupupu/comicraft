import { Hero } from "@/components/sections/hero";
import { Principles } from "@/components/sections/principles";
import { Showcase } from "@/components/sections/showcase";
import { Journey } from "@/components/sections/journey";
import { StudioTeaser } from "@/components/sections/studio-teaser";
import { PricingPreview } from "@/components/sections/pricing-preview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Principles />
      <Showcase />
      <Journey />
      <StudioTeaser />
      <PricingPreview />
    </>
  );
}
