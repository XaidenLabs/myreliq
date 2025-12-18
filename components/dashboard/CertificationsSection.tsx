"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { AddCredentialModal } from "@/components/modals/AddCredentialModal";
import { Credential } from "@/lib/types";

export function CertificationsSection({ onAddOverride }: { onAddOverride?: () => void }) {
    const { credentials, reloadDashboardData } = useDashboardStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleAdd = () => {
        if (onAddOverride) {
            onAddOverride();
        } else {
            setIsAddModalOpen(true);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this certification?")) return;
        setLoadingId(id);

        try {
            const res = await fetch(`/api/credentials?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                await reloadDashboardData();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#1f1e2a]">Certifications</h2>
                    <p className="text-sm text-[#7d7b8a] mt-1">
                        Manage your professional certifications and credentials
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="rounded-xl bg-[#ff4c2b] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#ff4c2b]/20 transition hover:bg-[#e64426]"
                >
                    + Add Certification
                </button>
            </div>

            {/* Certifications Grid */}
            {credentials && credentials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {credentials.map((credential) => (
                        <div
                            key={credential.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#1f1e2a]/5 hover:shadow-md transition group"
                        >
                            {/* Certificate Image Placeholder */}
                            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#ff4c2b]/10 to-[#ff6b4a]/10" />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-20 w-20 text-gray-300 relative z-10"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                            </div>

                            {/* Certificate Info */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-lg text-[#1f1e2a] flex-1 line-clamp-2">
                                        {credential.title}
                                    </h3>
                                    <span
                                        className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${credential.status === "minted"
                                            ? "bg-green-100 text-green-700"
                                            : credential.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {credential.status}
                                    </span>
                                </div>

                                {credential.description && (
                                    <p className="text-sm text-[#7d7b8a] mb-4 line-clamp-2">
                                        {credential.description}
                                    </p>
                                )}

                                {credential.mintAddress && (
                                    <div className="mb-4 p-2 bg-[#fef7f5] rounded-lg">
                                        <p className="text-xs font-bold text-[#7d7b8a] mb-1">On-Chain</p>
                                        <code className="text-xs text-[#ff4c2b] font-mono break-all">
                                            {credential.mintAddress.slice(0, 8)}...{credential.mintAddress.slice(-8)}
                                        </code>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    {credential.metadataUri && (
                                        <a
                                            href={credential.metadataUri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center px-3 py-2 bg-[#fef7f5] text-[#ff4c2b] rounded-lg text-sm font-bold hover:bg-[#ff4c2b] hover:text-white transition"
                                        >
                                            View
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDelete(credential.id)}
                                        disabled={loadingId === credential.id}
                                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-red-100 hover:text-red-600 transition disabled:opacity-50"
                                    >
                                        {loadingId === credential.id ? "..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-[#1f1e2a]/10">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-[#ff4c2b]/30 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                    </svg>
                    <h3 className="text-xl font-bold text-[#1f1e2a] mb-2">No Certifications Yet</h3>
                    <p className="text-[#7d7b8a] mb-6">
                        Add your professional certifications to showcase your credentials
                    </p>
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#ff4c2b] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#ff4c2b]/20 transition hover:bg-[#e64426]"
                    >
                        + Add Your First Certification
                    </button>
                </div>
            )}

            {/* Add Credential Modal */}
            <AddCredentialModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </section>
    );
}
