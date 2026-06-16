import { Hero } from "@/components/sections/hero";
import { Principles } from "@/components/sections/principles";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FeaturesOverview } from "@/components/sections/features-overview";
import { StudioPreview } from "@/components/sections/studio-preview";
import { PricingPreview } from "@/components/sections/pricing-preview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Principles />
      <HowItWorks />
      <FeaturesOverview />
      <StudioPreview />
      <PricingPreview />
    </>
  );
}
