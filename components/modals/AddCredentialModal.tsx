"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

interface AddCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCredentialModal({ isOpen, onClose }: AddCredentialModalProps) {
    const { reloadDashboardData } = useDashboardStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        organizationId: "", // Just used as Issuer Name for now
        description: "",
        metadataUri: "", // Used as Link/URL for MVP
        mintAddress: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/credentials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                await reloadDashboardData();
                onClose();
                setFormData({ title: "", organizationId: "", description: "", metadataUri: "", mintAddress: "" });
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
                <h2 className="text-2xl font-bold text-[#1f1e2a] mb-6">Add Credential / Certification</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. AWS Solutions Architect"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Issuer / Organization
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Amazon Web Services"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium"
                            value={formData.organizationId}
                            onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Credential Link / Proof URL
                        </label>
                        <input
                            type="url"
                            required
                            placeholder="https://..."
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium"
                            value={formData.metadataUri}
                            onChange={(e) => setFormData({ ...formData, metadataUri: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            rows={3}
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
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
                            {loading ? "Adding..." : "Add Credential"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
