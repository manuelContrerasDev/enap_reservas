// src/components/ui/LoaderScreen.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoEnap from "../../assets/logo-enap.png";

const SPLASH_DURATION = 1200;

const LoaderScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#004b87] to-[#003666] text-white text-center pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          aria-label="Pantalla de carga inicial"
          role="status"
        >
          <motion.img
            src={logoEnap}
            alt="Logo ENAP"
            className="w-24 h-auto mb-6 bg-white rounded-md p-2 shadow-lg"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-2xl font-bold mb-2"
          >
            Sistema de Reservas — ENAP Limache
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-200 tracking-wide"
          >
            Cargando aplicación...
          </motion.p>

          <motion.div
            className="mt-8 w-12 h-12 border-4 border-white/30 border-t-[#f7c600] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoaderScreen;
