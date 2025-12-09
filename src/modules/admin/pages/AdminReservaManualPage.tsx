import React from "react";
import { useReservaManual } from "@/modules/admin/reservas/hooks/useReservaManual";
import { useNotificacion } from "@/context/NotificacionContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import ReservaManualForm from "@/modules/admin/reservas/ReservaManualForm";
import type { ReservaManualBackendPayload } from "@/types/reservaManualBackend";

const AdminReservaManualPage: React.FC = () => {
  const { crear, loading, resultado } = useReservaManual();
  const { agregarNotificacion } = useNotificacion();
  const navigate = useNavigate();

  const handleSubmit = async (formData: ReservaManualBackendPayload) => {
    const res = await crear(formData);

    if (res.ok) {
      agregarNotificacion("Reserva creada exitosamente", "success");

      setTimeout(() => {
        navigate("/app/admin/reservas", { replace: true });
      }, 1200);
    } else {
      agregarNotificacion(res.error ?? "Error creando reserva", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .45 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-[#00394F] mb-2">
        Crear Reserva Manual
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Uso exclusivo para administración (reservas especiales, migraciones, adultos mayores, etc.)
      </p>

      <ReservaManualForm onSubmit={handleSubmit} loading={loading} />

      {resultado && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 border border-gray-200 rounded-xl bg-white shadow-sm p-6"
        >
          <h2 className="text-lg font-bold text-[#00394F] mb-3">
            Reserva creada correctamente ✔
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><strong>ID:</strong> {resultado.id}</p>
            <p><strong>Usuario:</strong> {resultado.user.email}</p>
            <p><strong>Espacio:</strong> {resultado.espacio.nombre}</p>
            <p><strong>Fechas:</strong> {resultado.fechaInicio} → {resultado.fechaFin}</p>
            <p><strong>Estado:</strong> {resultado.estado}</p>
            <p><strong>Total:</strong> {resultado.totalClp.toLocaleString("es-CL")}</p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/app/admin/reservas")}
              className="px-4 py-2 bg-[#007B91] hover:bg-[#005F73] text-white rounded-lg shadow-md transition-all"
            >
              Volver al Panel de Reservas
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminReservaManualPage;
