import { useBuilderStore } from "@/store/useBuilderStore";

type WizardModalProps = {
    isOpen: boolean;
    onClose: () => void;
    step: number;
    setStep: (step: number) => void;
    isEditing: boolean;
    onRefresh: () => Promise<void>;
    wizardProfileId: string | null;
    setWizardProfileId: (id: string | null) => void;
};

export const WizardModal = ({
    isOpen,
    onClose,
    step,
    setStep,
    isEditing,
    onRefresh,
    wizardProfileId,
    setWizardProfileId,
}: WizardModalProps) => {
    const {
        profile,
        setProfile,
        // Form state
        profileForm,
        identityForm,
        roleForm,
        milestoneForm,
        // Update actions
        updateProfileForm,
        updateIdentityForm,
        updateRoleForm,
        updateMilestoneForm,
        // Reset actions
        resetIdentityForm,
        resetRoleForm,
        resetMilestoneForm,
        // Loading/Error state
        setLoading,
        setError,
    } = useBuilderStore();

    if (!isOpen) return null;

    // Helper for requests inside the modal
    const handleRequest = async <T,>(
        url: string,
        options: RequestInit,
    ): Promise<{ data?: T; error?: string }> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                headers: { "Content-Type": "application/json" },
                ...options,
            });
            const json = await response.json();
            if (!response.ok) {
                setError(json.error ?? "Something went wrong");
                return { error: json.error };
            }
            return { data: json };
        } catch (err) {
            setError((err as Error).message);
            return { error: (err as Error).message };
        } finally {
            setLoading(false);
        }
    };

    const createOrUpdateProfile = async () => {
        const payload = {
            ...profileForm,
            interests: profileForm.interests
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            skills: profileForm.skills
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
        };

        if (profile || wizardProfileId) {
            const id = wizardProfileId ?? profile?.id;
            const { data } = await handleRequest<any>(`/api/profiles/${id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });
            if (data) {
                setProfile(data);
                setWizardProfileId(data.id);
            }
        } else {
            const { data } = await handleRequest<any>("/api/profiles", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            if (data) {
                setProfile(data);
                setWizardProfileId(data.id);
            }
        }
    };

    const addIdentityHandler = async () => {
        if (!profile && !wizardProfileId) return;
        const { data, error: apiError } = await handleRequest<any>(
            `/api/profiles/${wizardProfileId ?? profile?.id}/identities`,
            {
                method: "POST",
                body: JSON.stringify(identityForm),
            },
        );
        if (data && !apiError) {
            resetIdentityForm();
            await onRefresh();
        }
    };

    const addRoleHandler = async () => {
        if (!profile && !wizardProfileId) return;
        const payload = {
            ...roleForm,
            tags: roleForm.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            links: roleForm.links
                .split(",")
                .map((link) => link.trim())
                .filter(Boolean),
        };
        const { data, error: apiError } = await handleRequest<any>(
            `/api/profiles/${wizardProfileId ?? profile?.id}/roles`,
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
        if (data && !apiError) {
            resetRoleForm();
            await onRefresh();
        }
    };

    const addMilestoneHandler = async () => {
        if (!profile && !wizardProfileId) return;
        const { data, error: apiError } = await handleRequest<any>(
            `/api/profiles/${wizardProfileId ?? profile?.id}/milestones`,
            {
                method: "POST",
                body: JSON.stringify(milestoneForm),
            },
        );
        if (data && !apiError) {
            resetMilestoneForm();
            await onRefresh();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm transition-all duration-300">
            <div className="w-full max-w-2xl transform rounded-[2rem] bg-white p-8 shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-[#ff4c2b] font-bold">
                            {isEditing ? "Edit Portfolio" : "Create Portfolio"}
                        </p>
                        <h3 className="mt-1 text-3xl font-bold text-[#1f1e2a]">Step {step} of 4</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-gray-100 p-2 text-[#5d5b66] hover:bg-gray-200 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <label className="block text-sm font-medium text-[#1f1e2a] mb-1">Full Name</label>
                            <input
                                className="w-full rounded-xl border border-[#1f1e2a]/15 px-4 py-3 bg-white text-[#1f1e2a] placeholder:text-gray-400 focus:border-[#ff4c2b] focus:ring-1 focus:ring-[#ff4c2b] focus:outline-none transition-all"
                                placeholder="e.g. Alex Johnson"
                                value={profileForm.name}
                                onChange={(e) => updateProfileForm({ name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1f1e2a] mb-1">Email Address</label>
                            <input
                                className="w-full rounded-xl border border-[#1f1e2a]/15 px-4 py-3 bg-white text-[#1f1e2a] placeholder:text-gray-400 focus:border-[#ff4c2b] focus:ring-1 focus:ring-[#ff4c2b] focus:outline-none transition-all"
                                placeholder="e.g. alex@example.com"
                                value={profileForm.email}
                                onChange={(e) => updateProfileForm({ email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1f1e2a] mb-1">Bio</label>
                            <textarea
                                className="w-full rounded-xl border border-[#1f1e2a]/15 px-4 py-3 bg-white text-[#1f1e2a] placeholder:text-gray-400 focus:border-[#ff4c2b] focus:ring-1 focus:ring-[#ff4c2b] focus:outline-none transition-all"
                                rows={3}
                                placeholder="Tell your story in a few sentences..."
                                value={profileForm.bio}
                                onChange={(e) => updateProfileForm({ bio: e.target.value })}
                            />
                        </div>
                        <button
                            className="mt-6 w-full rounded-full bg-[#ff4c2b] py-3.5 text-base font-bold text-white shadow-lg shadow-[#ff4c2b]/25 transition hover:bg-[#e64426] active:scale-[0.98]"
                            onClick={async () => {
                                await createOrUpdateProfile();
                                setStep(2);
                            }}
                        >
                            Continue to identities
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <label className="block text-sm font-medium text-[#1f1e2a] mb-1">Skill Identity</label>
                            <input
                                className="w-full rounded-xl border border-[#1f1e2a]/15 px-4 py-3 bg-white text-[#1f1e2a] placeholder:text-gray-400 focus:border-[#ff4c2b] focus:ring-1 focus:ring-[#ff4c2b] focus:outline-none transition-all"
                                placeholder="e.g. Frontend Developer, Researcher"
                                value={identityForm.label}
                                onChange={(e) => updateIdentityForm({ label: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1f1e2a] mb-1">Description (Optional)</label>
                            <input
                                className="w-full rounded-xl border border-[#1f1e2a]/15 px-4 py-3 bg-white text-[#1f1e2a] placeholder:text-gray-400 focus:border-[#ff4c2b] focus:ring-1 focus:ring-[#ff4c2b] focus:outline-none transition-all"
                                placeholder="Short tagline for this hat..."
                                value={identityForm.description}
                                onChange={(e) =>
                                    updateIdentityForm({ description: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                className="flex-1 rounded-full border border-[#1f1e2a]/10 py-3.5 text-sm font-semibold text-[#5d5b66] hover:bg-gray-50 transition-colors"
                                onClick={() => setStep(3)}
                            >
                                Skip
                            </button>
                            <button
                                className="flex-[2] rounded-full bg-[#ff4c2b] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff4c2b]/25 transition hover:bg-[#e64426] active:scale-[0.98]"
                                onClick={async () => {
                                    await addIdentityHandler();
                                    setStep(3);
                                }}
                            >
                                Save Identity & Continue
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <label className="block text-sm font-medium text-[#1f1e2a] mb-1">Role / Project Title</label>
                            <input
                                className="w-full rounded-xl border border-[#1f1e2a]/15 px-4 py-3 bg-white text-[#1f1e2a] placeholder:text-gray-400 focus:border-[#ff4c2b] focus:ring-1 focus:ring-[#ff4c2b] focus:outline-none transition-all"
                                placeholder="e.g. Lead Engineer, Hackathon Winner"
                                value={roleForm.title}
                                onChange={(e) => updateRoleForm({ title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1f1e2a] mb-1">Organization / Context</label>
                            <input
                                className="w-full rounded-xl border border-[#1f1e2a]/15 px-4 py-3 bg-white text-[#1f1e2a] placeholder:text-gray-400 focus:border-[#ff4c2b] focus:ring-1 focus:ring-[#ff4c2b] focus:outline-none transition-all"
                                placeholder="e.g. Google, EthGlobal"
                                value={roleForm.organization}
                                onChange={(e) =>
                                    updateRoleForm({ organization: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1f1e2a] mb-1">Description</label>
                            <textarea
                                className="w-full rounded-xl border border-[#1f1e2a]/15 px-4 py-3 bg-white text-[#1f1e2a] placeholder:text-gray-400 focus:border-[#ff4c2b] focus:ring-1 focus:ring-[#ff4c2b] focus:outline-none transition-all"
                                rows={3}
                                placeholder="What did you build? What was the impact?"
                                value={roleForm.description}
                                onChange={(e) =>
                                    updateRoleForm({ description: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                className="flex-1 rounded-full border border-[#1f1e2a]/10 py-3.5 text-sm font-semibold text-[#5d5b66] hover:bg-gray-50 transition-colors"
                                onClick={() => setStep(4)}
                            >
                                Skip
                            </button>
                            <button
                                className="flex-[2] rounded-full bg-[#ff4c2b] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff4c2b]/25 transition hover:bg-[#e64426] active:scale-[0.98]"
                                onClick={async () => {
                                    await addRoleHandler();
                                    setStep(4);
                                }}
                            >
                                Save Role & Continue
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <label className="block text-sm font-medium text-[#1f1e2a] mb-1">Milestone Title</label>
                            <input
                                className="w-full rounded-xl border border-[#1f1e2a]/15 px-4 py-3 bg-white text-[#1f1e2a] placeholder:text-gray-400 focus:border-[#ff4c2b] focus:ring-1 focus:ring-[#ff4c2b] focus:outline-none transition-all"
                                placeholder="e.g. Launched v1, Raised Seed Round"
                                value={milestoneForm.title}
                                onChange={(e) =>
                                    updateMilestoneForm({ title: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#1f1e2a] mb-1">Description</label>
                            <textarea
                                className="w-full rounded-xl border border-[#1f1e2a]/15 px-4 py-3 bg-white text-[#1f1e2a] placeholder:text-gray-400 focus:border-[#ff4c2b] focus:ring-1 focus:ring-[#ff4c2b] focus:outline-none transition-all"
                                rows={3}
                                placeholder="Details about this win..."
                                value={milestoneForm.description}
                                onChange={(e) =>
                                    updateMilestoneForm({ description: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                className="flex-1 rounded-full border border-[#1f1e2a]/10 py-3.5 text-sm font-semibold text-[#5d5b66] hover:bg-gray-50 transition-colors"
                                onClick={() => {
                                    onClose();
                                    onRefresh();
                                }}
                            >
                                Skip
                            </button>
                            <button
                                className="flex-[2] rounded-full bg-[#ff4c2b] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ff4c2b]/25 transition hover:bg-[#e64426] active:scale-[0.98]"
                                onClick={async () => {
                                    await addMilestoneHandler();
                                    onClose();
                                    await onRefresh();
                                }}
                            >
                                Finish & View Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
