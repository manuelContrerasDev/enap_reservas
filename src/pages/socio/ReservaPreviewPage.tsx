import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Loader2,
  CalendarDays,
  Users,
  Home,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import { useNotificacion } from "@/context/NotificacionContext";
import { useReserva } from "@/context/ReservaContext";
import ModalTerminosEnap from "@/components/modals/ModalTerminosEnap";
import CheckoutProgress from "@/components/ui/CheckoutProgress";

const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function ReservaPreviewPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();
  const { reservas } = useReserva();

  const reservaId = params.get("reservaId");
  const [openModal, setOpenModal] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const [reserva, setReserva] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar la reserva desde contexto (sin llamar API)
  useEffect(() => {
    if (!reservaId) {
      agregarNotificacion("ID de reserva no encontrado.", "error");
      navigate("/espacios");
      return;
    }

    setLoading(true);

    const r = reservas.find((x) => x.id === reservaId);
    if (!r) {
      agregarNotificacion("Reserva no encontrada.", "error");
      navigate("/espacios");
      return;
    }

    setReserva(r);
    setLoading(false);
  }, [reservaId, reservas]);

  if (loading || !reserva) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#002E3E]" size={48} />
        <p className="text-gray-600 text-sm mt-3">Cargando reserva…</p>
      </main>
    );
  }

  return (
    <main className="bg-[#F2F4F7] min-h-screen flex flex-col  items-center px-4 pt-2 pb-6">

      <Helmet>
        <title>Resumen de Reserva | ENAP Limache</title>
      </Helmet>

      {/* Barra de progreso */}
      <CheckoutProgress step={2} />

      {/* CONTENEDOR CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border p-8 space-y-8"
      >

        {/* ENCABEZADO */}
        <header className="text-center space-y-2">
          <CheckCircle2 className="text-green-600 mx-auto" size={46} />

          <h1 className="text-2xl font-extrabold text-[#002E3E]">
            Detalle de tu Reserva
          </h1>

          <p className="text-gray-600 text-sm">
            Revisa que todo esté correcto antes de continuar al pago.
          </p>
        </header>

        {/* DETALLE RESERVA */}
        <section
          aria-label="Detalle de la reserva"
          className="bg-gray-50 rounded-2xl px-6 py-5 border space-y-4"
        >
          <h2 className="text-xl font-bold text-[#002E3E] text-center flex items-center justify-center gap-2">
            <Home size={20} /> {reserva.espacioNombre}
          </h2>

          <ul className="text-gray-700 text-sm space-y-2 text-center">
            <li className="flex justify-center gap-1">
              <Users size={14} />
              <strong>{reserva.personas}</strong> persona(s)
            </li>

            <li>
              <strong>{reserva.dias}</strong> día(s)
            </li>

            {/* Fechas: inicio -> fin */}
            <li className="flex items-center justify-center gap-3 text-sm font-medium text-gray-700">
              <span className="px-2 py-1 bg-white border rounded-lg shadow-sm">
                {new Date(reserva.fechaInicio).toLocaleDateString("es-CL")}
              </span>

              <span className="text-gray-500 font-semibold text-lg">→</span>

              <span className="px-2 py-1 bg-white border rounded-lg shadow-sm">
                {new Date(reserva.fechaFin).toLocaleDateString("es-CL")}
              </span>
            </li>

          </ul>
        </section>

        {/* TOTAL */}
        <section className="text-center border-t pt-6 space-y-2">
          <h3 className="text-xl font-bold text-[#002E3E]">Total a pagar:</h3>

          <p className="text-3xl font-extrabold text-[#DEC01F] tracking-tight">
            {CLP.format(reserva.total)}
          </p>

          <p className="text-xs text-gray-500">
            * Pago procesado de forma segura con Webpay Transbank.
          </p>
        </section>

        {/* CHECKBOX TÉRMINOS — justo arriba del botón */}
        <section className="mt-5 flex items-start gap-3 border-t pt-5">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={() => setAceptaTerminos((v) => !v)}
            className="h-5 w-5 mt-0.5 accent-[#002E3E] cursor-pointer"
          />

          <p className="text-sm text-gray-700 leading-tight">
            Acepto los{" "}
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="underline text-[#002E3E] hover:text-[#01384A] font-medium"
            >
              Términos y Condiciones ENAP
            </button>{" "}
            para continuar con el pago.
          </p>
        </section>

        {/* BOTÓN CONTINUAR */}
        <button
          disabled={!aceptaTerminos}
          onClick={() => navigate(`/pago?reservaId=${reserva.id}`)}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow flex items-center justify-center gap-2 mt-3 transition-all
            ${
              !aceptaTerminos
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#002E3E] hover:bg-[#01384A] text-white"
            }
          `}
        >
          Continuar al Pago
          <ChevronRight size={20} />
        </button>

        {/* ENLACES */}
        <div className="text-center mt-4">
          <Link
            to="/espacios"
            className="text-sm text-gray-600 hover:underline"
          >
            <  > </> Volver a espacios
          </Link>
        </div>

      </motion.div>

      {/* MODAL TÉRMINOS */}
      <ModalTerminosEnap
        abierto={openModal}
        onCerrar={() => setOpenModal(false)}
      />
    </main>
  );
}
