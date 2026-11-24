import type { Metadata } from "next";
import {
  ADDRESS,
  EIN,
  FOUNDED_YEAR,
  MISSION_LINE,
  PHONE_TEL,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  formatStreetAddress,
  isContactEmailSet,
  CONTACT_EMAIL,
} from "@/lib/site";

const OG_IMAGE = "/og.jpg";

export function pageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} — free pants for veterans in Sioux Falls, South Dakota` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

/** Organization / NGO structured data. Email is omitted until a real inbox is set. */
export function organizationJsonLd() {
  const sameAs = SOCIAL_LINKS.map((link) => link.url).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og.jpg`,
    description: `${MISSION_LINE} Veteran-led nonprofit in Sioux Falls, South Dakota.`,
    telephone: PHONE_TEL,
    foundingDate: String(FOUNDED_YEAR),
    taxID: EIN,
    nonprofitStatus: "Nonprofit501c3",
    address: {
      "@type": "PostalAddress",
      streetAddress: formatStreetAddress(),
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.region,
      postalCode: ADDRESS.postalCode,
      addressCountry: ADDRESS.country,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Sioux Falls, South Dakota",
    },
    ...(isContactEmailSet() ? { email: CONTACT_EMAIL } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
