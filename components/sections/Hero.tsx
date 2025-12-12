import { heroCopy, heroStickers } from "@/data/landing";
import { GhostButton, PrimaryButton } from "../ui/Buttons";
import { IconClock, IconLoop, IconSpark, IconSun } from "../icons";

const heroIconMap = {
  loop: IconLoop,
  clock: IconClock,
  spark: IconSpark,
  sun: IconSun,
} as const;

export const HeroSection = () => (
  <section id="hero" className="flex flex-col items-center gap-6 py-16 text-center">
    <p className="rounded-full border border-[#1f1e2a]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#f2512e]">
      {heroCopy.badge}
    </p>
    <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-7xl font-sans tracking-tight">
      {heroCopy.title}
    </h1>
    <p className="max-w-2xl text-base text-[#5d5b66] sm:text-lg">{heroCopy.description}</p>
    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
      <PrimaryButton label={heroCopy.primaryCta} href={heroCopy.primaryHref} />
      <GhostButton label={heroCopy.secondaryCta} href={heroCopy.secondaryHref} />
    </div>

    <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs uppercase tracking-[0.3em] text-[#a07f82]">
      {heroStickers.map((item) => {
        const Icon = heroIconMap[item.icon as keyof typeof heroIconMap];
        return (
          <div
            key={item.label}
            className="flex items-center gap-2 rounded-full border border-dashed border-[#1f1e2a]/20 px-4 py-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#ff4521] shadow-[0_2px_10px_rgba(255,69,33,0.15)] overflow-hidden">

              <Icon className="h-4 w-4 relative z-10" />
            </span>
            {item.label}
          </div>
        );
      })}
    </div>
  </section>
);
