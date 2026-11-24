import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME } from "@/lib/site";

export function InnerPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <header className="bg-black text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link href="/" className="font-extrabold tracking-tight hover:opacity-80 transition-opacity">
            {SITE_NAME}
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/shop" className="px-2 py-2 text-xs sm:text-sm font-bold hover:text-white/80">
              Shop
            </Link>
            <Link
              href="/#request"
              className="px-3 py-2 rounded-xl border border-white/30 text-xs sm:text-sm font-bold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Request Pants
            </Link>
            <Link
              href="/#donate"
              className="px-3 py-2 rounded-xl bg-[#b22234] text-xs sm:text-sm font-bold hover:bg-[#8b0000] transition-colors"
            >
              Donate
            </Link>
          </div>
        </div>
      </header>
      {children}
      <SiteFooter />
    </main>
  );
}
