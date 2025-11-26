// src/pages/pago/PagoPage.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  Users,
  MapPin,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import { useReserva } from "@/context/ReservaContext";
import { usePago } from "@/context/PagoContext";
import { useNotificacion } from "@/context/NotificacionContext";
import CheckoutProgress from "@/components/ui/CheckoutProgress";


const PagoPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const reservaId = params.get("reservaId");
  const { reservaActual } = useReserva();
  const { iniciarPago, estado, mensaje } = usePago();
  const { agregarNotificacion } = useNotificacion();

  const [error, setError] = useState<string | null>(null);

  /* ============================================================
   * Validaciones iniciales
   * ============================================================ */
  useEffect(() => {
    if (!reservaId || !reservaActual) {
      setError("No hay una reserva activa para pagar.");
      setTimeout(() => navigate("/espacios"), 2000);
      return;
    }

    // Opcional pero recomendado (coherencia)
    if (reservaActual.id && reservaActual.id !== reservaId) {
      setError("La reserva indicada no coincide con tu sesión.");
    }
  }, [reservaId, reservaActual, navigate]);

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={56} />
        <h2 className="text-2xl font-bold text-gray-800">{error}</h2>
      </section>
    );
  }

  if (!reservaActual) return null;

  /* ============================================================
   * Días ya vienen calculados desde el context
   * ============================================================ */
  const dias = reservaActual.dias ?? 1;

  /* ============================================================
   * Iniciar flujo Webpay
   * ============================================================ */
  const handlePago = async () => {
    try {
      await iniciarPago(reservaId!);
    } catch (error) {
      console.error("❌ Error iniciar pago:", error);
      agregarNotificacion("Error al iniciar el pago.", "error");
      setError("Ocurrió un error al procesar el pago.");
    }
  };

  /* ============================================================
   * Render principal
   * ============================================================ */
  return (
    <main className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-12 px-6 flex flex-col items-center">
      <CheckoutProgress step={3} />
      <div className="max-w-3xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-[#002E3E] mb-10 text-center"
        >
          Confirmar Pago
        </motion.h1>

        {/* ==================== RESUMEN ==================== */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
            <div className="w-12 h-12 bg-[#DEC01F]/10 rounded-full flex items-center justify-center">
              <MapPin className="text-[#DEC01F]" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#002E3E]">
                {reservaActual.espacioNombre}
              </h2>
              <p className="text-sm text-gray-600">
                Reserva de {dias} día{dias > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li className="flex justify-between">
              <span className="flex items-center gap-2">
                <Calendar size={16} /> Inicio:
              </span>
              <span>
                {new Date(reservaActual.fechaInicio).toLocaleDateString("es-CL")}
              </span>
            </li>

            <li className="flex justify-between">
              <span className="flex items-center gap-2">
                <Calendar size={16} /> Fin:
              </span>
              <span>
                {new Date(reservaActual.fechaFin).toLocaleDateString("es-CL")}
              </span>
            </li>

            <li className="flex justify-between">
              <span className="flex items-center gap-2">
                <Users size={16} /> Personas:
              </span>
              <span>{reservaActual.personas}</span>
            </li>

            <li className="pt-4 border-t border-gray-200 text-lg font-bold text-[#002E3E] flex justify-between">
              <span>Total a pagar:</span>
              <span className="text-[#DEC01F]">
                ${reservaActual.total.toLocaleString("es-CL")}
              </span>
            </li>
          </ul>
        </motion.section>

        {/* ==================== BOTÓN WEBPAY ==================== */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-[#002E3E]" size={24} />
            <h3 className="text-xl font-bold text-[#002E3E]">
              Pagar con Webpay
            </h3>
          </div>

          <button
            onClick={handlePago}
            disabled={estado === "loading"}
            className="w-full bg-[#DEC01F] hover:bg-[#E5D14A] text-[#002E3E] font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {estado === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Redirigiendo a Webpay...</span>
              </>
            ) : (
              <>
                <CreditCard size={22} />
                <span>Ir a pagar</span>
              </>
            )}
          </button>

          {mensaje && (
            <p className="text-center text-sm text-red-500 mt-4">{mensaje}</p>
          )}
        </motion.section>
      </div>
    </main>
  );
};

export default PagoPage;
