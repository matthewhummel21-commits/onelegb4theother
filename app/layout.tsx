import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "One Leg B4 the Other — Support Veterans",
  description: "Help us restore dignity and mobility to veterans who need it most.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
