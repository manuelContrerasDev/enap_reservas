// ============================================================
// ReservaPreviewPage.tsx — Step 2 (ENAP 2025 · BLINDADO)
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { Loader2, CheckCircle2, ChevronRight, Download } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

import { useReserva } from "@/modules/reservas/context/ReservaContext";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";
import { useAuth } from "@/modules/auth/hooks";

import ModalTerminosEnap from "@/modules/reservas/components/modals/ModalTerminosEnap";
import CheckoutProgress from "@/shared/ui/loaders/CheckoutProgress";

import { InfoReservaCard } from "@/modules/reservas/components/preview/infoReservaCard";
import { AsistentesList } from "@/modules/reservas/components/preview/AsistentesList";
import { TotalCard } from "@/modules/reservas/components/preview/TotalCard";
import { reservaPermisos } from "@/modules/reservas/utils/reservaPermisos";

import type { ReservaDTO } from "@/modules/reservas/types/ReservaDTO";
import type { ReservaFrontend } from "@/modules/reservas/types/ReservaFrontend";
import { normalizarReserva } from "@/modules/reservas/types/normalizarReserva";
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

  /* ============================================================
   * Fetch reserva desde backend (Step 2 = backend source of truth)
   * ============================================================ */
  const fetchReserva = useCallback(async () => {
    if (!reservaId) {
      agregarNotificacion("No se encontró la reserva.", "error");
      navigate(PATHS.SOCIO_ESPACIOS, { replace: true });
      return;
    }

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

      if (!resp.ok || json?.ok === false || !json?.data) {
        throw new Error(json?.error || "Error al cargar la reserva");
      }

      const dto: ReservaDTO = json.data;
      const normalizada = normalizarReserva(dto);

      setReserva(normalizada);

      // Sync liviano al draft (solo lo necesario para Step 3)
      setReservaActual({
        espacioId: normalizada.espacioId ?? undefined,
        espacioNombre: normalizada.espacioNombre,
        fechaInicio: normalizada.fechaInicio,
        fechaFin: normalizada.fechaFin,
        dias: normalizada.dias,
        total: normalizada.totalClp,
        cantidadPersonas: normalizada.cantidadPersonas,
      });
    } catch (err) {
      console.error("❌ ReservaPreview:", err);
      agregarNotificacion("Error al cargar la reserva.", "error");
      setReservaActual(null);
      navigate(PATHS.SOCIO_ESPACIOS, { replace: true });
    } finally {
      setLoading(false);
    }
  }, [reservaId, token, agregarNotificacion, navigate, setReservaActual]);

  useEffect(() => {
    fetchReserva();
  }, [fetchReserva]);

  /* ============================================================
   * Loading / Guard
   * ============================================================ */
  if (loading || !reserva) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#002E3E]" size={48} />
        <p className="text-gray-600 text-sm mt-3">Cargando reserva…</p>
      </main>
    );
  }

  const puedeIrTransferencia = reservaPermisos.puedeVerTransferencia(reserva);

  /* ============================================================
   * Render
   * ============================================================ */
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
        <header className="text-center space-y-2">
          <CheckCircle2 className="text-green-600 mx-auto" size={46} />
          <h1 className="text-2xl font-extrabold text-[#002E3E]">
            Detalle de tu Reserva
          </h1>
          <p className="text-gray-600 text-sm">
            Revisa tu información antes de continuar.
          </p>
        </header>

        <InfoReservaCard reserva={reserva} />

        {reserva.invitados.length > 0 && (
          <AsistentesList invitados={reserva.invitados} />
        )}

        <TotalCard total={reserva.totalClp} />

        <button
          disabled
          className="w-full bg-gray-100 text-[#002E3E] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border cursor-not-allowed"
        >
          <Download size={20} />
          Descargar comprobante (próximamente)
        </button>

        {/* Términos */}
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
              </button>
              .
            </span>
          </label>

          {!puedeIrTransferencia && (
            <p className="text-xs text-gray-500 ml-8">
              Esta reserva ya no permite transferencia según su estado.
            </p>
          )}
        </section>

        <button
          onClick={() => {
            if (!aceptaTerminos) {
              agregarNotificacion(
                "Debes aceptar el reglamento antes de continuar.",
                "info"
              );
              return;
            }

            if (!puedeIrTransferencia) {
              agregarNotificacion(
                "Esta reserva ya no permite transferencia.",
                "info"
              );
              return;
            }

            navigate(`${PATHS.RESERVA_TRANSFERENCIA}?reservaId=${reserva.id}`);
          }}
          disabled={!aceptaTerminos || !puedeIrTransferencia}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
            aceptaTerminos && puedeIrTransferencia
              ? "bg-[#DEC01F] hover:bg-[#E5D14A] text-[#002E3E]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Ver datos de transferencia
          <ChevronRight size={20} />
        </button>

        <Link
          to={PATHS.SOCIO_ESPACIOS}
          className="text-center text-[#002E3E] font-semibold underline text-sm"
        >
          Volver a Espacios
        </Link>
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
