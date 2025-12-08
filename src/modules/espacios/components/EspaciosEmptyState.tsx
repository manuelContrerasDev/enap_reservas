import React from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EspaciosEmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
      {/* ICONO */}
      <div className="text-[#DCAB12]">
        {icon || <AlertCircle size={58} />}
      </div>

      {/* TITULO */}
      <h3 className="text-xl font-semibold text-gray-800">
        {title}
      </h3>

      {/* MENSAJE */}
      {message && (
        <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
          {message}
        </p>
      )}

      {/* ACCION */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="
            mt-3 px-5 py-2 rounded-xl text-sm font-semibold
            bg-[#01546B] text-white shadow hover:bg-[#016A85]
            transition
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
