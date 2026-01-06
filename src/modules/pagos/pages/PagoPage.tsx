// ============================================================
// PagoPage.tsx — Step 3 (Ir a Pagar) — ENAP 2025 (SINCRONIZADO)
// ============================================================

import React, { useState, useEffect, useRef } from "react";
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

import { ReservaEstado } from "@/types/enums";
import type { ReservaDTO } from "@/types/ReservaDTO";
import { PATHS } from "@/routes/paths";

const API_URL = import.meta.env.VITE_API_URL;

export default function PagoPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const reservaId = params.get("reservaId");

  const { token } = useAuth();
  const { agregarNotificacion } = useNotificacion();
  const { iniciarPago, estado } = usePago();

  const [reserva, setReserva] = useState<ReservaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Términos
  const [aceptaReglamento, setAceptaReglamento] = useState(false);
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const [modalVisible, setModalVisible] =
    useState<null | "reglamento" | "politicas">(null);

  const puedePagar =
    aceptaReglamento && aceptaPoliticas && estado !== "loading";

  const pagandoRef = useRef(false);

  // ============================================================
  // FETCH RESERVA
  // ============================================================
  useEffect(() => {
    if (!reservaId) {
      setError("No se encontró el ID de la reserva.");
      setLoading(false);
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
          setReserva(json.data as ReservaDTO);
        }
      } catch (err: any) {
        if (!cancel) setError(err.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    fetchReserva();
    return () => {
      cancel = true;
    };
  }, [reservaId, token, agregarNotificacion, navigate]);

  // ============================================================
  // ESTADOS
  // ============================================================
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
          className="mt-4 bg-[#002E3E] text-white px-5 py-2 rounded-lg"
        >
          Volver
        </button>
      </section>
    );
  }

  // ============================================================
  // BLOQUEO SI NO ES PAGABLE
  // ============================================================
  if (reserva.estado !== ReservaEstado.PENDIENTE_PAGO) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="text-yellow-500 mb-4" size={54} />
        <h2 className="text-2xl font-bold text-gray-800">
          Esta reserva ya no está disponible para pago
        </h2>
        <p className="mt-2 text-gray-600">
          Estado actual: {reserva.estado}
        </p>

        <button
          onClick={() => navigate(PATHS.SOCIO_MIS_RESERVAS)}
          className="mt-6 bg-[#002E3E] text-white px-6 py-2 rounded-lg"
        >
          Ver mis reservas
        </button>
      </section>
    );
  }

  // ============================================================
  // INICIAR PAGO (Webpay)
  // ============================================================
  const handlePago = () => {
    if (pagandoRef.current) return;

    if (!puedePagar) {
      agregarNotificacion(
        "Debes aceptar el reglamento y las políticas antes de continuar.",
        "info"
      );
      return;
    }

    pagandoRef.current = true;

    // 🔥 El hook maneja errores y redirección
    iniciarPago(reserva.id);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <main className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-12 px-6 flex flex-col items-center">
      <CheckoutProgress step={3} />

      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-[#002E3E] mb-10 text-center">
          Confirmación de Pago
        </h1>

        <ResumenReserva
          espacioNombre={reserva.espacio?.nombre ?? "Espacio"}
          dias={reserva.dias}
          fechaInicio={reserva.fechaInicio}
          fechaFin={reserva.fechaFin}
          cantidadPersonas={
            reserva.cantidadAdultos +
            reserva.cantidadNinos +
            reserva.cantidadPiscina
          }
          monto={reserva.totalClp}
        />

        <TerminosPago
          aceptaReglamento={aceptaReglamento}
          setAceptaReglamento={setAceptaReglamento}
          aceptaPoliticas={aceptaPoliticas}
          setAceptaPoliticas={setAceptaPoliticas}
          onOpenReglamento={() => setModalVisible("reglamento")}
          onOpenPoliticas={() => setModalVisible("politicas")}
        />

        <motion.section className="bg-white rounded-xl shadow-md p-8 border">
          <button
            onClick={handlePago}
            disabled={!puedePagar}
            className="w-full bg-[#DEC01F] text-[#002E3E] font-bold py-4 rounded-lg flex justify-center gap-2"
          >
            {estado === "loading" ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Redirigiendo a Webpay…
              </>
            ) : (
              <>
                <CreditCard size={22} />
                Ir a pagar
              </>
            )}
          </button>
        </motion.section>
      </div>

      {modalVisible && (
        <ModalTerminosEnap
          tipo={modalVisible}
          onClose={() => setModalVisible(null)}
        />
      )}
    </main>
  );
}
