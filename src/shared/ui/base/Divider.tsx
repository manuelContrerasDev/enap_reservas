import React from "react";
import { cn } from "@/shared/utils/cn";

interface DividerProps {
  className?: string;
}

export default function Divider({ className }: DividerProps) {
  return (
    <hr
      className={cn(
        "my-4 border-t border-enap-muted/30",
        className
      )}
    />
  );
}
