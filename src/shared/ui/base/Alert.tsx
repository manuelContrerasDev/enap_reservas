import React from "react";
import { cn } from "@/shared/utils/cn";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

type AlertVariant = "info" | "success" | "warning" | "error";

const STYLES: Record<AlertVariant, string> = {
  info: "bg-cian-50 border-cian-200 text-cian-700",
  success: "bg-success/10 border-success/40 text-success",
  warning: "bg-warning/10 border-warning/40 text-warning",
  error: "bg-error/10 border-error/40 text-error",
};

const ICONS: Record<AlertVariant, React.ElementType> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  showIcon?: boolean;
  className?: string;
}

export default function Alert({
  variant = "info",
  children,
  showIcon = true,
  className,
}: AlertProps) {
  const Icon = ICONS[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-enap border p-3 text-sm font-medium shadow-enapSm",
        STYLES[variant],
        className
      )}
    >
      {showIcon && <Icon className="h-4 w-4 mt-0.5 shrink-0" />}
      <div>{children}</div>
    </div>
  );
}
