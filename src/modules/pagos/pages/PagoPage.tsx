// src/pages/pago/PagoPage.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreditCard, Loader2, AlertTriangle } from "lucide-react";

import { useReserva } from "@/context/ReservaContext";
import { usePago } from "@/context/PagoContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { useAuth } from "@/context/auth";

import CheckoutProgress from "@/components/ui/CheckoutProgress";

import ResumenReserva from "@/modules/pagos/components/ResumenReserva";
import TerminosPago from "@/modules/pagos/components/TerminosPago";
import ModalTerminosEnap from "@/modules/reservas/components/modals/ModalTerminosEnap";

const API_URL = import.meta.env.VITE_API_URL;

const PagoPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const reservaId = params.get("reservaId");

  const { token } = useAuth();
  const { reservaActual, cargarReservas } = useReserva();
  const { iniciarPago, estado, mensaje } = usePago();
  const { agregarNotificacion } = useNotificacion();

  const [error, setError] = useState<string | null>(null);

  // Modal estados
  const [aceptaReglamento, setAceptaReglamento] = useState(false);
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const [modalVisible, setModalVisible] = useState<null | "reglamento" | "politicas">(null);

  const puedePagar = aceptaReglamento && aceptaPoliticas && estado !== "loading";

  /* ============================================================
   * Validaciones iniciales robustas
   * ============================================================ */
  useEffect(() => {
    if (!reservaId) {
      setError("No se encontró el ID de la reserva.");
      return;
    }

    if (!reservaActual) {
      // fallback: recargar reservas por si se perdió la sesión en memoria
      cargarReservas();
      return;
    }
  }, [reservaId, reservaActual, cargarReservas]);

  /* ============================================================
   * Estado de error
   * ============================================================ */
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
   * Datos de reserva
   * ============================================================ */
  const {
    espacioNombre = "Espacio",
    fechaInicio,
    fechaFin,
    dias = 1,
    cantidadPersonas = 1,
    totalClp,
  } = reservaActual;

  const monto = totalClp ?? 0;

  /* ============================================================
   * Iniciar pago
   * ============================================================ */
  const handlePago = async () => {
    if (!puedePagar) {
      agregarNotificacion("Debes aceptar el reglamento y las políticas antes de continuar.", "info");
      return;
    }

    if (!monto || monto <= 0) {
      agregarNotificacion("El monto del pago es inválido.", "error");
      return;
    }

    try {
      await iniciarPago(reservaId!, monto);
    } catch (err) {
      console.error("❌ Error iniciarPago:", err);
      agregarNotificacion("Ocurrió un error iniciando el pago.", "error");
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-12 px-6 flex flex-col items-center">
      <CheckoutProgress step={3} />

      <div className="max-w-3xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-[#002E3E] mb-10 text-center"
        >
          Confirmación de Pago
        </motion.h1>

        {/* RESUMEN */}
        <ResumenReserva
          espacioNombre={espacioNombre}
          dias={dias}
          fechaInicio={fechaInicio!}
          fechaFin={fechaFin!}
          cantidadPersonas={cantidadPersonas}
          monto={monto}
        />

        {/* TÉRMINOS */}
        <TerminosPago
          aceptaReglamento={aceptaReglamento}
          setAceptaReglamento={setAceptaReglamento}
          aceptaPoliticas={aceptaPoliticas}
          setAceptaPoliticas={setAceptaPoliticas}
          onOpenReglamento={() => setModalVisible("reglamento")}
          onOpenPoliticas={() => setModalVisible("politicas")}
        />

        {/* BOTÓN WEBPAY */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-8 border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-[#002E3E]" size={24} />
            <h3 className="text-xl font-bold text-[#002E3E]">Pagar con Webpay</h3>
          </div>

          <button
            onClick={handlePago}
            disabled={!puedePagar}
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

          {mensaje && <p className="text-center text-sm text-red-500 mt-4">{mensaje}</p>}
        </motion.section>
      </div>

      {/* MODALES */}
      {modalVisible === "reglamento" && (
        <ModalTerminosEnap tipo="reglamento" onClose={() => setModalVisible(null)} />
      )}

      {modalVisible === "politicas" && (
        <ModalTerminosEnap tipo="politicas" onClose={() => setModalVisible(null)} />
      )}
    </main>
  );
};

export default PagoPage;
