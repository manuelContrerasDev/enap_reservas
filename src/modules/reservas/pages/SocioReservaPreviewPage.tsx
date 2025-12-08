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

import { useReserva } from "@/context/ReservaContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { useAuth } from "@/context/auth";

import ModalTerminosEnap from "@/modules/reservas/components/modals/ModalTerminosEnap";
import CheckoutProgress from "@/components/ui/CheckoutProgress";

import type { ReservaFrontend } from "@/types/ReservaFrontend";
import { PATHS } from "@/routes/paths";

import { InfoReservaCard } from "@/modules/reservas/components/preview/infoReservaCard";
import { AsistentesList } from "@/modules/reservas/components/preview/AsistentesList";
import { TotalCard } from "@/modules/reservas/components/preview/TotalCard";


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

  const { setReservaActual } = useReserva();

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
        setReserva(normalizada);       // ← state local de esta page
        setReservaActual(normalizada); // ← sincroniza el Contexto global
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

        {/* INFORMACIÓN DEL ESPACIO */}
        <InfoReservaCard reserva={reserva} />

        {/* ASISTENTES */}
        <AsistentesList invitados={reserva.invitados.map(i => ({
          nombre: i.nombre,
          rut: i.rut ?? "—",
        }))} />


        {/* TOTAL */}
        <TotalCard total={reserva.totalClp} />

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

      {/* ============================================================ */}
      {/* TÉRMINOS Y REGLAMENTO - Step 2 */}
      {/* ============================================================ */}
      <section className="space-y-4">

        {/* Checkbox de aceptación */}
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
              reglamento interno y las políticas de uso
            </button>{" "}
            del Sindicato ENAP.
          </span>
        </label>

        {/* NOTA / advertencia */}
        {!aceptaTerminos && (
          <p className="text-red-500 text-xs ml-8">
            Debes aceptar el reglamento para continuar al pago.
          </p>
        )}

      </section>

      {/* ============================================================ */}
      {/* BOTÓN IR A PAGO */}
      {/* ============================================================ */}
      <button
        onClick={() => {
          if (!aceptaTerminos) {
            agregarNotificacion(
              "Debes aceptar el reglamento interno antes de continuar.",
              "info"
            );
            return;
          }

          navigate(`/app/pago?reservaId=${reserva.id}`);
        }}
        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
          aceptaTerminos
            ? "bg-[#DEC01F] hover:bg-[#E5D14A] text-[#002E3E] shadow"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!aceptaTerminos}
      >
        Continuar al Pago
        <ChevronRight size={20} />
      </button>

      {/* ============================================================ */}
      {/* BOTÓN VOLVER */}
      {/* ============================================================ */}
      <Link
        to={PATHS.SOCIO_ESPACIOS}
        className="w-full block text-center text-[#002E3E] font-semibold underline text-sm mt-3"
      >
        Volver a Espacios
      </Link>

      {/* ============================================================ */}
      {/* MODAL DE REGLAMENTO */}
      {/* ============================================================ */}
      {openModal && (
        <ModalTerminosEnap
          tipo="reglamento"
          onClose={() => setOpenModal(false)}
        />
      )}

      </motion.div>


      {openModal && (
        <ModalTerminosEnap
          tipo="reglamento"
          onClose={() => setOpenModal(false)}
        />
      )}

    </main>
  );
}
