"use client";

import { useState, useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Role } from "@/lib/types";

interface AddMilestoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    roles: Role[];
    preselectedRoleId?: string;
}

export function AddMilestoneModal({ isOpen, onClose, roles, preselectedRoleId }: AddMilestoneModalProps) {
    const { reloadDashboardData } = useDashboardStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        roleId: preselectedRoleId || roles[0]?.id || "",
        title: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
        metrics: "",
        mediaUrl: ""
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                roleId: preselectedRoleId || (roles.length > 0 && !prev.roleId ? roles[0].id : prev.roleId) || ""
            }));
        }
    }, [isOpen, preselectedRoleId, roles]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                roleId: formData.roleId,
                title: formData.title,
                description: formData.description,
                achievedAt: formData.date, // Schema expects achievedAt
                metricValue: formData.metrics, // Schema expects metricValue
                metricLabel: formData.metrics ? "KPI" : undefined,
                mediaUrl: formData.mediaUrl
            };

            const res = await fetch("/api/milestones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                await reloadDashboardData();
                onClose();
                // Reset form...
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                <h2 className="text-2xl font-bold text-[#1f1e2a] mb-6">Add Milestone</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Related Role
                        </label>
                        <select
                            required
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                            value={formData.roleId}
                            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                        >
                            <option value="" disabled>Select Role</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>{r.title} at {r.organization}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Milestone Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Launched Mobile App"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            required
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Media URL (Optional)
                        </label>
                        <input
                            type="url"
                            placeholder="https://... (Image or Video)"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium"
                            value={formData.mediaUrl}
                            onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Proof / Metrics (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Increased conversion by 20%"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium text-[#1f1e2a]"
                            value={formData.metrics}
                            onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="What specifically did you achieve?"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-sm font-bold text-[#5d5b66] hover:bg-gray-100 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-[#ff4c2b] px-6 py-2 text-sm font-bold text-white shadow-lg shadow-[#ff4c2b]/20 hover:bg-[#e64426] transition disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add Milestone"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
