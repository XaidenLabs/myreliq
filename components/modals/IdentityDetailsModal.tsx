"use client";

import { Identity } from "@/lib/types";
import { IconVerified } from "@/components/icons";

interface IdentityDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    identity: Identity | null;
}

export function IdentityDetailsModal({ isOpen, onClose, identity }: IdentityDetailsModalProps) {
    if (!isOpen || !identity) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-all">
            <div className="w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Hero Image */}
                <div className="h-64 w-full relative">
                    {identity.profileImage ? (
                        <img src={identity.profileImage} alt={identity.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-6xl font-bold text-gray-300">{identity.name.charAt(0)}</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                        <div className="flex items-center gap-2">
                            <h2 className="text-3xl font-bold text-white">{identity.name}</h2>
                            {identity.mintAddress && <IconVerified className="h-6 w-6 text-green-400" />}
                        </div>
                        <p className="text-white/80 font-medium text-sm mt-1">
                            {identity.slug ? `@${identity.slug}` : ""}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Description</h3>
                        <p className="text-[#1f1e2a] leading-relaxed">
                            {identity.description || "No description provided."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Status</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${identity.isPrimary ? "bg-[#ff4c2b]/10 text-[#ff4c2b]" : "bg-gray-100 text-gray-500"}`}>
                                {identity.isPrimary ? "Primary Identity" : "Secondary Identity"}
                            </span>
                        </div>
                        {identity.mintAddress && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Blockchain</h3>
                                <a
                                    href={`https://solscan.io/token/${identity.mintAddress}?cluster=devnet`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold text-[#ff4c2b] hover:underline break-all"
                                >
                                    View on Solscan ↗
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-[#fef7f5] p-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#1f1e2a] hover:bg-gray-50 transition"
                    >
                        Close
                    </button>
                    {/* Could add Edit button here too if we passed the handler */}
                </div>
            </div>
        </div>
    );
}
