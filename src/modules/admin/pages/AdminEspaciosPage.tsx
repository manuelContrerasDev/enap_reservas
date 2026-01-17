// src/modules/espacios/pages/AdminEspaciosPage.tsx
import React, { memo, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2, Edit, PlusCircle, Filter } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";

import { useEspacios } from "@/modules/espacios/context/EspaciosContext";
import { useAuth } from "@/modules/auth/hooks";
import { PATHS } from "@/app/router/paths";

import ModalNuevoEspacio from "@/modules/reservas/components/modals/ModalNuevoEspacio";
import ModalEditarEspacio from "@/modules/reservas/components/modals/ModalEditarEspacio";
import ModalConfirmarEliminar from "@/modules/admin/components/modals/ModalConfirmarEliminar";

import type { EspacioDTO } from "@/modules/espacios/types/espacios";

/* ============================================================
 * Tipos locales
 * ============================================================ */
type FiltroEstado = "TODOS" | "ACTIVOS" | "INACTIVOS";

/* ============================================================
 * Utils
 * ============================================================ */
function filtrarPorEstado(
  espacios: EspacioDTO[],
  filtro: FiltroEstado
) {
  switch (filtro) {
    case "ACTIVOS":
      return espacios.filter((e) => e.activo);
    case "INACTIVOS":
      return espacios.filter((e) => !e.activo);
    default:
      return espacios;
  }
}

const AdminEspaciosPage: React.FC = () => {
  const { espacios, loading, toggleActivo, eliminarEspacio } = useEspacios();
  const { role } = useAuth();

  /* ============================================================
   * Guards
   * ============================================================ */
  if (!role) {
    return (
      <div className="text-center py-20">
        <Loader2 className="animate-spin mx-auto" size={32} />
      </div>
    );
  }

  if (role !== "ADMIN") {
    return <Navigate to={PATHS.AUTH_LOGIN} replace />;
  }

  /* ============================================================
   * Estado UI
   * ============================================================ */
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstado>("TODOS");

  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [espacioSeleccionado, setEspacioSeleccionado] =
    useState<EspacioDTO | null>(null);

  const [espacioAEliminar, setEspacioAEliminar] =
    useState<EspacioDTO | null>(null);

  /* ============================================================
   * Data derivada
   * ============================================================ */
  const espaciosFiltrados = useMemo(
    () => filtrarPorEstado(espacios, filtroEstado),
    [espacios, filtroEstado]
  );

  /* ============================================================
   * Acciones
   * ============================================================ */
  const handleToggleActivo = useCallback(
    (id: string) => {
      toggleActivo(id);
    },
    [toggleActivo]
  );

  const confirmarEliminacion = useCallback(async () => {
    if (!espacioAEliminar) return;

    await eliminarEspacio(espacioAEliminar.id);

    setModalEliminar(false);
    setEspacioAEliminar(null);
  }, [espacioAEliminar, eliminarEspacio]);

  return (
    <>
      <Helmet>
        <title>Administración | Espacios</title>
      </Helmet>

      <main className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 rounded-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <Loader2 className="animate-spin" size={48} />
            <p className="mt-2 text-sm text-gray-600">
              Cargando espacios…
            </p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <motion.header
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-[#002E3E]">
                  Gestión de Espacios
                </h1>
                <p className="text-gray-600 text-sm">
                  Administra los espacios disponibles.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
                  <Filter size={16} />
                  <select
                    value={filtroEstado}
                    onChange={(e) =>
                      setFiltroEstado(e.target.value as FiltroEstado)
                    }
                    className="bg-transparent text-sm outline-none"
                  >
                    <option value="TODOS">Todos</option>
                    <option value="ACTIVOS">Activos</option>
                    <option value="INACTIVOS">Inactivos</option>
                  </select>
                </div>

                <button
                  onClick={() => setModalNuevo(true)}
                  className="flex items-center gap-2 bg-[#DEC01F] px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  <PlusCircle size={18} /> Nuevo Espacio
                </button>
              </div>
            </motion.header>

            {/* TABLA */}
            <section className="bg-white rounded-xl shadow border overflow-x-auto">
              {espaciosFiltrados.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  No hay espacios para este filtro.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3 text-left">Nombre</th>
                      <th className="px-6 py-3">Tipo</th>
                      <th className="px-6 py-3">Tarifa</th>
                      <th className="px-6 py-3">Capacidad</th>
                      <th className="px-6 py-3">Estado</th>
                      <th className="px-6 py-3">Acciones</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    <AnimatePresence>
                      {espaciosFiltrados.map((e) => (
                        <motion.tr
                          key={e.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <td className="px-6 py-3 font-medium">
                            {e.nombre}
                          </td>
                          <td className="px-6 py-3">{e.tipo}</td>
                          <td className="px-6 py-3">
                            ${e.precioBaseSocio.toLocaleString("es-CL")}
                          </td>
                          <td className="px-6 py-3">{e.capacidad}</td>
                          <td className="px-6 py-3">
                            <button
                              onClick={() => handleToggleActivo(e.id)}
                              className={`px-2 py-1 rounded text-xs ${
                                e.activo
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {e.activo ? "Activo" : "Inactivo"}
                            </button>
                          </td>
                          <td className="px-6 py-3 flex gap-3">
                            <button
                              onClick={() => {
                                setEspacioSeleccionado(e);
                                setModalEditar(true);
                              }}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setEspacioAEliminar(e);
                                setModalEliminar(true);
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}

        {/* MODALES */}
        <ModalNuevoEspacio
          abierto={modalNuevo}
          onCerrar={() => setModalNuevo(false)}
        />

        <ModalEditarEspacio
          abierto={modalEditar}
          espacio={espacioSeleccionado}
          onCerrar={() => {
            setModalEditar(false);
            setEspacioSeleccionado(null);
          }}
        />

        <ModalConfirmarEliminar
          abierto={modalEliminar}
          nombre={espacioAEliminar?.nombre}
          onCerrar={() => {
            setModalEliminar(false);
            setEspacioAEliminar(null);
          }}
          onConfirmar={confirmarEliminacion}
        />
      </main>
    </>
  );
};

export default memo(AdminEspaciosPage);
