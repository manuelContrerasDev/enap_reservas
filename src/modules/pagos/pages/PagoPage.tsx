// ============================================================
// PagoPage.tsx — Step 3 (Ir a Pagar) — UX/UI Premium ENAP 2025
// ============================================================

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreditCard, Loader2, AlertTriangle } from "lucide-react";

import { useNotificacion } from "@/context/NotificacionContext";
import { useAuth } from "@/context/auth";
import { usePago } from "@/modules/pagos/hooks/usePago";

import CheckoutProgress from "@/components/ui/CheckoutProgress";

import ResumenReserva from "@/modules/pagos/components/ResumenReserva";
import TerminosPago from "@/modules/pagos/components/TerminosPago";
import ModalTerminosEnap from "@/modules/reservas/components/modals/ModalTerminosEnap";

import { PATHS } from "@/routes/paths";
import type { ReservaFrontend } from "@/types/ReservaBackend";

const API_URL = import.meta.env.VITE_API_URL;

export default function PagoPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const reservaId = params.get("reservaId");

  const { token } = useAuth();
  const { agregarNotificacion } = useNotificacion();
  const { iniciarPago, estado } = usePago();

  const [error, setError] = useState<string | null>(null);
  const [reserva, setReserva] = useState<ReservaFrontend | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal estados
  const [aceptaReglamento, setAceptaReglamento] = useState(false);
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const [modalVisible, setModalVisible] = useState<null | "reglamento" | "politicas">(null);

  const puedePagar = aceptaReglamento && aceptaPoliticas && estado !== "loading";

  /* ============================================================
   * CARGAR RESERVA DIRECTAMENTE DESDE API
   * ============================================================ */
  useEffect(() => {
    if (!reservaId) {
      setError("No se encontró el ID de la reserva.");
      return;
    }

    if (!token) {
      agregarNotificacion("Sesión expirada.", "error");
      navigate(PATHS.AUTH_LOGIN);
      return;
    }

    let cancel = false;

    const fetchReserva = async () => {
      try {
        const resp = await fetch(`${API_URL}/api/reservas/${reservaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await resp.json();

        if (!resp.ok || !json.data) {
          throw new Error(json.error ?? "No se pudo obtener la reserva.");
        }

        if (!cancel) {
          setReserva(json.data);
        }
      } catch (err: any) {
        if (!cancel) {
          setError(err.message);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    fetchReserva();
    return () => {
      cancel = true;
    };
  }, [reservaId, token, agregarNotificacion, navigate]);

  /* ============================================================
   * ESTADOS DE CARGA / ERROR
   * ============================================================ */
  if (loading) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#002E3E]" size={48} />
        <p className="mt-3 text-gray-600 text-sm">Cargando información…</p>
      </main>
    );
  }

  if (error || !reserva) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={54} />
        <h2 className="text-2xl font-bold text-gray-800">
          {error ?? "Reserva no encontrada"}
        </h2>

        <button
          onClick={() => navigate(PATHS.SOCIO_ESPACIOS)}
          className="mt-4 bg-[#002E3E] text-white px-5 py-2 rounded-lg hover:bg-[#01384A]"
        >
          Volver
        </button>
      </section>
    );
  }

  /* ============================================================
   * DATOS DE RESERVA
   * ============================================================ */
  const {
    espacioNombre,
    fechaInicio,
    fechaFin,
    dias,
    cantidadPersonas,
    totalClp,
  } = reserva;

  const monto = totalClp ?? 0;

  /* ============================================================
   * INICIAR PAGO (usando módulo nuevo usePago)
   * ============================================================ */
  const handlePago = async () => {
    if (!puedePagar) {
      agregarNotificacion(
        "Debes aceptar el reglamento y las políticas antes de continuar.",
        "info"
      );
      return;
    }

    if (!monto || monto <= 0) {
      agregarNotificacion("El monto del pago es inválido.", "error");
      return;
    }

    try {
      await iniciarPago(reservaId!); // ahora NO se pasa el monto (lo calcula BE)
    } catch (err) {
      console.error("❌ Error iniciarPago:", err);
      agregarNotificacion("Ocurrió un error iniciando el pago.", "error");
    }
  };

  /* ============================================================
   * RENDER PRINCIPAL
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
          Confirmación de Pago
        </motion.h1>

        {/* RESUMEN */}
        <ResumenReserva
          espacioNombre={espacioNombre}
          dias={dias}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
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

        </motion.section>
      </div>

      {/* MODALES */}
      {modalVisible === "reglamento" && (
        <ModalTerminosEnap
          tipo="reglamento"
          onClose={() => setModalVisible(null)}
        />
      )}

      {modalVisible === "politicas" && (
        <ModalTerminosEnap
          tipo="politicas"
          onClose={() => setModalVisible(null)}
        />
      )}
    </main>
  );
}
