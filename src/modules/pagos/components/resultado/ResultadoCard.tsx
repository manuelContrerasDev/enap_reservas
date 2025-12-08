// src/modules/pagos/resultado/ResultadoCard.tsx

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface ResultadoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

export default function ResultadoCard({
  icon,
  title,
  description,
  children,
}: ResultadoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="bg-white shadow-md border border-gray-200 rounded-2xl p-10 text-center max-w-lg w-full"
    >
      {/* ICON */}
      <div className="mx-auto mb-4">{icon}</div>

      {/* TITLE */}
      <h2 className="text-3xl font-bold text-[#002E3E] mb-2">
        {title}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-700 mb-6">{description}</p>

      {/* CONTENT (detalle o acciones) */}
      {children && (
        <div className="mt-4 w-full">{children}</div>
      )}
    </motion.div>
  );
}
