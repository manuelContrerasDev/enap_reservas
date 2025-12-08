// src/pages/pago/PagoResultadoPage.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/auth";

import ResultadoCard from "@/modules/pagos/components/resultado/ResultadoCard";
import ResultadoIcon from "@/modules/pagos/components/resultado/ResultadoIcon";
import ResultadoDetalle from "@/modules/pagos/components/resultado/ResultadoDetalle";
import ResultadoAcciones from "@/modules/pagos/components/resultado/ResultadoAcciones";

const API_URL = import.meta.env.VITE_API_URL;

export default function PagoResultadoPage() {
  const [params] = useSearchParams();
  const { token } = useAuth(); // 🔥 USAR AuthContext en vez de localStorage

  const estadoQuery = (params.get("estado") ?? "").toLowerCase();
  const pagoId = params.get("pagoId");
  const reservaId = params.get("reservaId");

  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  /* ============================================================
   * Normalizar estado Webpay
   * ============================================================ */
  const estado: "approved" | "cancelled" | "rejected" | "error" =
    ["approved", "success", "authorized", "accepted"].includes(estadoQuery)
      ? "approved"
      : estadoQuery === "cancelled"
      ? "cancelled"
      : estadoQuery === "rejected"
      ? "rejected"
      : "error";

  const reservaFinal = reservaId ?? detalle?.reservaId; // fallback seguro

  /* ============================================================
   * Obtener detalles del pago
   * ============================================================ */
  useEffect(() => {
    const fetchData = async () => {
      if (!pagoId) {
        setError("Identificador de pago inválido.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("Tu sesión ha expirado. Vuelve a iniciar sesión.");
        setLoading(false);
        return;
      }

      try {
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
  }, [pagoId, token]);

  /* ============================================================
   * LOADING
   * ============================================================ */
  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center py-32">
        <Loader2 className="animate-spin text-[#002E3E]" size={48} />
        <p className="mt-4 text-gray-600">Cargando estado del pago...</p>
      </section>
    );
  }

  /* ============================================================
   * ERROR GLOBAL
   * ============================================================ */
  if (error) {
    return (
      <main className="flex flex-col items-center justify-center py-24 px-4">
        <ResultadoCard
          icon={<ResultadoIcon estado="error" />}
          title="Error"
          description={error}
        >
          <ResultadoAcciones estado="error" />
        </ResultadoCard>
      </main>
    );
  }

  /* ============================================================
   * RESULTADO POR ESTADO
   * ============================================================ */
  const renderCard = () => {
    switch (estado) {
      case "approved":
        return (
          <ResultadoCard
            icon={<ResultadoIcon estado="approved" />}
            title="¡Pago exitoso!"
            description="Tu pago ha sido confirmado correctamente."
          >
            {detalle && (
              <ResultadoDetalle
                id={detalle.id}
                amountClp={detalle.amountClp}
                reservaId={detalle.reservaId}
                status={detalle.status}
              />
            )}
            <ResultadoAcciones estado="approved" reservaId={reservaFinal} />
          </ResultadoCard>
        );

      case "rejected":
        return (
          <ResultadoCard
            icon={<ResultadoIcon estado="rejected" />}
            title="Pago rechazado"
            description="Hubo un problema al procesar tu pago."
          >
            <ResultadoAcciones estado="rejected" reservaId={reservaFinal} />
          </ResultadoCard>
        );

      case "cancelled":
        return (
          <ResultadoCard
            icon={<ResultadoIcon estado="cancelled" />}
            title="Pago cancelado"
            description="La operación fue cancelada desde Webpay."
          >
            <ResultadoAcciones estado="cancelled" reservaId={reservaFinal} />
          </ResultadoCard>
        );

      default:
        return (
          <ResultadoCard
            icon={<ResultadoIcon estado="error" />}
            title="Error en el pago"
            description="No se pudo procesar el pago."
          >
            <ResultadoAcciones estado="error" />
          </ResultadoCard>
        );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center py-24 px-4">
      {renderCard()}
    </main>
  );
}
