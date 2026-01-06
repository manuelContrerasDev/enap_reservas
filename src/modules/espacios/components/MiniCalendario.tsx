// src/components/espacios/MiniCalendario.tsx
import React, { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import type { Matcher } from "react-day-picker";
import { es } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface MiniCalendarioProps {
  fechaSeleccionada: string | null;
  onChange: (value: string | null) => void;

  /** true = ocupado */
  estaOcupado: (fechaISO: string) => boolean;
}

/* ============================================================
 * Utils — ISO local seguro (sin timezone)
 * ============================================================ */
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
  const selectedDate = fechaSeleccionada
    ? new Date(fechaSeleccionada)
    : undefined;

  /* ------------------------------------------------------------
   * Disabled days
   * ------------------------------------------------------------ */
  const disabledDays: Matcher[] = useMemo(
    () => [
      { before: new Date() },
      (date) => estaOcupado(toLocalISO(date)),
    ],
    [estaOcupado]
  );

  /* ------------------------------------------------------------
   * Modificadores visuales
   * ------------------------------------------------------------ */
  const modifiers = {
    ocupado: (date: Date) => estaOcupado(toLocalISO(date)),
    disponible: (date: Date) => !estaOcupado(toLocalISO(date)),
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    const iso = toLocalISO(date);
    if (estaOcupado(iso)) return;

    onChange(iso);
  };

  return (
    <div
      className="
        bg-white border border-gray-300 shadow-sm
        rounded-xl p-3 mx-auto flex justify-center
      "
    >
      <DayPicker
        mode="single"
        locale={es}
        selected={selectedDate}
        onSelect={handleSelect}
        disabled={disabledDays}
        modifiers={modifiers}
        showOutsideDays
        fromDate={new Date()}
        modifiersClassNames={{
          selected: "bg-[#005D73] text-white rounded-md",
          today: "border border-[#005D73] rounded-md",

          ocupado: "bg-red-100 text-red-700 line-through opacity-70",
          disponible: "bg-emerald-100 text-emerald-700",
          disabled: "opacity-50",
        }}
        styles={{
          caption: { textAlign: "center", fontSize: "0.8rem" },
          head_cell: { fontSize: "0.72rem", padding: "4px" },
          cell: { padding: "3px" },
          table: { margin: "0 auto" },
          root: { width: "100%", maxWidth: 300 },
        }}
      />
    </div>
  );
}
