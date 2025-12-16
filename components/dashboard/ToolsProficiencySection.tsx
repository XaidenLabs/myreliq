"use client";

import { useState } from "react";
import { StarRating } from "../ui/StarRating";
import { useDashboardStore } from "@/store/useDashboardStore";

export function ToolsProficiencySection() {
    const { profile, reloadDashboardData } = useDashboardStore();
    const [newTool, setNewTool] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleAddTool = async () => {
        if (!newTool.trim() || newRating === 0) return;
        setLoading(true);

        try {
            // Simplified update: we just send the whole updated tools array
            // Ideally should be an atomic push, but this works with existing simple profile PUT
            const currentTools = profile?.tools || [];
            const updatedTools = [...currentTools, { name: newTool, proficiency: newRating }];

            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tools: updatedTools }),
            });

            if (res.ok) {
                await reloadDashboardData();
                setNewTool("");
                setNewRating(0);
            }
        } catch (error) {
            console.error("Failed to add tool", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTool = async (index: number) => {
        if (!profile?.tools) return;
        const updatedTools = profile.tools.filter((_, i) => i !== index);

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tools: updatedTools }),
            });
            if (res.ok) {
                await reloadDashboardData();
            }
        } catch (error) {
            console.error("Failed to remove tool", error);
        }
    };

    const handleUpdateTool = async (index: number, newRating: number) => {
        if (!profile?.tools) return;
        const currentTools = [...profile.tools];
        currentTools[index] = { ...currentTools[index], proficiency: newRating };

        try {
            // Optimistic update could happen here locally first if we wanted
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tools: currentTools }),
            });

            if (res.ok) {
                await reloadDashboardData();
            }
        } catch (error) {
            console.error("Failed to update tool", error);
        }
    };

    return (
        <section className="bg-[#fef7f5] dark:bg-transparent rounded-[2.5rem] p-8 md:p-12 min-h-[600px]">
            <h2 className="text-3xl font-bold text-[#1f1e2a] dark:text-white mb-12">My Details</h2>

            {/* Tools Header */}
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-[#1f1e2a] dark:text-white flex items-center gap-2">
                    Tools & Proficiency
                </h3>
                {/* Visual cue that hitting Enter or rating adds it? Or just inline form */}
                {/* Design implies + Tools just adds inputs, but let's make it an inline form */}
                <button
                    onClick={handleAddTool}
                    disabled={!newTool || newRating === 0 || loading}
                    className="text-sm font-bold text-[#ff4c2b] hover:underline disabled:opacity-50"
                >
                    + Tools
                </button>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-2 gap-8 mb-4 px-4 text-[10px] font-bold uppercase tracking-wider text-[#7d7b8a] dark:text-gray-400">
                <div>Tool</div>
                <div>Rate Your Proficiency ( Scale of 1 to 10 )</div>
            </div>

            {/* Existing Tools List */}
            <div className="space-y-4 mb-4">
                {profile?.tools?.map((tool, index) => (
                    <div key={index} className="grid grid-cols-2 gap-8 items-center bg-white dark:bg-[#1f1e2a] p-4 rounded-xl border border-[#1f1e2a]/5 dark:border-white/10 group relative hover:shadow-md transition-shadow">
                        <span className="font-bold text-[#1f1e2a] dark:text-white">{tool.name}</span>
                        <div className="flex items-center justify-between">
                            <StarRating
                                rating={tool.proficiency}
                                onChange={(rating) => handleUpdateTool(index, rating)}
                            />
                        </div>
                        <button
                            onClick={() => handleRemoveTool(index)}
                            className="absolute -right-2 -top-2 bg-[#ff4c2b] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md transform scale-0 group-hover:scale-100 transition-transform"
                            title="Remove tool"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Add New Tool Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
                <input
                    type="text"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTool()}
                    placeholder="e.g. React, Figma, Python..."
                    className="w-full h-12 rounded-full bg-[#e5e7eb] dark:bg-[#2a2935] px-6 font-bold text-[#1f1e2a] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff4c2b]/20"
                />

                <div className="flex items-center gap-4">
                    <StarRating rating={newRating} onChange={setNewRating} />
                    <button
                        onClick={handleAddTool}
                        disabled={!newTool || newRating === 0 || loading}
                        className="h-10 px-6 rounded-full bg-[#ff4c2b] text-white text-sm font-bold shadow-lg shadow-[#ff4c2b]/20 disabled:opacity-50 hover:bg-[#e64426] transition"
                    >
                        Add
                    </button>
                    {loading && <span className="text-xs text-[#ff4c2b] animate-pulse">Saving...</span>}
                </div>
            </div>

            {(!newTool && (!profile?.tools || profile.tools.length === 0)) && (
                <p className="mt-8 text-sm text-gray-400 italic">Add your favorite tools (e.g. Figma, React, Python) and rate your skills.</p>
            )}
        </section>
    );
}
