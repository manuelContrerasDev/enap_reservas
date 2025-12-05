// src/pages/admin/AdminEspaciosPage.tsx
import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2, Edit, PlusCircle, Filter } from "lucide-react";

import { useEspacios } from "@/context/EspaciosContext";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

import ModalNuevoEspacio from "@/components/modals/ModalNuevoEspacio";
import ModalEditarEspacio from "@/components/modals/ModalEditarEspacio";
import ModalConfirmarEliminar from "@/components/modals/ModalConfirmarEliminar";

import type { Espacio } from "@/context/EspaciosContext";

type FiltroEstado = "TODOS" | "ACTIVOS" | "INACTIVOS";

const AdminEspaciosPage: React.FC = () => {
  const { espacios, loading, toggleActivo, eliminarEspacio } = useEspacios();
  const { role } = useAuth();

  // MODALES
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  const [confirmarEliminarAbierto, setConfirmarEliminarAbierto] = useState(false);
  const [espacioAEliminar, setEspacioAEliminar] = useState<Espacio | null>(null);


  const [espacioSeleccionado, setEspacioSeleccionado] = useState<Espacio | null>(null);

  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("TODOS");

  // ⛔️ FIX: no retornamos hooks condicionales
  if (!role) {
    return (
      <div className="text-center py-20">
        <Loader2 className="animate-spin mx-auto" size={32} />
      </div>
    );
  }

  const noEsAdmin = role !== "ADMIN";

  // ⚠️ IMPORTANTE: Hooks ya fueron ejecutados ANTES del return.
  if (noEsAdmin) {
    return <Navigate to={PATHS.AUTH_LOGIN} replace />;
  }

  const espaciosFiltrados = useMemo(() => {
    if (filtroEstado === "ACTIVOS") return espacios.filter((e) => e.activo);
    if (filtroEstado === "INACTIVOS") return espacios.filter((e) => !e.activo);
    return espacios;
  }, [espacios, filtroEstado]);

  const handleToggle = useCallback(
    (id: string) => {
      toggleActivo(id);
    },
    [toggleActivo]
  );

  const confirmarEliminar = async (id: string) => {
  const seguro = window.confirm(
      "¿Estás seguro de eliminar este espacio? Esta acción NO se puede deshacer."
    );

    if (!seguro) return;

    const ok = await eliminarEspacio(id);

    if (!ok) {
      alert("❌ No se pudo eliminar el espacio.");
    }
  };

  const ejecutarEliminacion = async () => {
    if (!espacioAEliminar) return;

    const ok = await eliminarEspacio(espacioAEliminar.id);

    setConfirmarEliminarAbierto(false);
    setEspacioAEliminar(null);

    if (!ok) {
      alert("❌ Error al eliminar el espacio.");
    }
  };


  return (
    <main className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 rounded-lg">

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-[#002E3E]">
          <Loader2 className="animate-spin" size={48} />
          <p className="mt-2 text-gray-600 text-sm">Cargando espacios...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* HEADER */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-[#002E3E] mb-1">
                Gestión de Espacios
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Administra los espacios disponibles para los socios.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
                  className="text-sm text-gray-700 bg-transparent focus:outline-none"
                >
                  <option value="TODOS">Todos</option>
                  <option value="ACTIVOS">Activos</option>
                  <option value="INACTIVOS">Inactivos</option>
                </select>
              </div>

              <button
                onClick={() => setModalNuevoAbierto(true)}
                className="flex items-center justify-center gap-2 bg-[#DEC01F] text-[#002E3E] px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:bg-[#E5C845]"
              >
                <PlusCircle size={18} /> Nuevo Espacio
              </button>
            </div>
          </motion.header>

          {/* TABLA */}
          <section className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {espaciosFiltrados.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No hay espacios que coincidan con el filtro seleccionado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm sm:text-base">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold border-b">
                    <tr>
                      <th className="px-6 py-3 text-left">Nombre</th>
                      <th className="px-6 py-3 text-left">Tipo</th>
                      <th className="px-6 py-3 text-left">Tarifa (Socio)</th>
                      <th className="px-6 py-3 text-left">Capacidad</th>
                      <th className="px-6 py-3 text-left">Estado</th>
                      <th className="px-6 py-3 text-left">Acciones</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence initial={false}>
                      {espaciosFiltrados.map((e) => (
                        <motion.tr
                          key={e.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-3 font-medium">{e.nombre}</td>
                          <td className="px-6 py-3 text-gray-600">{e.tipo}</td>

                          <td className="px-6 py-3 text-gray-800">
                            ${e.tarifaClp.toLocaleString("es-CL")}
                          </td>

                          <td className="px-6 py-3 text-gray-600">
                            {e.capacidad}
                            {e.capacidadExtra ? ` (+${e.capacidadExtra})` : ""}
                          </td>

                          <td className="px-6 py-3">
                            <button
                              onClick={() => handleToggle(e.id)}
                              className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                                e.activo
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              {e.activo ? "Activo" : "Inactivo"}
                            </button>
                          </td>

                          <td className="px-6 py-3 flex items-center gap-3">
                            <button
                              onClick={() => {
                                setEspacioSeleccionado(e);
                                setModalEditarAbierto(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit size={18} />
                            </button>
                              
                            <button
                              onClick={() => {
                                setEspacioAEliminar(e);
                                setConfirmarEliminarAbierto(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {/* MODALES */}
      <ModalNuevoEspacio abierto={modalNuevoAbierto} onCerrar={() => setModalNuevoAbierto(false)} />
      <ModalEditarEspacio 
        abierto={modalEditarAbierto} 
        onCerrar={() => {
          setModalEditarAbierto(false);
          setEspacioSeleccionado(null);
        }} 
        espacio={espacioSeleccionado}
      />

      <ModalConfirmarEliminar
        abierto={confirmarEliminarAbierto}
        onCerrar={() => {
          setConfirmarEliminarAbierto(false);
          setEspacioAEliminar(null);
        }}
        onConfirmar={ejecutarEliminacion}
        nombre={espacioAEliminar?.nombre}
      />

    </main>
  );
};

export default AdminEspaciosPage;
