"use client";

import Link from "next/link";
import { navLinks } from "@/data/landing";
import { GhostButton, PrimaryButton } from "../ui/Buttons";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { IconMenu } from "@/components/icons";
import { ThemeToggle } from "../ui/ThemeToggle";

export const Header = () => {
  const { user, fetchUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <header className="sticky top-4 z-50 flex flex-wrap items-center justify-between gap-4 rounded-full border border-[#1f1e2a]/10 dark:border-white/10 bg-white/80 dark:bg-[#1f1e2a]/80 px-6 py-4 backdrop-blur-md shadow-sm transition-all text-[#1f1e2a] dark:text-white" id="top">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center text-[#ff4c2b]">
            {/* Star Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-bold tracking-tight">myreliq</p>
          </div>
        </Link>
      </div>

      <nav className="hidden flex-1 justify-center gap-8 text-sm font-semibold text-[#4c4b59] dark:text-gray-300 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            className="transition hover:text-[#1f1e2a] dark:hover:text-white"
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user ? (
          <Link href="/dashboard" className="hidden md:flex items-center gap-2 rounded-full border border-[#1f1e2a]/10 dark:border-white/10 bg-white dark:bg-[#2a2935] p-1 pr-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff4c2b] text-sm font-bold text-white">
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold text-[#1f1e2a] dark:text-white">Dashboard</span>
          </Link>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <GhostButton label="Log in" href="/auth/login" className="!border-[#1f1e2a]/20 dark:!border-white/20 !text-[#1f1e2a] dark:!text-white hover:!bg-[#1f1e2a]/5 dark:hover:!bg-white/10 px-6" />
            <PrimaryButton label="Create Portfolio" href="/auth/register" />
          </div>
        )}

        <button
          className="rounded-full bg-white dark:bg-[#2a2935] p-2 text-[#1f1e2a] dark:text-white shadow-sm md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <IconMenu />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute left-0 top-full mt-2 w-full rounded-3xl border border-[#1f1e2a]/10 dark:border-white/10 bg-white dark:bg-[#1f1e2a] p-6 shadow-xl md:hidden flex flex-col gap-6 animate-in slide-in-from-top-4 fade-in">
          <nav className="flex flex-col gap-4 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                className="text-lg font-bold text-[#4c4b59] dark:text-gray-300 hover:text-[#ff4c2b]"
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 rounded-full bg-[#ff4c2b] py-3 text-white font-bold"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <GhostButton label="Log in" href="/auth/login" className="!border-[#1f1e2a]/20 dark:!border-white/20 !text-[#1f1e2a] dark:!text-white hover:!bg-[#1f1e2a]/5 dark:hover:!bg-white/10 w-full justify-center" />
                <PrimaryButton label="Create Portfolio" href="/auth/register" className="w-full justify-center" />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
