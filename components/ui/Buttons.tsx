import Link from "next/link";
import type { MouseEventHandler } from "react";

type ButtonProps = {
  label: string;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  ariaLabel?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

const renderAction = ({
  label,
  href,
  className,
  target,
  rel,
  onClick,
  ariaLabel,
  disabled,
  type,
}: ButtonProps) => {
  const classes = `${className ?? ""}`.trim();
  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      type={type ?? "button"}
    >
      {label}
    </button>
  );
};

export const PrimaryButton = ({ label, className = "", ...rest }: ButtonProps) =>
  renderAction({
    label,
    className: `inline-flex items-center justify-center cursor-pointer rounded-full bg-[#ff4521] px-8 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,69,33,0.35)] transition hover:bg-[#e53713] ${className}`,
    ...rest,
  });

export const GhostButton = ({
  label,
  variant = "light",
  className = "",
  ...rest
}: ButtonProps & { variant?: "light" | "dark" }) => {
  const base = "cursor-pointer rounded-full border px-6 py-3 text-sm font-semibold transition";

  const classNames =
    variant === "dark"
      ? `inline-flex items-center justify-center ${base} border-white/40 text-white hover:border-white ${className}`
      : `inline-flex items-center justify-center ${base} border-[#1f1e2a]/30 text-[#1f1e2a] hover:border-[#1f1e2a] dark:border-white/30 dark:text-white dark:hover:border-white ${className}`;

  return renderAction({
    label,
    className: classNames,
    ...rest,
  });
};
