// ============================================================
// AdminStep1_DatosSocioEspacio.tsx — ENAP 2025 (SYNC · RHF INPUT)
// ============================================================

import React, { useEffect } from "react";
import { StepHeader } from "@/modules/admin/gestion/reservas/manual/StepHeader";
import { useEspacios } from "@/modules/espacios/context/EspaciosContext";

import type {
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";

import type { ReservaManualFormValues } from "../schemas/ReservaManualFormValues";
import { SocioAutocomplete } from "./SocioAutocomplete";

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
  const tipoCliente = watch("tipoCliente");

  useEffect(() => {
    if (!espacioId) return;

    setValue("cantidadAdultos", 1, { shouldValidate: true });
    setValue("cantidadNinos", 0, { shouldValidate: true });
    setValue("cantidadPiscina", 0, { shouldValidate: true });
  }, [espacioId, setValue]);

  return (
    <div className="space-y-10">
      <div className="card-enap p-6 rounded-xl">
        <StepHeader title="Tipo de Cliente" />

        <select {...register("tipoCliente")}>
          <option value="SOCIO">Socio ENAP</option>
          <option value="EXTERNO">Externo</option>
        </select>
      </div>

      {tipoCliente === "SOCIO" && (
        <div className="card-enap p-6 rounded-xl">
          <StepHeader title="Buscar Socio" />

          <SocioAutocomplete
            onSelect={(socio) => {
              setValue("userId", socio.id, { shouldValidate: true });
              setValue("socio.nombre", socio.name ?? "");
              setValue("socio.correoEnap", socio.email ?? "");
            }}
          />

          {errors.userId && (
            <p className="err">Debe seleccionar un socio</p>
          )}
        </div>
      )}

      <div className="card-enap p-6 rounded-xl">
        <StepHeader title="Datos del Socio" />

        <input placeholder="Nombre" {...register("socio.nombre")} />
        <input placeholder="RUT" {...register("socio.rut")} />
        <input placeholder="Teléfono" {...register("socio.telefono")} />
        <input
          placeholder="Correo ENAP"
          {...register("socio.correoEnap")}
        />
      </div>

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

        <input type="date" {...register("fechaInicio")} />
        <input type="date" {...register("fechaFin")} />
      </div>
    </div>
  );
};
