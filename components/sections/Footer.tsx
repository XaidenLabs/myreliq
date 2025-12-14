import { GhostButton, PrimaryButton } from "../ui/Buttons";
import { IconSolana } from "../icons";

export const FooterSection = () => (
  <footer className="mt-12 rounded-[2.5rem] bg-[#ff4c2b] px-8 py-12 text-white shadow-xl mx-4 mb-4">
    <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <p className="text-2xl font-bold tracking-tight">myreliq</p>
        </div>
        <p className="text-base font-medium text-white/90 leading-relaxed">
          Bring your entire proof-of-work journey into one shareable portfolio in minutes.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <GhostButton
          label="Contact us"
          variant="dark"
          href="mailto:hello@myreliq.xyz"
          className="!border-white/30 !text-white hover:!bg-white/10 hover:!border-white"
        />
        <PrimaryButton
          label="Subscribe for drops"
          className="bg-white text-[#ff4c2b] hover:bg-white/90 border-0 shadow-none font-bold"
          href="https://tally.so/r/waitlist"
          target="_blank"
          rel="noreferrer"
        />
      </div>
    </div>
    <div className="mt-12 flex flex-col gap-6 border-t border-white/20 pt-8 text-sm font-medium text-white/70 sm:flex-row sm:items-center sm:justify-between">
      <p>&copy; {new Date().getFullYear()} Myreliq Collective</p>
      <div className="flex gap-8">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">
          <IconSolana className="h-4 w-4" />
          <span>Built on Solana</span>
        </div>
        <a href="#" className="hover:text-white transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Support
        </a>
      </div>
    </div>
  </footer>
);
