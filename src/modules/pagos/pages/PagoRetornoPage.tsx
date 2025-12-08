// src/pages/pago/PagoRetornoPage.tsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PATHS } from "@/routes/paths";

export default function PagoRetornoPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const estado = params.get("estado") ?? "error";
    const pagoId = params.get("pagoId");
    const reservaId = params.get("reservaId");

    // Validaciones mínimas
    if (!pagoId || !reservaId) {
      navigate(PATHS.PAGO_WEBPAY_FINAL + "?estado=error");
      return;
    }

    // Redirigir al resultado final
    navigate(
      `${PATHS.PAGO_WEBPAY_FINAL}?estado=${estado}&pagoId=${pagoId}&reservaId=${reservaId}`,
      { replace: true }
    );
  }, [navigate, params]);

  return (
    <main className="flex flex-col items-center justify-center py-32">
      <Loader2 className="animate-spin text-[#002E3E]" size={48} />
      <p className="mt-3 text-gray-700">Procesando retorno de Webpay...</p>
    </main>
  );
}
