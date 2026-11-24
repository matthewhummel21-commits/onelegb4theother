"use client";

import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";
import { NEWS_STORIES } from "@/lib/site";

export function NewsCoverage() {
  return (
    <section className="py-10 px-6 bg-black border-b border-white/10">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-white/30 mb-6">As Seen On</p>
        <div className="grid grid-cols-2 gap-4">
          {NEWS_STORIES.map((story, index) => {
            const frame = (
              <div className="rounded-2xl overflow-hidden aspect-video relative group">
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 400px"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                  <p className="text-white text-xs font-bold uppercase tracking-wide">📺 {story.outlet}</p>
                </div>
              </div>
            );
            // TODO(board): story.url is empty until the Keloland article URL is added in lib/site.ts.
            const linked = story.url ? (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-2xl"
              >
                {frame}
              </a>
            ) : (
              frame
            );
            return (
              <BlurFade key={story.image} inView delay={index * 0.15}>
                {linked}
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
