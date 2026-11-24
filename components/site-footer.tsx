import { ContactEmail, PhoneLink, SocialLinks } from "@/components/site-contact";
import { EIN, IRS_TEOS_URL, SITE_NAME, formatAddressLine } from "@/lib/site";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#donate", label: "Donate" },
  { href: "/#request", label: "Request Pants" },
  { href: "/shop", label: "Shop" },
  { href: "/advertise", label: "Become a Sponsor" },
  { href: "/about", label: "Accountability" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/donation-policy", label: "Donation & Refund Policy" },
];

export function SiteFooter() {
  return (
    <footer className="py-10 px-6 bg-black border-t border-white/10 text-center text-xs text-gray-500">
      <p className="font-bold text-white mb-1">{SITE_NAME}</p>
      <p className="mb-1">{formatAddressLine()}</p>
      <p className="mb-1">
        <PhoneLink className="hover:text-white transition-colors" />
      </p>
      <p className="mb-3">
        <ContactEmail className="hover:text-white transition-colors" />
      </p>
      <SocialLinks className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4" />
      <p className="mb-3">
        EIN:{" "}
        <a
          href={IRS_TEOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors underline underline-offset-2"
        >
          {EIN}
        </a>{" "}
        · 501(c)(3) Nonprofit · Veteran-Led
      </p>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-4">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className="hover:text-white transition-colors">
            {link.label}
          </a>
        ))}
      </div>
      <p>
        © {new Date().getFullYear()} {SITE_NAME} · All rights reserved
      </p>
    </footer>
  );
}
