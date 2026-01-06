import React, { useEffect } from "react";
import { StepHeader } from "@/modules/admin/reservas/manual/StepHeader";
import { useEspacios } from "@/context/EspaciosContext";

import type {
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";

import type { ReservaManualFormValues } from "@/validators/reservaManual.schema";

interface Props {
  register: UseFormRegister<ReservaManualFormValues>;
  watch: UseFormWatch<ReservaManualFormValues>;
  errors: FieldErrors<ReservaManualFormValues>;
  setValue: UseFormSetValue<ReservaManualFormValues>;
}

export const AdminStep1_DatosSocioEspacio: React.FC<Props> = ({
  register,
  watch,
  errors,
  setValue,
}) => {
  const { espacios } = useEspacios();

  const espacioId = watch("espacioId");
  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");

  const espacio = espacios.find((e) => e.id === espacioId);

  // ============================================================
  // Fechas → ISO (backend requiere datetime)
  // ============================================================

  useEffect(() => {
    if (fechaInicio && fechaInicio.length === 10) {
      setValue(
        "fechaInicio",
        new Date(`${fechaInicio}T00:00:00`).toISOString(),
        { shouldValidate: true }
      );
    }
  }, [fechaInicio, setValue]);

  useEffect(() => {
    if (fechaFin && fechaFin.length === 10) {
      setValue(
        "fechaFin",
        new Date(`${fechaFin}T00:00:00`).toISOString(),
        { shouldValidate: true }
      );
    }
  }, [fechaFin, setValue]);

  // ============================================================
  // Cambio de espacio → reset cantidades
  // ============================================================

  useEffect(() => {
    if (!espacioId) return;

    setValue("cantidadAdultos", 1, { shouldValidate: true });
    setValue("cantidadNinos", 0, { shouldValidate: true });
    setValue("cantidadPiscina", 0, { shouldValidate: true });
  }, [espacioId, setValue]);

  return (
    <div className="space-y-10">
      {/* ================= DATOS SOCIO ================= */}
      <div className="card-enap p-6 rounded-xl">
        <StepHeader title="Datos del Socio" />

        <input {...register("socio.nombre")} placeholder="Nombre socio" />
        {errors.socio?.nombre && <p className="err">{errors.socio.nombre.message}</p>}

        <input {...register("socio.rut")} placeholder="RUT" />
        {errors.socio?.rut && <p className="err">{errors.socio.rut.message}</p>}

        <input {...register("socio.telefono")} placeholder="Teléfono" />
        {errors.socio?.telefono && <p className="err">{errors.socio.telefono.message}</p>}

        <input {...register("socio.correoEnap")} placeholder="Correo ENAP" />
        {errors.socio?.correoEnap && (
          <p className="err">{errors.socio.correoEnap.message}</p>
        )}
      </div>

      {/* ================= ESPACIO Y FECHAS ================= */}
      <div className="card-enap p-6 rounded-xl">
        <StepHeader title="Espacio y Fechas" />

        <select {...register("espacioId")}>
          <option value="">Seleccione un espacio</option>
          {espacios.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
        {errors.espacioId && <p className="err">{errors.espacioId.message}</p>}

        {espacio && (
          <p className="text-sm text-gray-600 mt-2">
            Capacidad: {espacio.capacidad} — Modalidad: {espacio.modalidadCobro}
          </p>
        )}

        {/* Inputs controlados por RHF */}
        <input type="date" {...register("fechaInicio")} />
        {errors.fechaInicio && <p className="err">{errors.fechaInicio.message}</p>}

        <input type="date" {...register("fechaFin")} />
        {errors.fechaFin && <p className="err">{errors.fechaFin.message}</p>}
      </div>
    </div>
  );
};
