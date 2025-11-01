// src/context/NotificacionContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

const NotificacionContext = createContext<NotificacionContextType | undefined>(
  undefined
);

export const NotificacionProvider = ({ children }: { children: ReactNode }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const eliminarNotificacion = (id: number) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  const agregarNotificacion = (mensaje: string, tipo: Notificacion["tipo"]) => {
    const id = Date.now();
    setNotificaciones((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => eliminarNotificacion(id), 4000);
  };

  return (
    <NotificacionContext.Provider
      value={{ notificaciones, agregarNotificacion, eliminarNotificacion }}
    >
      {children}
      {/* 🔔 Render visual de notificaciones */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {notificaciones.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className={`px-4 py-3 rounded-lg shadow-lg text-white ${
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

export const useNotificacion = (): NotificacionContextType => {
  const context = useContext(NotificacionContext);
  if (!context) {
    throw new Error("useNotificacion must be used within a NotificacionProvider");
  }
  return context;
};
