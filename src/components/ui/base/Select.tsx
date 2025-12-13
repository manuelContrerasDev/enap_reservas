import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(
          `
          w-full px-4 py-3 rounded-lg border bg-white text-sm
          shadow-inner transition-all outline-none
          focus:ring-2
          `,
          error
            ? "border-error focus:border-error focus:ring-error/40"
            : "border-gray-300 focus:border-enap.gold focus:ring-enap.gold/40",
          props.disabled && "opacity-70 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;
