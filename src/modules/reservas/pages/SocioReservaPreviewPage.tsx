// ============================================================
// ReservaPreviewPage.tsx — Step 2 (Refactor Premium ENAP 2025)
// ============================================================

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import {
  Loader2,
  CheckCircle2,
  ChevronRight,
  Download,
  ArrowLeft,
} from "lucide-react";

import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import { useReserva } from "@/context/ReservaContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { useAuth } from "@/context/auth";

import ModalTerminosEnap from "@/modules/reservas/components/modals/ModalTerminosEnap";
import CheckoutProgress from "@/components/ui/CheckoutProgress";

import { InfoReservaCard } from "@/modules/reservas/components/preview/infoReservaCard";
import { AsistentesList } from "@/modules/reservas/components/preview/AsistentesList";
import { TotalCard } from "@/modules/reservas/components/preview/TotalCard";

import type { ReservaFrontend } from "@/types/ReservaBackend";
import { PATHS } from "@/routes/paths";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReservaPreviewPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const { agregarNotificacion } = useNotificacion();
  const { token } = useAuth();
  const { setReservaActual } = useReserva();

  const reservaId = params.get("reservaId");

  const [openModal, setOpenModal] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const [reserva, setReserva] = useState<ReservaFrontend | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH RESERVA — en función estable y limpia
  // ============================================================
  const fetchReserva = useCallback(async () => {
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

    setLoading(true);

    try {
      const resp = await fetch(`${API_URL}/api/reservas/${reservaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await resp.json();

      if (!resp.ok || !json.data) {
        throw new Error(json.error || "Error al cargar la reserva");
      }

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
        invitados: (r.invitados ?? []).map((i: any) => ({
          nombre: i.nombre,
          rut: i.rut || "—",
          edad: i.edad ?? undefined,
        })),
      };

      setReserva(normalizada);
      setReservaActual(normalizada);
    } catch (err) {
      console.error("❌ Preview Error:", err);
      agregarNotificacion("Error al cargar la reserva.", "error");
      navigate(PATHS.SOCIO_ESPACIOS);
    } finally {
      setLoading(false);
    }
  }, [reservaId, token, agregarNotificacion, navigate, setReservaActual]);

  // Ejecutar fetch
  useEffect(() => {
    fetchReserva();
  }, [fetchReserva]);

  // ============================================================
  // LOADING STATE
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
    <main className="bg-[#F2F4F7] min-h-screen flex flex-col items-center px-4 pt-2 pb-8">
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

        <InfoReservaCard reserva={reserva} />

        {/* ASISTENTES */}
        {reserva.invitados.length > 0 && (
          <AsistentesList invitados={reserva.invitados} />
        )}

        <TotalCard total={reserva.totalClp} />

        {/* DESCARGAR */}
        <button
          disabled
          className="w-full bg-gray-100 text-[#002E3E] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border cursor-not-allowed"
        >
          <Download size={20} />
          Descargar comprobante (próximamente)
        </button>

        {/* TÉRMINOS */}
        <section className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="mt-1 h-5 w-5"
            />

            <span className="text-gray-700 text-sm leading-relaxed">
              Declaro haber leído y aceptar el{" "}
              <button
                type="button"
                onClick={() => setOpenModal(true)}
                className="text-[#002E3E] underline font-semibold"
              >
                reglamento interno y políticas de uso
              </button>{" "}
              del Sindicato ENAP.
            </span>
          </label>

          {!aceptaTerminos && (
            <p className="text-red-500 text-xs ml-8">
              Debes aceptar el reglamento para continuar al pago.
            </p>
          )}
        </section>

        {/* BOTÓN PAGO */}
        <button
          onClick={() => {
            if (!aceptaTerminos) {
              agregarNotificacion(
                "Debes aceptar el reglamento interno antes de continuar.",
                "info"
              );
              return;
            }
            navigate(`${PATHS.RESERVA_PAGO}?reservaId=${reserva.id}`);
          }}
          disabled={!aceptaTerminos}
          aria-disabled={!aceptaTerminos}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            aceptaTerminos
              ? "bg-[#DEC01F] hover:bg-[#E5D14A] text-[#002E3E] shadow"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continuar al Pago
          <ChevronRight size={20} />
        </button>

        {/* VOLVER */}
        <button
          onClick={() => navigate(-1)}
          className="w-full block text-center text-[#002E3E] font-semibold underline text-sm"
        >
          Volver al paso anterior
        </button>

        {/* VOLVER A ESPACIOS */}
        <Link
          to={PATHS.SOCIO_ESPACIOS}
          className="w-full block text-center text-[#002E3E] font-semibold underline text-sm"
        >
          Volver a Espacios
        </Link>
      </motion.div>

      {/* MODAL TÉRMINOS */}
      {openModal && (
        <ModalTerminosEnap tipo="reglamento" onClose={() => setOpenModal(false)} />
      )}
    </main>
  );
}
