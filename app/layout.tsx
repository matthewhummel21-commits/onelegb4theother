import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "One Leg B4 the Other — Support Veterans",
  description: "Providing new pants to veterans in need — with dignity. Donate, shop, or request pants.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OneLeg",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#b22234" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
