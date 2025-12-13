// AdminReservaSuccess.tsx — versión ENAP Premium

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminReservaSuccess = ({ id }: { id: string }) => {
  const navigate = useNavigate();

  return (
    <div className="p-10 max-w-xl mx-auto text-center space-y-5">
      <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />

      <h2 className="text-2xl font-bold text-emerald-700">
        ¡Reserva creada correctamente!
      </h2>

      <p className="text-gray-600">
        La reserva <strong>{id}</strong> fue registrada en el sistema.
      </p>

      <div className="pt-4">
        <button
          onClick={() => navigate("/app/admin/reservas")}
          className="px-6 py-3 bg-[#00394F] text-white rounded-lg shadow hover:bg-[#002a3a] transition-all"
        >
          Volver al listado
        </button>
      </div>
    </div>
  );
};
