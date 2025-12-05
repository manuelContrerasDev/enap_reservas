// src/components/ui/kit/EnapAlert.tsx
import React from "react";

export type EnapAlertType = "info" | "success" | "warning" | "error";

interface EnapAlertProps {
  type?: EnapAlertType;
  children: React.ReactNode;
}

const COLORS: Record<EnapAlertType, string> = {
  info: "bg-cian-50 border-cian-200 text-cian-700",
  success: "bg-success/10 border-success/40 text-success",
  warning: "bg-warning/10 border-warning/40 text-warning",
  error: "bg-error/10 border-error/40 text-error",
};

export default function EnapAlert({ type = "info", children }: EnapAlertProps) {
  return (
    <div
      className={`border rounded-enap p-3 text-sm font-medium shadow-enapSm ${COLORS[type]}`}
    >
      {children}
    </div>
  );
}
