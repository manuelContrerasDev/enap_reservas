// src/pages/admin/AdminReservasPage.tsx
import React, { useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useReducedMotion, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { PATHS } from "@/routes/paths";
import { useAuth } from "@/context/auth";
import { useNotificacion } from "@/context/NotificacionContext";
import { useEspacios } from "@/context/EspaciosContext";

import { useReservasAdmin } from "@/modules/reservas/hooks/useReservasAdmin";
import { useReservasKPIs, usePagination, useFadeUp } from "@/hooks";

import ReservasFilters from "@/modules/admin/components/reservas/ReservasFilters";
import ReservasKPIs from "@/modules/admin/components/reservas/ReservasKPIs";
import ReservasTable from "@/modules/admin/components/reservas/ReservasTable";
import ReservasPagination from "@/modules/admin/components/reservas/ReservasPagination";

import type { ReservaBackend } from "@/types/ReservaBackend";

// UI Kit oficial
import { Button, Panel, Divider, LoaderPage } from "@/components/ui";

const ROWS_OPTIONS = [10, 15, 20, 50] as const;

const AdminReservasPage: React.FC = () => {
  const { role } = useAuth();
  const { agregarNotificacion } = useNotificacion();
  const { espacios } = useEspacios();
  const prefersReducedMotion = useReducedMotion();
  const fadeUp = useFadeUp(0.35);

  // Seguridad por rol
  if (role !== "ADMIN") return <Navigate to="/app" replace />;

  const {
    reservas,
    loading,
    filtros,
    setFiltros,
    updateEstado,
    eliminarReserva,
  } = useReservasAdmin();

  const reservasTyped = useMemo(
    () => (reservas ?? []) as ReservaBackend[],
    [reservas]
  );

  const kpis = useReservasKPIs(reservasTyped);

  const {
    currentPage,
    rowsPerPage,
    startIndex,
    endIndex,
    totalPages,
    currentSlice,
    setCurrentPage,
    setRowsPerPage,
  } = usePagination(reservasTyped, ROWS_OPTIONS, 15);

  // Cambiar estado
  const handleEstadoChange = useCallback(
    async (id: string, estado: unknown) => {
      const res = await updateEstado(id, estado as any);
      if (res.ok) agregarNotificacion("Estado actualizado", "success");
      else agregarNotificacion("Error al actualizar estado", "error");
    },
    [updateEstado, agregarNotificacion]
  );

  // Eliminar
  const handleEliminar = useCallback(
    async (id: string) => {
      if (!window.confirm("¿Eliminar esta reserva?")) return;

      const res = await eliminarReserva(id);
      if (res.ok) agregarNotificacion("Reserva eliminada", "success");
      else agregarNotificacion("Error al eliminar reserva", "error");
    },
    [eliminarReserva, agregarNotificacion]
  );

  const empty = !loading && reservasTyped.length === 0;

  return (
    <>
      <Helmet>
        <title>Administración | Reservas</title>
      </Helmet>

      <main className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] px-6 py-10">
        {loading ? (
          <LoaderPage />
        ) : (
          <div className="mx-auto w-full max-w-6xl space-y-6">
            {/* HEADER */}
            <motion.header
              {...fadeUp}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-enap-primary">
                  Panel de Reservas
                </h1>
                <p className="text-gray-600">
                  Gestión completa de reservas y control operativo.
                </p>
              </div>

              <Link to={PATHS.ADMIN_RESERVAS_MANUAL}>
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Crear reserva manual
                </Button>
              </Link>
            </motion.header>

            {/* KPIs */}
            <section aria-label="Indicadores">
              <ReservasKPIs
                kpis={kpis}
                prefersReducedMotion={!!prefersReducedMotion}
              />
            </section>

            {/* FILTROS + TABLA */}
            <Panel title="Reservas">
              <section aria-label="Filtros de búsqueda">
                <ReservasFilters
                  filtros={filtros}
                  setFiltros={setFiltros}
                  espacios={espacios}
                />
              </section>

              <Divider />

              {empty ? (
                <div
                  className="py-16 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-base font-semibold text-gray-800">
                    No hay reservas para mostrar
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Prueba ajustando los filtros o crea una reserva manual.
                  </p>

                  <div className="mt-6 flex justify-center">
                    <Link to={PATHS.ADMIN_RESERVAS_MANUAL}>
                      <Button>
                        <Plus className="h-4 w-4" />
                        Crear reserva manual
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <section aria-label="Tabla de reservas">
                    <ReservasTable
                      rows={currentSlice}
                      handleEliminar={handleEliminar}
                      handleEstadoChange={handleEstadoChange}
                      prefersReducedMotion={!!prefersReducedMotion}
                    />
                  </section>

                  <Divider />

                  <section aria-label="Paginación">
                    <ReservasPagination
                      reservas={reservasTyped}
                      rowsPerPage={rowsPerPage}
                      setRowsPerPage={setRowsPerPage}
                      startIndex={startIndex}
                      endIndex={endIndex}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  </section>
                </>
              )}
            </Panel>
          </div>
        )}
      </main>
    </>
  );
};

export default AdminReservasPage;
