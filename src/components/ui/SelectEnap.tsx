import React from "react";

interface SelectEnapProps {
  label: string;
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  error?: string | null;
  children: React.ReactNode;
  disabled?: boolean;
}

export const SelectEnap: React.FC<SelectEnapProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  children,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-sm font-semibold text-[#002E3E]"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 rounded-lg border bg-white text-sm transition-all outline-none
        focus:ring-2 focus:ring-[#002E3E] focus:border-[#002E3E]
        ${disabled ? "opacity-70 cursor-not-allowed" : ""}
        ${error ? "border-red-500" : "border-gray-300"}`}
      >
        {children}
      </select>

      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};
