// src/pages/admin/AdminReservasPage.tsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";

import { PATHS } from "@/routes/paths";
import { useAuth } from "@/context/AuthContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { useEspacios } from "@/context/EspaciosContext";

import { useReservasAdmin } from "@/hooks/useReservasAdmin";
import { useReservasKPIs, usePagination, useFadeUp } from "@/hooks";

import ReservasFilters from "@/pages/admin/reservas/ReservasFilters";
import ReservasKPIs from "@/pages/admin/reservas/ReservasKPIs";
import ReservasTable from "@/pages/admin/reservas/ReservasTable";
import ReservasPagination from "@/pages/admin/reservas/ReservasPagination";

import type { ReservaFrontend } from "@/types/ReservaFrontend";

const ROWS_OPTIONS = [10, 15, 20, 50] as const;

const AdminReservasPage: React.FC = () => {
  const { role } = useAuth();
  const { agregarNotificacion } = useNotificacion();
  const { espacios } = useEspacios();
  const prefersReducedMotion = useReducedMotion();
  const fadeUp = useFadeUp(0.35);

  // Solo admin
  if (role !== "ADMIN") return <Navigate to="/app" replace />;

  // 🔥 Usamos el hook nuevo
  const {
    reservas,
    loading,
    filtros,
    setFiltros,
    reload,
    updateEstado,
    eliminarReserva,
  } = useReservasAdmin();

  const kpis = useReservasKPIs(reservas as ReservaFrontend[]);

  const {
    currentPage,
    rowsPerPage,
    startIndex,
    endIndex,
    totalPages,
    currentSlice,
    setCurrentPage,
    setRowsPerPage,
  } = usePagination(reservas, ROWS_OPTIONS, 15);

  /* ============================================================
   * 🟦 Cambiar estado
   * ============================================================ */
  const handleEstadoChange = async (id: string, estado: any) => {
    const res = await updateEstado(id, estado);
    if (res.ok) agregarNotificacion("Estado actualizado", "success");
    else agregarNotificacion("Error al actualizar estado", "error");
  };

  /* ============================================================
   * 🟥 Eliminar
   * ============================================================ */
  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar esta reserva?")) return;

    const res = await eliminarReserva(id);
    if (res.ok) agregarNotificacion("Reserva eliminada", "success");
    else agregarNotificacion("Error al eliminar reserva", "error");
  };

  /* ============================================================
   * 🖥️ Render
   * ============================================================ */
  return (
    <>
      <Helmet>
        <title>Administración | Reservas</title>
      </Helmet>

      <main className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#002E3E]">
            <Loader2 className="animate-spin" size={48} />
          </div>
        ) : (
          <>
            {/* HEADER */}
            <motion.header {...fadeUp} className="mb-10">
              <h1 className="text-3xl font-bold text-[#002E3E]">Panel de Reservas</h1>
              <p className="text-gray-600">Gestión completa de reservas.</p>
            </motion.header>

            {/* KPIs */}
            <ReservasKPIs
              kpis={kpis}
              prefersReducedMotion={!!prefersReducedMotion}
            />

            {/* FILTROS */}
            <ReservasFilters
              filtros={filtros}
              setFiltros={setFiltros}
              espacios={espacios}
            />

            {/* TABLA */}
            <ReservasTable
              rows={currentSlice}
              handleEliminar={handleEliminar}
              handleEstadoChange={handleEstadoChange}
              prefersReducedMotion={!!prefersReducedMotion}
            />

            {/* PAGINACIÓN */}
            <ReservasPagination
              reservas={reservas}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              startIndex={startIndex}
              endIndex={endIndex}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
      </main>
    </>
  );
};

export default AdminReservasPage;
