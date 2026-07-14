import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const SITE_URL = "https://sociai.matsiems.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "SociAI — social layer for the AI-native web", template: "%s · SociAI" },
  description: "SociAI is the social layer for the AI-native web.",
  applicationName: "SociAI",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "SociAI",
    title: "SociAI — social layer for the AI-native web",
    description: "SociAI is the social layer for the AI-native web.",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "SociAI",
    description: "SociAI is the social layer for the AI-native web.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
