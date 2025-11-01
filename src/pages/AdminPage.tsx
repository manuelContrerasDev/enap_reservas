import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  MapPin,
  DollarSign,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useReserva } from "../context/ReservaContext";
import { useNotificacion } from "../context/NotificacionContext";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { PATHS } from "../routes/paths";

/**
 * AdminPage — Panel administrativo ENAP
 * Gestión de reservas con filtros y paginación.
 * Filtros: usuario, espacio, estado, fecha_inicio (>, <).
 */
const AdminPage: React.FC = () => {
  const { reservas, eliminarReserva, actualizarEstado, loading } = useReserva();
  const { agregarNotificacion } = useNotificacion();
  const { userRole } = useAuth();

  /** 🚫 Acceso */
  if (userRole !== "admin") {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  /** 🎨 Colores estado */
  const getEstadoColor = useCallback((estado: string) => {
    const map: Record<string, string> = {
      confirmada: "bg-green-100 text-green-800 border border-green-300",
      pendiente: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      cancelada: "bg-red-100 text-red-800 border border-red-300",
    };
    return map[estado] || "bg-gray-100 text-gray-800 border border-gray-300";
  }, []);

  /** 📊 KPIs (sobre universo completo, no filtrado) */
  const kpis = useMemo(() => {
    const total = reservas.length;
    const confirmadas = reservas.filter((r) => r.estado === "confirmada").length;
    const pendientes = reservas.filter((r) => r.estado === "pendiente").length;
    const canceladas = reservas.filter((r) => r.estado === "cancelada").length;
    return { total, confirmadas, pendientes, canceladas };
  }, [reservas]);

  /** 🔄 Acciones */
  const handleEstadoChange = async (
    id: string,
    nuevoEstado: "pendiente" | "confirmada" | "cancelada"
  ) => {
    try {
      await actualizarEstado(id, nuevoEstado);
      agregarNotificacion(`✅ Estado actualizado a: ${nuevoEstado}`, "success");
    } catch {
      agregarNotificacion("❌ Error al actualizar el estado", "error");
    }
  };

  const handleEliminarReserva = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta reserva?")) return;
    try {
      await eliminarReserva(id);
      agregarNotificacion("🗑️ Reserva eliminada correctamente", "success");
      // ajuste de página se maneja en useEffect de paginación
    } catch {
      agregarNotificacion("❌ Error al eliminar la reserva", "error");
    }
  };

  /** ⏳ Loader */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-[#002E3E]">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  /** 🧭 Filtros (cliente) */
  const [fUsuario, setFUsuario] = useState("");
  const [fEspacio, setFEspacio] = useState("");
  const [fEstado, setFEstado] = useState<"todas" | "pendiente" | "confirmada" | "cancelada">(
    "todas"
  );
  const [fFechaOp, setFFechaOp] = useState<">" | "<">(">");
  const [fFecha, setFFecha] = useState<string>("");

  // Al cambiar filtros, volvemos a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [fUsuario, fEspacio, fEstado, fFecha, fFechaOp]);

  const filtered = useMemo(() => {
    const lower = (s: string) => s.toLowerCase();
    const fechaRef = fFecha ? new Date(`${fFecha}T00:00:00`) : null;

    return reservas.filter((r) => {
      const okUsuario = fUsuario.trim()
        ? (r.usuario || "").toLowerCase().includes(lower(fUsuario))
        : true;
      const okEspacio = fEspacio.trim()
        ? (r.espacio_nombre || "").toLowerCase().includes(lower(fEspacio))
        : true;
      const okEstado = fEstado === "todas" ? true : r.estado === fEstado;

      let okFecha = true;
      if (fechaRef) {
        const fIni = new Date(r.fecha_inicio);
        okFecha = fFechaOp === ">" ? fIni > fechaRef : fIni < fechaRef;
      }
      return okUsuario && okEspacio && okEstado && okFecha;
    });
  }, [reservas, fUsuario, fEspacio, fEstado, fFecha, fFechaOp]);

  /** 📄 Paginación sobre filtrados */
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filtered.length);

  const currentRows = useMemo(
    () => filtered.slice(startIndex, endIndex),
    [filtered, startIndex, endIndex]
  );

  // Si cambia tamaño/filtrado y la página actual queda fuera, ajústala
  useEffect(() => {
    const nextTotalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    if (currentPage > nextTotalPages) setCurrentPage(nextTotalPages);
  }, [filtered.length, rowsPerPage, currentPage]);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const handleClearFilters = () => {
    setFUsuario("");
    setFEspacio("");
    setFEstado("todas");
    setFFecha("");
    setFFechaOp(">");
  };

  return (
    <main className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-10 px-6">
      {/* 🔷 Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-[#002E3E] mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Gestión de reservas: control, confirmación y cancelación.
        </p>
      </motion.header>

      {/* 📊 KPIs */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-6"
      >
        {[
          {
            label: "Total Reservas",
            value: kpis.total,
            color: "text-[#002E3E]",
            icon: <Calendar className="text-[#DEC01F]" size={36} />,
          },
          {
            label: "Confirmadas",
            value: kpis.confirmadas,
            color: "text-green-600",
            icon: <Calendar className="text-green-500" size={36} />,
          },
          {
            label: "Pendientes",
            value: kpis.pendientes,
            color: "text-yellow-600",
            icon: <Calendar className="text-yellow-500" size={36} />,
          },
          {
            label: "Canceladas",
            value: kpis.canceladas,
            color: "text-red-600",
            icon: <Calendar className="text-red-500" size={36} />,
          },
        ].map(({ label, value, color, icon }) => (
          <div
            key={label}
            className="bg-white rounded-lg shadow p-5 flex items-center justify-between border-l-4 border-[#DEC01F]"
          >
            <div>
              <p className="text-sm text-gray-600">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
            {icon}
          </div>
        ))}
      </motion.section>

      {/* 🔎 Filtros */}
      <section className="bg-white rounded-xl shadow-md border border-gray-100 mb-4">
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Usuario</label>
            <input
              value={fUsuario}
              onChange={(e) => setFUsuario(e.target.value)}
              placeholder="Buscar por usuario…"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#002E3E] outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Espacio</label>
            <input
              value={fEspacio}
              onChange={(e) => setFEspacio(e.target.value)}
              placeholder="Buscar por espacio…"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#002E3E] outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Estado</label>
            <select
              value={fEstado}
              onChange={(e) =>
                setFEstado(e.target.value as "todas" | "pendiente" | "confirmada" | "cancelada")
              }
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#002E3E]"
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">Fecha (inicio)</label>
            <div className="flex gap-2">
              <select
                value={fFechaOp}
                onChange={(e) => setFFechaOp(e.target.value as ">" | "<")}
                className="border border-gray-300 rounded px-2 py-2 text-sm bg-white focus:ring-2 focus:ring-[#002E3E]"
                title="Operador de comparación"
              >
                <option value=">">{">"}</option>
                <option value="<">{"<"}</option>
              </select>
              <input
                type="date"
                value={fFecha}
                onChange={(e) => setFFecha(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#002E3E] outline-none"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full md:w-auto px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700"
              title="Limpiar filtros"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </section>

      {/* 🧾 Tabla de reservas (filtrada + paginada) */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[#002E3E] text-white">
              <tr>
                {[
                  "Usuario",
                  "Espacio",
                  "Fechas",
                  "Personas",
                  "Total",
                  "Estado",
                  "Acciones",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-[13px]"
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="odd:bg-white even:bg-[#F9FAFB] hover:bg-[#F1F8FA] transition-colors"
                >
                  {/* Usuario */}
                  <td className="px-6 py-4 text-gray-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span>{r.usuario}</span>
                    </div>
                  </td>

                  {/* Espacio */}
                  <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{r.espacio_nombre}</span>
                    </div>
                  </td>

                  {/* Fechas */}
                  <td className="px-6 py-4 text-center text-gray-700 whitespace-nowrap">
                    {new Date(r.fecha_inicio).toLocaleDateString("es-CL")} —{" "}
                    {new Date(r.fecha_fin).toLocaleDateString("es-CL")}
                  </td>

                  {/* Personas */}
                  <td className="px-6 py-4 text-center font-medium text-gray-900">
                    {r.personas}
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 text-right font-semibold text-[#DEC01F]">
                    ${r.total.toLocaleString("es-CL")}
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(
                        r.estado
                      )}`}
                    >
                      {r.estado}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <select
                        value={r.estado}
                        onChange={(e) =>
                          handleEstadoChange(
                            r.id,
                            e.target.value as "pendiente" | "confirmada" | "cancelada"
                          )
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#002E3E] bg-white"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>

                      <button
                        onClick={() => handleEliminarReserva(r.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Eliminar reserva"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {currentRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center text-gray-500 italic">
                    No hay resultados con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔢 Paginación */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Mostrando <strong>{filtered.length === 0 ? 0 : startIndex + 1}</strong>–
            <strong>{endIndex}</strong> de <strong>{filtered.length}</strong> reservas
            {filtered.length !== reservas.length && (
              <span className="ml-2 text-gray-500">(filtrado de {reservas.length})</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Filas por página:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-[#002E3E]"
            >
              {[10, 15, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#002E3E] hover:bg-[#002E3E]/10"
                }`}
                aria-label="Página anterior"
              >
                <ChevronLeft size={16} /> Anterior
              </button>

              <span className="px-2 text-sm text-gray-700">
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || filtered.length === 0}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === totalPages || filtered.length === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#002E3E] hover:bg-[#002E3E]/10"
                }`}
                aria-label="Página siguiente"
              >
                Siguiente <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default AdminPage;
