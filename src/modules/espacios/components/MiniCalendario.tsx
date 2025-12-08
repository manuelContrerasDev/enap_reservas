// src/components/espacios/MiniCalendario.tsx
import React from "react";
import { DayPicker } from "react-day-picker";
import type { Matcher } from "react-day-picker";
import { es } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface MiniCalendarioProps {
  fechaSeleccionada: string | null;
  onChange: (value: string | null) => void;
  estaOcupado: (fechaISO: string) => boolean;
}

// evita problemas de timezone
const toLocalISO = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function MiniCalendario({
  fechaSeleccionada,
  onChange,
  estaOcupado,
}: MiniCalendarioProps) {
  const selectedDate = fechaSeleccionada ? new Date(fechaSeleccionada) : undefined;

  const disabledDays: Matcher[] = [
    { before: new Date() },
    (date) => estaOcupado(toLocalISO(date)),
  ];

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const iso = toLocalISO(date);
    if (estaOcupado(iso)) return;
    onChange(iso);
  };

  return (
    <div
      className="
        bg-white border border-gray-300 shadow-sm rounded-xl 
        p-3 mx-auto flex justify-center
      "
    >
      <DayPicker
        mode="single"
        locale={es}
        selected={selectedDate}
        onSelect={handleSelect}
        disabled={disabledDays}
        showOutsideDays
        fromDate={new Date()}
        modifiersClassNames={{
          selected: "bg-[#005D73] text-white rounded-md",
          today: "border border-[#005D73] rounded-md",
          disabled: "line-through text-red-600 opacity-60",
        }}
        styles={{
          // Estilo compacto real SIN deformar hitboxes
          caption: { textAlign: "center", fontSize: "0.8rem" },
          head_cell: { fontSize: "0.72rem", padding: "4px" },
          cell: { padding: "3px" }, // reduce tamaño pero mantiene hitbox correcto
          table: { margin: "0 auto" },
          root: { width: "100%", maxWidth: 300 }, // tamaño seguro sin deformar
        }}
      />
    </div>
  );
}
