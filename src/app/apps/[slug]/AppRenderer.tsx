"use client";

import { REGISTRY } from "./AppRegistry";

export function AppRenderer({ slug }: { slug: string }) {
  const Component = REGISTRY[slug];
  if (!Component) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-neutral-500">No artefact wired for &ldquo;{slug}&rdquo;.</p>
      </div>
    );
  }
  return <Component />;
}
