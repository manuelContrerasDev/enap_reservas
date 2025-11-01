import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  Users,
  MapPin,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useReserva } from "../context/ReservaContext";
import { useAuth } from "../context/AuthContext";
import { useNotificacion } from "../context/NotificacionContext";

/**
 * PagoPage — Confirmación y simulación de pago institucional ENAP.
 * Colores base: Azul petróleo (#002E3E) + Dorado (#DEC01F)
 * Diseño limpio, accesible y visualmente coherente con el sistema.
 */
const PagoPage: React.FC = () => {
  const navigate = useNavigate();
  const { reservaActual, agregarReserva, setReservaActual } = useReserva();
  const { userName } = useAuth();
  const { agregarNotificacion } = useNotificacion();

  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState(false);

  /** 🔎 Validar reserva activa */
  useEffect(() => {
    if (!reservaActual) {
      setError("No hay una reserva activa. Por favor selecciona un espacio.");
      setTimeout(() => navigate("/espacios"), 2000);
    }
  }, [reservaActual, navigate]);

  /** 🧼 Limpiar reserva al confirmar */
  useEffect(() => {
    if (confirmado) {
      const timer = setTimeout(() => {
        setReservaActual(null);
        navigate("/espacios");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [confirmado, navigate, setReservaActual]);

  /** 💳 Simular proceso de pago */
  const handlePago = async () => {
    if (!reservaActual) return;

    try {
      setProcesando(true);
      setError(null);

      // ⏱️ Simulación de espera
      await new Promise((res) => setTimeout(res, 1500));

      const result = await agregarReserva(userName ?? "");

      if (!result) throw new Error("Error al registrar la reserva.");

      agregarNotificacion("✅ Pago realizado exitosamente. Reserva confirmada.", "success");
      setConfirmado(true);
    } catch (err) {
      console.error("❌ Error procesando pago:", err);
      agregarNotificacion("Error al procesar el pago. Intenta nuevamente.", "error");
      setError("Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setProcesando(false);
    }
  };

  /** 🧮 Calcular días */
  const dias = reservaActual
    ? Math.max(
        Math.ceil(
          (new Date(reservaActual.fechaFin).getTime() -
            new Date(reservaActual.fechaInicio).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        1
      )
    : 0;

  // ⚠️ Sin reserva activa
  if (error || !reservaActual) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={56} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
        <button
          onClick={() => navigate("/espacios")}
          className="mt-4 bg-[#002E3E] hover:bg-[#003B4D] text-white px-6 py-3 rounded-lg transition-colors shadow-sm"
        >
          Volver a Espacios
        </button>
      </section>
    );
  }

  // ✅ Confirmación final
  if (confirmado) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <CheckCircle className="text-green-500 mb-4" size={72} />
        <h2 className="text-3xl font-bold text-[#002E3E] mb-3">
          ¡Reserva confirmada!
        </h2>
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente.
        </p>
        <p className="text-sm text-gray-400">
          Serás redirigido automáticamente en unos segundos...
        </p>
      </motion.section>
    );
  }

  // 🧾 Vista principal
  return (
    <main
      className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-12 px-6 flex flex-col items-center"
      role="main"
    >
      <div className="max-w-3xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-[#002E3E] mb-10 text-center"
        >
          Confirmar Pago
        </motion.h1>

        {/* 🧩 Resumen */}
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
                Resumen de tu reserva — {dias} día{dias > 1 && "s"}
              </p>
            </div>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li className="flex justify-between">
              <span className="flex items-center gap-2">
                <Calendar size={16} /> Inicio:
              </span>
              <span>{new Date(reservaActual.fechaInicio).toLocaleDateString("es-CL")}</span>
            </li>

            <li className="flex justify-between">
              <span className="flex items-center gap-2">
                <Calendar size={16} /> Fin:
              </span>
              <span>{new Date(reservaActual.fechaFin).toLocaleDateString("es-CL")}</span>
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

        {/* 💳 Simulación */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-[#002E3E]" size={24} />
            <h3 className="text-xl font-bold text-[#002E3E]">Simulación de Pago</h3>
          </div>

          {/* Tarjeta visual */}
          <div className="bg-gradient-to-br from-[#002E3E] to-[#00475A] rounded-xl p-8 mb-8 text-white shadow-inner">
            <div className="mb-6">
              <p className="text-sm opacity-75 mb-2">Número de tarjeta</p>
              <p className="text-xl font-mono tracking-wider">•••• •••• •••• 4532</p>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="opacity-75 mb-1">Titular</p>
                <p className="font-semibold">{userName}</p>
              </div>
              <div>
                <p className="opacity-75 mb-1">Vencimiento</p>
                <p className="font-semibold">12/26</p>
              </div>
            </div>
          </div>

          {/* Botón principal */}
          <button
            onClick={handlePago}
            disabled={procesando}
            className="w-full bg-[#DEC01F] hover:bg-[#E5D14A] text-[#002E3E] font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm focus:ring-2 focus:ring-[#DEC01F]/50"
          >
            {procesando ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Procesando pago...</span>
              </>
            ) : (
              <>
                <CheckCircle size={22} />
                <span>Realizar Pago</span>
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Esta es una simulación. No se realizará ningún cargo real.
          </p>
        </motion.section>
      </div>
    </main>
  );
};

export default PagoPage;
