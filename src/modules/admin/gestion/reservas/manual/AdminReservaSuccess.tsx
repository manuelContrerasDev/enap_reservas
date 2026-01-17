// src/modules/admin/reservas/manual/AdminReservaSuccess.tsx
// ============================================================
// AdminReservaSuccess — ENAP 2025 (PRO · FINAL)
// Cierre del flujo Reserva Manual Admin
// ============================================================

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/app/router/paths";
interface Props {
  id: string;
}

const AdminReservaSuccess: React.FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  return (
    <section
      className="p-10 max-w-xl mx-auto text-center space-y-6"
      aria-live="polite"
      aria-labelledby="reserva-success-title"
    >
      {/* Icono */}
      <CheckCircle2
        className="w-16 h-16 text-emerald-600 mx-auto"
        aria-hidden="true"
      />

      {/* Título */}
      <h2
        id="reserva-success-title"
        className="text-2xl font-bold text-emerald-700"
      >
        ¡Reserva creada correctamente!
      </h2>

      {/* Mensaje principal */}
      <p className="text-gray-600 leading-relaxed">
        La reserva con ID{" "}
        <span className="font-mono font-semibold text-gray-800">
          {id}
        </span>{" "}
        fue registrada exitosamente en el sistema.
      </p>

      {/* Contexto funcional (MUY IMPORTANTE PARA UX ADMIN) */}
      <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
        <p>
          Estado inicial:{" "}
          <span className="font-semibold text-yellow-700">
            Pendiente de pago
          </span>
        </p>
        <p className="mt-1">
          El comprobante puede ser cargado y validado desde el panel de reservas.
        </p>
      </div>

      {/* Acciones */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() => navigate(PATHS.ADMIN_RESERVAS)}
          className="px-6 py-3 bg-[#00394F] text-white rounded-lg shadow
                     hover:bg-[#002a3a] transition-all focus:outline-none
                     focus:ring-2 focus:ring-offset-2 focus:ring-[#00394F]"
        >
          Volver al listado de reservas
        </button>
      </div>
    </section>
  );
};

export default React.memo(AdminReservaSuccess);
