// src/modules/espacios/components/EspaciosHeader.tsx
import React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, CalendarDays, BadgeCheck } from "lucide-react";
import type { Role } from "@/types/auth"; // ajusta la ruta si aplica

interface Props {
  role: Role | null;
}

export default function EspaciosHeader({ role }: Props) {
  /* ============================================================
   * COPY SEGÚN PERFIL (CATÁLOGO PÚBLICO)
   * ============================================================ */
  const isSocio = role === "SOCIO";
  const isExterno = role === "EXTERNO";

  const etiqueta = isSocio
    ? "Beneficios para Socios"
    : isExterno
    ? "Acceso Usuarios Externos"
    : "Catálogo de Espacios";

  const descripcion = isSocio
    ? "Accede a tarifas preferenciales y reserva cabañas, quinchos y piscina según tus beneficios como socio."
    : isExterno
    ? "Explora los espacios disponibles del centro recreativo y revisa las tarifas para usuarios externos."
    : "Explora los espacios disponibles del centro recreativo.";

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
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
        {/* ETIQUETA */}
        <span
          className="
            inline-flex items-center gap-2
            bg-white/10 backdrop-blur-sm
            px-4 py-1.5 rounded-full
            text-[11px] uppercase tracking-wide text-white/80
          "
        >
          <BadgeCheck size={14} />
          {etiqueta}
        </span>

        {/* TÍTULO */}
        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-2">
          <CalendarDays size={26} />
          Espacios Disponibles
        </h1>

        {/* DESCRIPCIÓN */}
        <p className="max-w-xl mx-auto text-white/80 text-sm md:text-base leading-relaxed">
          {descripcion}
        </p>
      </div>
    </motion.header>
  );
}
