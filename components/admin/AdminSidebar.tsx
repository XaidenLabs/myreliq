"use client";

import { IconBolt } from "@/components/icons";
import { GhostButton } from "@/components/ui/Buttons";

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "users", label: "Users" },
        { id: "settings", label: "Settings" },
    ];

    return (
        <aside className="hidden w-72 flex-col justify-between border-r border-[#1f1e2a]/5 bg-white px-6 py-8 md:flex fixed h-full z-10 transition-colors duration-300 dark:bg-[#121212] dark:border-white/5">
            <div className="flex flex-col gap-10">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff4c2b] text-white shadow-lg shadow-[#ff4c2b]/20">
                        <IconBolt className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xl font-bold tracking-tight text-[#1f1e2a] dark:text-white">myreliq</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff4c2b]">Admin</p>
                    </div>
                </div>
                <nav className="flex flex-col gap-2 font-medium text-base">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex w-full items-center justify-start rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                                ? "bg-[#1f1e2a] text-white shadow-lg shadow-[#1f1e2a]/10 dark:bg-white dark:text-[#1f1e2a]"
                                : "text-[#5d5b66] hover:bg-[#ffece8] hover:text-[#ff4c2b] dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex flex-col gap-2">
                <a
                    href="/dashboard"
                    className="flex w-full items-center justify-start rounded-full px-6 py-3 text-sm font-semibold text-[#5d5b66] hover:bg-[#ffece8] hover:text-[#ff4c2b] dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-200"
                >
                    User Dashboard
                </a>
            </div>
        </aside>
    );
}
