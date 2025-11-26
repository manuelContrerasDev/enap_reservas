import React from "react";
import {
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { ReservaFrontendType } from "@/validators/reserva.schema";

interface Props {
  watch: UseFormWatch<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
  maxCap: number;
}

const PersonasForm: React.FC<Props> = ({
  watch,
  setValue,
  errors,
  maxCap,
}) => {
  // Nos aseguramos que siempre sea número
  const personas = Number(watch("cantidadPersonas") ?? 1);

  const handleChange = (raw: string) => {
    const num = Number(raw);
    if (Number.isNaN(num)) {
      setValue("cantidadPersonas", 1, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      return;
    }

    const safe = Math.min(maxCap, Math.max(1, num));

    setValue("cantidadPersonas", safe, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <section className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Cantidad de personas
      </label>

      <input
        type="number"
        placeholder="Ej: 4 personas"
        value={personas}
        onChange={(e) => handleChange(e.target.value)}
        min={1}
        max={maxCap}
        className="w-full rounded-lg border px-4 py-3"
      />

      {errors.cantidadPersonas && (
        <p className="text-xs text-red-600">
          {errors.cantidadPersonas.message}
        </p>
      )}

      <p className="text-xs text-gray-500">
        Capacidad máxima total: {maxCap} personas.
      </p>
    </section>
  );
};

export default PersonasForm;
