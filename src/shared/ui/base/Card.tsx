import React from "react";
import { cn } from "@/shared/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-enap border border-enap-muted/40 shadow-enapMd p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
