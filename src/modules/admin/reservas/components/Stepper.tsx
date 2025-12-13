// ======================================================================
// Stepper.tsx — ENAP UI Premium 2025
// ======================================================================

import React from "react";
import { motion } from "framer-motion";

const steps = [
  { id: 1, label: "Datos del Socio" },
  { id: 2, label: "Cantidades y Resumen" },
  { id: 3, label: "Completado" },
];

export const Stepper: React.FC<{ step: number }> = ({ step }) => {
  return (
    <div className="w-full flex items-center justify-center mb-10">
      <div className="flex items-center gap-6 md:gap-12">

        {steps.map((s, i) => {
          const isActive = step === s.id;
          const isCompleted = step > s.id;

          return (
            <div key={s.id} className="flex items-center gap-2 md:gap-3">

              {/* Punto */}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isCompleted
                    ? "#007B91"
                    : isActive
                    ? "#00394F"
                    : "#D1D5DB",
                }}
                transition={{ duration: 0.25 }}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold`}
              >
                {isCompleted ? "✓" : s.id}
              </motion.div>

              {/* Texto */}
              <span
                className={`text-sm font-medium transition-all ${
                  isActive
                    ? "text-[#00394F]"
                    : isCompleted
                    ? "text-[#007B91]"
                    : "text-gray-500"
                }`}
              >
                {s.label}
              </span>

              {/* Conector */}
              {i < steps.length - 1 && (
                <div
                  className={`w-10 md:w-16 h-1 rounded-full transition-all ${
                    step > s.id ? "bg-[#007B91]" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
