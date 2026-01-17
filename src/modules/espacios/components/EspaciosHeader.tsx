// src/modules/espacios/components/EspaciosHeader.tsx
import React, { memo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, BadgeCheck } from "lucide-react";

import type { UserRole } from "@/modules/auth/types/auth.types";
import { getEspaciosHeaderCopy } from "../helpers/espacios.header.copy";

interface Props {
  role: UserRole | null;
}

const EspaciosHeader: React.FC<Props> = ({ role }) => {
  const { etiqueta, descripcion } = getEspaciosHeaderCopy(role);

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

        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-2">
          <CalendarDays size={26} />
          Espacios Disponibles
        </h1>

        <p className="max-w-xl mx-auto text-white/80 text-sm md:text-base leading-relaxed">
          {descripcion}
        </p>
      </div>
    </motion.header>
  );
};

export default memo(EspaciosHeader);
