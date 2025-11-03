// src/pages/AdminPage.tsx
import React, { useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  User,
  MapPin,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useReserva } from "../context/ReservaContext";
import type { EstadoReserva } from "../context/ReservaContext";
import { useNotificacion } from "../context/NotificacionContext";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { PATHS } from "../routes/paths";
import { Helmet } from "react-helmet-async";

// 🔌 hooks reutilizables
import {
  useReservaFilters,
  useFilterReservas,
  usePagination,
  useReservasKPIs,
  useFadeUp,
} from "@/hooks";

/** Constantes UI */
const CLP = new Intl.NumberFormat("es-CL");
const DATE = new Intl.DateTimeFormat("es-CL", { dateStyle: "short" });
const ROWS_OPTIONS = [10, 15, 20, 50] as const;
const TABLE_HEADERS = ["Usuario", "Espacio", "Fechas", "Personas", "Total", "Estado", "Acciones"] as const;

/** Chip por estado */
const estadoClassMap: Record<EstadoReserva, string> = {
  confirmada: "bg-green-100 text-green-800 border border-green-300",
  pendiente: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  cancelada: "bg-red-100 text-red-800 border border-red-300",
};

const AdminPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const fadeUp = useFadeUp(0.35);

  // Contextos
  const { reservas, eliminarReserva, actualizarEstado, loading, error, cargarReservas } = useReserva();
  const { agregarNotificacion } = useNotificacion();
  const { userRole } = useAuth();

  // Filtros (separados en hook)
  const {
    fUsuario, setFUsuario,
    fEspacio, setFEspacio,
    fEstado, setFEstado,
    fFechaOp, setFFechaOp,
    fFecha, setFFecha,
    isEmpty: filtrosVacios,
    clear: handleClearFilters,
  } = useReservaFilters();

  // Aplicar filtros a las reservas
  const filtered = useFilterReservas(reservas, {
    fUsuario, fEspacio, fEstado, fFechaOp, fFecha,
  });

  // Paginación sobre la lista filtrada
  const {
    currentPage, setCurrentPage,
    rowsPerPage, setRowsPerPage,
    totalPages, startIndex, endIndex,
    currentSlice: currentRows,
  } = usePagination(filtered, ROWS_OPTIONS, 15);

  // Resetear a página 1 cuando cambie cualquier filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [fUsuario, fEspacio, fEstado, fFechaOp, fFecha, setCurrentPage]);

  // KPIs
  const kpis = useReservasKPIs(reservas);

  // Acciones
  const handleEstadoChange = useCallback(
    async (id: string, nuevoEstado: EstadoReserva) => {
      try {
        await actualizarEstado(id, nuevoEstado);
        agregarNotificacion(`✅ Estado actualizado a: ${nuevoEstado}`, "success");
      } catch {
        agregarNotificacion("❌ Error al actualizar el estado", "error");
      }
    },
    [actualizarEstado, agregarNotificacion]
  );

  const handleEliminar = useCallback(
    async (id: string) => {
      if (!confirm("¿Seguro que deseas eliminar esta reserva?")) return;
      try {
        await eliminarReserva(id);
        agregarNotificacion("🗑️ Reserva eliminada correctamente", "success");
      } catch {
        agregarNotificacion("❌ Error al eliminar la reserva", "error");
      }
    },
    [eliminarReserva, agregarNotificacion]
  );

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Guard
  if (userRole !== "admin") {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return (
    <>
      <Helmet>
        <title>Administración | ENAP Limache</title>
      </Helmet>

      <main
        className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-10 px-6"
        role="main"
        aria-labelledby="admin-title"
      >
        {/* Error banner */}
        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm">
                Ocurrió un problema al cargar las reservas: <span className="font-medium">{error}</span>
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

        {/* Loader (sin return temprano para no romper orden de hooks) */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#002E3E]">
            <Loader2 className="animate-spin" size={48} />
          </div>
        ) : (
          <>
            {/* Header */}
            <motion.header {...fadeUp} className="mb-10">
              <h1 id="admin-title" className="mb-2 text-3xl font-bold text-[#002E3E]">
                Panel de Administración
              </h1>
              <p className="text-gray-600">Gestión de reservas: control, confirmación y cancelación.</p>
            </motion.header>

            {/* KPIs */}
            <motion.section
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.15 }}
              className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4"
              aria-label="Indicadores de reservas"
            >
              {[
                { label: "Total Reservas", value: kpis.total, color: "text-[#002E3E]", Icon: Calendar, iconClass: "text-[#DEC01F]" },
                { label: "Confirmadas", value: kpis.confirmadas, color: "text-green-600", Icon: Calendar, iconClass: "text-green-500" },
                { label: "Pendientes", value: kpis.pendientes, color: "text-yellow-600", Icon: Calendar, iconClass: "text-yellow-500" },
                { label: "Canceladas", value: kpis.canceladas, color: "text-red-600", Icon: Calendar, iconClass: "text-red-500" },
              ].map(({ label, value, color, Icon, iconClass }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border-l-4 border-[#DEC01F] bg-white p-5 shadow"
                  role="status"
                  aria-label={label}
                >
                  <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  </div>
                  <Icon className={iconClass} size={36} aria-hidden="true" />
                </div>
              ))}
            </motion.section>

            {/* Filtros */}
            <section className="mb-4 rounded-xl border border-gray-100 bg-white shadow-md" aria-label="Filtros de búsqueda">
              <div className="grid grid-cols-1 gap-3 px-6 py-4 md:grid-cols-5">
                <div className="flex flex-col">
                  <label className="mb-1 text-xs font-semibold text-gray-600" htmlFor="f-usuario">Usuario</label>
                  <input
                    id="f-usuario"
                    value={fUsuario}
                    onChange={(e) => setFUsuario(e.target.value)}
                    placeholder="Buscar por usuario…"
                    className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#002E3E]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-xs font-semibold text-gray-600" htmlFor="f-espacio">Espacio</label>
                  <input
                    id="f-espacio"
                    value={fEspacio}
                    onChange={(e) => setFEspacio(e.target.value)}
                    placeholder="Buscar por espacio…"
                    className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#002E3E]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-xs font-semibold text-gray-600" htmlFor="f-estado">Estado</label>
                  <select
                    id="f-estado"
                    value={fEstado}
                    onChange={(e) => setFEstado(e.target.value as "todas" | EstadoReserva)}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#002E3E]"
                  >
                    <option value="todas">Todas</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-xs font-semibold text-gray-600" htmlFor="f-fecha">Fecha (inicio)</label>
                  <div className="flex gap-2">
                    <select
                      aria-label="Operador de comparación de fecha"
                      value={fFechaOp}
                      onChange={(e) => setFFechaOp(e.target.value as ">" | "<")}
                      className="rounded border border-gray-300 bg-white px-2 py-2 text-sm focus:ring-2 focus:ring-[#002E3E]"
                      title="Operador de comparación"
                    >
                      <option value=">">{">"}</option>
                      <option value="<">{"<"}</option>
                    </select>
                    <input
                      id="f-fecha"
                      type="date"
                      value={fFecha}
                      onChange={(e) => setFFecha(e.target.value)}
                      className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#002E3E]"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="w-full rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 md:w-auto"
                    title="Limpiar filtros"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </section>

            {/* Tabla */}
            <motion.section
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.1 }}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md"
              aria-label="Listado de reservas"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <caption className="sr-only">Tabla de reservas con acciones</caption>
                  <thead className="bg-[#002E3E] text-white">
                    <tr>
                      {TABLE_HEADERS.map((head) => (
                        <th
                          key={head}
                          scope="col"
                          className="px-6 py-3 text-left text-[13px] font-semibold uppercase tracking-wide"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {currentRows.map((r, i) => (
                      <motion.tr
                        key={r.id}
                        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1 }}
                        transition={prefersReducedMotion ? undefined : { delay: i * 0.03 }}
                        className="transition-colors odd:bg-white even:bg-[#F9FAFB] hover:bg-[#F1F8FA]"
                      >
                        {/* Usuario */}
                        <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" aria-hidden="true" />
                            <span>{r.usuario}</span>
                          </div>
                        </td>

                        {/* Espacio */}
                        <td className="whitespace-nowrap px-6 py-4 text-gray-800">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" aria-hidden="true" />
                            <span>{r.espacio_nombre}</span>
                          </div>
                        </td>

                        {/* Fechas */}
                        <td className="whitespace-nowrap px-6 py-4 text-center text-gray-700">
                          {DATE.format(new Date(r.fecha_inicio))} — {DATE.format(new Date(r.fecha_fin))}
                        </td>

                        {/* Personas */}
                        <td className="px-6 py-4 text-center font-medium text-gray-900 tabular-nums">
                          {r.personas}
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 text-right font-semibold text-[#DEC01F] tabular-nums">
                          ${CLP.format(r.total)}
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              estadoClassMap[r.estado as EstadoReserva] ??
                              "border border-gray-300 bg-gray-100 text-gray-800"
                            }`}
                          >
                            {r.estado}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <label className="sr-only" htmlFor={`estado-${r.id}`}>
                              Cambiar estado
                            </label>
                            <select
                              id={`estado-${r.id}`}
                              value={r.estado}
                              onChange={(e) => handleEstadoChange(r.id, e.target.value as EstadoReserva)}
                              className="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-[#002E3E]"
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="confirmada">Confirmada</option>
                              <option value="cancelada">Cancelada</option>
                            </select>

                            <button
                              onClick={() => handleEliminar(r.id)}
                              className="text-red-600 transition hover:text-red-800"
                              title="Eliminar reserva"
                              aria-label={`Eliminar reserva de ${r.usuario} en ${r.espacio_nombre}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
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

              {/* Paginación */}
              <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-6 py-3 md:flex-row md:items-center md:justify-between md:gap-0">
                <div className="text-sm text-gray-600">
                  Mostrando <strong>{filtered.length === 0 ? 0 : startIndex + 1}</strong>–
                  <strong>{endIndex}</strong> de <strong>{filtered.length}</strong> reservas
                  {filtered.length !== reservas.length && (
                    <span className="ml-2 text-gray-500">(filtrado de {reservas.length})</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600" htmlFor="rows">
                    Filas por página:
                  </label>
                  <select
                    id="rows"
                    value={rowsPerPage}
                    onChange={(e) => {
                      const n = Number(e.target.value) as (typeof ROWS_OPTIONS)[number];
                      setRowsPerPage(n);
                      setCurrentPage(1);
                    }}
                    className="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-[#002E3E]"
                  >
                    {ROWS_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium ${
                        currentPage === 1
                          ? "cursor-not-allowed text-gray-400"
                          : "text-[#002E3E] hover:bg-[#002E3E]/10"
                      }`}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={16} aria-hidden="true" /> Anterior
                    </button>

                    <span className="px-2 text-sm text-gray-700">
                      Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                    </span>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || filtered.length === 0}
                      className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium ${
                        currentPage === totalPages || filtered.length === 0
                          ? "cursor-not-allowed text-gray-400"
                          : "text-[#002E3E] hover:bg-[#002E3E]/10"
                      }`}
                      aria-label="Página siguiente"
                    >
                      Siguiente <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          </>
        )}
      </main>
    </>
  );
};

export default AdminPage;
