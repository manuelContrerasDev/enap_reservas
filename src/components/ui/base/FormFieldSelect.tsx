// src/components/ui/base/FormFieldSelect.tsx
import React from "react";
import Select, { SelectProps } from "./Select";

interface FormFieldSelectProps {
  label: string;
  error?: string | null;
  selectProps?: SelectProps;
  children: React.ReactNode;
}

export default function FormFieldSelect({
  label,
  error,
  selectProps,
  children,
}: FormFieldSelectProps) {
  const id = selectProps?.id;

  return (
    <div className="space-y-1 w-full">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-enap.primary"
      >
        {label}
      </label>

      <Select error={!!error} {...selectProps}>
        {children}
      </Select>

      {error && (
        <p className="text-error text-xs font-medium">{error}</p>
      )}
    </div>
  );
}
