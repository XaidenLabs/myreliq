"use client";

import Link from "next/link";
import { navLinks } from "@/data/landing";
import { GhostButton, PrimaryButton } from "../ui/Buttons";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const Header = () => {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <header className="sticky top-4 z-50 flex flex-wrap items-center justify-between gap-4 rounded-full border border-[#1f1e2a]/10 bg-white/80 px-6 py-4 backdrop-blur-md shadow-sm transition-all" id="top">
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

      <nav className="hidden flex-1 justify-center gap-8 text-sm font-semibold text-[#4c4b59] md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            className="transition hover:text-[#1f1e2a]"
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {user ? (
          <Link href="/dashboard" className="flex items-center gap-2 rounded-full border border-[#1f1e2a]/10 bg-white p-1 pr-4 transition-all hover:bg-gray-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff4c2b] text-sm font-bold text-white">
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold text-[#1f1e2a]">Dashboard</span>
          </Link>
        ) : (
          <>
            <GhostButton label="Log in" href="/auth/login" className="!border-[#1f1e2a]/20 !text-[#1f1e2a] hover:!bg-[#1f1e2a]/5 px-6" />
            <PrimaryButton label="Create Portfolio" href="/auth/register" />
          </>
        )}
      </div>
    </header>
  );
};
