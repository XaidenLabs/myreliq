import { FAQSection } from "@/components/sections/FAQ";
import { FooterSection } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { HeroSection } from "@/components/sections/Hero";
import { HowItWorksSection } from "@/components/sections/HowItWorks";
import { ProblemSection } from "@/components/sections/Problem";
import { SolutionSection } from "@/components/sections/Solution";
import { TestimonialsSection } from "@/components/sections/Testimonials";
import { TrustedSection } from "@/components/sections/Trusted";

export default function Home() {
  return (
    <div className="bg-[#fef7f5] dark:bg-[#1f1e2a] text-[#1f1e2a] dark:text-white transition-colors duration-500">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Header />
        <main className="flex flex-1 flex-col">
          <HeroSection />
          <TrustedSection />
          <ProblemSection />
          <SolutionSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <FAQSection />
        </main>
        <FooterSection />
      </div>
    </div>
  );
}
