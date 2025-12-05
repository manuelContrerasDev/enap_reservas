// src/components/ui/kit/EnapModal.tsx
import React from "react";

interface EnapModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function EnapModal({
  open,
  onClose,
  title,
  children,
}: EnapModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-enap shadow-enapLg p-6 w-full max-w-lg relative">
        {title && (
          <h2 className="text-lg font-semibold mb-4 text-enap-primary">{title}</h2>
        )}

        {children}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
