// ============================================================
// ReservaPreviewPage.tsx — Step 2 corregido y listo para producción
// ============================================================

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Loader2,
  Users,
  Home,
  ChevronRight,
  CheckCircle2,
  Download,
} from "lucide-react";

import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import { useNotificacion } from "@/context/NotificacionContext";
import { useAuth } from "@/context/AuthContext";

import ModalTerminosEnap from "@/components/modals/ModalTerminosEnap";
import CheckoutProgress from "@/components/ui/CheckoutProgress";

import type { ReservaFrontend } from "@/types/ReservaFrontend";
import { PATHS } from "@/routes/paths";

const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const API_URL = import.meta.env.VITE_API_URL;

export default function ReservaPreviewPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const { agregarNotificacion } = useNotificacion();
  const { token } = useAuth();

  const reservaId = params.get("reservaId");

  const [openModal, setOpenModal] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const [reserva, setReserva] = useState<ReservaFrontend | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // CARGAR RESERVA DESDE API (producción, estable)
  // ============================================================
  useEffect(() => {
    if (!reservaId) {
      agregarNotificacion("No se encontró la reserva.", "error");
      navigate(PATHS.SOCIO_ESPACIOS);
      return;
    }

    if (!token) {
      agregarNotificacion("Sesión expirada.", "error");
      navigate(PATHS.AUTH_LOGIN);
      return;
    }

    let cancel = false;

    const cargar = async () => {
      setLoading(true);

      try {
        const resp = await fetch(`${API_URL}/api/reservas/${reservaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await resp.json();

        // FIX: backend entrega json.data
        if (!resp.ok || !json.data) throw new Error(json.error || "Error al cargar");

        const r = json.data;

        const normalizada: ReservaFrontend = {
          id: r.id,
          espacioId: r.espacio?.id ?? r.espacioId ?? "",
          espacioNombre: r.espacio?.nombre ?? "Espacio",
          espacioTipo: r.espacio?.tipo ?? "CABANA",
          fechaInicio: r.fechaInicio,
          fechaFin: r.fechaFin,
          dias: r.dias ?? 1,
          cantidadPersonas: r.cantidadPersonas ?? 1,
          totalClp: r.totalClp ?? 0,
          estado: r.estado,
          usuario: {
            id: r.user?.id ?? "",
            nombre: r.user?.name ?? "",
            email: r.user?.email ?? "",
          },

          invitados: r.invitados ?? [],
        };

        if (!cancel) {
          setReserva(normalizada);
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Error preview:", err);
        if (!cancel) {
          agregarNotificacion("Error al cargar la reserva.", "error");
          navigate(PATHS.SOCIO_ESPACIOS);
        }
      }
    };

    cargar();
    return () => {
      cancel = true;
    };
  }, [reservaId, token, agregarNotificacion, navigate]);

  // ============================================================
  // ESTADOS DE CARGA
  // ============================================================
  if (loading || !reserva) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#002E3E]" size={48} />
        <p className="text-gray-600 text-sm mt-3">Cargando reserva…</p>
      </main>
    );
  }

  // ============================================================
  // RENDER PRINCIPAL
  // ============================================================
  return (
    <main className="bg-[#F2F4F7] min-h-screen flex flex-col items-center px-4 pt-2 pb-6">
      <Helmet>
        <title>Resumen de Reserva | ENAP</title>
      </Helmet>

      <CheckoutProgress step={2} />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border p-8 space-y-8"
      >
        {/* HEADER */}
        <header className="text-center space-y-2">
          <CheckCircle2 className="text-green-600 mx-auto" size={46} />
          <h1 className="text-2xl font-extrabold text-[#002E3E]">
            Detalle de tu Reserva
          </h1>
          <p className="text-gray-600 text-sm">
            Revisa tu información antes de continuar al pago.
          </p>
        </header>

        {/* DETALLE */}
        <section className="bg-gray-50 rounded-2xl px-6 py-5 border space-y-4">
          <h2 className="text-xl font-bold text-[#002E3E] text-center flex items-center justify-center gap-2">
            <Home size={20} /> {reserva.espacioNombre}
          </h2>

          <ul className="text-gray-700 text-sm space-y-2 text-center">
            <li className="flex justify-center gap-1 items-center">
              <Users size={14} />
              <strong>{reserva.cantidadPersonas}</strong> persona(s)
            </li>

            <li className="font-semibold">{reserva.dias} día(s)</li>

            <li className="flex items-center justify-center gap-3 text-sm font-medium">
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

        {/* INVITADOS / ASISTENTES */}
        {reserva.invitados && reserva.invitados.length > 0 && (
          <section className="bg-white border rounded-xl px-6 py-4 shadow-sm">
            <h3 className="text-lg font-bold text-[#002E3E] mb-2 flex items-center gap-2">
              <Users size={18} /> Lista de asistentes
            </h3>

            <ul className="space-y-1">
              {reserva.invitados.map((inv, idx) => (
                <li
                  key={idx}
                  className="flex justify-between bg-gray-50 px-3 py-2 rounded border"
                >
                  <span>{inv.nombre}</span>
                  <span className="text-gray-600">{inv.rut}</span>
                </li>
              ))}
            </ul>
          </section>
        )}


        {/* TOTAL */}
        <section className="text-center border-t pt-6 space-y-2">
          <h3 className="text-xl font-bold text-[#002E3E]">Total a pagar:</h3>

          <p className="text-3xl font-extrabold text-[#DEC01F] tracking-tight">
            {CLP.format(reserva.totalClp)}
          </p>

          <p className="text-xs text-gray-500">
            * Transacción segura con Webpay Transbank.
          </p>
        </section>

        {/* DESCARGAR */}
        <div className="flex flex-col gap-3">
          <button
            disabled
            className="w-full bg-gray-100 text-[#002E3E] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border cursor-not-allowed"
          >
            <Download size={20} />
            Descargar comprobante (próximamente)
          </button>
        </div>

        {/* TÉRMINOS */}
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
            </button>
            .
          </p>
        </section>

        {/* CONTINUAR AL PAGO */}
        <button
          disabled={!aceptaTerminos}
          onClick={() =>
            navigate(
              `${PATHS.PAGO}?reservaId=${reserva.id}&monto=${reserva.totalClp}`
            )
          }
          className={`w-full py-4 rounded-xl font-bold text-lg shadow flex items-center justify-center gap-2 mt-3 transition-all ${
            !aceptaTerminos
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#002E3E] hover:bg-[#01384A] text-white"
          }`}
        >
          Continuar al Pago <ChevronRight size={20} />
        </button>

        {/* VOLVER */}
        <div className="text-center mt-4">
          <Link
            to={PATHS.SOCIO_ESPACIOS}
            className="text-sm text-gray-600 hover:underline"
          >
            &lt; Volver a espacios
          </Link>
        </div>
      </motion.div>

      <ModalTerminosEnap
        abierto={openModal}
        onCerrar={() => setOpenModal(false)}
      />
    </main>
  );
}
