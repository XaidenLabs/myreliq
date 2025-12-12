type SectionHeadingProps = {
  kicker?: string;
  title: string;
  className?: string;
};

export const SectionHeading = ({ kicker, title, className }: SectionHeadingProps) => (
  <div className={`flex flex-col gap-2 ${className || ""}`}>
    {kicker && (
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff4c2b]">{kicker}</p>
    )}
    <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
  </div>
);
