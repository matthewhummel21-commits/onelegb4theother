import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — One Leg B4 the Other",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
