"use client";

import { IconStar } from "@/components/icons";

interface StarRatingProps {
    rating: number; // 0 to 10
    onChange?: (rating: number) => void;
    readonly?: boolean;
}

export function StarRating({ rating, onChange, readonly = false }: StarRatingProps) {
    const stars = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div className="flex items-center gap-1">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange && onChange(star)}
                    className={`transition-all ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
                >
                    <IconStar
                        className={`h-6 w-6 transition-colors ${star <= rating
                            ? "text-[#ff4c2b]"
                            : "text-gray-300"
                            }`}
                    />
                </button>
            ))}
        </div>
    );
}
