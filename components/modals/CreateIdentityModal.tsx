"use client";

import { useState, useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

import { Identity } from "@/lib/types";
import { IconBolt } from "@/components/icons";
import { toast } from "sonner";

interface CreateIdentityModalProps {
    isOpen: boolean;
    onClose: () => void;
    identityToEdit?: Identity | null;
}

export function CreateIdentityModal({ isOpen, onClose, identityToEdit }: CreateIdentityModalProps) {
    const { profile, reloadDashboardData } = useDashboardStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        profileImage: "",
    });

    useEffect(() => {
        if (isOpen) {
            if (identityToEdit) {
                setFormData({
                    name: identityToEdit.name,
                    description: identityToEdit.description || "",
                    profileImage: identityToEdit.profileImage || profile?.profileImage || "",
                });
            } else if (profile?.profileImage) {
                // Reset for create mode, but keep profile image default
                setFormData({
                    name: "",
                    description: "",
                    profileImage: profile.profileImage!,
                });
            } else {
                setFormData({ name: "", description: "", profileImage: "" });
            }
        }
    }, [isOpen, identityToEdit, profile?.profileImage]);

    if (!isOpen) return null;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }

            setLoading(true);
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            uploadFormData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "myreliq_unsigned");

            try {
                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: "POST",
                        body: uploadFormData,
                    }
                );
                const data = await res.json();
                if (data.secure_url) {
                    setFormData(prev => ({ ...prev, profileImage: data.secure_url }));
                    toast.success("Image uploaded successfully");
                } else {
                    console.error("Cloudinary Upload Error:", data);
                    toast.error(`Upload failed: ${data.error?.message || "Unknown error"}`);
                }
            } catch (err) {
                console.error(err);
                toast.error("Error uploading image");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = identityToEdit ? "/api/identities" : "/api/identities";
            const method = identityToEdit ? "PUT" : "POST";
            const body = identityToEdit
                ? { ...formData, id: identityToEdit.id }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                await reloadDashboardData();
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                <h2 className="text-2xl font-bold text-[#1f1e2a] mb-2">
                    {identityToEdit ? "Edit Identity" : "Create New Identity"}
                </h2>
                <p className="text-sm text-[#5d5b66] mb-8">Defines a persona (e.g., "Full Stack Dev").</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#1f1e2a]/10 bg-gray-100">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Identity" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                                <span className="text-xs font-bold">Change</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Identity Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Product Designer"
                            className="w-full rounded-2xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">
                            Short Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Briefly describe this professional persona..."
                            className="w-full rounded-2xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
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
                            {loading ? "Saving..." : (identityToEdit ? "Save Changes" : "Create Identity")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
