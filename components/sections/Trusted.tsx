import { trustedLogos } from "@/data/landing";

export const TrustedSection = () => (
  <section id="trusted" className="flex flex-col gap-6 py-12">
    <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#1f1e2a] dark:text-white">
      Loved, Trusted, Treasured by Solana Network
    </p>
    <div className="flex flex-wrap items-center justify-center gap-12 text-2xl font-bold text-[#5d5b66] dark:text-gray-400 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0">
      {trustedLogos.map((logo, index) => (
        <div key={`${logo}-${index}`} className="flex items-center gap-12">
          <span>{logo}</span>
          {index !== trustedLogos.length - 1 && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#1f1e2a] dark:text-white">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  </section>
);
