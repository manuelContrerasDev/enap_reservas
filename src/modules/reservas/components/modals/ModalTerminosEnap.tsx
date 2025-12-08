// src/components/modals/ModalTerminosEnap.tsx
import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  tipo?: "reglamento" | "politicas";
  onClose: () => void;
}

const textos = {
  reglamento: {
    titulo: "Reglamento Interno de Uso",
    contenido: `
      1. El socio es responsable del correcto uso de las instalaciones.
      2. Está prohibido exceder la capacidad máxima establecida.
      3. En caso de daños, el socio deberá asumir los costos de reparación.
      4. Está prohibido realizar actividades no autorizadas dentro del recinto.
      5. La administración se reserva el derecho de suspender la reserva ante faltas.
    `,
  },
  politicas: {
    titulo: "Políticas y Condiciones de Uso",
    contenido: `
      1. La reserva se considera confirmada una vez realizado el pago.
      2. Los montos no son reembolsables, salvo casos de fuerza mayor.
      3. El usuario declara que la información proporcionada es verdadera.
      4. La plataforma garantiza la seguridad del proceso de pago.
      5. Toda conducta indebida dará pie a la suspensión del servicio.
    `,
  },
};

export default function ModalTerminosEnap({ tipo = "reglamento", onClose }: Props) {
  const { titulo, contenido } = textos[tipo];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-[#002E3E] mb-4">{titulo}</h2>

        {/* CONTENT */}
        <div className="max-h-[60vh] overflow-y-auto pr-3 whitespace-pre-line leading-relaxed text-gray-700">
          {contenido}
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-[#DEC01F] hover:bg-[#E5D14A] text-[#002E3E] px-6 py-2 rounded-lg font-semibold"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
