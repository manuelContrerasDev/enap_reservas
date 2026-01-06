// ============================================================
// TransferenciaPage.tsx — Paso Final (Pago Manual)
// ENAP 2026 · PRODUCCIÓN
// ============================================================

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Info } from "lucide-react";

import CheckoutProgress from "@/components/ui/CheckoutProgress";
import { useReserva } from "@/context/ReservaContext";
import { PATHS } from "@/routes/paths";

// ✅ Imagen oficial desde assets
import datosTransferencia from "@/assets/datosTransferencia.png";

export default function TransferenciaPage() {
  const navigate = useNavigate();
  const { reservaActual } = useReserva();

  /* ============================================================
   * GUARD — acceso directo no permitido
   * ============================================================ */
  if (!reservaActual) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
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

  /* ============================================================
   * RENDER
   * ============================================================ */
  return (
    <main className="bg-[#F2F4F7] min-h-screen flex flex-col items-center px-4 pt-2 pb-10">
      <Helmet>
        <title>Pago por Transferencia | ENAP</title>
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
            Pago por Transferencia
          </h1>
          <p className="text-gray-600 text-sm">
            Tu reserva quedó registrada como{" "}
            <strong>PENDIENTE DE PAGO</strong>.
          </p>
        </header>

        {/* INFO RESERVA */}
        <section className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
          <p>
            <strong>Espacio:</strong> {reservaActual.espacioNombre}
          </p>

          {reservaActual.fechaInicio && reservaActual.fechaFin && (
            <p>
              <strong>Fechas:</strong>{" "}
              {reservaActual.fechaInicio} → {reservaActual.fechaFin}
            </p>
          )}

          {typeof reservaActual.total === "number" && (
            <p className="text-lg font-bold text-[#002E3E]">
              Total a pagar: $
              {reservaActual.total.toLocaleString("es-CL")}
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

          {/* IMAGEN OFICIAL */}
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
