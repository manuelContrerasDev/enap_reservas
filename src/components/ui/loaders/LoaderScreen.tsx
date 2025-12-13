// src/components/ui/LoaderScreen.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoEnap from "@/assets/logo-enap.png";

const SPLASH_DURATION = 1200;

const LoaderScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="loader"
          className="
            fixed inset-0 z-[9999]
            flex flex-col items-center justify-center
            bg-enap-bg text-enap-text
            px-6 text-center
          "
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <img
              src={logoEnap}
              alt="ENAP"
              className="w-24 h-auto rounded-md p-2 bg-white shadow-lg"
            />

            <h1 className="mt-6 text-2xl font-semibold">
              Sistema de Reservas ENAP
            </h1>

            <p className="mt-1 text-gray-300 text-sm">
              Cargando la aplicación…
            </p>
          </motion.div>

          {/* SPINNER ENAP */}
          <motion.div
            className="mt-10 w-12 h-12 rounded-full border-4 
                       border-white/20 border-t-enap-gold"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoaderScreen;
