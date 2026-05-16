"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (sessionId) setReady(true);
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center px-6">
      <BlurFade delay={0.1}>
        <div className="max-w-lg text-center space-y-6">
          <div className="text-6xl">🎖️</div>
          <h1 className="text-4xl font-extrabold text-white">
            Thank You for Serving the Mission
          </h1>
          <p className="text-white/60 text-lg">
            Your shirt is on its way to production. More importantly — a veteran
            just got one step closer to a pair of pants. That&apos;s real impact.
          </p>
          {ready && (
            <p className="text-white/30 text-xs">
              Order ref: {sessionId?.slice(-12).toUpperCase()}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href="/shop">
              <ShimmerButton
                background="rgb(178,34,52)"
                shimmerColor="#ffffff"
                borderRadius="12px"
                className="px-8 py-3 font-bold"
              >
                Buy Another
              </ShimmerButton>
            </a>
            <a
              href="/"
              className="px-8 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </BlurFade>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
