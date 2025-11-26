import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  onConfirmar: () => void;
  nombre?: string; // Nombre del espacio
  bloqueoMensaje?: string | null; 
  // Ej: "Este espacio tiene reservas futuras y no puede ser eliminado."
}

const ModalConfirmarEliminar: React.FC<Props> = ({
  abierto,
  onCerrar,
  onConfirmar,
  nombre = "este espacio",
  bloqueoMensaje = null,
}) => {
  if (!abierto) return null;

  const puedeEliminar = !bloqueoMensaje;

  return (
    <AnimatePresence>
      <motion.div
        onClick={onCerrar}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Contenedor */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        >
          {/* Botón cerrar */}
          <button
            onClick={onCerrar}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X size={22} />
          </button>

          {/* Ícono advertencia */}
          <div className="flex justify-center mb-3">
            <AlertTriangle size={50} className="text-red-600" />
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-center text-[#002E3E] mb-3">
            Confirmar Eliminación
          </h2>

          {/* Separador punteado */}
          <hr className="border-t border-[#002E3E]/30 border-dashed mb-4" />

          {/* Mensaje principal */}
          <p className="text-center text-gray-700 text-sm leading-relaxed mb-4">
            ¿Deseas eliminar <strong>{nombre}</strong>?  
            <br />
            <span className="text-red-600 font-semibold">
              Esta acción es permanente y no se puede deshacer.
            </span>
          </p>

          {/* Si NO se puede eliminar → mensaje bloqueo */}
          {bloqueoMensaje && (
            <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              <strong className="font-semibold">No se puede eliminar:</strong>
              <br />
              {bloqueoMensaje}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={onCerrar}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
            >
              Cancelar
            </button>

            <button
              onClick={puedeEliminar ? onConfirmar : undefined}
              disabled={!puedeEliminar}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-all ${
                puedeEliminar
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Trash2 size={16} />
              Eliminar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalConfirmarEliminar;
