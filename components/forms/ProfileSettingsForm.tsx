"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuthStore } from "@/store/useAuthStore";
import { TagInput } from "../ui/TagInput";

export function ProfileSettingsForm() {
    const { profile, reloadDashboardData } = useDashboardStore();
    const { user } = useAuthStore();

    // Initialize state with profile data or defaults
    const [formData, setFormData] = useState({
        fullName: profile?.fullName || user?.firstName || "",
        headline: profile?.headline || "",
        bio: profile?.bio || "",
        location: profile?.location || "",
        profileImage: profile?.profileImage || "",
        website: profile?.socials?.website || "",
        twitter: profile?.socials?.twitter || "",
        github: profile?.socials?.github || "",
        linkedin: profile?.socials?.linkedin || "",
        skills: profile?.skills || [],
        interests: profile?.interests || [],
        education: profile?.education || []
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Education Helper
    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { school: "", degree: "", startDate: "", endDate: "" }]
        });
    };

    const updateEducation = (index: number, field: string, value: string) => {
        const newEdu = [...formData.education];
        newEdu[index] = { ...newEdu[index], [field]: value };
        setFormData({ ...formData, education: newEdu });
    };

    const removeEducation = (index: number) => {
        setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const payload = {
                fullName: formData.fullName,
                headline: formData.headline,
                bio: formData.bio,
                location: formData.location,
                profileImage: formData.profileImage,
                skills: formData.skills,
                interests: formData.interests,
                education: formData.education,
                socials: {
                    website: formData.website,
                    twitter: formData.twitter,
                    github: formData.github,
                    linkedin: formData.linkedin,
                }
            };

            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setMessage("Profile updated successfully!");
                await reloadDashboardData();
            } else {
                setMessage("Failed to update profile.");
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {message && (
                <div className={`p-4 rounded-xl text-sm font-bold ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                    {message}
                </div>
            )}

            {/* Basic Details */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#1f1e2a] border-b border-[#1f1e2a]/5 pb-2">Basic Info</h3>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Profile Image URL</label>
                    <input
                        type="text"
                        placeholder="https://..."
                        className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium"
                        value={formData.profileImage}
                        onChange={e => setFormData({ ...formData, profileImage: e.target.value })}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Headline</label>
                        <input
                            type="text"
                            placeholder="e.g. Senior Frontend Engineer"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                            value={formData.headline}
                            onChange={e => setFormData({ ...formData, headline: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Bio</label>
                    <textarea
                        rows={4}
                        placeholder="Tell your story..."
                        className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Location</label>
                        <input
                            type="text"
                            placeholder="e.g. Lagos, Nigeria"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Website</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium"
                            value={formData.website}
                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Skills & Interests */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#1f1e2a] border-b border-[#1f1e2a]/5 pb-2">Skills & Interests</h3>
                <TagInput
                    label="Skill Set"
                    tags={formData.skills}
                    onChange={(tags) => setFormData({ ...formData, skills: tags })}
                    placeholder="Add a skill (e.g. React, Design)..."
                />
                <TagInput
                    label="Interests"
                    tags={formData.interests}
                    onChange={(tags) => setFormData({ ...formData, interests: tags })}
                    placeholder="Add an interest (e.g. AI, Crypto)..."
                />
            </div>

            {/* Education */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1f1e2a]/5 pb-2">
                    <h3 className="text-lg font-bold text-[#1f1e2a]">Education</h3>
                    <button type="button" onClick={addEducation} className="text-sm font-bold text-[#ff4c2b] hover:underline">+ Add School</button>
                </div>

                {formData.education.map((edu, index) => (
                    <div key={index} className="p-4 rounded-xl bg-gray-50 border border-[#1f1e2a]/5 relative group">
                        <button type="button" onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition">Remove</button>
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7d7b8a] mb-1">School / University</label>
                                <input type="text" className="w-full rounded-lg border border-[#1f1e2a]/10 p-2 text-sm font-bold" value={edu.school} onChange={e => updateEducation(index, "school", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7d7b8a] mb-1">Degree</label>
                                <input type="text" className="w-full rounded-lg border border-[#1f1e2a]/10 p-2 text-sm font-bold" value={edu.degree} onChange={e => updateEducation(index, "degree", e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7d7b8a] mb-1">Start Date</label>
                                <input type="text" placeholder="e.g 2020" className="w-full rounded-lg border border-[#1f1e2a]/10 p-2 text-sm" value={edu.startDate || ""} onChange={e => updateEducation(index, "startDate", e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7d7b8a] mb-1">End Date</label>
                                <input type="text" placeholder="e.g 2024" className="w-full rounded-lg border border-[#1f1e2a]/10 p-2 text-sm" value={edu.endDate || ""} onChange={e => updateEducation(index, "endDate", e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
                {formData.education.length === 0 && <p className="text-sm text-gray-400 italic">No education history added.</p>}
            </div>

            {/* Socials */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#1f1e2a] border-b border-[#1f1e2a]/5 pb-2">Social Links</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">GitHub</label>
                        <input
                            type="text"
                            placeholder="username"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium"
                            value={formData.github}
                            onChange={e => setFormData({ ...formData, github: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">Twitter / X</label>
                        <input
                            type="text"
                            placeholder="username"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium"
                            value={formData.twitter}
                            onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">LinkedIn</label>
                        <input
                            type="text"
                            placeholder="username"
                            className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-medium"
                            value={formData.linkedin}
                            onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-[#1f1e2a] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#1f1e2a]/20 hover:bg-[#3d3b4d] transition disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
