import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Join the Newsletter | One Leg B4 the Other",
  description:
    "Get updates from One Leg B4 the Other, a veteran-led Sioux Falls, South Dakota nonprofit that gives free pants to veterans.",
  path: "/join",
});

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
