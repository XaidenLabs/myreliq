"use client";

import { useState, KeyboardEvent } from "react";
import { IconBolt } from "@/components/icons";

interface TagInputProps {
    label: string;
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export function TagInput({ label, tags, onChange, placeholder = "Type and press Enter..." }: TagInputProps) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const trimmed = input.trim();
            if (trimmed && !tags.includes(trimmed)) {
                onChange([...tags, trimmed]);
                setInput("");
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7d7b8a] mb-2">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-[#fef7f5] border border-[#1f1e2a]/10 px-2 py-1 text-sm font-bold text-[#1f1e2a]">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-[#ff4c2b] hover:text-[#d93f23] ml-1">
                            ×
                        </button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className="w-full rounded-xl border border-[#1f1e2a]/10 bg-[#fef7f5] px-4 py-3 font-semibold text-[#1f1e2a] focus:border-[#ff4c2b] focus:outline-none focus:ring-1 focus:ring-[#ff4c2b]"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}
