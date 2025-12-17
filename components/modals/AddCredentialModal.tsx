"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { toast } from "sonner";

interface AddCredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddCredentialModal({ isOpen, onClose }: AddCredentialModalProps) {
    const { reloadDashboardData } = useDashboardStore();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
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

        if (!formData.metadataUri) {
            toast.error("Please provide a link or upload a proof image.");
            return;
        }

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
                toast.success("Credential added successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to add credential.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setUploading(true);
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
                setFormData(prev => ({ ...prev, metadataUri: data.secure_url }));
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Upload failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
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
                            Credential Proof
                        </label>

                        <div className="space-y-3">
                            {/* Option 1: Link */}
                            <input
                                type="url"
                                placeholder="https://..."
                                className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium"
                                value={formData.metadataUri}
                                onChange={(e) => setFormData({ ...formData, metadataUri: e.target.value })}
                            />

                            <div className="text-center text-xs font-bold text-[#7d7b8a]">OR</div>

                            {/* Option 2: Image Upload */}
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploading}
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-xs file:font-semibold
                                      file:bg-[#fef7f5] file:text-[#ff4c2b]
                                      hover:file:bg-[#ffece8]
                                      disabled:opacity-50"
                                />
                                {uploading && <span className="absolute right-0 top-2 text-xs text-[#ff4c2b] font-bold animate-pulse">Uploading...</span>}
                            </div>

                            {/* Preview if it looks like an image URL */}
                            {formData.metadataUri && (formData.metadataUri.includes('cloudinary') || formData.metadataUri.match(/\.(jpeg|jpg|gif|png)$/) != null) && (
                                <div className="mt-2">
                                    <p className="text-[10px] uppercase font-bold text-[#7d7b8a] mb-1">Preview</p>
                                    <img src={formData.metadataUri} alt="Credential Proof" className="w-full h-32 object-cover rounded-xl border border-[#1f1e2a]/10" />
                                </div>
                            )}
                        </div>
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
