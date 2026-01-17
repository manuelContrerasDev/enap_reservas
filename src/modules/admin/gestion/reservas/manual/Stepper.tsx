// ======================================================================
// Stepper.tsx — ENAP UI Premium 2025 (ADMIN · FLUJO COMPACTO)
// ======================================================================

import React from "react";
import { motion } from "framer-motion";

const steps = [
  { id: 1, label: "Formulario de Reserva" },
  { id: 2, label: "Confirmación" },
];

export const Stepper: React.FC<{ step: number }> = ({ step }) => {
  return (
    <div className="w-full flex items-center justify-center mb-10">
      <div className="flex items-center gap-8">
        {steps.map((s, i) => {
          const isActive = step === s.id;
          const isCompleted = step > s.id;

          return (
            <div key={s.id} className="flex items-center gap-3">
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
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold"
              >
                {isCompleted ? "✓" : s.id}
              </motion.div>

              <span
                className={`text-sm font-medium ${
                  isActive
                    ? "text-[#00394F]"
                    : isCompleted
                    ? "text-[#007B91]"
                    : "text-gray-500"
                }`}
              >
                {s.label}
              </span>

              {i < steps.length - 1 && (
                <div
                  className={`w-16 h-1 rounded-full ${
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
