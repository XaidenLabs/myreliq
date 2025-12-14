import { problemCards } from "@/data/landing";
import { IconSpark, IconOutdated, IconTechnical, IconStack, IconGrowth, IconFlame } from "../icons";
import { SectionHeading } from "./SectionHeading";

export const ProblemSection = () => (
  <section id="problem" className="py-24">
    <SectionHeading kicker="" title="The Problem" className="mb-16 text-center text-3xl md:text-4xl font-bold uppercase tracking-widest text-[#ff4c2b]" />
    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
      {problemCards.map((item, index) => {
        let Icon = IconSpark;
        if (index === 0) Icon = IconOutdated;
        if (index === 1) Icon = IconFlame;
        if (index === 2) Icon = IconStack;
        if (index === 3) Icon = IconGrowth;

        return (
          <div
            key={item.title}
            className="flex flex-col items-center text-center rounded-2xl bg-white p-8 shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className="mb-6 text-[#ff4c2b]">
              <Icon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-[#1f1e2a] mb-3">{item.title}</h3>
            <p className="text-sm text-[#5d5b66] leading-relaxed max-w-[85%]">{item.description}</p>
          </div>
        )
      })}
    </div>
  </section>
);
