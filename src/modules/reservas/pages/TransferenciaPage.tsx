// ============================================================
// TransferenciaPage.tsx — Step 3 (Transferencia Manual)
// ENAP 2026 · PRODUCCIÓN
// ============================================================

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Info, Loader2 } from "lucide-react";

import CheckoutProgress from "@/shared/ui/loaders/CheckoutProgress";
import { useReserva } from "@/modules/reservas/context/ReservaContext";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";
import { useAuth } from "@/modules/auth/hooks";
import { PATHS } from "@/routes/paths";

import type { ReservaDTO } from "@/modules/reservas/types/ReservaDTO";
import { normalizarReserva } from "@/modules/reservas/types/normalizarReserva";

// Imagen oficial
import datosTransferencia from "@/assets/datosTransferencia.png";

const API_URL = import.meta.env.VITE_API_URL;

export default function TransferenciaPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { reservaActual, setReservaActual } = useReserva();
  const { agregarNotificacion } = useNotificacion();
  const { token } = useAuth();

  const reservaId = params.get("reservaId");
  const [loading, setLoading] = useState(false);

  const tieneDraft = Boolean(reservaActual);

  const totalFmt = useMemo(() => {
    if (typeof reservaActual?.total !== "number") return null;
    return reservaActual.total.toLocaleString("es-CL");
  }, [reservaActual?.total]);

  // ============================================================
  // 🔁 Hidratación defensiva desde backend (deep link / refresh)
  // ============================================================
  const hydrateFromServer = useCallback(async () => {
    if (tieneDraft) return;
    if (!reservaId) return;

    if (!token) {
      agregarNotificacion("Sesión expirada. Inicia sesión nuevamente.", "error");
      navigate(PATHS.AUTH_LOGIN, { replace: true });
      return;
    }

    try {
      setLoading(true);

      const resp = await fetch(`${API_URL}/api/reservas/${reservaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await resp.json();

      if (!resp.ok || json.ok === false) {
        throw new Error(json.error || "Error al cargar la reserva");
      }

      const dto: ReservaDTO = json.data;
      const normal = normalizarReserva(dto);

      // 🔒 Hydrate draft mínimo (wizard-safe)
      setReservaActual({
        espacioId: normal.espacioId ?? undefined,
        espacioNombre: normal.espacioNombre,
        fechaInicio: normal.fechaInicio,
        fechaFin: normal.fechaFin,
        dias: normal.dias,
        total: normal.totalClp,
        cantidadPersonas: normal.cantidadPersonas,
      });
    } catch (err) {
      console.error("❌ Transferencia hydrate:", err);
      agregarNotificacion(
        "No se pudo cargar la información de la reserva.",
        "error"
      );
      navigate(PATHS.SOCIO_ESPACIOS, { replace: true });
    } finally {
      setLoading(false);
    }
  }, [
    tieneDraft,
    reservaId,
    token,
    agregarNotificacion,
    navigate,
    setReservaActual,
  ]);

  useEffect(() => {
    hydrateFromServer();
  }, [hydrateFromServer]);

  // ============================================================
  // 🛑 Guard final: sin draft y sin posibilidad de hidratar
  // ============================================================
  if (!tieneDraft) {
    if (loading) {
      return (
        <main className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <Loader2 className="animate-spin text-[#002E3E]" size={44} />
          <p className="text-gray-600 text-sm mt-3">
            Cargando información…
          </p>
        </main>
      );
    }

    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gray-600 mb-4">
          No se encontró información de la reserva.
        </p>
        <Link
          to={PATHS.SOCIO_ESPACIOS}
          className="text-[#002E3E] font-semibold underline"
        >
          Volver a espacios
        </Link>
      </main>
    );
  }

  // ============================================================
  // 🔒 Narrow explícito (TypeScript SAFE)
  // ============================================================
  const reserva = reservaActual!;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <main className="bg-[#F2F4F7] min-h-screen flex flex-col items-center px-4 pt-2 pb-10">
      <Helmet>
        <title>Transferencia | ENAP</title>
      </Helmet>

      <CheckoutProgress step={3} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border p-8 space-y-6"
      >
        {/* HEADER */}
        <header className="text-center space-y-2">
          <Info className="mx-auto text-[#005D73]" size={42} />
          <h1 className="text-2xl font-extrabold text-[#002E3E]">
            Transferencia Bancaria
          </h1>
          <p className="text-gray-600 text-sm">
            Tu reserva quedó registrada como{" "}
            <strong>PENDIENTE DE PAGO</strong>.
          </p>
        </header>

        {/* INFO RESERVA */}
        <section className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
          <p>
            <strong>Espacio:</strong> {reserva.espacioNombre}
          </p>

          {reserva.fechaInicio && reserva.fechaFin && (
            <p>
              <strong>Fechas:</strong> {reserva.fechaInicio} →{" "}
              {reserva.fechaFin}
            </p>
          )}

          {totalFmt && (
            <p className="text-lg font-bold text-[#002E3E]">
              Total a pagar: ${totalFmt}
            </p>
          )}
        </section>

        {/* DATOS TRANSFERENCIA */}
        <section className="space-y-4">
          <h2 className="font-bold text-[#002E3E] text-lg">
            Datos de Transferencia
          </h2>

          <div className="bg-[#F4F7F9] border rounded-xl p-4 text-sm space-y-1">
            <p><strong>Banco:</strong> BancoEstado</p>
            <p><strong>Tipo de cuenta:</strong> Cuenta Corriente</p>
            <p><strong>N° Cuenta:</strong> 23000023442</p>
            <p><strong>Nombre:</strong> Sindicato de Trabajadores RPC</p>
            <p><strong>RUT:</strong> 70.606.400-1</p>
            <p>
              <strong>Correo:</strong>{" "}
              <span className="font-semibold">
                reservaloslaureles@gmail.com
              </span>
            </p>
          </div>

          <img
            src={datosTransferencia}
            alt="Datos transferencia ENAP"
            className="rounded-xl border shadow-sm"
          />
        </section>

        {/* AVISO */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-gray-700">
          <p className="font-semibold mb-1">Importante:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Debes transferir el monto exacto indicado.</li>
            <li>Envía el comprobante al correo señalado.</li>
            <li>La reserva será confirmada tras validar el pago.</li>
          </ul>
        </div>

        {/* ACCIONES */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(PATHS.SOCIO_MIS_RESERVAS)}
            className="w-full bg-[#002E3E] text-white py-3 rounded-xl font-semibold hover:bg-[#01384A]"
          >
            Ir a mis reservas
          </button>

          <button
            onClick={() => navigate(PATHS.SOCIO_ESPACIOS)}
            className="w-full border py-3 rounded-xl font-semibold text-[#002E3E] hover:bg-gray-100"
          >
            Volver a espacios
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#005D73] hover:underline justify-center"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </motion.div>
    </main>
  );
}
