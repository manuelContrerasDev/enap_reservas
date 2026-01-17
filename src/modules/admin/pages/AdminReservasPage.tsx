/* ============================================================
 * AdminReservasPage — Panel Operativo & Financiero
 * ============================================================ */

import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, Link } from "react-router-dom";
import { useReducedMotion, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { PATHS } from "@/app/router/paths";
import { useAuth } from "@/modules/auth/hooks";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";
import { useEspacios } from "@/modules/espacios/context/EspaciosContext";

import { useReservasAdmin } from "@/modules/admin/components/hooks/useReservasAdmin";
import { useReservasKPIs, usePagination, useFadeUp } from "@/modules/pagos/hooks";

import ReservasFilters from "@/modules/admin/components/filters/ReservasFilters";
import ReservasKPIs from "@/modules/admin/components/kpis/ReservasKPIs";
import ReservasTable from "@/modules/admin/components/table/ReservasTable";
import ReservasPagination from "@/modules/admin/components/table/ReservasPagination";

import type { ReservaFrontend } from "@/modules/reservas/types/ReservaFrontend";
import type { ReservaEstado } from "@/shared/types/enums";

import type { EditarReservaPayload } from "@/modules/admin/gestion/reservas/api/editarReserva";
import { editarReserva } from "@/modules/admin/gestion/reservas/api/editarReserva";

// UI
import { Button, Panel, Divider  } from "@/shared/ui/base";
import { LoaderPage } from "@/shared/ui/loaders";

import ModalEditarReserva from "../components/modals/ModalEditarReserva";
import ModalSubirComprobante from "../components/modals/ModalSubirComprobante";
import ModalValidarComprobante from "../components/modals/ModalValidarComprobante";

const ROWS_OPTIONS = [10, 15, 20, 50] as const;

const AdminReservasPage: React.FC = () => {
  /* ============================================================
   * 🔐 Seguridad & Contexto
   * ============================================================ */
  const { role } = useAuth();
  const { agregarNotificacion } = useNotificacion();
  const { espacios } = useEspacios();

  if (role !== "ADMIN") {
    return <Navigate to={PATHS.SOCIO_HOME} replace />;
  }

  /* ============================================================
   * 🎛️ Animaciones & UX
   * ============================================================ */
  const prefersReducedMotion = useReducedMotion();
  const fadeUp = useFadeUp(0.35);

  /* ============================================================
   * 🧠 Estado local (modales)
   * ============================================================ */
  const [reservaEditar, setReservaEditar] =
    useState<ReservaFrontend | null>(null);

  const [reservaComprobante, setReservaComprobante] =
    useState<ReservaFrontend | null>(null);

  const [reservaValidar, setReservaValidar] =
    useState<ReservaFrontend | null>(null);

  /* ============================================================
   * 📦 Data Admin
   * ============================================================ */
  const {
    reservas,
    loading,
    filtros,
    setFiltros,

    cancelarReserva,

    subirComprobanteAdmin,
    aprobarPagoReserva,
    rechazarPagoReserva,
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
   * ❌ Cancelación administrativa
   * ============================================================ */
  const handleCancelar = useCallback(
    async (id: string, motivo?: string) => {
      try {
        await cancelarReserva(id, motivo);
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
   * 📎 Evidencia de pago (no valida)
   * ============================================================ */
  const handleAbrirModalComprobante = useCallback(
    (reserva: ReservaFrontend) => {
      setReservaComprobante(reserva);
    },
    []
  );

  /* ============================================================
   * ✅ Validación financiera (impacta tesorería)
   * ============================================================ */
  const handleAbrirValidacionPago = useCallback(
    (reserva: ReservaFrontend) => {
      setReservaValidar(reserva);
    },
    []
  );

  /* ============================================================
   * 💰 Acciones financieras
   * ============================================================ */
  const handleAprobarPago = async (
    id: string,
    payload?: {
      monto?: number;
      referencia?: string;
      nota?: string;
    }
  ) => {
  await aprobarPagoReserva(id, payload);

    agregarNotificacion("Pago aprobado y reserva confirmada", "success");
    setReservaValidar(null);
  };

  const handleRechazarPago = async (
    id: string,
    payload: { motivo: string }
  ) => {
    await rechazarPagoReserva(id, payload);
    agregarNotificacion("Pago rechazado y reserva liberada", "success");
    setReservaValidar(null);
  };

  const empty = !loading && reservasTyped.length === 0;

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
                  Gestión completa de reservas, pagos y control operativo.
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
                    onSubirComprobante={handleAbrirModalComprobante}
                    onValidarPago={handleAbrirValidacionPago}
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
            agregarNotificacion("Reserva actualizada", "success");
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
            agregarNotificacion(
              "Comprobante subido. Queda pendiente de validación.",
              "success"
            );
            setReservaComprobante(null);
          }}
        />
      )}

      {/* ✅ VALIDAR PAGO */}
      {reservaValidar && (
        <ModalValidarComprobante
          open
          reserva={reservaValidar}
          onClose={() => setReservaValidar(null)}
          onAprobar={handleAprobarPago}
          onRechazar={handleRechazarPago}
        />
      )}
    </>
  );
};

export default AdminReservasPage;
