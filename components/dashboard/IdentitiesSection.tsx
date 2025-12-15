"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { CreateIdentityModal } from "@/components/modals/CreateIdentityModal";
import { IdentityDetailsModal } from "@/components/modals/IdentityDetailsModal";
import { Identity } from "@/lib/types";
import { IconVerified } from "@/components/icons";

export function IdentitiesSection() {
    const { identities, reloadDashboardData } = useDashboardStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [identityToEdit, setIdentityToEdit] = useState<Identity | null>(null);
    const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleEdit = (identity: Identity) => {
        setIdentityToEdit(identity);
        setIsCreateModalOpen(true);
    };

    const handleCreate = () => {
        setIdentityToEdit(null);
        setIsCreateModalOpen(true);
    };

    const handleViewDetails = (identity: Identity) => {
        setSelectedIdentity(identity);
        setIsDetailsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this identity?")) return;
        setLoadingId(id);

        try {
            const res = await fetch(`/api/identities?id=${id}`, {
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
        <section className="bg-[#fef7f5] rounded-[2.5rem] p-8 md:p-12 min-h-[600px]">
            <h2 className="text-3xl font-bold text-[#1f1e2a] mb-2">My Identities</h2>
            <p className="text-lg font-medium text-[#1f1e2a] mb-12">Varying Versions of You</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 auto-rows-fr">
                {/* Existing Identities */}
                {identities.map((identity) => (
                    <IdentityCard
                        key={identity.id}
                        identity={identity}
                        onEdit={() => handleEdit(identity)}
                        onDelete={() => handleDelete(identity.id)}
                        onClick={() => handleViewDetails(identity)}
                        loading={loadingId === identity.id}
                    />
                ))}

                {/* Add New Identity Card */}
                <button
                    onClick={handleCreate}
                    className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-[#b0b0bb] rounded-[2.5rem] aspect-[3/4] w-full hover:border-[#ff4c2b] hover:bg-[#ff4c2b]/5 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                    <div className="w-20 h-20 rounded-full bg-[#fef7f5] flex items-center justify-center mb-6 group-hover:bg-[#ff4c2b] transition-all duration-300 shadow-inner group-hover:shadow-lg group-hover:shadow-[#ff4c2b]/30">
                        <span className="text-4xl text-[#ff4c2b] font-light group-hover:text-white transition-colors duration-300">+</span>
                    </div>
                    <span className="text-[#1f1e2a] font-bold text-lg group-hover:text-[#ff4c2b] transition-colors">
                        Add New Identity
                    </span>
                    <span className="text-[#7d7b8a] text-sm mt-2 text-center max-w-[80%] group-hover:text-[#ff4c2b]/70 transition-colors">
                        Create a new persona for your portfolio
                    </span>
                </button>
            </div>

            <CreateIdentityModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                identityToEdit={identityToEdit}
            />

            <IdentityDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                identity={selectedIdentity}
            />
        </section>
    );
}

function IdentityCard({ identity, onDelete, onEdit, onClick, loading }: { identity: Identity; onDelete: () => void; onEdit: () => void; onClick: () => void; loading: boolean }) {
    return (
        <div
            onClick={onClick}
            className="group relative rounded-[2.5rem] overflow-hidden cursor-pointer w-full aspect-[3/4] transition-all duration-500 hover:-translate-y-2"
        >
            {/* Main Container with Border & Shadow */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-white border border-white/20 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#ff4c2b]/20 transition-all duration-500 overflow-hidden z-0">
                {/* Full Background Image */}
                <div className="absolute inset-0">
                    {identity.profileImage ? (
                        <img
                            src={identity.profileImage}
                            alt={identity.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#fef7f5] to-[#ebd7d2] flex items-center justify-center">
                            <span className="text-9xl font-black text-[#1f1e2a]/5 select-none">{identity.name.charAt(0)}</span>
                        </div>
                    )}
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f1e2a] via-transparent to-transparent opacity-80 z-10" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 z-10" />

                {/* Top Actions (Edit/Delete) - Always visible on mobile, hover on desktop */}
                <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        disabled={loading}
                        className="p-2.5 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/90 hover:text-[#1f1e2a] transition-all border border-white/20"
                        title="Edit Identity"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        disabled={loading}
                        className="p-2.5 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-all border border-white/20"
                        title="Delete Identity"
                    >
                        {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            {/* Badge pill for context */}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white border border-white/10">
                                Identity
                            </span>
                            {identity.mintAddress && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#22c55e]/20 backdrop-blur-sm text-[#4ade80] border border-[#22c55e]/30">
                                    <IconVerified className="h-3 w-3" /> Minted
                                </span>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-[#ff4c2b] transition-colors">
                            {identity.name}
                        </h3>

                        <p className="text-white/70 text-sm font-medium line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {identity.description || "No description provided."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
