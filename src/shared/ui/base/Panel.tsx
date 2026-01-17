import React from "react";
import { cn } from "@/shared/utils/cn";

interface PanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Panel({ title, children, className }: PanelProps) {
  return (
    <section
      className={cn(
        "bg-white rounded-enap shadow-enapLg p-6",
        className
      )}
    >
      {title && (
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-enap-primary">
            {title}
          </h2>
        </header>
      )}

      {children}
    </section>
  );
}
