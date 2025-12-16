"use client";

import { useTheme } from "next-themes";
import { IconSun, IconMoon } from "@/components/icons";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full bg-white dark:bg-[#1f1e2a] p-2 text-[#1f1e2a] dark:text-white shadow-sm border border-[#1f1e2a]/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <IconSun className="h-5 w-5" />
            ) : (
                <IconMoon className="h-5 w-5" />
            )}
        </button>
    );
}
