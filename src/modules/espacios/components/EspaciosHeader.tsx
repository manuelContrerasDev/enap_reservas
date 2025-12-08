import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, CalendarDays, ShieldCheck } from "lucide-react";

interface Props {
  role: "ADMIN" | "SOCIO" | "EXTERNO" | null;
}

export default function EspaciosHeader({ role }: Props) {
  /* ============================================================
   * TEXTOS PERSONALIZADOS POR ROL
   * ============================================================ */
  const etiqueta =
    role === "ADMIN"
      ? "Panel Administrativo"
      : role === "SOCIO"
      ? "Portal de Socios"
      : role === "EXTERNO"
      ? "Portal de Usuarios Externos"
      : "Navegación General";

  const descripcion =
    role === "ADMIN"
      ? "Gestiona los espacios del centro recreativo: administración total del catálogo."
      : "Explora los espacios disponibles del centro recreativo: cabañas, quinchos y áreas recreativas.";

  const IconoEtiqueta = role === "ADMIN" ? ShieldCheck : LayoutGrid;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
        w-full
        bg-gradient-to-br from-[#002E3E] via-[#005D73] to-[#0088CC]
        text-white
        shadow-lg
        rounded-b-3xl
        pb-10 pt-8 px-6
      "
    >
      <div className="max-w-6xl mx-auto text-center space-y-4">

        {/* ETIQUETA SUPERIOR */}
        <span
          className="
            inline-flex items-center gap-2
            bg-white/10 backdrop-blur-sm
            px-4 py-1.5 rounded-full
            text-[11px] uppercase tracking-wide text-white/80
          "
        >
          <IconoEtiqueta size={14} />
          {etiqueta}
        </span>

        {/* TÍTULO PRINCIPAL */}
        <h1
          className="
            text-3xl md:text-4xl font-extrabold 
            flex items-center justify-center gap-2
          "
        >
          <CalendarDays size={26} />
          {role === "ADMIN" ? "Gestión de Espacios" : "Espacios Disponibles"}
        </h1>

        {/* DESCRIPCIÓN */}
        <p
          className="
            max-w-xl mx-auto
            text-white/80
            text-sm md:text-base
            leading-relaxed
          "
        >
          {descripcion}
        </p>
      </div>
    </motion.header>
  );
}
