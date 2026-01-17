// src/modules/auth/components/AuthButton.tsx
import React from "react";
import { motion } from "framer-motion";

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
}

export default function AuthButton({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  type = "submit",
  ...rest
}: AuthButtonProps) {
  const isDisabled = disabled || loading;

  const base =
    "w-full py-3 rounded-xl font-semibold text-sm md:text-base " +
    "transition-all flex items-center justify-center gap-2 select-none " +
    "focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variants = {
    primary:
      "bg-[#C7A96A] text-white hover:bg-[#B99555] focus:ring-[#C7A96A]/40",
    secondary:
      "bg-[#002E3E] text-white hover:bg-[#013444] focus:ring-[#003A4E]/40",
    outline:
      "border border-[#C7A96A] text-[#C7A96A] hover:bg-[#C7A96A] hover:text-white focus:ring-[#C7A96A]/40",
  } as const;

  const active = !isDisabled ? "active:scale-[0.97]" : "";
  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={[
        base,
        variants[variant],
        active,
        isDisabled ? disabledStyles : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? (
        <motion.span
          role="status"
          aria-live="polite"
          className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.65, ease: "linear" }}
        />
      ) : (
        children
      )}
    </button>
  );
}
