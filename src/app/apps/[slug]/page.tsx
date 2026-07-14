import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { APPS, findAppBySlug } from "@/lib/apps";
import { AppRenderer } from "./AppRenderer";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return APPS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = findAppBySlug(slug);
  if (!app) return { title: "App not found · SociAI" };
  return {
    title: `${app.title} · SociAI`,
    description: app.blurb,
  };
}

export default async function AppPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const app = findAppBySlug(slug);
  if (!app) notFound();

  return <AppRenderer slug={app.slug} />;
}
