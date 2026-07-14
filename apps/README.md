# apps/

Drop React `.jsx` prototype files here. The pre-build script
`scripts/gen-apps-manifest.mjs` scans this folder and rebuilds:

- `../src/lib/apps.ts` — server-safe manifest
- `../src/app/apps/[slug]/AppRegistry.tsx` — client static-import registry

Each JSX file should:

1. Default-export a React component.
2. (Optional) Declare a `META` const with `title`, `subtitle`, `brand` — used
   for the site homepage listing and the `/apps/<slug>` page metadata.

Example:

```jsx
const META = {
  title: "SociAI",
  subtitle: "Social layer for the AI-native web",
  brand: "SociAI",
};

export default function App() {
  return <div className="p-6">Hello</div>;
}
```

The slug is derived from the filename (`My App.jsx` → `my-app`).

Rerun `npm run dev` (or `npm run build`) to pick up new files — the `predev`
and `prebuild` hooks trigger the regen automatically.
