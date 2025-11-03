// src/pages/TesoreriaPage.tsx
import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Helmet } from "react-helmet-async";
import { useReserva } from "@/context/ReservaContext";
import { useAuth } from "@/context/AuthContext";
import { usePagination, useFadeUp } from "@/hooks";

const CLP = new Intl.NumberFormat("es-CL");
const ROWS_OPTIONS = [10, 20, 50] as const;

const TesoreriaPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const fadeUp = useFadeUp(0.35);

  const { reservas, loading, error, cargarReservas } = useReserva();
  const { userRole } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null);

  if (userRole !== "admin") {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center text-center text-gray-600">
        <p className="text-lg font-medium">⚠️ No tienes permisos para acceder a este módulo.</p>
      </section>
    );
  }

  // 📊 Cálculo de totales y pagos
  const stats = useMemo(() => {
    let ingresos = 0;
    let pendientes = 0;
    let canceladas = 0;

    for (const r of reservas) {
      if (r.estado === "confirmada") ingresos += r.total;
      else if (r.estado === "pendiente") pendientes += r.total;
      else if (r.estado === "cancelada") canceladas += r.total;
    }

    return {
      ingresos,
      pendientes,
      canceladas,
      balance: ingresos,
    };
  }, [reservas]);

  // 📈 Datos del gráfico
  const chartData = useMemo(() => {
    const grouped: Record<string, { fecha: string; ingresos: number }> = {};

    for (const r of reservas) {
      const d = new Date(r.fecha_inicio);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      const label = d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
      if (!grouped[key]) grouped[key] = { fecha: label, ingresos: 0 };
      if (r.estado === "confirmada") grouped[key].ingresos += r.total;
    }

    return Object.values(grouped).sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
  }, [reservas]);

  // 🔍 Filtrado
  const filteredReservas = useMemo(() => {
    let data = reservas;
    if (estadoFiltro) data = data.filter((r) => r.estado === estadoFiltro);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          (r.usuario || "").toLowerCase().includes(q) ||
          (r.espacio_nombre || "").toLowerCase().includes(q)
      );
    }
    return data;
  }, [reservas, searchTerm, estadoFiltro]);

  // 📄 Paginación
  const {
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    startIndex,
    endIndex,
    currentSlice: currentRows,
  } = usePagination(filteredReservas, ROWS_OPTIONS, 20);

  // 📤 Exportar CSV
  const handleExportCSV = () => {
    if (!filteredReservas.length) {
      alert("⚠️ No hay datos para exportar.");
      return;
    }

    const headers = ["Usuario", "Espacio", "Total (CLP)", "Pago", "Pagado", "Estado", "Fecha"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

    const rows = filteredReservas.map((r) => [
      r.usuario,
      r.espacio_nombre,
      CLP.format(r.total),
      r.estado === "confirmada" ? "pagado" : "pendiente",
      r.estado === "confirmada" ? CLP.format(r.total) : "$0",
      r.estado,
      new Date(r.fecha_inicio).toLocaleDateString("es-CL"),
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const fecha = new Date().toLocaleDateString("es-CL").replace(/\//g, "-");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ENAP_Tesoreria_${fecha}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // 🎬 Animaciones KPI
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.45 },
    }),
  };

  return (
    <main className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-10 px-6 space-y-10">
      <Helmet>
        <title>Tesorería | ENAP Limache</title>
      </Helmet>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">
              Error al cargar los datos: <span className="font-medium">{error}</span>
            </p>
            <button
              onClick={cargarReservas}
              className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-[#002E3E]">
          <Loader2 className="animate-spin mb-3" size={48} />
          <p className="text-sm text-gray-600">Cargando datos financieros…</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <motion.header
            {...(prefersReducedMotion ? {} : fadeUp)}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-[#002E3E]">Tesorería</h1>
              <p className="text-gray-600">Resumen financiero y análisis visual de reservas</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-[#DEC01F] hover:bg-[#E8CF4F] text-[#002E3E] px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
            >
              <FileSpreadsheet size={18} /> Exportar
            </button>
          </motion.header>

          {/* KPIs */}
          <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { label: "Ingresos", value: stats.ingresos, color: "text-green-600", border: "border-l-4 border-green-500", icon: <TrendingUp className="text-green-500" /> },
              { label: "Pendientes", value: stats.pendientes, color: "text-yellow-600", border: "border-l-4 border-yellow-500", icon: <Clock className="text-yellow-500" /> },
              { label: "Canceladas", value: stats.canceladas, color: "text-red-600", border: "border-l-4 border-red-500", icon: <TrendingDown className="text-red-500" /> },
              { label: "Balance", value: stats.balance, color: "text-[#002E3E]", border: "border-l-4 border-[#DEC01F]", icon: <DollarSign className="text-[#DEC01F]" /> },
            ].map(({ label, value, color, border, icon }, i) => (
              <motion.div
                key={label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className={`bg-white rounded-lg shadow p-5 flex items-center justify-between ${border}`}
              >
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>${CLP.format(value)}</p>
                </div>
                {icon}
              </motion.div>
            ))}
          </section>

          {/* Tabla */}
          <section className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center bg-[#002E3E] text-white px-6 py-3">
              <h2 className="text-lg font-semibold">Detalle de Reservas</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-[#002E3E]/70" />
                <input
                  type="text"
                  placeholder="Buscar reserva..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-[#DEC01F] bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Usuario</th>
                    <th className="px-6 py-3 text-left">Espacio</th>
                    <th className="px-6 py-3 text-center">Total</th>
                    <th className="px-6 py-3 text-center">Pago</th>
                    <th className="px-6 py-3 text-center">Pagado</th>
                    <th className="px-6 py-3 text-center">Estado</th>
                    <th className="px-6 py-3 text-center">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((r, i) => {
                    const pagoEstado = r.estado === "confirmada" ? "pagado" : "pendiente";
                    const pagoMonto = r.estado === "confirmada" ? r.total : 0;
                    return (
                      <tr
                        key={r.id}
                        className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-[#F2F8F9] transition`}
                      >
                        <td className="px-6 py-3">{r.usuario}</td>
                        <td className="px-6 py-3">{r.espacio_nombre}</td>
                        <td className="px-6 py-3 text-center">${CLP.format(r.total)}</td>
                        <td className="px-6 py-3 text-center">{pagoEstado}</td>
                        <td className="px-6 py-3 text-center">${CLP.format(pagoMonto)}</td>
                        <td
                          className={`px-6 py-3 text-center font-semibold ${
                            r.estado === "confirmada"
                              ? "text-green-600"
                              : r.estado === "pendiente"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {r.estado}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {new Date(r.fecha_inicio).toLocaleDateString("es-CL")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Gráficos */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow p-6 border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-[#002E3E] mb-4">Ingresos por fecha</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="fecha" angle={-25} textAnchor="end" height={60} tick={{ fill: "#374151", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => `$${CLP.format(v)}`} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="ingresos" fill="#002E3E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-lg shadow p-6 border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-[#002E3E] mb-4">Distribución de Estados</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[
                    { name: "Confirmadas", total: stats.ingresos },
                    { name: "Pendientes", total: stats.pendientes },
                    { name: "Canceladas", total: stats.canceladas },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fill: "#374151", fontSize: 13 }} />
                  <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => `$${CLP.format(v)}`} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    <Cell fill="#00796B" />
                    <Cell fill="#DEC01F" />
                    <Cell fill="#E53935" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </section>
        </>
      )}
    </main>
  );
};

export default TesoreriaPage;
