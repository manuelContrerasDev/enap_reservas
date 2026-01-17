// src/components/ui/feedback/Spinner.tsx
import React from "react";
import { cn } from "@/shared/utils/cn";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export default function Spinner({ size = 32, className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-full border-4 border-cian-200 border-t-cian-600 animate-spin",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
