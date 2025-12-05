// src/ui/EnapInput.tsx
import React, { useState, forwardRef, useId } from "react";
import { Eye, EyeOff } from "lucide-react";

const EnapInput = forwardRef(
  ({ label, error, type = "text", id, ...rest }: any, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [show, setShow] = useState(false);

    const isPassword = type === "password";

    return (
      <div className="space-y-1 w-full">
        <label htmlFor={inputId} className="text-sm font-semibold text-enap.primary">
          {label}
        </label>

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type={isPassword && show ? "text" : type}
            className={`
              w-full px-4 py-3 rounded-lg border bg-white text-enap.text
              shadow-inner transition-all outline-none
              ${error
                ? "border-error focus:border-error focus:ring-error/50"
                : "border-gray-300 focus:border-enap.gold focus:ring-2 focus:ring-enap.gold/40"}
            `}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && <p className="text-error text-xs">{error}</p>}
      </div>
    );
  }
);

export default EnapInput;
