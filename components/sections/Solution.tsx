import { solutionCards } from "@/data/landing";
import { SectionHeading } from "./SectionHeading";
import { IconBolt, IconStudent, IconSolana, IconMilestone, IconRoles, IconShare } from "../icons";

export const SolutionSection = () => (
  <section id="solution" className="py-24">
    <SectionHeading kicker="" title="The Solution" className="mb-16 text-center text-3xl md:text-4xl font-bold uppercase tracking-widest text-[#ff4c2b]" />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
      {solutionCards.map((solution, index) => {
        let Icon = IconBolt;
        if (index === 1) Icon = IconStudent;
        if (index === 2) Icon = IconSolana; // Wait, design order might be different? "Built on Solana"
        // Let's stick to the mapped order in data/landing.ts which matches design order usually?
        // Data:
        // 0: Instant Setup
        // 1: Student Focused
        // 2: Built on Solana
        // 3: Milestone Timeline
        // 4: Add Roles & Projects
        // 5: One Shareable Link

        // Design check:
        // 1. Instant Setup (Bolt)
        // 2. Student Focused (Student?) - actually design shows "Student Focused".
        // 3. Built on Solana (Horizontal lines icon? Or Diamond?)
        // 4. Milestone Timeline (Hourglass?)
        // 5. Add Roles & Projects (Folder?)
        // 6. One Shareable Link (Share icon)

        if (index === 0) Icon = IconBolt;
        if (index === 1) Icon = IconStudent;
        if (index === 2) Icon = IconMilestone;
        if (index === 3) Icon = IconRoles;
        if (index === 4) Icon = IconShare;

        return (
          <div
            key={solution.title}
            className="group flex flex-col items-center text-center rounded-2xl bg-[#ff4521] px-6 py-10 text-white shadow-[#ff4521]/20 shadow-xl transition hover:scale-[1.02]"
          >
            <div className="mb-6 rounded-full bg-white/20 p-4 text-white">
              <Icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{solution.title}</h3>
            <p className="text-sm font-medium text-white/90 leading-relaxed max-w-[90%]">{solution.description}</p>
          </div>
        );
      })}
    </div>
  </section>
);
