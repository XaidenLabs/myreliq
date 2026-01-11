"use client";

import { useState, useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Identity, WorkMode, Role } from "@/lib/types";
import { TagInput } from "../ui/TagInput";
import { format } from "date-fns";

interface CreateRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    identities: Identity[];
    roleToEdit?: Role;
}

export function CreateRoleModal({ isOpen, onClose, identities, roleToEdit }: CreateRoleModalProps) {
    const { reloadDashboardData } = useDashboardStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        identityId: "",
        title: "",
        organization: "",
        workMode: "remote" as WorkMode,
        startDate: "",
        endDate: "",
        description: "",
        tags: [] as string[],
    });

    const resetForm = () => {
        setFormData({
            identityId: identities[0]?.id || "",
            title: "",
            organization: "",
            workMode: "remote",
            startDate: "",
            endDate: "",
            description: "",
            tags: [],
        });
    }

    // Initialize form when modal opens or roleToEdit changes
    useEffect(() => {
        if (isOpen) {
            if (roleToEdit) {
                setFormData({
                    identityId: roleToEdit.identityId,
                    title: roleToEdit.title,
                    organization: roleToEdit.organization,
                    workMode: (roleToEdit.workMode as WorkMode) || "remote",
                    // Ensure dates are formatted as YYYY-MM-DD for input[type=date]
                    startDate: roleToEdit.startDate ? new Date(roleToEdit.startDate).toISOString().split('T')[0] : "",
                    endDate: roleToEdit.endDate ? new Date(roleToEdit.endDate).toISOString().split('T')[0] : "",
                    description: roleToEdit.description || "",
                    tags: roleToEdit.tags || [],
                });
            } else {
                if (identities.length > 0 && !formData.identityId) {
                    // Only set default if not editing. 
                    // Wait, if I close and reopen "Add", it should reset.
                    // The parent might not unmount this component.
                    // I should reset if !roleToEdit
                    setFormData(prev => ({ ...prev, identityId: identities[0].id }));
                }
            }
        } else {
            // Optional: reset when closed to avoid flashing old data on reopen?
            // Better handled by parent resetting roleToEdit, but safety clear is good.
            // However, simple state reset when opening as new might be better.
        }
    }, [isOpen, identities, roleToEdit]);

    // Safety check for reset on "New" mode
    useEffect(() => {
        if (isOpen && !roleToEdit) {
            // If we open in "Add" mode, make sure we aren't showing stale edit data?
            // Actually, useEffect above handles setting data on roleToEdit change.
            // If roleToEdit becomes undefined (add mode), we should probably reset.
            resetForm();
            if (identities.length > 0) setFormData(prev => ({ ...prev, identityId: identities[0].id }));
        }
    }, [isOpen, roleToEdit]);


    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Clean payload
            const payload = {
                ...formData,
                endDate: formData.endDate || null,
            };

            let res;
            if (roleToEdit) {
                // UPDATE
                res = await fetch(`/api/roles/${roleToEdit.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                // CREATE
                res = await fetch("/api/roles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (res.ok) {
                await reloadDashboardData();
                onClose();
                resetForm();
            } else {
                console.error("Failed to save role");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-[#1f1e2a] mb-6">
                    {roleToEdit ? "Edit Experience Role" : "Add Experience Role"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                                Identity Profile
                            </label>
                            <select
                                required
                                className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                                value={formData.identityId}
                                onChange={(e) => setFormData({ ...formData, identityId: e.target.value })}
                            >
                                <option value="" disabled>Select Identity</option>
                                {identities.map(i => (
                                    <option key={i.id} value={i.id}>{i.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                                Work Mode
                            </label>
                            <select
                                required
                                className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                                value={formData.workMode}
                                onChange={(e) => setFormData({ ...formData, workMode: e.target.value as WorkMode })}
                            >
                                <option value="remote">Remote</option>
                                <option value="on-site">On-site</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Role Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Senior Frontend Engineer"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Organization / Company
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Acme Corp"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Start Date</label>
                            <input type="date" required className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">End Date (Optional)</label>
                            <input type="date" className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <TagInput
                            label="Tags / Skills Used"
                            tags={formData.tags}
                            onChange={(tags) => setFormData({ ...formData, tags })}
                            placeholder="e.g. Figma, Next.js, Team Leadership..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe your responsibilities and impact..."
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
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
                            {loading ? "Saving..." : (roleToEdit ? "Update Role" : "Save Role")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
