
"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface GenerateInsightButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export default function GenerateInsightButton({ onClick, disabled }: GenerateInsightButtonProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className="gap-2"
        >
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">Generate AI Insight</span>
        </Button>
    );
}
