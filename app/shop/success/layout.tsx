import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Order Received | One Leg B4 the Other",
    description: "Thank you for shopping One Leg B4 the Other. Your order helps fund pants for veterans.",
    path: "/shop/success",
  }),
  robots: { index: false, follow: false },
};

export default function ShopSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
