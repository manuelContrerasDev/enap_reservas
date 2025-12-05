// src/components/ui/kit/EnapPanel.tsx
import React from "react";

interface EnapPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function EnapPanel({ title, children, className }: EnapPanelProps) {
  return (
    <div className={`bg-white rounded-enap shadow-enapLg p-6 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-enap-primary mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
