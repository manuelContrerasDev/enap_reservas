// src/modules/admin/reservas/manual/AdminReservaSuccess.tsx
// ============================================================
// AdminReservaSuccess — ENAP 2025 (FINAL)
// ============================================================

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

interface Props {
  id: string;
}

const AdminReservaSuccess: React.FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-10 max-w-xl mx-auto text-center space-y-5"
      aria-live="polite"
    >
      <CheckCircle2
        className="w-16 h-16 text-emerald-600 mx-auto"
        aria-hidden
      />

      <h2 className="text-2xl font-bold text-emerald-700">
        ¡Reserva creada correctamente!
      </h2>

      <p className="text-gray-600">
        La reserva con ID{" "}
        <span className="font-mono font-semibold text-gray-800">
          {id}
        </span>{" "}
        fue registrada exitosamente en el sistema.
      </p>

      <div className="pt-4">
        <button
          type="button"
          onClick={() => navigate(PATHS.ADMIN_RESERVAS)}
          className="px-6 py-3 bg-[#00394F] text-white rounded-lg shadow hover:bg-[#002a3a] transition-all"
        >
          Volver al listado
        </button>
      </div>
    </div>
  );
};

export default React.memo(AdminReservaSuccess);
