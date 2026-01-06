import React from "react";
import { AlertCircle } from "lucide-react";

type Variant = "info" | "warning" | "empty";

interface Props {
  title: string;
  message?: string;

  icon?: React.ReactNode;

  actionLabel?: string;
  onAction?: () => void;

  variant?: Variant;
}

const VARIANT_COLOR: Record<Variant, string> = {
  info: "#005D73",
  warning: "#DCAB12",
  empty: "#9CA3AF",
};

export default function EspaciosEmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  variant = "info",
}: Props) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center py-20 space-y-4 text-center"
    >
      {/* ICONO */}
      <div style={{ color: VARIANT_COLOR[variant] }}>
        {icon || <AlertCircle size={56} />}
      </div>

      {/* TÍTULO */}
      <h3 className="text-xl font-semibold text-gray-800">
        {title}
      </h3>

      {/* MENSAJE */}
      {message && (
        <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
          {message}
        </p>
      )}

      {/* ACCIÓN */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="
            mt-3 px-5 py-2 rounded-xl text-sm font-semibold
            bg-[#01546B] text-white shadow
            hover:bg-[#016A85]
            transition
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
