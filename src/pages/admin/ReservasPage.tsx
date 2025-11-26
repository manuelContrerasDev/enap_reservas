// src/pages/admin/AdminPage.tsx

import React, { useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import { useReserva } from "@/context/ReservaContext";
import { EstadoReserva } from "@/context/ReservaContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { Helmet } from "react-helmet-async";

// Hooks reutilizables
import {
  useReservaFilters,
  useFilterReservas,
  usePagination,
  useReservasKPIs,
  useFadeUp,
} from "@/hooks";

const CLP = new Intl.NumberFormat("es-CL");
const DATE = new Intl.DateTimeFormat("es-CL", { dateStyle: "short" });
const ROWS_OPTIONS = [10, 15, 20, 50] as const;

const TABLE_HEADERS = [
  "Usuario",
  "Espacio",
  "Fechas",
  "Personas",
  "Total",
  "Estado",
  "Acciones",
] as const;

const estadoClassMap: Record<EstadoReserva, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  CONFIRMADA: "bg-green-100 text-green-800 border border-green-300",
  CANCELADA: "bg-red-100 text-red-800 border border-red-300",
  RECHAZADA: "bg-red-100 text-red-800 border border-red-300",
};

const AdminPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const fadeUp = useFadeUp(0.35);

  const {
    reservas,
    loading,
    error,
    cargarReservas,
    actualizarEstado,
    eliminarReserva,
  } = useReserva();

  const { agregarNotificacion } = useNotificacion();
  const { role } = useAuth();

  // 🔐 Guard admin (nota: hooks siempre se llaman arriba)
  if (role !== "ADMIN") return <Navigate to={PATHS.AUTH_LOGIN} replace />;

  // 🔄 Cargar reservas al entrar al panel admin
  useEffect(() => {
    if (role === "ADMIN") {
      cargarReservas();
    }
  }, [role, cargarReservas]);

  // Filtros
  const {
    fUsuario,
    setFUsuario,
    fEspacio,
    setFEspacio,
    fEstado,
    setFEstado,
    fFechaOp,
    setFFechaOp,
    fFecha,
    setFFecha,
    isEmpty: filtrosVacios,
    clear: handleClearFilters,
  } = useReservaFilters();

  const filtered = useFilterReservas(reservas, {
    fUsuario,
    fEspacio,
    fEstado,
    fFechaOp,
    fFecha,
  });

  // Paginación
  const {
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    startIndex,
    endIndex,
    currentSlice: currentRows,
  } = usePagination(filtered, ROWS_OPTIONS, 15);

  // Reset página cuando cambian filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [fUsuario, fEspacio, fEstado, fFechaOp, fFecha, setCurrentPage]);

  const kpis = useReservasKPIs(reservas);

  /** ================================
   *  CAMBIAR ESTADO
   * ================================ */
  const handleEstadoChange = useCallback(
    async (id: string, estado: EstadoReserva) => {
      try {
        await actualizarEstado(id, estado);
        agregarNotificacion("Estado actualizado correctamente.", "success");
      } catch {
        agregarNotificacion("Error al actualizar estado.", "error");
      }
    },
    [actualizarEstado, agregarNotificacion]
  );

  /** ================================
   *  ELIMINAR RESERVA
   * ================================ */
  const handleEliminar = useCallback(
    async (id: string) => {
      if (!confirm("¿Seguro que deseas eliminar esta reserva?")) return;

      try {
        await eliminarReserva(id);
        agregarNotificacion("Reserva eliminada correctamente.", "success");
      } catch {
        agregarNotificacion("Error al eliminar la reserva.", "error");
      }
    },
    [eliminarReserva, agregarNotificacion]
  );

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <>
      <Helmet>
        <title>Administración | ENAP Limache</title>
      </Helmet>

      <main className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-10 px-6">
        {/* Error global */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm">
                Ocurrió un problema al cargar las reservas:{" "}
                <span className="font-medium">{error}</span>
              </p>
              <button
                onClick={cargarReservas}
                className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
              >
                Recargar
              </button>
            </div>
          </div>
        )}

        {/* Loader inicial */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#002E3E]">
            <Loader2 className="animate-spin" size={48} />
          </div>
        ) : (
          <>
            {/* HEADER */}
            <motion.header {...fadeUp} className="mb-10">
              <h1 className="mb-2 text-3xl font-bold text-[#002E3E]">
                Panel de Administración
              </h1>
              <p className="text-gray-600">
                Gestión completa de reservas: revisión, filtros, cambios de estado y eliminación.
              </p>
            </motion.header>

            {/* KPIs */}
            <motion.section
              initial={!prefersReducedMotion ? { opacity: 0 } : undefined}
              animate={!prefersReducedMotion ? { opacity: 1 } : undefined}
              transition={{ delay: 0.15 }}
              className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4"
            >
              {[
                { label: "Total Reservas", value: kpis.total, color: "text-[#002E3E]" },
                { label: "Confirmadas", value: kpis.confirmadas, color: "text-green-600" },
                { label: "Pendientes", value: kpis.pendientes, color: "text-yellow-600" },
                { label: "Canceladas / Rechazadas", value: kpis.canceladas + kpis.rechazadas, color: "text-red-600" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border-l-4 border-[#DEC01F] bg-white p-5 shadow"
                >
                  <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  </div>
                  <Calendar className="text-[#DEC01F]" size={36} />
                </div>
              ))}
            </motion.section>

            {/* FILTROS */}
            <section className="mb-4 rounded-xl border border-gray-100 bg-white shadow-md p-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                <input
                  value={fUsuario}
                  onChange={(e) => setFUsuario(e.target.value)}
                  placeholder="Usuario…"
                  className="rounded border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  value={fEspacio}
                  onChange={(e) => setFEspacio(e.target.value)}
                  placeholder="Espacio…"
                  className="rounded border border-gray-300 px-3 py-2 text-sm"
                />
                <select
                  value={fEstado}
                  onChange={(e) => setFEstado(e.target.value as EstadoReserva | "todas")}
                  className="rounded border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="todas">Todas</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADA">Confirmada</option>
                  <option value="CANCELADA">Cancelada</option>
                  <option value="RECHAZADA">Rechazada</option>
                </select>

                {/* FECHA */}
                <div className="flex gap-2">
                  <select
                    value={fFechaOp}
                    onChange={(e) => setFFechaOp(e.target.value as "<" | ">")}
                    className="rounded border border-gray-300 px-2 py-2 text-sm"
                  >
                    <option value=">">{">"}</option>
                    <option value="<">{"<"}</option>
                  </select>
                  <input
                    type="date"
                    value={fFecha}
                    onChange={(e) => setFFecha(e.target.value)}
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                <button
                  onClick={handleClearFilters}
                  className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Limpiar filtros
                </button>
              </div>
            </section>

            {/* TABLA */}
            <section className="rounded-xl border border-gray-100 bg-white shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-[#002E3E] text-white">
                    <tr>
                      {TABLE_HEADERS.map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-[13px] font-semibold uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {currentRows.map((r, i) => (
                      <motion.tr
                        key={r.id}
                        initial={!prefersReducedMotion ? { opacity: 0 } : undefined}
                        animate={!prefersReducedMotion ? { opacity: 1 } : undefined}
                        transition={{ delay: i * 0.03 }}
                        className="odd:bg-white even:bg-[#F9FAFB] hover:bg-[#F1F8FA]"
                      >
                        {/* Usuario */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col leading-tight">
                            <span className="font-medium text-[#002E3E]">
                              {r.usuario.nombre}
                            </span>
                            <span className="text-xs text-gray-500">
                              {r.usuario.email}
                            </span>
                          </div>
                        </td>

                        {/* Espacio */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#002E3E]" />
                            <span className="font-medium text-gray-800">
                              {r.espacioNombre}
                            </span>
                          </div>
                        </td>

                        {/* Fechas */}
                        <td className="px-6 py-4 text-center">
                          {DATE.format(new Date(r.fechaInicio))} —{" "}
                          {DATE.format(new Date(r.fechaFin))}
                        </td>

                        {/* Personas */}
                        <td className="px-6 py-4 text-center">{r.personas}</td>

                        {/* Total */}
                        <td className="px-6 py-4 text-right font-semibold text-[#DEC01F]">
                          ${CLP.format(r.total)}
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4 text-center">
                          <select
                            value={r.estado}
                            onChange={(e) =>
                              handleEstadoChange(r.id, e.target.value as EstadoReserva)
                            }
                            className={`rounded px-2 py-1 text-xs font-medium ${estadoClassMap[r.estado]}`}
                          >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="CONFIRMADA">Confirmada</option>
                            <option value="CANCELADA">Cancelada</option>
                            <option value="RECHAZADA">Rechazada</option>
                          </select>
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEliminar(r.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar reserva"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}

                    {currentRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={TABLE_HEADERS.length}
                          className="px-6 py-6 text-center text-gray-600"
                        >
                          {reservas.length === 0 && filtrosVacios
                            ? "Aún no hay reservas registradas."
                            : "No hay resultados con los filtros aplicados."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINACIÓN */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>
                    Mostrando {startIndex + 1}–{endIndex} de {filtered.length}
                  </span>

                  <div className="flex items-center gap-2">
                    <span>Filas por página:</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) =>
                        setRowsPerPage(Number(e.target.value) as (typeof ROWS_OPTIONS)[number])
                      }
                      className="rounded border border-gray-300 px-2 py-1 text-xs"
                    >
                      {ROWS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded px-3 py-1 text-sm text-[#002E3E] disabled:text-gray-400"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>

                  <span className="px-2 text-sm">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded px-3 py-1 text-sm text-[#002E3E] disabled:text-gray-400"
                  >
                    Siguiente
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default AdminPage;
