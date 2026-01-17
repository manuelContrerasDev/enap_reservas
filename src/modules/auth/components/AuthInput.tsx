// src/modules/auth/components/AuthInput.tsx
import React, { useState, forwardRef, useId } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

interface AuthInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
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
      placeholder,
      disabled,
      required,
      autoComplete,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const renderType = isPassword && showPassword ? "text" : type;

    const paddingY = compact ? "py-2" : "py-3";

    const baseInput =
      "w-full rounded-xl border bg-white text-gray-900 outline-none transition-all duration-200 ease-out";

    const focusStyles = error
      ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-300"
      : "border-gray-300 focus:border-[#C7A96A] focus:ring-2 focus:ring-[#C7A96A]/40";

    const disabledStyles = disabled
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "";

    const inputClass = [
      baseInput,
      paddingY,
      "px-4 pr-12",
      icon ? "pl-10" : "",
      focusStyles,
      disabledStyles,
      floating ? "peer placeholder-transparent" : "",
    ].join(" ");

    return (
      <div className="w-full space-y-1">
        {/* Label clásico */}
        {!floating && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={renderType}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : tooltip
                ? `${inputId}-tip`
                : undefined
            }
            placeholder={floating ? label : placeholder}
            className={inputClass}
            {...rest}
          />

          {/* Floating label */}
          {floating && (
            <label
              htmlFor={inputId}
              className={`
                absolute ${icon ? "left-10" : "left-3"}
                top-3 text-gray-500 text-sm
                pointer-events-none
                transition-all duration-200
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs
                bg-white px-1 rounded
              `}
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}

          {/* Toggle password */}
          {isPassword && (
            <motion.button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
              whileTap={{ scale: 0.9 }}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </motion.button>
          )}
        </div>

        {tooltip && (
          <p
            id={`${inputId}-tip`}
            role="note"
            className="text-xs text-gray-500 -mt-0.5"
          >
            {tooltip}
          </p>
        )}

        {error && (
          <motion.p
            id={`${inputId}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
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
