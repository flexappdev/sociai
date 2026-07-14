import Link from "next/link";
import { APPS } from "@/lib/apps";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          SociAI
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Social layer for the AI-native web.
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-neutral-600">
          Prototypes drop into <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">apps/</code> as JSX and appear here.
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Prototypes ({APPS.length})
        </h2>
        {APPS.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
            <p className="text-neutral-600">
              No prototypes yet. Drop a{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-sm">.jsx</code>{" "}
              file into <code className="rounded bg-white px-1.5 py-0.5 text-sm">apps/</code>.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {APPS.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/apps/${a.slug}`}
                  className="block rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-indigo-400 hover:shadow-sm"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    {a.brand}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-neutral-900">
                    {a.title}
                  </div>
                  {a.blurb && (
                    <p className="mt-1 text-sm text-neutral-600">{a.blurb}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
