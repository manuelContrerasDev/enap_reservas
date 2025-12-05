// src/components/ui/kit/EnapCard.tsx
import React from "react";

interface EnapCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function EnapCard({ children, className }: EnapCardProps) {
  return (
    <div
      className={`bg-white shadow-enapMd rounded-enap p-5 border border-enap-muted/40 ${className}`}
    >
      {children}
    </div>
  );
}
