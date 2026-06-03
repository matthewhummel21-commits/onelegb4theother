"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";
import { VeteranRequestForm } from "@/components/ui/veteran-request-form";

const PRESET_AMOUNTS = [20, 35, 50, 100, 500, 1000];

const RAISED = 11340;
const GOAL = 20000;
const PROGRESS = Math.round((RAISED / GOAL) * 100);
const VETERANS_WAITING = 33;

const STATS = [
  { value: 500, suffix: "+", label: "Veterans Supported" },
  { value: 33, suffix: "+", label: "On the Waitlist Now" },
  { value: 94, suffix: "¢", label: "Of every $1 to veterans" },
];

export default function DonationPage() {
  const [mode, setMode] = useState<"monthly" | "once">("monthly");
  const [selected, setSelected] = useState<number | null>(35);
  const [custom, setCustom] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [merchSize, setMerchSize] = useState<string | null>(null);
  const [merchLoading, setMerchLoading] = useState(false);
  const [donating, setDonating] = useState(false);

  const handleDonate = async () => {
    if (!finalAmount || isNaN(Number(finalAmount)) || donating) return;
    setDonating(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, mode }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Something went wrong. Please try again.");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setDonating(false);
    }
  };

  const handleMerchCheckout = async () => {
    if (!merchSize || merchLoading) return;
    setMerchLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: merchSize }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Something went wrong. Try again.");
    } finally {
      setMerchLoading(false);
    }
  };

  // Close menu on scroll
  useEffect(() => {
    const handler = () => setMobileMenuOpen(false);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const finalAmount = custom ? parseFloat(custom) : selected;
  const isJeansPair = finalAmount === 35;

  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">

      {/* NAV */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-extrabold text-lg tracking-tight">One Leg B4 the Other</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/shop" className="hidden sm:flex items-center px-4 py-2 rounded-xl bg-secondary border border-white/20 text-white text-sm font-bold hover:bg-secondary/80 transition-colors">
              Shop
            </a>
            <a href="/advertise" className="hidden sm:flex items-center px-4 py-2 rounded-xl bg-secondary border border-white/20 text-white text-sm font-bold hover:bg-secondary/80 transition-colors">
              Advertise
            </a>
            <a href="#request" className="hidden sm:flex items-center px-4 py-2 rounded-xl bg-secondary border border-white/20 text-white text-sm font-bold hover:bg-secondary/80 transition-colors">
              Request Pants
            </a>
            <a href="#newsletter" className="hidden sm:flex items-center px-4 py-2 rounded-xl bg-secondary border border-white/20 text-white text-sm font-bold hover:bg-secondary/80 transition-colors">
              Newsletter
            </a>
            <a href="/admin" className="hidden sm:flex items-center px-3 py-2 rounded-xl border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-colors text-xs font-mono" title="Admin">
              ⚙️
            </a>
            {/* Mobile hamburger */}
            <button
              className="sm:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
            <a href="#donate">
              <ShimmerButton
                background="rgb(178,34,52)"
                shimmerColor="#ffffff"
                borderRadius="12px"
                className="px-6 py-2 text-sm font-bold"
              >
                Donate Now
              </ShimmerButton>
            </a>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed top-[65px] left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 sm:hidden">
          <div className="flex flex-col p-4 gap-3">
            <a href="/shop" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-xl bg-secondary border border-white/20 text-white font-bold hover:bg-secondary/80 transition-colors">
              🛍️ Shop - Issued With Honor Tee
            </a>
            <a href="/advertise" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-xl bg-secondary border border-white/20 text-white font-bold hover:bg-secondary/80 transition-colors">
              📣 Advertise With Us
            </a>
            <a href="#request" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-xl bg-secondary border border-white/20 text-white font-bold hover:bg-secondary/80 transition-colors">
              👖 Request Pants
            </a>
            <a href="#newsletter" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-xl bg-secondary border border-white/20 text-white font-bold hover:bg-secondary/80 transition-colors">
              📬 Newsletter
            </a>
            <a href="#donate" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-4 py-3 rounded-xl bg-[#b22234] text-white font-bold hover:bg-[#8b0000] transition-colors">
              ❤️ Donate Now
            </a>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-screen flex items-end pb-24 overflow-hidden bg-black pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_30%_40%,rgba(178,34,52,0.35),transparent)]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_80%_80%_at_100%_0%,rgba(60,59,110,0.30),transparent)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="flex items-end justify-between gap-12">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <Badge className="mb-6 bg-white/10 text-white border border-white/20 text-sm px-4 py-1.5 font-semibold backdrop-blur-sm">
                🇺🇸 Proud Supporter of U.S. Military Veterans
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.0] tracking-tight"
            >
              Served With Honor.<br />
              <span className="text-primary">Dressed With Dignity.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-xs font-bold tracking-[0.25em] text-gray-500 uppercase mb-2"
            >
              Beyond the Uniform · Est. 2024
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-300 max-w-xl mb-4 leading-relaxed font-semibold"
            >
              We provide the pants. Veterans put their best foot forward.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-base text-gray-400 max-w-xl mb-10 leading-relaxed"
            >
              Right now, <strong className="text-white">{VETERANS_WAITING} veterans</strong> are on our waiting list. The only thing stopping us is funding.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <a href="#donate">
                <ShimmerButton
                  background="rgb(178,34,52)"
                  shimmerColor="#ffffff"
                  borderRadius="16px"
                  className="h-14 px-10 text-lg font-bold w-full sm:w-auto"
                >
                  Help a Veteran Now →
                </ShimmerButton>
              </a>
              <a href="#story">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-2 border-white bg-white/15 text-white hover:bg-white hover:text-gray-900 rounded-2xl">
                  Our Story
                </Button>
              </a>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 max-w-lg"
            >
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white font-bold text-base">${RAISED.toLocaleString()} raised</span>
                <span className="text-gray-400">Goal: ${GOAL.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${PROGRESS}%` }}
                  transition={{ delay: 1.1, duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-red-400"
                />
              </div>
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">{PROGRESS}%</span> of monthly goal ·{" "}
                <span className="text-primary font-semibold">{VETERANS_WAITING} veterans on the waitlist</span>
              </p>
            </motion.div>
          </div>

          {/* Logo - right side of hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex flex-col items-center justify-end pb-8 shrink-0"
          >
            <img
              src="/logo.png"
              alt="One Leg B4 the Other"
              className="w-[460px] h-auto"
              style={{ filter: 'drop-shadow(0 0 60px rgba(178,34,52,0.6)) drop-shadow(0 0 120px rgba(60,59,110,0.4))' }}
            />
          </motion.div>
          </div>
        </div>
      </section>

      {/* AS SEEN ON */}
      <section className="py-10 px-6 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-white/30 mb-6">As Seen On</p>
          <div className="grid grid-cols-2 gap-4">
            <BlurFade inView delay={0}>
              <div className="rounded-2xl overflow-hidden aspect-video">
                <img src="/images/news-interview-1.jpg" alt="News coverage" className="w-full h-full object-cover" />
              </div>
            </BlurFade>
            <BlurFade inView delay={0.15}>
              <div className="rounded-2xl overflow-hidden aspect-video">
                <img src="/images/news-interview-2.jpg" alt="News coverage" className="w-full h-full object-cover" />
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ANIMATED STATS */}
      <section className="bg-primary py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {STATS.map((s, i) => (
            <BlurFade key={s.label} delay={i * 0.15} inView>
              <p className="text-4xl md:text-5xl font-extrabold text-white">
                <NumberTicker value={s.value} className="text-white" />
                {s.suffix}
              </p>
              <p className="text-primary-foreground/80 text-sm mt-2">{s.label}</p>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-16 px-6 bg-card border-y border-border">
        <div className="max-w-3xl mx-auto">
          <BlurFade inView delay={0}>
            <div className="rounded-3xl border border-border bg-background p-10 md:p-14 text-center">
              <div className="text-5xl mb-6">👖</div>
              <p className="text-xl md:text-2xl font-semibold leading-relaxed text-foreground">
                Veterans receive a brand new pair of civilian pants, issued from a place of honor and respect. Getting dressed with confidence is something they earned in uniform &mdash; we&rsquo;re making sure they carry it into civilian life.
              </p>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section className="py-20 px-6 bg-background" id="story">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <BlurFade delay={0} inView direction="right">
            <div className="relative">
              <div className="absolute -top-4 -left-4 text-8xl text-primary/20 font-serif leading-none">&ldquo;</div>
              <div className="bg-card border border-border rounded-3xl p-8 relative z-10">
                <p className="text-lg leading-relaxed text-foreground mb-6 italic">
                  "I don't know what you want me to do with my life, but if you want me to do something impactful, you need to tell me - because I'm ready to make that move."
                </p>
                <Separator className="mb-6" />
                <div className="flex items-center gap-4">
                  <img
                    src="/images/joseph-christmas-sponsor.jpg"
                    alt="Joseph Powell"
                    className="w-12 h-12 rounded-full object-cover object-right"
                  />
                  <div>
                    <p className="font-bold text-foreground">Joseph Powell</p>
                    <p className="text-sm text-muted-foreground">Founder, One Leg B4 the Other</p>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.2} inView direction="left">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20">How It Started</Badge>
              <h2 className="text-3xl font-bold mb-5 leading-tight">A prayer. An epiphany. A movement.</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Joseph Powell comes from a family of veterans. His brother served. His grandfather served. When he asked God what to do with his life, the answer came the next morning while getting dressed.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Give pants to homeless and disabled veterans.</strong> That simple. Each pair brand new, dignified, and delivered with genuine respect.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Because these veterans wrote a check with their lives, not knowing what the outcome would be. We owe them more than we give them.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 12, label: "States Reached" },
                  { value: 33, suffix: "+", label: "On the Waitlist" },
                  { value: 933, label: "Community Supporters" },
                ].map((s) => (
                  <div key={s.label} className="text-center p-4 rounded-2xl bg-card border border-border">
                    <p className="text-2xl font-extrabold text-primary">
                      <NumberTicker value={s.value} className="text-primary" />{s.suffix ?? ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* VETERAN VOICE */}
      <BlurFade inView delay={0}>
        <section className="py-20 px-6 bg-secondary text-secondary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-8">🇺🇸</div>
            <p className="text-3xl md:text-4xl font-bold italic leading-snug mb-8">
              &ldquo;It&rsquo;s not about the pants. It&rsquo;s the door it opens &mdash; a conversation, a connection, a reminder that someone sees you.&rdquo;
            </p>
            <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-6 py-3">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="font-semibold text-sm tracking-wide">Andrew Miller &middot; Vice President &middot; U.S. Army Veteran</p>
            </div>
          </div>
        </section>
      </BlurFade>

      {/* PRESIDENT MESSAGE */}
      <section className="py-20 px-6 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto">
          <BlurFade inView delay={0}>
            <Badge className="mb-6 bg-primary/10 text-primary border border-primary/20">A Message from the President</Badge>
            <div className="relative">
              <div className="absolute -top-6 -left-4 text-9xl text-primary/10 font-serif leading-none select-none">&ldquo;</div>
              <blockquote className="relative z-10 space-y-4 text-lg leading-relaxed text-foreground">
                <p>I proudly served as an aircraft maintenance and crash recovery technician for 20 years. When a jet went down, I led the team that went out there. We had a great team &mdash; one that hoped we&rsquo;d never be needed. Nobody wants a situation like that to happen.</p>
                <p>Coming home, I saw veterans struggling with things that also shouldn&rsquo;t be happening. Basic things. Nobody was really focusing on something a lot of people take for granted &mdash; having clothing that fits. We know what we wear affects how we feel, and we saw a real opportunity to do more for our community than most.</p>
                <p>So we did something about it.</p>
                <p>It&rsquo;s not complicated. A veteran needs pants &mdash; we get them pants. We show up, share some stories, and hope those pants help spark that inner soldier or airman in them. After all, they gave everything. The least we can do is show up.</p>
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <img src="/images/veteran-pants-fitting.jpg" alt="Matthew Hummel" className="w-12 h-12 rounded-full object-cover object-top" />
                <div>
                  <p className="font-bold text-foreground">Matthew Hummel</p>
                  <p className="text-sm text-muted-foreground">President &middot; U.S. Air Force Veteran &middot; 20 Years of Service</p>
                </div>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* DONATION FORM */}
      <section className="py-20 px-6 bg-background" id="donate">
        <div className="max-w-xl mx-auto">
          <BlurFade inView delay={0}>
            <div className="text-center mb-10">
              <Badge className="mb-3 bg-primary/10 text-primary border border-primary/20">Make an Impact</Badge>
              <h2 className="text-4xl font-extrabold tracking-tight">Fund a Veteran&rsquo;s Dignity</h2>
              <p className="text-muted-foreground mt-3">
                $35 is roughly the cost of one pair of jeans. Your donation goes directly to veterans.
              </p>
            </div>
          </BlurFade>

          <BlurFade inView delay={0.1}>
            {/* Mode toggle */}
            <div className="flex rounded-2xl bg-card border border-border p-1.5 mb-6">
              {(["monthly", "once"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setSelected(35); setCustom(""); }}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    mode === m
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "monthly" ? "📅 Monthly" : "💛 One Time"}
                </button>
              ))}
            </div>

            {mode === "monthly" && (
              <div className="mb-5 p-4 rounded-2xl bg-secondary/10 border border-secondary/20 text-sm text-center text-foreground">
                Monthly donors are the backbone of our mission. <strong>Cancel anytime.</strong>
              </div>
            )}

            {/* Amount grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {PRESET_AMOUNTS.map((amount) => (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSelected(amount); setCustom(""); }}
                  className={`rounded-2xl border-2 py-4 font-bold transition-all ${
                    selected === amount && !custom
                      ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "border-border bg-card hover:border-primary hover:text-primary"
                  }`}
                >
                  ${amount}
                  {amount === 35 && (
                    <span className="block text-xs font-normal opacity-70 mt-0.5">≈ 1 pair of jeans</span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Custom */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
              <Input
                type="number"
                placeholder="Custom amount"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                className="pl-10 h-14 text-base rounded-2xl border-2 focus:border-primary"
              />
            </div>

            {/* Impact */}
            {finalAmount && !isNaN(finalAmount) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-5 rounded-2xl bg-primary/8 border border-primary/20 text-sm"
              >
                {isJeansPair ? (
                  <p className="text-foreground">⚡ <strong>$35</strong> is roughly the cost of one pair of jeans - that&rsquo;s exactly what goes to a veteran on our waitlist.</p>
                ) : (
                  <p className="text-foreground">⚡ Your <strong>${finalAmount}</strong> goes directly to putting veterans on their feet. Thank you.</p>
                )}
              </motion.div>
            )}

            <Separator className="mb-6" />

            <ShimmerButton
              background="rgb(178,34,52)"
              shimmerColor="#ffffff"
              borderRadius="16px"
              className="w-full h-16 text-xl font-extrabold"
              disabled={!finalAmount || isNaN(Number(finalAmount)) || donating}
              onClick={handleDonate}
            >
              {donating
                ? "Redirecting..."
                : finalAmount
                ? `Donate $${finalAmount}${mode === "monthly" ? "/mo" : ""} →`
                : "Choose an Amount"}
            </ShimmerButton>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span>🔒 Secure & encrypted</span>
              <span>·</span>
              <span>🏅 501(c)(3) tax-deductible</span>
              <span>·</span>
              <span>✅ Cancel anytime</span>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* HOW WE SPEND IT */}
      <section className="py-16 px-6 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto">
          <BlurFade inView delay={0}>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold">Where Your Money Goes</h2>
              <p className="text-muted-foreground mt-2 text-sm">We are volunteer-driven and lean by design.</p>
            </div>
          </BlurFade>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "👖", pct: 90, label: "Buying & delivering pants to veterans directly", color: "text-primary" },
              { icon: "🚗", pct: 7, label: "Transportation, outreach & community events", color: "text-secondary" },
              { icon: "📣", pct: 3, label: "Awareness & fundraising to grow our reach", color: "text-accent-foreground" },
            ].map((item, i) => (
              <BlurFade key={item.label} inView delay={i * 0.15}>
                <div className="rounded-2xl border border-border bg-background p-6 text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <p className={`text-4xl font-extrabold mb-2 ${item.color}`}>
                    <NumberTicker value={item.pct} className={item.color} />%
                  </p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* VETERAN REQUEST */}
      <section className="py-20 px-6 bg-card border-t border-border" id="request">
        <div className="max-w-2xl mx-auto">
          <BlurFade inView delay={0}>
            <div className="text-center mb-10">
              <Badge className="mb-3 bg-secondary/10 text-secondary border border-secondary/20">Are You a Veteran in Need?</Badge>
              <h2 className="text-4xl font-extrabold tracking-tight mb-3">Request Pants - No Cost to You</h2>
              <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                If you&rsquo;re a veteran facing hardship, we&rsquo;ll ship pants directly to your door at no charge.
                Know a vet who needs help? Fill this out on their behalf.
              </p>
              <div className="mt-4 inline-flex gap-6 text-sm text-muted-foreground">
                <span>✅ U.S. Military Veteran</span>
                <span>·</span>
                <span>✅ Ships free to your door</span>
                <span>·</span>
                <span>✅ No cost ever</span>
              </div>
            </div>
          </BlurFade>
          <BlurFade inView delay={0.1}>
            <div className="bg-background rounded-3xl border border-border p-8">
              <VeteranRequestForm />
            </div>
          </BlurFade>
        </div>
      </section>

      {/* MERCH */}
      <section id="merch" className="py-16 px-6 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto">
          <BlurFade inView delay={0}>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-3">Wear the Mission</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Every shirt sold funds a pair of pants for a veteran. That&apos;s the whole deal.
              </p>
            </div>
          </BlurFade>

          <BlurFade inView delay={0.1}>
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-card border-2 border-border rounded-3xl overflow-hidden md:flex max-w-3xl mx-auto shadow-md"
            >
              {/* Shirt Images - Front & Back */}
              <div className="md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-6 gap-3">
                <div className="flex gap-3 w-full justify-center">
                  <div className="flex-1 text-center">
                    <img
                      src="https://files.cdn.printful.com/files/ddf/ddf2a7cb5e629596c28f07090b1b6267_preview.png"
                      alt="Issued With Honor T-Shirt Front"
                      className="w-full object-contain rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wide">Front</p>
                  </div>
                  <div className="flex-1 text-center">
                    <img
                      src="https://files.cdn.printful.com/files/41d/41da7341d45d419700c8d017bfd67428_preview.png"
                      alt="Issued With Honor T-Shirt Back"
                      className="w-full object-contain rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wide">Back</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Limited Edition</span>
                <h3 className="text-2xl font-extrabold mb-1">Issued With Honor</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  White tee · Front logo · &quot;Issued With Honor&quot; back
                </p>

                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-3xl font-extrabold">$45</span>
                  <span className="text-sm text-muted-foreground line-through"></span>
                </div>

                <p className="text-xs text-emerald-600 font-semibold mb-5 flex items-center gap-1">
                  <span>✓</span> Your purchase sends a pair of pants to a veteran
                </p>

                {/* Size Selector */}
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setMerchSize(size)}
                        className={`border rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none ${
                          merchSize === size
                            ? "bg-primary border-primary text-white"
                            : "border-border hover:border-primary hover:text-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {!merchSize && <p className="text-xs text-amber-500 mt-2 font-semibold">👆 Pick a size to unlock checkout</p>}
                </div>

                <button
                  onClick={handleMerchCheckout}
                  disabled={!merchSize || merchLoading}
                  className="w-full py-3 rounded-xl font-bold text-base text-white transition-all"
                  style={{
                    background: merchSize && !merchLoading ? "rgb(178,34,52)" : "rgb(150,150,150)",
                    cursor: merchSize && !merchLoading ? "pointer" : "not-allowed",
                  }}
                >
                  {merchLoading ? "Redirecting..." : merchSize ? `Buy Now - ${merchSize} / $45` : "Select a Size"}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Ships via Printful · Print on demand · No inventory
                </p>
              </div>
            </motion.div>
          </BlurFade>
        </div>
      </section>

      {/* IMPACT GALLERY */}
      <section id="impact" className="py-16 px-6 bg-muted/40 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <BlurFade inView delay={0}>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-3">Mission in Action</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Real veterans. Real dignity. See where every dollar goes.
              </p>
            </div>
          </BlurFade>

          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: "/images/pants-delivery-june2026-1.jpg", label: "Delivering With Honor" },
              { src: "/images/pants-delivery-june2026-2.jpg", label: "Hands-On Mission" },
              { src: "/images/pants-delivery-june2026-3.jpg", label: "Veteran to Veteran" },
              { src: "/images/delivery-day-kevin.jpg", label: "Delivery Day" },
              { src: "/images/team-office-shirts.jpg", label: "Smiles & Handshakes" },
              { src: "/images/team-selfie-office.jpg", label: "The Team" },
              { src: "/images/booth-car-show.jpg", label: "Community Event" },
              { src: "/images/joseph-christmas-sponsor.jpg", label: "Veteran Recipients" },
              { src: "/images/sorting-pants.jpg", label: "Behind the Scenes" },
            ].map((photo, i) => (
              <BlurFade key={i} inView delay={i * 0.1}>
                <div className="aspect-square rounded-2xl overflow-hidden relative group">
                  <img
                    src={photo.src}
                    alt={photo.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-xs text-white font-semibold">{photo.label}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <BlurFade inView delay={0}>
        <section className="py-20 px-6 bg-black text-white text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-5xl mb-6">🎖️</p>
            <h2 className="text-4xl font-extrabold mb-4">
              They Came Home.<br />We Make Sure They Feel Like It.
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              They wrote a check with their lives, not knowing what the outcome would be. The least we can do is show up for them.
            </p>
            <a href="#donate">
              <ShimmerButton
                background="rgb(178,34,52)"
                shimmerColor="#ffffff"
                borderRadius="16px"
                className="h-14 px-12 text-lg font-bold mx-auto"
              >
                Donate Now →
              </ShimmerButton>
            </a>
          </div>
        </section>
      </BlurFade>

      {/* FOOTER */}
      <section id="newsletter" className="py-16 px-6 bg-gray-950 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <NewsletterSignup />
        </div>
      </section>

      <footer className="py-10 px-6 bg-black border-t border-white/10 text-center text-xs text-gray-500">
        <p className="font-bold text-white mb-1">One Leg B4 the Other</p>
        <p className="mb-1">230 S Phillips Ave, Suite 203 · Sioux Falls, SD 57104</p>
        <p className="mb-1">(605) 277-2721</p>
        <p className="mb-3">EIN: 99-3332965 · 501(c)(3) Nonprofit · Veteran-Led</p>
        <div className="flex justify-center gap-6 mb-4">
          <a href="https://onelegb4theother.com" className="hover:text-white transition-colors">Home</a>
          <a href="https://onelegb4theother.com/#donate" className="hover:text-white transition-colors">Donate</a>
          <a href="https://onelegb4theother.com/#request" className="hover:text-white transition-colors">Request Pants</a>
          <a href="https://onelegb4theother.com/shop" className="hover:text-white transition-colors">Shop</a>
        </div>
        <p>© {new Date().getFullYear()} One Leg B4 the Other · All rights reserved</p>
      </footer>
    </main>
  );
}
