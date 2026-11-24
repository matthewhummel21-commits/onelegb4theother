import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Become a Sponsor | One Leg B4 the Other",
  description:
    "Sponsor One Leg B4 the Other, a veteran-led Sioux Falls, South Dakota nonprofit that gives free pants to veterans.",
  path: "/advertise",
});

export default function AdvertiseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
