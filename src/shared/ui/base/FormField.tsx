// src/components/ui/base/FormField.tsx
import React from "react";
import Input, { InputProps } from "../../../shared/ui/base/Input";

interface FormFieldProps {
  label: string;
  error?: string | null;
  inputProps?: InputProps;
}

export default function FormField({
  label,
  error,
  inputProps,
}: FormFieldProps) {
  const id = inputProps?.id;

  return (
    <div className="space-y-1 w-full">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-enap.primary"
      >
        {label}
      </label>

      <Input error={!!error} {...inputProps} />

      {error && (
        <p className="text-error text-xs font-medium">{error}</p>
      )}
    </div>
  );
}
