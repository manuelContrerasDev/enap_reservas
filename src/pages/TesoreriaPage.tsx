import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
import { useReserva } from "../context/ReservaContext";
import { useAuth } from "../context/AuthContext";

/**
 * TesoreríaPage — Panel administrativo de finanzas ENAP.
 * Paleta: Azul petróleo (#002E3E) + Dorado (#DEC01F)
 * Enfoque: semántica, accesibilidad, legibilidad y estructura visual profesional.
 */
const TesoreriaPage: React.FC = () => {
  const { reservas, loading } = useReserva();
  const { userRole } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null);
  const rowsPerPage = 20;

  /** 🔐 Acceso */
  if (userRole !== "admin") {
    return (
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center text-gray-600">
        <p className="text-lg font-medium">⚠️ No tienes permisos para acceder a este módulo.</p>
      </section>
    );
  }

  /** 📊 Cálculos base */
  const stats = useMemo(() => {
    const ingresos = reservas.filter(r => r.estado === "confirmada").reduce((sum, r) => sum + r.total, 0);
    const canceladas = reservas.filter(r => r.estado === "cancelada").reduce((sum, r) => sum + r.total, 0);
    const pendientes = reservas.filter(r => r.estado === "pendiente").reduce((sum, r) => sum + r.total, 0);
    const balance = ingresos - canceladas;
    return { ingresos, canceladas, pendientes, balance };
  }, [reservas]);

  /** 📈 Datos para gráficos */
  const chartData = useMemo(() => {
    const grouped: Record<string, { fecha: string; ingresos: number; canceladas: number; pendientes: number }> = {};
    reservas.forEach(r => {
      const fecha = new Date(r.fecha_inicio).toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
      if (!grouped[fecha]) grouped[fecha] = { fecha, ingresos: 0, canceladas: 0, pendientes: 0 };
      if (r.estado === "confirmada") grouped[fecha].ingresos += r.total;
      if (r.estado === "cancelada") grouped[fecha].canceladas += r.total;
      if (r.estado === "pendiente") grouped[fecha].pendientes += r.total;
    });
    return Object.values(grouped).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [reservas]);

  /** 🔍 Filtrado */
  const filteredReservas = useMemo(() => {
    let filtered = reservas;
    if (estadoFiltro) filtered = filtered.filter(r => r.estado === estadoFiltro);
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.usuario?.toLowerCase().includes(lower) ||
          r.espacio_nombre?.toLowerCase().includes(lower)
      );
    }
    return filtered;
  }, [reservas, searchTerm, estadoFiltro]);

  /** 📄 Paginación */
  const totalPages = Math.ceil(filteredReservas.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredReservas.slice(startIndex, startIndex + rowsPerPage);

  const handlePrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  const filtros = [
    { label: "Confirmadas", estado: "confirmada", icon: <CheckCircle size={14} className="text-green-600" /> },
    { label: "Pendientes", estado: "pendiente", icon: <Clock size={14} className="text-yellow-600" /> },
    { label: "Canceladas", estado: "cancelada", icon: <XCircle size={14} className="text-red-600" /> },
  ];

  /** 📤 Exportar CSV (sin perder sincronización con filtros/búsqueda) */
  const handleExportCSV = () => {
    if (!filteredReservas.length) {
      alert("⚠️ No hay datos para exportar.");
      return;
    }

    // Totales según filtros aplicados
    const totalesFiltrados = filteredReservas.reduce(
      (acc, r) => {
        if (r.estado === "confirmada") acc.ingresos += r.total;
        if (r.estado === "pendiente") acc.pendientes += r.total;
        if (r.estado === "cancelada") acc.canceladas += r.total;
        return acc;
      },
      { ingresos: 0, pendientes: 0, canceladas: 0 }
    );
    const balanceFiltrado = totalesFiltrados.ingresos - totalesFiltrados.canceladas;

    const headers = ["Usuario", "Espacio", "Total (CLP)", "Estado", "Fecha de Inicio"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

    const rows = filteredReservas.map(r => [
      r.usuario,
      r.espacio_nombre,
      r.total.toLocaleString("es-CL"),
      r.estado,
      new Date(r.fecha_inicio).toLocaleDateString("es-CL"),
    ]);

    // Bloque de resumen al final (según filtros)
    const resumenBlock = [
      [], // línea en blanco
      ["", "Totales (según filtros)", "", "", ""],
      ["", "Ingresos confirmados", totalesFiltrados.ingresos.toLocaleString("es-CL"), "", ""],
      ["", "Pendientes",          totalesFiltrados.pendientes.toLocaleString("es-CL"), "", ""],
      ["", "Canceladas",          totalesFiltrados.canceladas.toLocaleString("es-CL"), "", ""],
      ["", "Balance",             balanceFiltrado.toLocaleString("es-CL"), "", ""],
    ];

    const csv = [headers, ...rows, ...resumenBlock]
      .map(row => row.map(escape).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const fecha = new Date().toLocaleDateString("es-CL").replace(/\//g, "-");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ENAP_Tesoreria_Reservas_${fecha}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  /** 🎬 Animaciones KPI */
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5 },
    }),
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[#002E3E]">
        <Loader2 className="animate-spin mb-3" size={48} />
        <p className="text-sm text-gray-600">Cargando datos financieros...</p>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-10 px-6 space-y-10">
      {/* 🔷 Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#002E3E]">Tesorería</h1>
          <p className="text-gray-600">Resumen financiero y análisis visual de reservas</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-[#DEC01F] hover:bg-[#E8CF4F] text-[#002E3E] px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
          aria-label="Exportar datos a CSV"
        >
          <FileSpreadsheet size={18} />
          Exportar
        </button>
      </header>

      {/* 📊 KPI */}
      <section aria-label="Indicadores financieros" className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[
          { label: "Ingresos Confirmados", value: stats.ingresos, color: "text-green-600", border: "border-l-4 border-green-500", icon: <TrendingUp className="text-green-500" /> },
          { label: "Pendientes", value: stats.pendientes, color: "text-yellow-600", border: "border-l-4 border-yellow-500", icon: <Clock className="text-yellow-500" /> },
          { label: "Canceladas", value: stats.canceladas, color: "text-red-600", border: "border-l-4 border-red-500", icon: <TrendingDown className="text-red-500" /> },
          { label: "Balance Total", value: stats.balance, color: stats.balance >= 0 ? "text-[#002E3E]" : "text-red-600", border: "border-l-4 border-[#DEC01F]", icon: <DollarSign className="text-[#DEC01F]" /> },
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
              <p className={`text-2xl font-bold ${color}`}>${value.toLocaleString("es-CL")}</p>
            </div>
            {icon}
          </motion.div>
        ))}
      </section>

      {/* 🧾 Tabla principal */}
      <section aria-label="Detalle de reservas" className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
        {/* Header tabla */}
        <div className="flex flex-wrap items-center justify-between bg-[#002E3E] text-white px-6 py-3 gap-3">
          <h2 className="text-lg font-semibold">Detalle de Reservas</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-[#002E3E]/70" />
            <input
              type="text"
              placeholder="Buscar reserva..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#DEC01F] bg-white"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-2 bg-gray-50 border-b border-gray-200">
          {filtros.map(({ label, estado, icon }) => {
            const activo = estadoFiltro === estado;
            return (
              <button
                key={estado}
                onClick={() => setEstadoFiltro(activo ? null : estado)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border transition ${
                  activo
                    ? "bg-[#DEC01F] text-[#002E3E] border-[#DEC01F]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {icon} {label}
              </button>
            );
          })}
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Usuario</th>
                <th className="px-6 py-3 text-left">Espacio</th>
                <th className="px-6 py-3 text-center">Total</th>
                <th className="px-6 py-3 text-center">Estado</th>
                <th className="px-6 py-3 text-center">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((r, i) => (
                <tr
                  key={r.id}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-[#F2F8F9] transition`}
                >
                  <td className="px-6 py-3">{r.usuario}</td>
                  <td className="px-6 py-3">{r.espacio_nombre}</td>
                  <td className="px-6 py-3 text-center">${r.total.toLocaleString("es-CL")}</td>
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
              ))}
              {currentRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center px-6 py-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#002E3E] hover:bg-[#002E3E]/10"
            }`}
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página <strong>{currentPage}</strong> de {totalPages || 1}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#002E3E] hover:bg-[#002E3E]/10"
            }`}
          >
            Siguiente <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* 📊 Gráficos después de la tabla */}
      <section aria-label="Gráficos financieros" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* 📈 Evolución de ingresos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow p-6 border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-[#002E3E] mb-4">Evolución de Ingresos</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="fecha" angle={-25} textAnchor="end" height={60} tick={{ fill: "#374151", fontSize: 12 }} />
              <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString("es-CL")}`} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="ingresos" name="Ingresos Confirmados" fill="#002E3E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 📊 Distribución de estados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: "#374151", fontSize: 13 }} />
              <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString("es-CL")}`} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                <Cell fill="#00796B" />
                <Cell fill="#DEC01F" />
                <Cell fill="#E53935" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>
    </main>
  );
};

export default TesoreriaPage;
