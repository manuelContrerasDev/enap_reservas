import { motion } from "framer-motion";
import { Check, CalendarCheck, ClipboardList, CreditCard } from "lucide-react";

interface Props {
  step: 1 | 2 | 3;
  allowBack?: boolean;
  onStepClick?: (step: number) => void;
}

const steps = [
  { id: 1, label: "Reserva", icon: <CalendarCheck size={16} /> },
  { id: 2, label: "Detalle", icon: <ClipboardList size={16} /> },
  { id: 3, label: "Pago", icon: <CreditCard size={16} /> },
];

export default function CheckoutProgress({ step, allowBack = true, onStepClick }: Props) {
  const total = steps.length;
  const progress = ((step - 1) / (total - 1)) * 100;

  return (
    <nav
      aria-label="Progreso del proceso de reserva"
      className="
        w-full 
        max-w-4xl 
        mx-auto 
        px-3 
        mb-8 
        mt-1
        bg-[#F9FAFB]/95 backdrop-blur-md
        shadow-sm
      "
    >
      {/* Desktop/tablet — horizontal */}
      <div className="hidden md:block">

        {/* Barra de progreso */}
        <div className="relative h-[6px] rounded-full bg-gray-200 overflow-hidden mb-6">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#002E3E] via-[#0D4D63] to-[#DEC01F]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>

        {/* Stepper horizontal */}
        <ol className="flex justify-between items-start mt-3 relative">
          {steps.map((s) => {
            const isActive = s.id === step;
            const isDone = s.id < step;
            const clickable = allowBack && isDone && onStepClick;

            return (
              <li key={s.id} className="flex flex-col items-center text-center w-full">
                <button
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick?.(s.id)}
                  aria-current={isActive ? "step" : undefined}
                  className="flex flex-col items-center group"
                >
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0.8 }}
                    animate={{ scale: isActive ? 1.15 : 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shadow-sm mb-1
                      ${isDone ? "bg-[#002E3E] border-[#002E3E] text-white" : ""}
                      ${isActive ? "bg-white border-[#002E3E] text-[#002E3E]" : ""}
                      ${!isActive && !isDone ? "bg-white border-gray-300 text-gray-400" : ""}
                    `}
                  >
                    {isDone ? <Check size={20} /> : s.icon}
                  </motion.div>

                  <span
                    className={`text-xs font-semibold 
                      ${isActive ? "text-[#002E3E]" : isDone ? "text-gray-600" : "text-gray-400"}
                    `}
                  >
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile versión compacta */}
      <div className="mt-3 flex flex-col gap-2 md:hidden">
        {steps.map((s) => {
          const isActive = s.id === step;
          const isDone = s.id < step;

          return (
            <div
              key={s.id}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 border
                ${isActive ? "border-[#002E3E] bg-white" : "border-gray-300 bg-gray-50"}
              `}
            >
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center
                  ${
                    isDone
                      ? "bg-[#002E3E] text-white"
                      : isActive
                      ? "bg-white border border-[#002E3E] text-[#002E3E]"
                      : "bg-gray-200 text-gray-400"
                  }
                `}
              >
                {isDone ? <Check size={18} /> : s.icon}
              </div>

              <span
                className={`text-sm ${
                  isActive ? "text-[#002E3E] font-semibold" : "text-gray-600"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
