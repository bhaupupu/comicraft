import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { features, featureBySlug } from "@/lib/features-data";
import { FeaturePage } from "@/components/sections/feature-page";

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const feature = featureBySlug(params.slug);
  if (!feature) return {};
  return {
    title: feature.eyebrow,
    description: feature.lead,
  };
}

export default function FeatureSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!featureBySlug(params.slug)) notFound();
  return <FeaturePage slug={params.slug} />;
}
