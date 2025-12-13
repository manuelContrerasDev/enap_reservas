// ============================================================
// AdminStep1_DatosSocioEspacio.tsx — UX/UI Premium ENAP 2025
// ============================================================

import React from "react";
import { StepHeader } from "./StepHeader";

import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";

import type { ReservaManualPayload } from "@/validators/reservaManual.schema";
import { useEspacios } from "@/context/EspaciosContext";

interface Props {
  register: UseFormRegister<ReservaManualPayload>;
  watch: UseFormWatch<ReservaManualPayload>;
  errors: FieldErrors<ReservaManualPayload>;
  setValue: UseFormSetValue<ReservaManualPayload>; // 🔥 ahora obligatorio para consistencia
}

export const AdminStep1_DatosSocioEspacio: React.FC<Props> = ({
  register,
  watch,
  errors,
  setValue,
}) => {
  const { espacios } = useEspacios();
  const selectedEspacio = espacios.find((e) => e.id === watch("espacioId"));

  return (
    <div className="space-y-10">

      {/* ============================================================
         DATOS DEL SOCIO
      ============================================================ */}
      <div className="card">
        <StepHeader title="Datos del Socio" subtitle="Identificación del titular de la reserva" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* ID Usuario */}
          <div className="form-group">
            <label className="label">ID Usuario</label>
            <input
              {...register("userId")}
              className="input"
              placeholder="ID de Socio"
            />
            {errors.userId && <p className="err">{errors.userId.message}</p>}
          </div>

          {/* Nombre */}
          <div className="form-group">
            <label className="label">Nombre socio</label>
            <input
              {...register("datosContacto.nombre")}
              className="input"
              placeholder="Nombre completo del titular"
            />
            {errors.datosContacto?.nombre && (
              <p className="err">{errors.datosContacto.nombre.message}</p>
            )}
          </div>

          {/* Rut */}
          <div className="form-group">
            <label className="label">RUT</label>
            <input
              {...register("datosContacto.rut")}
              className="input"
              placeholder="Ej: 12.345.678-9"
            />
            {errors.datosContacto?.rut && (
              <p className="err">{errors.datosContacto.rut.message}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <label className="label">Teléfono</label>
            <input
              {...register("datosContacto.telefono")}
              className="input"
              placeholder="+56 9 12345678"
            />
            {errors.datosContacto?.telefono && (
              <p className="err">{errors.datosContacto.telefono.message}</p>
            )}
          </div>

          {/* Correo ENAP */}
          <div className="form-group md:col-span-2">
            <label className="label">Correo ENAP</label>
            <input
              {...register("datosContacto.correoEnap")}
              className="input"
              placeholder="nombre.apellido@enap.cl"
            />
            {errors.datosContacto?.correoEnap && (
              <p className="err">{errors.datosContacto.correoEnap.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
         ESPACIO + FECHAS
      ============================================================ */}
      <div className="card">
        <StepHeader
          title="Espacio y Fechas"
          subtitle="Seleccione el espacio y el periodo de la reserva"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          {/* Espacio */}
          <div className="form-group">
            <label className="label">Espacio</label>
            <select {...register("espacioId")} className="input">
              <option value="">Seleccione...</option>
              {espacios.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} ({e.tipo})
                </option>
              ))}
            </select>

            {errors.espacioId && (
              <p className="err">{errors.espacioId.message}</p>
            )}

            {selectedEspacio && (
              <p className="text-xs text-gray-500 mt-2">
                Capacidad: <strong>{selectedEspacio.capacidad}</strong> — 
                Modalidad: <strong>{selectedEspacio.modalidadCobro}</strong>
              </p>
            )}
          </div>

          {/* Fecha Inicio */}
          <div className="form-group">
            <label className="label">Fecha inicio</label>
            <input type="date" {...register("fechaInicio")} className="input" />
            {errors.fechaInicio && (
              <p className="err">{errors.fechaInicio.message}</p>
            )}
          </div>

          {/* Fecha Fin */}
          <div className="form-group">
            <label className="label">Fecha fin</label>
            <input type="date" {...register("fechaFin")} className="input" />
            {errors.fechaFin && (
              <p className="err">{errors.fechaFin.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
