"use client";

export function AnalyticsSection() {
    // Mock Data for Premium
    const stats = [
        { label: "Profile Views", value: "1,234", trend: "+12%" },
        { label: "Link Clicks", value: "456", trend: "+5%" },
        { label: "Identity Mints", value: "2", trend: "+1" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold text-[#1f1e2a] dark:text-white">Analytics Overview</h2>
                <p className="text-[#5d5b66] dark:text-gray-400">Track your portfolio performance over the last 30 days.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#2a2935] p-6 rounded-[2rem] shadow-sm border border-[#1f1e2a]/5 dark:border-white/5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400 mb-2">{stat.label}</p>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-bold text-[#1f1e2a] dark:text-white">{stat.value}</span>
                            <span className="text-sm font-bold text-green-500 mb-1.5 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-lg">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mock Chart Area */}
            <div className="bg-white dark:bg-[#2a2935] p-8 rounded-[2.5rem] shadow-sm border border-[#1f1e2a]/5 dark:border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-[#1f1e2a] dark:text-white">Engagement History</h3>
                    <select className="bg-gray-50 dark:bg-white/5 border-none rounded-lg text-xs font-bold text-[#5d5b66] dark:text-gray-400 p-2">
                        <option>Last 30 Days</option>
                        <option>Last 7 Days</option>
                    </select>
                </div>
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {/* Simple CSS Bar Chart Steps */}
                    {[40, 65, 30, 85, 50, 90, 45, 70, 60, 55, 80, 95, 60, 75, 50].map((h, i) => (
                        <div key={i} className="w-full bg-[#fef7f5] dark:bg-white/5 rounded-t-lg relative group">
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-[#ff4c2b] rounded-t-lg transition-all duration-1000 opacity-80 group-hover:opacity-100"
                                style={{ height: `${h}%` }}
                            ></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-xs font-bold text-[#5d5b66] dark:text-gray-400">
                    <span>Nov 1</span>
                    <span>Nov 15</span>
                    <span>Dec 1</span>
                </div>
            </div>
        </div>
    );
}
