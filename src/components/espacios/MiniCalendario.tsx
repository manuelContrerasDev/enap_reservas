// src/components/espacios/MiniCalendario.tsx
import React from "react";
import { CalendarDays, X } from "lucide-react";

interface MiniCalendarioProps {
  fechaSeleccionada: string | null;
  onChange: (value: string | null) => void;
}

const MiniCalendario: React.FC<MiniCalendarioProps> = ({
  fechaSeleccionada,
  onChange,
}) => {
  const hoyISO = new Date().toISOString().slice(0, 10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onChange(value || null);
  };

  const limpiar = () => onChange(null);

  return (
    <div
      className={`flex items-center gap-2 bg-white px-3 py-2 rounded-lg border ${
        fechaSeleccionada
          ? "border-[#002E3E] shadow-sm"
          : "border-gray-300 hover:border-gray-400"
      } transition-all`}
    >
      <CalendarDays
        size={18}
        className="text-[#002E3E] opacity-80"
        aria-hidden="true"
      />

      <input
        id="mini-calendario-fecha"
        type="date"
        value={fechaSeleccionada ?? ""}
        onChange={handleChange}
        min={hoyISO}
        className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer flex-1"
      />

      {fechaSeleccionada && (
        <button
          type="button"
          onClick={limpiar}
          aria-label="Borrar fecha"
          className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default MiniCalendario;
