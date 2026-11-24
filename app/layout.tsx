import type { Metadata } from "next";
import "./globals.css";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    title: "Free Pants for Veterans in Sioux Falls, SD | One Leg B4 the Other",
    description:
      "One Leg B4 the Other is a veteran-led Sioux Falls, South Dakota nonprofit that gives free pants to veterans. Donate, request pants, or shop the mission.",
    path: "/",
  }),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OneLeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = JSON.stringify(organizationJsonLd()).replace(/</g, "\\u003c");
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#b22234" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        {children}
      </body>
    </html>
  );
}
