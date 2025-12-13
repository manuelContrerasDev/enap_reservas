import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";
import { useNotificacion } from "@/context/NotificacionContext";

const ICONS = {
  success: <CheckCircle className="text-success" />,
  error: <AlertCircle className="text-error" />,
  info: <Info className="text-cian-600" />,
  warning: <AlertTriangle className="text-warning" />,
};

const STYLES = {
  success: "bg-success/10 border-success/40",
  error: "bg-error/10 border-error/40",
  info: "bg-cian-50 border-cian-200",
  warning: "bg-warning/10 border-warning/40",
};

const Toast: React.FC = () => {
  const { notificaciones, eliminarNotificacion } = useNotificacion();

  return (
    <div
      className="fixed top-20 right-4 z-50 space-y-2"
      role="region"
      aria-live="assertive"
    >
      <AnimatePresence>
        {notificaciones.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            role="alert"
            className={`
              ${STYLES[notif.tipo]}
              border rounded-lg shadow-lg p-4
              flex items-start gap-3
              min-w-[300px] max-w-md
            `}
          >
            {ICONS[notif.tipo]}

            <p className="flex-1 text-sm text-gray-800">
              {notif.mensaje}
            </p>

            <button
              onClick={() => eliminarNotificacion(notif.id)}
              aria-label="Cerrar notificación"
              className="
                text-gray-500 hover:text-gray-700
                focus:outline-none focus:ring-2 focus:ring-enap.gold
                rounded
              "
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default memo(Toast);
