// src/modules/espacios/components/MiniCalendario.tsx
import React, { memo, useMemo, useCallback } from "react";
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

const fromLocalISO = (iso: string) => {
  // iso esperado: YYYY-MM-DD
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d, 12, 0, 0, 0); // 12:00 evita edge cases DST
};

export default memo(function MiniCalendario({
  fechaSeleccionada,
  onChange,
  estaOcupado,
}: MiniCalendarioProps) {
  const selectedDate = fechaSeleccionada
    ? fromLocalISO(fechaSeleccionada)
    : undefined;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /* ------------------------------------------------------------
   * Disabled days
   * ------------------------------------------------------------ */
  const disabledDays: Matcher[] = useMemo(
    () => [
      { before: today },
      (date) => estaOcupado(toLocalISO(date)),
    ],
    [estaOcupado, today]
  );

  /* ------------------------------------------------------------
   * Modificadores visuales
   * ------------------------------------------------------------ */
  const modifiers = useMemo(
    () => ({
      ocupado: (date: Date) => estaOcupado(toLocalISO(date)),
      disponible: (date: Date) => !estaOcupado(toLocalISO(date)),
    }),
    [estaOcupado]
  );

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return;

      const iso = toLocalISO(date);
      if (estaOcupado(iso)) return;

      // Toggle: si selecciona la misma fecha, limpia
      if (fechaSeleccionada === iso) {
        onChange(null);
        return;
      }

      onChange(iso);
    },
    [estaOcupado, fechaSeleccionada, onChange]
  );

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
        fromDate={today}
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
});
