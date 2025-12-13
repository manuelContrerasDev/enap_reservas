// src/components/ui/base/Input.tsx
import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", error, className, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={isPassword && show ? "text" : type}
          aria-invalid={error || undefined}
          autoComplete={isPassword ? "current-password" : undefined}
          className={cn(
            `
            w-full px-4 py-3 rounded-lg border bg-white text-sm
            shadow-inner transition-all outline-none
            focus:ring-2
            `,
            error
              ? "border-error focus:border-error focus:ring-error/40"
              : "border-gray-300 focus:border-enap.gold focus:ring-enap.gold/40",
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="
              absolute inset-y-0 right-3 flex items-center
              text-gray-500 hover:text-gray-700
            "
            tabIndex={-1}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
