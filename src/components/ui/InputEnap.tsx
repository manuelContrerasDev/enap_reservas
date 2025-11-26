import React from "react";

interface InputEnapProps {
  label: string;
  name: string;
  type?: string;
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  error?: string | null;
  placeholder?: string;
  min?: number;
  max?: number;
}

export const InputEnap: React.FC<InputEnapProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  min,
  max,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-sm font-semibold text-[#002E3E]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        min={min}
        max={max}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded-lg border bg-white text-sm transition-all outline-none
        focus:ring-2 focus:ring-[#002E3E] focus:border-[#002E3E]
        ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};
