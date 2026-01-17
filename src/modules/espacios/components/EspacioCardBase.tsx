// src/modules/espacios/components/EspacioCardBase.tsx
import React, { KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  puedeInteractuar: boolean;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
  children: React.ReactNode;
}

export default function EspacioCardBase({
  puedeInteractuar,
  onClick,
  onKeyDown,
  children,
}: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      role="article"
      tabIndex={puedeInteractuar ? 0 : -1}
      aria-disabled={!puedeInteractuar}
      onClick={onClick}
      onKeyDown={onKeyDown}
      whileHover={
        !prefersReducedMotion && puedeInteractuar
          ? { y: -4, scale: 1.01 }
          : undefined
      }
      className="
        group bg-white rounded-xl shadow-md border border-gray-100
        hover:shadow-lg hover:border-[#00A3C4]
        transition-all duration-200 overflow-hidden
      "
    >
      {children}
    </motion.article>
  );
}
