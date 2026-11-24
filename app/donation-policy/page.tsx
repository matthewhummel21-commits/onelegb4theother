import type { Metadata } from "next";
import { InnerPage } from "@/components/inner-page";
import { ContactEmail, PhoneLink } from "@/components/site-contact";
import { pageMetadata } from "@/lib/seo";
import { EIN, PAIR_COST_DOLLARS, PAIRS_POLICY, SITE_NAME } from "@/lib/site";

/**
 * DRAFT for board review. Not legal advice and not yet adopted.
 * TODO(board): Confirm refund handling for mistaken donations and for
 * print-on-demand shop orders before treating this as the adopted policy.
 */

export const metadata: Metadata = pageMetadata({
  title: "Donation and Refund Policy | One Leg B4 the Other",
  description:
    "Draft donation and refund policy for One Leg B4 the Other, a veteran-led 501(c)(3) in Sioux Falls, South Dakota.",
  path: "/donation-policy",
});

export default function DonationPolicyPage() {
  return (
    <InnerPage>
      <article className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Draft for board review</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Donation and Refund Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">
            This page is a draft. It is not yet {SITE_NAME}&apos;s adopted policy.
          </p>

          <div className="space-y-8 text-base leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Donations</h2>
              <p>
                Gifts to {SITE_NAME} support a veteran-led 501(c)(3), EIN {EIN}. The site describes donations
                as tax-deductible. Please keep your receipt and check with your own tax advisor.
              </p>
              <p className="mt-3">
                ${PAIR_COST_DOLLARS} is about what jeans cost on our donation form. Veterans receive {PAIRS_POLICY}.
                You can give another amount, once or monthly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Monthly gifts</h2>
              <p>
                Monthly donations can be canceled anytime. Canceling stops future charges. It does not
                automatically return gifts already made.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Refunds</h2>
              <p>
                If a donation was charged by mistake, call <PhoneLink className="font-semibold text-primary" /> or
                email <ContactEmail className="font-semibold text-primary" /> and we will review it. The board
                has not set a fixed refund window.
              </p>
              <p className="mt-3">
                Shop items are made to order and shipped by our print partner. If an order arrives wrong or
                damaged, contact us the same way and we will help.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-2">Where money goes</h2>
              <p>
                The figures on our home page are the ones we publish today. They are listed together on
                the <a href="/about" className="font-semibold text-primary underline">accountability page</a>.
              </p>
            </section>
          </div>
        </div>
      </article>
    </InnerPage>
  );
}
