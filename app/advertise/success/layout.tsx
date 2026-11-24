import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Sponsorship Received | One Leg B4 the Other",
    description: "Thank you for sponsoring One Leg B4 the Other, a veteran-led nonprofit in Sioux Falls, South Dakota.",
    path: "/advertise/success",
  }),
  robots: { index: false, follow: false },
};

export default function AdvertiseSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
