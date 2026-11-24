import Image from "next/image";
import { SPONSORS } from "@/lib/site";

export function SponsorsSection({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <section id="sponsors" className={dark ? "py-16 px-6 bg-black text-white border-t border-white/10" : "py-16 px-6 bg-card border-t border-border"}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-3">Our Sponsors</h2>
        <p className={dark ? "text-white/50 text-sm mb-8" : "text-muted-foreground text-sm mb-8"}>
          Businesses that help us get pants to veterans.
        </p>
        {SPONSORS.length === 0 ? (
          <div className={dark ? "rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-10" : "rounded-2xl border border-dashed border-border bg-background px-6 py-10"}>
            {/* TODO(board): SPONSORS in lib/site.ts is empty until logos are supplied. */}
            <p className={dark ? "text-sm text-white/50 mb-4" : "text-sm text-muted-foreground mb-4"}>
              Sponsor logos will be posted here.
            </p>
            <a href="/advertise" className="text-sm font-bold text-primary hover:underline">
              Become a Sponsor
            </a>
          </div>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {SPONSORS.map((sponsor) => (
              <li key={sponsor.name}>
                <a href={sponsor.url || "/advertise"} className="block">
                  <Image
                    src={sponsor.logoSrc}
                    alt={sponsor.name}
                    width={180}
                    height={80}
                    className="mx-auto max-h-16 w-auto object-contain"
                  />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
