// src/components/ui/LoaderTransition.tsx
import React from "react";
import { motion } from "framer-motion";
import logoEnap from "../../assets/logo-enap.png";

/**
 * LoaderTransition: solo el “contenido” del spinner.
 * ❗No incluye overlay ni fondo. El overlay lo aporta LayoutBase.
 */
const LoaderTransition: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Cargando módulo del sistema"
    >
      <motion.img
        src={logoEnap}
        alt="ENAP Loader"
        className="w-20 h-auto bg-white rounded-lg p-2 shadow-lg mb-3"
        initial={{ scale: 0.9, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.p
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
        className="text-sm tracking-wide font-medium text-gray-100"
      >
        Cargando módulo del sistema...
      </motion.p>
    </div>
  );
};

export default LoaderTransition;
