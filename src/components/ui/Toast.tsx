import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useNotificacion } from "../../context/NotificacionContext";

/**
 * Toast global para mostrar notificaciones del sistema.
 * Se renderiza una pila de mensajes animados en la esquina superior derecha.
 */
const Toast: React.FC = () => {
  const { notificaciones, eliminarNotificacion } = useNotificacion();

  const iconMap = {
    success: <CheckCircle className="text-green-500" aria-hidden="true" />,
    error: <AlertCircle className="text-red-500" aria-hidden="true" />,
    info: <Info className="text-blue-500" aria-hidden="true" />,
  };

  const bgMap = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  };

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
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`${bgMap[notif.tipo]} border rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px] max-w-md`}
            role="alert"
          >
            {iconMap[notif.tipo]}
            <p className="flex-1 text-sm text-gray-800">{notif.mensaje}</p>
            <button
              onClick={() => eliminarNotificacion(notif.id)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004b87] rounded"
              aria-label="Cerrar notificación"
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
