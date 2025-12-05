// src/pages/pago/PagoResultadoPage.tsx

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function PagoResultadoPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const estadoQuery = (params.get("estado") ?? "").toLowerCase();
  const pagoId = params.get("pagoId");
  const reservaId = params.get("reservaId");

  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  /* ==========================================================
   * Normalizar estado Webpay → estado interno del frontend
   * ========================================================== */
  const estado: "approved" | "cancelled" | "rejected" | "error" = 
    ["approved", "success", "authorized", "accepted"].includes(estadoQuery)
      ? "approved"
      : estadoQuery === "cancelled"
      ? "cancelled"
      : estadoQuery === "rejected"
      ? "rejected"
      : "error";

  /* ==========================================================
   * Cargar estado real del pago desde backend
   * ========================================================== */
  useEffect(() => {
    const fetchData = async () => {
      if (!pagoId) {
        setError("Identificador de pago inválido.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Sesión expirada. Vuelve a iniciar sesión.");
          setLoading(false);
          return;
        }

        const resp = await fetch(`${API_URL}/api/pagos/${pagoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();

        if (!resp.ok || !data.pago) {
          throw new Error(data.error ?? "No se pudo obtener el pago.");
        }

        setDetalle(data.pago);
      } catch (e: any) {
        setError(e.message ?? "Error al obtener el estado del pago.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagoId]);

  /* ==========================================================
   * 🌀 Loading
   * ========================================================== */
  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center py-32">
        <Loader2 className="animate-spin text-[#002E3E]" size={48} />
        <p className="mt-4 text-gray-600">Cargando estado del pago...</p>
      </section>
    );
  }

  /* ==========================================================
   * ❌ Error global
   * ========================================================== */
  if (error) {
    return (
      <section className="flex flex-col items-center justify-center py-32 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>

        <button
          onClick={() => navigate("/espacios")}
          className="mt-6 bg-[#002E3E] text-white px-6 py-3 rounded-lg"
        >
          Volver al inicio
        </button>
      </section>
    );
  }

  /* ==========================================================
  * 🟢 ESTADO APROBADO
  * ========================================================== */
  if (estado === "approved") {
    return (
      <main className="flex flex-col items-center justify-center py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-md border border-gray-200 rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <CheckCircle className="text-green-600 mx-auto mb-4" size={72} />

          <h2 className="text-3xl font-bold text-[#002E3E] mb-4">
            ¡Pago exitoso!
          </h2>

          <p className="text-gray-700 mb-6">
            Tu pago ha sido confirmado correctamente.
          </p>

          {detalle && (
            <div className="text-sm bg-gray-50 p-4 rounded-lg border mb-5 text-left space-y-1">
              <p><strong>ID Pago:</strong> {detalle.id}</p>
              <p><strong>Monto:</strong> ${detalle.amountClp?.toLocaleString("es-CL")}</p>
              <p><strong>Reserva:</strong> {detalle.reservaId}</p>
              <p><strong>Estado:</strong> {detalle.status}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() =>
                navigate(`/reserva/preview?reservaId=${reservaId}`)
              }
              className="bg-[#DEC01F] hover:bg-[#E5D14A] text-[#003449] px-6 py-3 rounded-lg w-full"
            >
              Ver mi reserva
            </button>

            <button
              onClick={() => navigate("/reservas")}
              className="bg-[#002E3E] hover:bg-[#013B50] text-white px-6 py-3 rounded-lg w-full"
            >
              Ir a mis reservas
            </button>

            <button
              onClick={() => navigate("/espacios")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg w-full"
            >
              Volver al inicio
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  /* ==========================================================
   * 🟥 ESTADO RECHAZADO
   * ========================================================== */
  if (estado === "rejected") {
    return (
      <main className="flex flex-col items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-md border border-gray-200 rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <XCircle className="text-red-500 mx-auto mb-4" size={72} />

          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Pago rechazado
          </h2>

          <p className="text-gray-700 mb-6">
            Hubo un problema al procesar tu pago.
          </p>

          <button
            onClick={() => navigate(`/pago?reservaId=${reservaId}`)}
            className="bg-[#002E3E] text-white px-6 py-3 rounded-lg hover:bg-[#003B4D]"
          >
            Reintentar pago
          </button>
        </motion.div>
      </main>
    );
  }

  /* ==========================================================
   * 🟡 CANCELADO
   * ========================================================== */
  if (estado === "cancelled") {
    return (
      <main className="flex flex-col items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-md border border-gray-200 rounded-2xl p-10 text-center max-w-lg w-full"
        >
          <XCircle className="text-yellow-500 mx-auto mb-4" size={72} />

          <h2 className="text-3xl font-bold text-yellow-600 mb-4">
            Pago cancelado
          </h2>

          <p className="text-gray-700 mb-6">
            La operación fue cancelada desde Webpay.
          </p>

          <button
            onClick={() => navigate(`/pago?reservaId=${reservaId}`)}
            className="bg-[#002E3E] text-white px-6 py-3 rounded-lg hover:bg-[#003B4D]"
          >
            Intentar nuevamente
          </button>
        </motion.div>
      </main>
    );
  }

  /* ==========================================================
   * ❗ FALLBACK ERROR
   * ========================================================== */
  return (
    <main className="flex flex-col items-center justify-center py-24">
      <XCircle className="text-red-500 mb-4" size={72} />
      <h2 className="text-2xl font-bold text-red-600">Error en el pago</h2>

      <button
        onClick={() => navigate("/espacios")}
        className="mt-6 bg-[#002E3E] text-white px-6 py-3 rounded-lg"
      >
        Volver al inicio
      </button>
    </main>
  );
}
