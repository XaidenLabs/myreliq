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
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#1f1e2a] mb-2">Welcome to MyReliq! 🎉</h2>
                    <p className="text-[#5d5b66]">
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
