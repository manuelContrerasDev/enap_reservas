// src/modules/espacios/components/EspacioCardAdmin.tsx
import React, { memo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Power,
  Trash2,
  Users,
  DollarSign,
  Info,
} from "lucide-react";

import type { EspacioDTO } from "@/modules/espacios/types/espacios";

/* ============================================================
 * Utils
 * ============================================================ */
const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const modalidadLabel = (m: EspacioDTO["modalidadCobro"]) => {
  switch (m) {
    case "POR_NOCHE":
      return "Por noche";
    case "POR_PERSONA":
      return "Por persona";
    default:
      return "Por día";
  }
};

/* ============================================================
 * Props
 * ============================================================ */
interface Props {
  espacio: EspacioDTO;
  onEditar: (espacio: EspacioDTO) => void;
  onEliminar: (id: string) => void;
  onToggleActivo: (id: string) => Promise<void>;
  loading?: boolean;
}

/* ============================================================
 * Component
 * ============================================================ */
const EspacioCardAdmin: React.FC<Props> = memo(
  ({ espacio, onEditar, onEliminar, onToggleActivo, loading = false }) => {
    const handleToggle = useCallback(() => {
      if (loading) return;
      onToggleActivo(espacio.id);
    }, [espacio.id, onToggleActivo, loading]);

    const handleEliminar = useCallback(() => {
      if (loading) return;
      onEliminar(espacio.id);
    }, [espacio.id, onEliminar, loading]);

    return (
      <motion.article
        className="
          bg-white border border-gray-200 rounded-xl shadow-sm
          p-5 flex flex-col gap-4 hover:shadow-md transition-all
        "
        whileHover={{ scale: 1.01 }}
        aria-busy={loading}
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

        {/* INFO GENERAL */}
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Users size={16} />
            Capacidad base:
            <strong className="ml-1">{espacio.capacidad}</strong>
          </div>

          <div className="text-xs text-gray-500">
            Tipo: <strong>{espacio.tipo}</strong> — Modalidad:{" "}
            <strong>{modalidadLabel(espacio.modalidadCobro)}</strong>
          </div>
        </div>

        {/* TARIFAS */}
        <div className="border-t pt-3 flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-semibold text-gray-700">
            <DollarSign size={16} /> Tarifas base
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              Socio:
              <strong className="ml-1">
                {CLP.format(espacio.precioBaseSocio)}
              </strong>
            </div>
            <div>
              Externo:
              <strong className="ml-1">
                {CLP.format(espacio.precioBaseExterno)}
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              Extra Socio:
              <strong className="ml-1">
                {CLP.format(espacio.precioPersonaAdicionalSocio)}
              </strong>
            </div>
            <div>
              Extra Externo:
              <strong className="ml-1">
                {CLP.format(espacio.precioPersonaAdicionalExterno)}
              </strong>
            </div>
          </div>

          {espacio.tipo === "PISCINA" && (
            <div className="mt-1 flex items-start gap-2 text-xs text-blue-700 bg-blue-50 p-2 rounded">
              <Info size={14} className="mt-[2px]" />
              <span>
                Piscina se cobra <strong>por persona</strong>:
                <br />
                Socio {CLP.format(espacio.precioPiscinaSocio)} / Externo{" "}
                {CLP.format(espacio.precioPiscinaExterno)}
              </span>
            </div>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onEditar(espacio)}
            disabled={loading}
            aria-label="Editar espacio"
            className="flex items-center gap-2 bg-[#DEC01F] text-[#002E3E]
                       py-2 px-4 rounded-lg hover:bg-[#E8CF4F]
                       text-sm font-semibold disabled:opacity-60"
          >
            <Edit size={16} /> Editar
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleToggle}
            disabled={loading}
            aria-label="Cambiar estado del espacio"
            className={`flex items-center gap-2 py-2 px-4 rounded-lg
              text-sm font-semibold disabled:opacity-60 ${
                espacio.activo
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
          >
            <Power size={16} />
            {espacio.activo ? "Desactivar" : "Activar"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleEliminar}
            disabled={loading}
            aria-label="Eliminar espacio"
            className="flex items-center gap-2 bg-red-500 text-white
                       py-2 px-4 rounded-lg hover:bg-red-600
                       text-sm font-semibold disabled:opacity-60"
          >
            <Trash2 size={16} /> Eliminar
          </motion.button>
        </div>
      </motion.article>
    );
  }
);

export default EspacioCardAdmin;
