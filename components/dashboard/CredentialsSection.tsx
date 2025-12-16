"use client";

import { Credential } from "@/lib/types";
import { IconBolt } from "@/components/icons";

export const CredentialsSection = ({
    credentials,
    onAddCredential
}: {
    credentials: Credential[],
    onAddCredential: () => void
}) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 rounded-[2rem] bg-white dark:bg-transparent border border-[#1f1e2a]/5 dark:border-white/5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-[#1f1e2a] dark:text-white">Certifications & Credentials</h3>
                        <p className="text-sm text-[#5d5b66] dark:text-gray-400 mt-1">Verified achievements and awards.</p>
                    </div>
                    <button
                        onClick={onAddCredential}
                        className="flex items-center gap-2 rounded-xl bg-[#1f1e2a] dark:bg-white px-4 py-2.5 text-sm font-bold text-white dark:text-[#1f1e2a] shadow-lg shadow-[#1f1e2a]/20 hover:bg-[#3d3b4d] dark:hover:bg-gray-200 transition"
                    >
                        <span>+ Add Credential</span>
                    </button>
                </div>

                {credentials.length === 0 ? (
                    <div className="text-center py-12 bg-[#fef7f5] dark:bg-[#1f1e2a] rounded-3xl border border-dashed border-[#ff4c2b]/20">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ff4c2b]/10 text-[#ff4c2b] mb-4">
                            <IconBolt className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1f1e2a] dark:text-white">No Credentials Yet</h3>
                        <p className="text-sm text-[#5d5b66] dark:text-gray-400 max-w-xs mx-auto mt-2 mb-6">
                            Add your certifications, degrees, or awards to build trust.
                        </p>
                        <button
                            onClick={onAddCredential}
                            className="text-sm font-bold text-[#ff4c2b] hover:bg-[#ffece8] dark:hover:bg-[#ffece8]/10 px-4 py-2 rounded-lg transition"
                        >
                            + Add Manually
                        </button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {credentials.map(cred => (
                            <div key={cred.id} className="p-5 rounded-2xl bg-white dark:bg-[#1f1e2a] border border-[#1f1e2a]/5 dark:border-white/10 hover:shadow-md transition group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition">
                                    <IconBolt className="h-12 w-12 text-[#1f1e2a] dark:text-white" />
                                </div>
                                <div className="relative">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#7d7b8a] dark:text-gray-400 mb-2">{cred.organizationId || "Self-Issued"}</p>
                                    <h4 className="text-lg font-bold text-[#1f1e2a] dark:text-white leading-tight mb-2">{cred.title}</h4>
                                    {cred.description && <p className="text-xs text-[#5d5b66] dark:text-gray-400 line-clamp-2 mb-4">{cred.description}</p>}

                                    <a href={cred.metadataUri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-[#ff4c2b] hover:underline">
                                        View Proof ↗
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
