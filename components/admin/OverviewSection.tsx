"use client";

import { IconMilestone, IconRoles, IconSpark, IconStack, IconSun } from "@/components/icons";
import { GhostButton } from "@/components/ui/Buttons";
import { format } from "date-fns";

interface OverviewSectionProps {
    stats: {
        profileCount: number;
        dailyProfileCount: number;
        roleCount: number;
        milestoneCount: number;
        recentProfiles: any[];
    };
}

const StatCard = ({
    label,
    value,
    helper,
    icon: Icon,
    trend,
}: {
    label: string;
    value: string;
    helper?: string;
    icon: any;
    trend?: string;
}) => (
    <div className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#2a2935] p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 border border-[#1f1e2a]/5 dark:border-white/5">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#fef7f5] dark:bg-white/5 transition-transform group-hover:scale-110"></div>
        <div className="relative">
            <div className="flex justify-between items-start mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef7f5] dark:bg-white/10 text-[#ff4c2b]">
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-600 dark:text-green-400">
                        +{trend} today
                    </span>
                )}
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7d7b8a] dark:text-gray-400">
                {label}
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-[#1f1e2a] dark:text-white">{value}</p>
            <p className="mt-1 text-sm font-medium text-[#5d5b66] dark:text-gray-400">{helper}</p>
        </div>
    </div>
);

export function OverviewSection({ stats }: OverviewSectionProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Users"
                    value={stats.profileCount.toString()}
                    helper="Active profiles"
                    icon={IconSpark}
                    trend={stats.dailyProfileCount > 0 ? stats.dailyProfileCount.toString() : undefined}
                />
                <StatCard
                    label="Total Roles"
                    value={stats.roleCount.toString()}
                    helper="Experience records"
                    icon={IconRoles}
                />
                <StatCard
                    label="Milestones"
                    value={stats.milestoneCount.toString()}
                    helper="Achievements logged"
                    icon={IconMilestone}
                />
                <StatCard
                    label="Queue"
                    value="0"
                    helper="Awaiting verification"
                    icon={IconStack}
                />
            </section>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Portfolios */}
                <section className="lg:col-span-2 rounded-[2.5rem] bg-white dark:bg-[#2a2935] p-8 shadow-sm border border-[#1f1e2a]/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-[#1f1e2a] dark:text-white">Newest Portfolios</h2>
                            <p className="text-sm text-[#5d5b66] dark:text-gray-400 mt-1">Latest creators joining the ecosystem.</p>
                        </div>
                        <GhostButton label="View All" href="#" className="!text-xs" />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#1f1e2a]/5 dark:border-white/5">
                                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">User</th>
                                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">Link</th>
                                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">Joined</th>
                                    <th className="pb-4 text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f1e2a]/5 dark:divide-white/5">
                                {stats.recentProfiles.map((p: any) => (
                                    <tr key={p._id} className="group">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-[#fef7f5] dark:bg-white/10 flex items-center justify-center font-bold text-[#ff4c2b]">
                                                    {(p.fullName || "?").charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#1f1e2a] dark:text-white">{p.fullName}</p>
                                                    <p className="text-xs text-[#5d5b66] dark:text-gray-400">{p.userId?.email || "No Email"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <code className="rounded-lg bg-gray-50 dark:bg-white/5 px-2 py-1 text-xs font-semibold text-[#5d5b66] dark:text-gray-400">
                                                /{p.shareSlug}
                                            </code>
                                        </td>
                                        <td className="py-4 text-sm font-medium text-[#5d5b66] dark:text-gray-400">
                                            {format(new Date(p.createdAt), "MMM d, yyyy")}
                                        </td>
                                        <td className="py-4">
                                            <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-600 dark:text-green-400">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* System Health / Audit */}
                <section className="rounded-[2.5rem] bg-[#1f1e2a] dark:bg-white/5 p-8 shadow-lg text-white border border-transparent dark:border-white/10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/10 rounded-xl">
                            <IconSun className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">System Status</h3>
                            <p className="text-white/60 text-sm">All systems operational</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                name: "Catalyst U",
                                type: "University",
                                reason: "Launching next cohort in Lagos",
                                initial: "C"
                            },
                            { name: "Sol Builders DAO", type: "Community", reason: "Credential issuer", initial: "S" },
                            { name: "CreateCamp", type: "Bootcamp", reason: "Capstone credential", initial: "T" },
                        ].map((org) => (
                            <div
                                key={org.name}
                                className="flex flex-col gap-3 rounded-2xl bg-[#fef7f5] dark:bg-[#121212] p-5 border border-[#1f1e2a]/5 dark:border-white/5 transition hover:border-[#ff4c2b]/30"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center text-[#1f1e2a] dark:text-white font-bold text-xs shadow-sm">
                                            {org.initial}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-[#1f1e2a] dark:text-white">{org.name}</p>
                                            <p className="text-[10px] uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">{org.type}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-[#5d5b66] dark:text-gray-400 leading-relaxed pl-11">{org.reason}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
