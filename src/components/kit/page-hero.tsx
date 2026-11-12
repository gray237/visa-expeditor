import Image from "next/image";
import type { ImageSlot } from "@/lib/image-slots";
import { getImage } from "@/lib/image-slots";

export type PageHeroProps = {
  slot: ImageSlot;
  heading: string;
  subhead?: string;
  eyebrow?: string;
};

export function PageHero({ slot, heading, subhead, eyebrow }: PageHeroProps) {
  const { src, width, height } = getImage(slot);

  return (
    <section className="relative overflow-hidden bg-[#0F2444] pb-16 pt-20 sm:pb-24 sm:pt-28">
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        sizes="100vw"
        className="w-full h-64 sm:h-80 object-cover"
        style={{ objectPosition: "center" }}
        priority
      />
      <div className="relative mx-auto max-w-350 px-6 -mt-16 sm:-mt-20">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#B8925A]">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#F5F6F4] sm:text-4xl">
            {heading}
          </h1>
          {subhead && (
            <p className="mt-5 max-w-lg font-body text-base text-[#F5F6F4]/70 sm:text-lg">
              {subhead}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
