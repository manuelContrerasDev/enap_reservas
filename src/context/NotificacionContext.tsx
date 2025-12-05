import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* =============================================
 * Tipos
 * ============================================= */
interface Notificacion {
  id: number;
  mensaje: string;
  tipo: "success" | "error" | "info";
}

interface NotificacionContextType {
  notificaciones: Notificacion[];
  agregarNotificacion: (mensaje: string, tipo: Notificacion["tipo"]) => void;
  eliminarNotificacion: (id: number) => void;
}

/* =============================================
 * Contexto
 * ============================================= */
const NotificacionContext = createContext<NotificacionContextType | null>(null);

/* =============================================
 * Provider
 * ============================================= */
export const NotificacionProvider = ({ children }: { children: ReactNode }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const idCounter = useRef(0);

  const eliminarNotificacion = (id: number) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  const agregarNotificacion = (mensaje: string, tipo: Notificacion["tipo"]) => {
    const id = ++idCounter.current;

    setNotificaciones((prev) => [...prev, { id, mensaje, tipo }]);

    setTimeout(() => {
      eliminarNotificacion(id);
    }, 3500);
  };

  return (
    <NotificacionContext.Provider
      value={{ notificaciones, agregarNotificacion, eliminarNotificacion }}
    >
      {children}

      <div className="fixed top-4 right-4 space-y-2 z-50 pointer-events-none">
        <AnimatePresence>
          {notificaciones.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-white font-medium ${
                n.tipo === "success"
                  ? "bg-green-600"
                  : n.tipo === "error"
                  ? "bg-red-600"
                  : "bg-blue-600"
              }`}
            >
              {n.mensaje}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificacionContext.Provider>
  );
};

/* =============================================
 * Hook seguro
 * ============================================= */
export const useNotificacion = (): NotificacionContextType => {
  const context = useContext(NotificacionContext);

  if (!context) {
    // Retornar versión NO-CRASH que no hace nada
    return {
      notificaciones: [],
      agregarNotificacion: () => {},
      eliminarNotificacion: () => {},
    };
  }

  return context;
};
