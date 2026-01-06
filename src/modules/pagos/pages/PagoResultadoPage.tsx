// ============================================================
// PagoResultadoPage.tsx — Versión Premium ENAP 2025 (FINAL)
// ============================================================

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/auth";

import ResultadoCard from "@/modules/pagos/components/resultado/ResultadoCard";
import ResultadoIcon from "@/modules/pagos/components/resultado/ResultadoIcon";
import ResultadoDetalle from "@/modules/pagos/components/resultado/ResultadoDetalle";
import ResultadoAcciones from "@/modules/pagos/components/resultado/ResultadoAcciones";
import { usePago } from "@/modules/pagos/hooks/usePago";


const API_URL = import.meta.env.VITE_API_URL;

// ============================================================
// Tipado seguro del pago
// ============================================================
interface PagoDetalle {
  id: string;
  amountClp: number;
  reservaId: string;
  status: "APPROVED" | "REJECTED" | "CANCELLED" | "PENDING" | "CREATED";
}

export default function PagoResultadoPage() {
  const [params] = useSearchParams();
  const { token } = useAuth();
  const { resetPago } = usePago(); // 👈 AQUÍ

    useEffect(() => {
      resetPago();
    }, [resetPago]);

  const pagoId = params.get("pagoId");
  const reservaQS = params.get("reservaId");
  const estadoQS = (params.get("estado") ?? "").toLowerCase();

  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<PagoDetalle | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // Normalizar estado recibido desde Webpay
  // ============================================================
  const estadoQuery: "approved" | "cancelled" | "rejected" | "error" =
    estadoQS === "approved"
      ? "approved"
      : estadoQS === "cancelled"
      ? "cancelled"
      : estadoQS === "rejected"
      ? "rejected"
      : "error";

  // ============================================================
  // Obtener detalle desde backend (fuente de verdad)
  // ============================================================
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

        setDetalle(data.pago as PagoDetalle);
      } catch (e: any) {
        setError(e.message ?? "Error al obtener el estado del pago.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagoId, token]);

  // ============================================================
  // FallBack de reservaId sincronizado
  // ============================================================
  const reservaFinal: string | undefined =
  reservaQS ?? detalle?.reservaId ?? undefined;

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center py-32">
        <Loader2 className="animate-spin text-[#002E3E]" size={48} />
        <p className="mt-4 text-gray-600">Cargando estado del pago...</p>
      </section>
    );
  }

  // ============================================================
  // ERROR GLOBAL
  // ============================================================
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

  // ============================================================
  // Determinar estado final combinando Webpay+BD
  // ============================================================
  const estadoBD = detalle?.status?.toLowerCase();

  const estadoFinal: "approved" | "rejected" | "cancelled" | "error" =
    estadoBD === "approved"
      ? "approved"
      : estadoBD === "rejected"
      ? "rejected"
      : estadoBD === "cancelled"
      ? "cancelled"
      : estadoQuery; // fallback por si Webpay dice algo mientras BD carga

  // ============================================================
  // Render dinámico
  // ============================================================
  const renderCard = () => {
    switch (estadoFinal) {
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
