import { faqs } from "@/data/landing";
import { IconChevronDown } from "../icons";
import { SectionHeading } from "./SectionHeading";

export const FAQSection = () => (
  <section id="faq" className="py-24">
    <SectionHeading kicker="" title="Frequently Asked Questions" className="mb-16 text-center text-4xl font-bold uppercase tracking-widest text-[#ff4c2b]" />
    <div className="mx-auto max-w-3xl space-y-4">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group rounded-2xl border border-[#1f1e2a]/10 bg-white px-6 py-5 text-left shadow-sm transition-all hover:bg-gray-50 open:bg-gray-50 open:shadow-md"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-[#1f1e2a]">
            {faq.question}
            <span className="text-[#ff4c2b] transition-transform duration-300 group-open:rotate-180">
              <IconChevronDown className="h-5 w-5" />
            </span>
          </summary>
          <div className="overflow-hidden transition-all duration-300 ease-in-out group-open:max-h-96 max-h-0">
            <p className="mt-3 text-sm font-medium leading-relaxed text-[#5d5b66]">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  </section>
);
