import React, { memo } from "react";
import { motion } from "framer-motion";
import logoEnap from "../../assets/logo-enap.png";

/**
 * FooterPublic — versión ligera del pie institucional.
 * Usado en LoginPage y vistas públicas.
 */
const FooterPublic: React.FC = () => {
  return (
    <footer
      className="bg-[#004b87] text-gray-200 py-6 mt-auto shadow-inner"
      role="contentinfo"
      aria-label="Pie de página público"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto px-4 text-center flex flex-col items-center"
      >
        {/* Logo institucional */}
        <img
          src={logoEnap}
          alt="Logo ENAP Refinería Aconcagua"
          className="w-14 h-auto object-contain bg-white rounded-md p-1 mb-3"
          loading="lazy"
        />
        <h2 className="font-semibold text-lg tracking-wide">
          ENAP Refinería Aconcagua
        </h2>

        {/* Descripción */}
        <p className="text-sm text-gray-300 mb-2">
          Sistema de Arriendos, Reservas y Pagos — Limache
        </p>

        {/* Derechos reservados */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-gray-400 mt-2"
        >
          © {new Date().getFullYear()} Sindicato ENAP Refinería Aconcagua. Todos los derechos reservados.
        </motion.p>
      </motion.div>
    </footer>
  );
};

export default memo(FooterPublic);
