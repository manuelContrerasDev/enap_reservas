import { motion } from "framer-motion";
import { Pizza } from "lucide-react";
import React from "react";

const LoaderPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-center">
      {/* Icono animado */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Pizza size={48} className="text-red-500 dark:text-yellow-400" />
      </motion.div>

      {/* Texto animado */}
      <motion.p
        className="text-lg font-semibold text-gray-700 dark:text-gray-200"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Preparando tu experiencia...
      </motion.p>
    </div>
  );
};

export default LoaderPage;
