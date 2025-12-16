"use client";

import { ProfileSettingsForm } from "../forms/ProfileSettingsForm";

interface ProfileOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileOnboardingModal({ isOpen, onClose }: ProfileOnboardingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white dark:bg-[#1f1e2a] rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar relative">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#1f1e2a] dark:text-white mb-2">Welcome to MyReliq! 🎉</h2>
                    <p className="text-[#5d5b66] dark:text-gray-300">
                        Let's set up your profile so people know who you are.
                        <br />
                        <span className="text-sm font-bold text-[#ff4c2b]">Please add a profile photo and your full name to continue.</span>
                    </p>
                </div>

                <ProfileSettingsForm onSuccess={onClose} />
            </div>
        </div>
    );
}
