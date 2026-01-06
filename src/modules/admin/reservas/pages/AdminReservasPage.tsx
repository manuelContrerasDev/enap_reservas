import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useReducedMotion, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { PATHS } from "@/routes/paths";
import { useAuth } from "@/context/auth";
import { useNotificacion } from "@/context/NotificacionContext";
import { useEspacios } from "@/context/EspaciosContext";

import { useReservasAdmin } from "@/modules/admin/reservas/hooks/useReservasAdmin";
import { useReservasKPIs, usePagination, useFadeUp } from "@/hooks";

import ReservasFilters from "@/modules/admin/reservas/components/filters/ReservasFilters";
import ReservasKPIs from "@/modules/admin/reservas/components/kpis/ReservasKPIs";
import ReservasTable from "@/modules/admin/reservas/components/table/ReservasTable";
import ReservasPagination from "@/modules/admin/reservas/components/table/ReservasPagination";

import type { ReservaFrontend } from "@/types/ReservaFrontend";
import type { ReservaEstado } from "@/types/enums";

import type { EditarReservaPayload } from "@/modules/admin/reservas/services/editarReserva";
import { editarReserva } from "@/modules/admin/reservas/services/editarReserva";

// UI
import { Button, Panel, Divider, LoaderPage } from "@/components/ui";
import ModalEditarReserva from "../components/modals/ModalEditarReserva";
import ModalSubirComprobante from "../components/modals/ModalSubirComprobante";

const ROWS_OPTIONS = [10, 15, 20, 50] as const;

const AdminReservasPage: React.FC = () => {
  const { role } = useAuth();
  const { agregarNotificacion } = useNotificacion();
  const { espacios } = useEspacios();

  const prefersReducedMotion = useReducedMotion();
  const fadeUp = useFadeUp(0.35);

  const [reservaEditar, setReservaEditar] =
    useState<ReservaFrontend | null>(null);

  const [reservaComprobante, setReservaComprobante] =
    useState<ReservaFrontend | null>(null);

  // 🔐 Seguridad
  if (role !== "ADMIN") {
    return <Navigate to={PATHS.SOCIO_HOME} replace />;
  }

  const {
    reservas,
    loading,
    filtros,
    setFiltros,
    updateEstado,
    cancelarReserva,
    subirComprobanteAdmin,
    confirmarReservaManual,
  } = useReservasAdmin();

  const reservasTyped = useMemo<ReservaFrontend[]>(
    () => reservas ?? [],
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

  /* ============================================================
   * 🔄 ESTADO
   * ============================================================ */
  const handleEstadoChange = useCallback(
    async (id: string, estado: ReservaEstado) => {
      try {
        await updateEstado(id, estado);
        agregarNotificacion("Estado actualizado", "success");
      } catch (e: any) {
        agregarNotificacion(
          e?.message ?? "Error al actualizar estado",
          "error"
        );
      }
    },
    [updateEstado, agregarNotificacion]
  );

  /* ============================================================
   * ❌ CANCELAR
   * ============================================================ */
  const handleCancelar = useCallback(
    async (id: string) => {
      if (!window.confirm("¿Cancelar esta reserva?")) return;

      try {
        await cancelarReserva(id, "Cancelada por administrador");
        agregarNotificacion("Reserva cancelada", "success");
      } catch (e: any) {
        agregarNotificacion(
          e?.message ?? "Error al cancelar reserva",
          "error"
        );
      }
    },
    [cancelarReserva, agregarNotificacion]
  );

  /* ============================================================
   * 📎 COMPROBANTE
   * ============================================================ */
  const handleAbrirModalComprobante = useCallback(
    (reserva: ReservaFrontend) => {
      setReservaComprobante(reserva);
    },
    []
  );

  const handleConfirmarManual = useCallback(
    async (id: string) => {
      try {
        await confirmarReservaManual(id);
        agregarNotificacion("Reserva confirmada", "success");
      } catch (e: any) {
        agregarNotificacion(
          e?.message ?? "Error al confirmar reserva",
          "error"
        );
      }
    },
    [confirmarReservaManual, agregarNotificacion]
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
                <Button variant="secondary">
                  <Plus className="h-4 w-4" />
                  Crear reserva manual
                </Button>
              </Link>
            </motion.header>

            {/* KPIs */}
            <ReservasKPIs
              kpis={kpis}
              prefersReducedMotion={!!prefersReducedMotion}
            />

            <Panel title="Reservas">
              <ReservasFilters
                filtros={filtros}
                setFiltros={setFiltros}
                espacios={espacios}
              />

              <Divider />

              {empty ? (
                <div className="py-16 text-center">
                  <p className="font-semibold">No hay reservas</p>
                </div>
              ) : (
                <>
                  <ReservasTable
                    rows={currentSlice}
                    onEditar={setReservaEditar}
                    handleEliminar={handleCancelar}
                    handleEstadoChange={handleEstadoChange}
                    onSubirComprobante={handleAbrirModalComprobante}
                    onConfirmarManual={handleConfirmarManual}
                    prefersReducedMotion={!!prefersReducedMotion}
                  />

                  <Divider />

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
                </>
              )}
            </Panel>
          </div>
        )}
      </main>

      {/* ✏️ EDITAR */}
      {reservaEditar && (
        <ModalEditarReserva
          reserva={reservaEditar}
          onClose={() => setReservaEditar(null)}
          onGuardar={async (payload: EditarReservaPayload) => {
            await editarReserva(reservaEditar.id, payload);
            setReservaEditar(null);
          }}
        />
      )}

      {/* 📎 SUBIR COMPROBANTE */}
      {reservaComprobante && (
        <ModalSubirComprobante
          open
          reserva={reservaComprobante}
          onClose={() => setReservaComprobante(null)}
          onSubmit={async (payload) => {
            await subirComprobanteAdmin(reservaComprobante.id, payload);
            await confirmarReservaManual(reservaComprobante.id);
            agregarNotificacion(
              "Comprobante subido y reserva confirmada",
              "success"
            );
            setReservaComprobante(null);
          }}
        />
      )}
    </>
  );
};

export default AdminReservasPage;
