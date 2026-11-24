import type { Metadata } from "next";
import Image from "next/image";
import { InnerPage } from "@/components/inner-page";
import { NewsCoverage } from "@/components/news-coverage";
import { SponsorsSection } from "@/components/sponsors-section";
import { ContactEmail, PhoneLink, SocialLinks } from "@/components/site-contact";
import { pageMetadata } from "@/lib/seo";
import {
  ADDRESS,
  CENTS_OF_EVERY_DOLLAR_TO_VETERANS,
  COMMUNITY_SUPPORTERS,
  EIN,
  FOUNDED_YEAR,
  FUNDS_GOAL,
  FUNDS_GOAL_PERIOD_LABEL,
  FUNDS_RAISED,
  GOAL_PROGRESS_PERCENT,
  IRS_TEOS_URL,
  LEADERSHIP,
  MISSION_DETAIL,
  MISSION_LINE,
  MONEY_ALLOCATION,
  PAIRS_POLICY,
  PANT_OPTIONS_LABEL,
  SITE_NAME,
  STATES_REACHED,
  VETERANS_SUPPORTED,
  VETERANS_WAITING,
  formatAddressLine,
} from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About & Accountability | One Leg B4 the Other",
  description:
    "One Leg B4 the Other is a veteran-led 501(c)(3) in Sioux Falls, South Dakota (EIN 99-3332965). Mission, leadership, and how gifts provide pants to veterans.",
  path: "/about",
});

const IMPACT = [
  { value: `${VETERANS_SUPPORTED}+`, label: "Veterans supported" },
  { value: String(VETERANS_WAITING), label: "On the waitlist" },
  { value: String(STATES_REACHED), label: "States reached" },
  { value: String(COMMUNITY_SUPPORTERS), label: "Community supporters" },
  { value: `${CENTS_OF_EVERY_DOLLAR_TO_VETERANS}¢`, label: "Of every $1 to veterans" },
  { value: "As needed", label: "Pairs per veteran" },
];

export default function AboutPage() {
  return (
    <InnerPage>
      <article className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">About & Accountability</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            A veteran-led nonprofit in Sioux Falls, South Dakota.
          </h1>
          <p className="text-xl font-semibold leading-relaxed mb-4">{MISSION_LINE}</p>
          <p className="text-muted-foreground leading-relaxed mb-8">{MISSION_DETAIL}</p>

          <div className="rounded-2xl border border-border bg-card p-6 mb-10 text-sm leading-relaxed">
            <p className="font-bold text-foreground mb-2">
              501(c)(3) · Established {FOUNDED_YEAR} · Veteran-led
            </p>
            <p className="mb-2">
              EIN{" "}
              <a
                href={IRS_TEOS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-2"
              >
                {EIN}
              </a>
              . Look this number up in the IRS Tax Exempt Organization Search.
            </p>
            <p className="mb-2">{formatAddressLine()}</p>
            <p className="mb-2">
              <PhoneLink className="font-semibold text-primary" />
              {" · "}
              <ContactEmail />
            </p>
            <p className="text-muted-foreground">
              Pants offered through the request form: {PANT_OPTIONS_LABEL}. No cost to the veteran.
              Veterans receive {PAIRS_POLICY}.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4">Published impact figures</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These are the figures currently shown on our home page, including ${FUNDS_RAISED.toLocaleString()} raised
            toward a ${FUNDS_GOAL.toLocaleString()} {FUNDS_GOAL_PERIOD_LABEL} ({GOAL_PROGRESS_PERCENT}%).
          </p>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {IMPACT.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border p-4">
                <dt className="text-xs text-muted-foreground">{item.label}</dt>
                <dd className="text-2xl font-extrabold text-primary mt-1">{item.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="space-y-2 text-sm text-muted-foreground mb-12">
            {MONEY_ALLOCATION.map((item) => (
              <li key={item.label}>
                <span className="font-bold text-foreground">{item.pct}%</span> {item.label}
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">Leadership</h2>
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            {LEADERSHIP.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 mx-auto mb-4 bg-secondary text-secondary-foreground flex items-center justify-center">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="96px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <span className="text-2xl font-bold tracking-wide" aria-hidden="true">
                      {member.initials}
                    </span>
                  )}
                </div>
                <p className="font-bold">{member.name}</p>
                <p className="text-xs text-primary font-semibold mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.detail}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-3">Contact</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {SITE_NAME}
            <br />
            {formatAddressLine()}
            <br />
            {ADDRESS.city}, {ADDRESS.regionName}
          </p>
          <p className="text-sm mb-4">
            <PhoneLink className="font-semibold text-primary" />
            <span className="text-muted-foreground"> · </span>
            <ContactEmail />
          </p>
          <SocialLinks className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8" />
          <p className="text-sm">
            <a href="/privacy" className="underline font-semibold">Privacy policy</a>
            <span className="text-muted-foreground"> · </span>
            <a href="/donation-policy" className="underline font-semibold">Donation & refund policy</a>
          </p>
        </div>
      </article>
      <NewsCoverage />
      <SponsorsSection />
    </InnerPage>
  );
}
