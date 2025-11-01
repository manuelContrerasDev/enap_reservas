import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2, Edit, PlusCircle } from "lucide-react";
import { useEspacios } from "../../context/EspaciosContext";
import { useNotificacion } from "../../context/NotificacionContext";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import ModalNuevoEspacio from "../../components/modals/ModalNuevoEspacio";
import ModalEditarEspacio from "../../components/modals/ModalEditarEspacio";

/**
 * AdminEspaciosPage — Gestión de espacios del sistema ENAP.
 * Solo accesible para usuarios con rol "admin".
 */
const AdminEspaciosPage: React.FC = () => {
  const { espacios, eliminarEspacio, loading } = useEspacios();
  const { agregarNotificacion } = useNotificacion();
  const { userRole } = useAuth();

  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState<any | null>(null);

  /** 🔒 Bloqueo para usuarios no autorizados */
  if (userRole !== "admin") {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  /** 🗑️ Eliminar espacio */
  const handleEliminarEspacio = useCallback(
    async (id: string) => {
      if (!confirm("¿Seguro que deseas eliminar este espacio?")) return;
      try {
        await eliminarEspacio(id);
        agregarNotificacion("🗑️ Espacio eliminado correctamente", "success");
      } catch {
        agregarNotificacion("❌ Error al eliminar el espacio", "error");
      }
    },
    [eliminarEspacio, agregarNotificacion]
  );

  /** 🌀 Cargando */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#002E3E]">
        <Loader2 className="animate-spin" size={48} aria-hidden="true" />
        <p className="mt-2 text-gray-600 text-sm">Cargando espacios...</p>
      </div>
    );
  }

  return (
    <main
      className="max-w-7xl mx-auto px-6 py-10 bg-gray-50 rounded-lg"
      aria-label="Gestión de espacios administrativos"
    >
      {/* 🔷 Header */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#002E3E] mb-1">
          Gestión de Espacios
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Crea, edita o elimina los espacios disponibles para los socios.
        </p>
      </motion.header>

      {/* 📋 Tabla principal */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        role="region"
        aria-label="Listado de espacios"
      >
        {/* 🔸 Barra superior */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-[#002E3E] text-white gap-3">
          <h2 className="text-lg font-semibold">Listado de Espacios</h2>
          <button
            onClick={() => setModalNuevoAbierto(true)}
            className="flex items-center gap-2 bg-[#DEC01F] text-[#002E3E] px-4 py-2 rounded-lg font-semibold text-sm shadow-sm hover:bg-[#E5C845] transition-all focus:ring-2 focus:ring-[#DEC01F]/50"
          >
            <PlusCircle size={18} aria-hidden="true" />
            Nuevo Espacio
          </button>
        </div>

        {/* 🧾 Tabla de datos */}
        {espacios.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay espacios registrados aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse text-sm sm:text-base"
              role="table"
              aria-label="Tabla de espacios registrados"
            >
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold border-b">
                <tr>
                  {[
                    "Nombre",
                    "Tipo",
                    "Tarifa",
                    "Capacidad",
                    "Activo",
                    "Acciones",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left whitespace-nowrap"
                      scope="col"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {espacios.map((e, i) => (
                  <motion.tr
                    key={e.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className={`hover:bg-gray-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                    role="row"
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">{e.nombre}</td>
                    <td className="px-6 py-3 text-gray-600">{e.tipo}</td>
                    <td className="px-6 py-3 text-gray-800">
                      ${e.tarifa.toLocaleString("es-CL")}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{e.capacidad}</td>
                    <td className="px-6 py-3">
                      {e.activo ? (
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEspacioSeleccionado(e);
                          setModalEditarAbierto(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar espacio"
                        aria-label={`Editar ${e.nombre}`}
                      >
                        <Edit size={18} aria-hidden="true" />
                      </button>

                      <button
                        onClick={() => handleEliminarEspacio(e.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Eliminar espacio"
                        aria-label={`Eliminar ${e.nombre}`}
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>

      {/* 🪟 Modales */}
      <ModalNuevoEspacio
        abierto={modalNuevoAbierto}
        onCerrar={() => setModalNuevoAbierto(false)}
      />
      <ModalEditarEspacio
        abierto={modalEditarAbierto}
        onCerrar={() => setModalEditarAbierto(false)}
        espacio={espacioSeleccionado}
      />
    </main>
  );
};

export default AdminEspaciosPage;
