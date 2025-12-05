// src/auth/components/AuthInput.tsx
import React, { useState, forwardRef, useId } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  floating?: boolean;
  compact?: boolean;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      error,
      type = "text",
      icon,
      tooltip,
      id,
      floating = false,
      compact = false,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? useId();
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const renderType = isPassword && showPassword ? "text" : type;

    const py = compact ? "py-2" : "py-3";

    return (
      <div className="w-full space-y-1">
        {/* LABEL (modo normal) */}
        {!floating && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700"
          >
            {label}
          </label>
        )}

        {/* WRAPPER */}
        <div className="relative">
          {/* Icono izquierda */}
          {icon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}

          {/* INPUT */}
          <input
            id={inputId}
            ref={ref}
            type={renderType}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`
              w-full px-4 pr-12 ${py}
              ${icon ? "pl-10" : ""}
              rounded-xl border bg-white text-gray-900 outline-none
              transition-all duration-200 ease-out
              ${
                error
                  ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:border-[#C7A96A] focus:ring-2 focus:ring-[#C7A96A]/40"
              }
            `}
            {...rest}
          />

          {/* Botón show/hide password */}
          {isPassword && (
            <motion.button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
              whileTap={{ scale: 0.85 }}
            >
              <motion.div
                key={showPassword ? "hide" : "show"}
                initial={{ opacity: 0, rotate: -20 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 20 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.div>
            </motion.button>
          )}

          {/* LABEL flotante */}
          {floating && (
            <label
              htmlFor={inputId}
              className={`
                absolute left-3 pointer-events-none
                text-xs bg-white px-1 rounded
                transition-all duration-200
                ${
                  rest.value || rest.defaultValue
                    ? "-top-2 text-gray-600"
                    : "top-3 text-gray-500"
                }
              `}
            >
              {label}
            </label>
          )}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <p className="text-xs text-gray-500 -mt-0.5">{tooltip}</p>
        )}

        {/* Error */}
        {error && (
          <motion.p
            id={`${inputId}-error`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-600 text-xs font-medium"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
export default AuthInput;
