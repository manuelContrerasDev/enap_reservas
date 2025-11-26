// src/pages/pago/RetornoWebpayPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function WebpayRetornoPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const query = new URLSearchParams(window.location.search);

      const token_ws = query.get("token_ws");       
      const tbkToken = query.get("TBK_TOKEN");      
      const tbkOrdenCompra = query.get("TBK_ORDEN_COMPRA");

      /* ============================================
       * 🚫 Cancelación por usuario (TBK flujo normal)
       * ============================================ */
      if (tbkToken || tbkOrdenCompra) {
        navigate("/pago/webpay/final?estado=cancelled");
        return;
      }

      /* ============================================
       * 🚫 No llegó token_ws → error genérico
       * ============================================ */
      if (!token_ws) {
        navigate("/pago/webpay/final?estado=error");
        return;
      }

      /* ============================================
       * 🔒 Validar sesión
       * ============================================ */
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/pago/webpay/final?estado=session_expired");
        return;
      }

      /* ============================================
       * 📡 Validar transacción en backend ENAP
       * ============================================ */
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/api/pagos/webpay/notificacion`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ token_ws }),
          }
        );

        const data = await resp.json();

        if (!resp.ok || !data.ok) {
          navigate("/pago/webpay/final?estado=error");
          return;
        }

        /* ============================================
         * 🟢 Normalizar estado devolvido por backend
         * ============================================ */
        const estadoRaw = (data.estado ?? "").toLowerCase();

        const estado =
          estadoRaw === "approved" ||
          estadoRaw === "authorized" ||
          estadoRaw === "accepted"
            ? "approved"
            : estadoRaw === "cancelled"
            ? "cancelled"
            : "error";

        const pagoId = data.pagoId ?? "";
        const reservaId = data.reservaId ?? "";

        navigate(
          `/pago/webpay/final?estado=${estado}&pagoId=${pagoId}&reservaId=${reservaId}`
        );
      } catch (err) {
        console.error("❌ Error retorno Webpay:", err);
        navigate("/pago/webpay/final?estado=error");
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
      <Loader2 className="animate-spin text-[#002E3E] mb-4" size={48} />
      <h2 className="text-xl text-[#002E3E] font-semibold">
        Confirmando pago con Webpay...
      </h2>
      <p className="text-gray-500 mt-2 text-sm">
        Esto puede tardar unos segundos.
      </p>
    </div>
  );
}
