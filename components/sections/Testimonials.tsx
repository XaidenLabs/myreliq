import { testimonials } from "@/data/landing";
import { SectionHeading } from "./SectionHeading";

export const TestimonialsSection = () => (
  <section id="testimonials" className="py-24">
    <SectionHeading kicker="Testimonials" title="" className="mb-16 text-center text-4xl font-bold uppercase tracking-widest text-[#1f1e2a]" />
    <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
      {testimonials.map((person) => (
        <div
          key={person.name}
          className="relative flex flex-col justify-between rounded-3xl border border-[#1f1e2a]/10 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div className="absolute right-6 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4c2b] text-white">
            {/* Small X icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>

          <div className="mb-6 flex items-center gap-4">
            {/* Avatar Placeholder */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
              {/* Use the first letter of name as fallback or a gray silhouette */}
              <span className="text-xl font-bold text-gray-500">{person.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-bold text-[#1f1e2a]">{person.name}</p>
              <p className="text-xs font-medium text-[#7d7b8a]">{person.title}</p>
            </div>
          </div>
          <p className="text-sm font-medium leading-relaxed text-[#5d5b66]">&quot;{person.quote}&quot;</p>
        </div>
      ))}
    </div>
  </section>
);
