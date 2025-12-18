"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { OverviewSection } from "./OverviewSection";
import { UsersTable } from "./UsersTable";

import { IconBolt, IconMenu, IconShare } from "@/components/icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AdminDashboardClientProps {
    stats: {
        profileCount: number;
        dailyProfileCount: number;
        roleCount: number;
        milestoneCount: number;
        recentProfiles: any[];
    };
}

export function AdminDashboardClient({ stats }: AdminDashboardClientProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#fef7f5] dark:bg-[#1f1e2a] text-[#1f1e2a] dark:text-white flex transition-colors duration-500">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Mobile Sidebar Logic reused roughly from main dashboard if needed, 
          but AdminSidebar has 'hidden md:flex' so we need a mobile drawer if we want mobile support.
          For now, we'll keep it simple as Desktop-first for Admin. 
      */}

            {/* Main Content */}
            <div className="flex-1 md:ml-72 transition-all duration-500">
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#1f1e2a]/5 dark:border-white/5 bg-white/80 dark:bg-[#121212]/80 px-6 py-5 backdrop-blur-xl md:px-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#1f1e2a] dark:text-white">Admin Dashboard</h1>
                        <p className="text-sm font-medium text-[#5d5b66] dark:text-gray-400 mt-1">Platform overview and user management.</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="hidden md:flex items-center gap-2 rounded-full border border-[#1f1e2a]/10 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm font-bold text-[#1f1e2a] dark:text-white">System Healthy</span>
                        </div>
                        <ThemeToggle />
                    </div>
                </header>

                <main className="px-6 py-8 md:px-10 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
                    {activeTab === "overview" && <OverviewSection stats={stats} />}
                    {activeTab === "users" && <UsersTable />}

                    {activeTab === "settings" && (
                        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#2a2935] rounded-[2.5rem] border border-[#1f1e2a]/5 dark:border-white/5 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-[#fef7f5] dark:bg-white/5 p-6 rounded-full mb-6">
                                <IconBolt className="h-12 w-12 text-[#ff4c2b]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1f1e2a] dark:text-white mb-2">Admin Settings</h2>
                            <p className="text-[#5d5b66] dark:text-gray-400 max-w-md">System configuration options will appear here.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
