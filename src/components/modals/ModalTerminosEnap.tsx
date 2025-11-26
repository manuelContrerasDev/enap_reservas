import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  abierto: boolean;
  onCerrar: () => void;
}

const ModalTerminosEnap: React.FC<Props> = ({ abierto, onCerrar }) => {
  if (!abierto) return null;

  return (
    <AnimatePresence>
      <motion.div
        onClick={onCerrar}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl relative overflow-y-auto max-h-[80vh]"
        >
          <button
            onClick={onCerrar}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X size={22} />
          </button>

          <h2 className="text-2xl font-bold text-[#002E3E] mb-4">
            Términos y Condiciones ENAP Limache
          </h2>

          <p className="text-gray-700 text-sm leading-relaxed">
            {/* Aquí pegamos tus políticas oficiales ENAP */}
            • El socio debe estar con sus cuotas al día.<br />
            • El aforo máximo debe respetarse.<br />
            • El socio o responsable debe presentarse en portería.<br />
            • Las reservas están sujetas a aprobación.<br />
            • En caso de no cumplir normativa, ENAP puede cancelar la reserva.<br />
            {/* …continúan políticas ENAP que ya tenemos… */}
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={onCerrar}
              className="px-5 py-2 bg-[#002E3E] text-white rounded-lg font-semibold"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalTerminosEnap;
