import type { Metadata } from "next";
import { InnerPage } from "@/components/inner-page";
import { ContactEmail, PhoneLink, PhoneNote } from "@/components/site-contact";
import { pageMetadata } from "@/lib/seo";
import { INCOME_GUIDELINE, PANT_OPTIONS_LABEL, SITE_NAME } from "@/lib/site";

/**
 * DRAFT for board review. Not legal advice and not yet adopted.
 * TODO(board): Review this page, confirm who may see request records, set a
 * retention period before treating this as the organization's privacy policy.
 */

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | One Leg B4 the Other",
  description:
    "What the One Leg B4 the Other pants request form collects, who on the board can see it, and how to ask for deletion.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <InnerPage>
      <article className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Draft for board review</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">
            This page is a draft. It is not yet {SITE_NAME}&apos;s adopted policy.
          </p>

          <div className="space-y-8 text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-2">What the pants request form collects</h2>
              <p className="text-muted-foreground mb-3">
                If you ask us for pants, or you fill the form out for a veteran, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>First and last name</li>
                <li>Phone number</li>
                <li>Email, if you give one</li>
                <li>Shipping address, city, state, and ZIP code</li>
                <li>Branch of service and years served</li>
                <li>Pant choice and size. The form offers {PANT_OPTIONS_LABEL}.</li>
                <li>Household income range, if you choose to give one. You can skip it. {INCOME_GUIDELINE}</li>
                <li>Anything you write in the notes</li>
                <li>Whether you want a follow-up call</li>
                <li>A DD-214 or VA ID file, if you choose to upload one. The upload is optional.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">Who sees it</h2>
              <p className="text-muted-foreground">
                The board sees request information so they can review it and get pants to the veteran.
                We do not sell it. We do not share it with advertisers, data brokers, or other organizations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">How long we keep it</h2>
              <p className="text-muted-foreground">
                The board has not set a final retention period. Draft: we keep a request only as long as we
                need it to send the pants and for ordinary nonprofit records. We delete it when you ask.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">Ask us to delete it</h2>
              <p className="text-muted-foreground">
                Call <PhoneLink className="font-semibold text-primary" /> or email <ContactEmail className="font-semibold text-primary" /> and
                ask us to delete your request. Tell us the name and phone number on the form so we can find it.
              </p>
              <PhoneNote className="text-sm text-muted-foreground mt-2" />
            </section>

            <section>
              <h2 className="text-xl font-bold mb-2">Donations and the shop</h2>
              <p className="text-muted-foreground">
                Donations and shop checkout are handled by Stripe. Merch is printed and shipped by Printful.
                Those companies receive the payment details needed to complete the transaction. We do not
                sell donor or customer information.
              </p>
            </section>
          </div>
        </div>
      </article>
    </InnerPage>
  );
}
