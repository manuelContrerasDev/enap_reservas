// src/components/ui/loaders/LoaderPage.tsx
import React from "react";
import { motion } from "framer-motion";
import Spinner from "../feedback/Spinner";

export default function LoaderPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      >
        <Spinner size={48} />
      </motion.div>

      <motion.p
        className="mt-4 text-base font-medium text-gray-600"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        Cargando información…
      </motion.p>
    </div>
  );
}
