// src/components/espacios/EspacioCardAdmin.tsx

import React, { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Edit, Power, Trash2, Users } from "lucide-react";
import type { Espacio } from "@/context/EspaciosContext";
import { useEspacios } from "@/context/EspaciosContext";
import { useNotificacion } from "@/context/NotificacionContext";

const CLP = new Intl.NumberFormat("es-CL");

interface Props {
  espacio: Espacio;
  onEditar: (espacio: Espacio) => void;
  onEliminar: (id: string) => void;
}

const EspacioCardAdmin: React.FC<Props> = memo(
  ({ espacio, onEditar, onEliminar }) => {
    const { toggleActivo } = useEspacios();
    const { agregarNotificacion } = useNotificacion();

    /* ============================================================
     * TOGGLE (Activo / Inactivo)
     * ============================================================ */
    const handleToggle = useCallback(async () => {
      try {
        await toggleActivo(espacio.id);
        agregarNotificacion(
          `Espacio ${espacio.activo ? "desactivado" : "activado"} correctamente`,
          "success"
        );
      } catch {
        agregarNotificacion("Error actualizando estado", "error");
      }
    }, [espacio.id, espacio.activo, toggleActivo, agregarNotificacion]);

    /* ============================================================
     * Eliminar espacio
     * ============================================================ */
    const handleEliminar = useCallback(() => {
      onEliminar(espacio.id);
    }, [espacio.id, onEliminar]);

    return (
      <motion.div
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-all"
        whileHover={{ scale: 1.01 }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-[#002E3E]">
            {espacio.nombre}
          </h3>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              espacio.activo
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {espacio.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#002E3E]" />
            Capacidad:{" "}
            <strong>
              {espacio.capacidad}
              {espacio.capacidadExtra
                ? ` (+${espacio.capacidadExtra})`
                : ""}
            </strong>
          </div>

          <div>
            <span className="font-medium">Tarifa Socio:</span>{" "}
            ${CLP.format(espacio.tarifaClp)}
          </div>

          {espacio.tarifaExterno && (
            <div>
              <span className="font-medium">Tarifa Externo:</span>{" "}
              ${CLP.format(espacio.tarifaExterno)}
            </div>
          )}

          <div className="text-xs text-gray-500">
            Tipo: {espacio.tipo} — Modalidad: {espacio.modalidadCobro}
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          {/* Editar */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onEditar(espacio)}
            className="flex items-center gap-2 bg-[#DEC01F] text-[#002E3E] py-2 px-4 rounded-lg hover:bg-[#E8CF4F] text-sm font-semibold"
          >
            <Edit size={16} /> Editar
          </motion.button>

          {/* Toggle estado */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleToggle}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold ${
              espacio.activo
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            <Power size={16} />
            {espacio.activo ? "Desactivar" : "Activar"}
          </motion.button>

          {/* Eliminar */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleEliminar}
            className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 text-sm font-semibold"
          >
            <Trash2 size={16} /> Eliminar
          </motion.button>
        </div>
      </motion.div> 
    );
  }
);

export default EspacioCardAdmin;
