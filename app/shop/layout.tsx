import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shop | Free Pants for Veterans in Sioux Falls | One Leg B4 the Other",
  description:
    "Shop tees, hoodies, hats, and more from One Leg B4 the Other. Purchases help fund pants for veterans in Sioux Falls, South Dakota.",
  path: "/shop",
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
