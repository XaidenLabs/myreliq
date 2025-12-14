import { stepCards } from "@/data/landing";
import { PrimaryButton } from "../ui/Buttons";
import { SectionHeading } from "./SectionHeading";

export const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24">
    <SectionHeading kicker="" title="How it Works" className="mb-16 text-center text-4xl font-bold uppercase tracking-widest text-[#ff4c2b]" />
    <div className="mx-auto max-w-4xl space-y-6">
      {stepCards.map((step, index) => (
        <div
          key={step.title}
          className="flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-[#1f1e2a]/10 bg-white p-8 shadow-sm transition-all hover:shadow-md sm:flex-row sm:p-10"
        >
          <div className="flex-1 max-w-lg">
            <h3 className="mb-2 text-2xl font-bold text-[#ff4c2b]">{step.title}</h3>
            <p className="text-sm font-medium text-[#7d7b8a]">{step.description}</p>
          </div>
          <p className="text-7xl font-bold text-transparent" style={{ WebkitTextStroke: "1px #d1d1d6" }}>
            {String(index + 1).padStart(2, "0")}
          </p>
        </div>
      ))}
    </div>
    <div className="mt-12 flex justify-center">
      <PrimaryButton label="Create Portfolio" href="/auth/register" />
    </div>
  </section>
);
