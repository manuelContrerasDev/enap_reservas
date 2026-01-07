// src/modules/reservas/pages/MisReservasPage.tsx
import React from "react";
import { motion } from "framer-motion";
import { Loader2, Search, XCircle, Pencil, Landmark, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useReservasSocio } from "@/modules/reservas/hooks/useReservasSocio";
import { useNotificacion } from "@/context/NotificacionContext";
import { useAuth } from "@/context/auth";

import { formatCLP } from "@/shared/lib/format";
import { PATHS } from "@/routes/paths";
import { reservaPermisos } from "@/modules/reservas/utils/reservaPermisos";

import type { ReservaFrontend } from "@/types/ReservaFrontend";
import ModalEditarInvitados from "@/modules/reservas/modals/ModalEditarInvitados";

import { actualizarInvitadosReserva } from "@/modules/reservas/api/actualizarInvitadosReserva";
import { cancelarReserva } from "@/modules/reservas/api/cancelarReserva";

export default function MisReservasPage() {
  const { reservas, loading, reload } = useReservasSocio();
  const { agregarNotificacion } = useNotificacion();
  const { token } = useAuth(); // solo para validar sesión
  const navigate = useNavigate();

  const [filtro, setFiltro] = React.useState("");
  const [reservaEditando, setReservaEditando] =
    React.useState<ReservaFrontend | null>(null);
  const [guardando, setGuardando] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return reservas;
    return reservas.filter((r) =>
      (r.espacioNombre ?? "").toLowerCase().includes(q)
    );
  }, [reservas, filtro]);

  const irADetalle = (id: string) => {
    navigate(`${PATHS.RESERVA_PREVIEW}?reservaId=${id}`);
  };

  const irATransferencia = (id: string) => {
    navigate(`${PATHS.RESERVA_TRANSFERENCIA}?reservaId=${id}`);
  };

  const handleGuardarInvitados = async (invitados: any[]) => {
    if (!reservaEditando) return;

    if (!token) {
      agregarNotificacion("Sesión expirada.", "error");
      navigate(PATHS.AUTH_LOGIN);
      return;
    }

    try {
      setGuardando(true);

      const payload = {
        invitados: invitados.map((i) => ({
          nombre: String(i.nombre ?? "").trim(),
          rut: String(i.rut ?? "").trim(),
          edad: i.edad ?? null,
          esPiscina: Boolean(i.esPiscina),
        })),
      };

      await actualizarInvitadosReserva(reservaEditando.id, payload);

      agregarNotificacion("Invitados actualizados correctamente.", "success");
      setReservaEditando(null);
      await reload();
    } catch (err: any) {
      agregarNotificacion(
        err?.message ?? "Error al actualizar invitados",
        "error"
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = async (r: ReservaFrontend) => {
    if (!token) {
      agregarNotificacion("Sesión expirada.", "error");
      navigate(PATHS.AUTH_LOGIN);
      return;
    }

    const ok = window.confirm(
      "¿Confirmas cancelar esta reserva?\n\nEsto liberará el cupo y no se podrá revertir."
    );
    if (!ok) return;

    try {
      setGuardando(true);

      await cancelarReserva(r.id, {
        motivo: "Cancelación por usuario",
      });

      agregarNotificacion("Reserva cancelada correctamente.", "success");
      await reload();
    } catch (err: any) {
      agregarNotificacion(
        err?.message ?? "Error al cancelar la reserva",
        "error"
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F2F4F7] px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-[#002E3E]">
              Mis Reservas
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Revisa tu historial, actualiza invitados o ve datos de
              transferencia.
            </p>
          </div>
        </header>

        {/* Buscador */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre de espacio..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#002E3E]" size={40} />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-600 py-10">
            No tienes reservas registradas.
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl shadow border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Espacio</th>
                  <th className="px-4 py-3 text-center">Fechas</th>
                  <th className="px-4 py-3 text-center">Personas</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-4">
                      <strong>{r.espacioNombre}</strong>
                      <div className="text-xs text-gray-500">
                        {r.espacioTipo ?? ""}
                      </div>
                    </td>

                    <td className="text-center px-4 py-4">
                      {new Date(r.fechaInicio).toLocaleDateString("es-CL")}
                      <br />—<br />
                      {new Date(r.fechaFin).toLocaleDateString("es-CL")}
                    </td>

                    <td className="text-center px-4 py-4">
                      {r.cantidadPersonas}
                    </td>

                    <td className="text-center px-4 py-4">
                      {formatCLP(r.totalClp)}
                    </td>

                    <td className="text-center px-4 py-4">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-gray-200 text-gray-700">
                        {String(r.estado).replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="text-center px-4 py-4">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          onClick={() => irADetalle(r.id)}
                          className="px-3 py-1.5 rounded bg-[#002E3E] text-white text-xs flex items-center gap-1"
                        >
                          <Eye size={14} /> Ver
                        </button>

                        {reservaPermisos.puedeVerTransferencia(r) && (
                          <button
                            onClick={() => irATransferencia(r.id)}
                            className="px-3 py-1.5 rounded bg-[#DEC01F] text-black text-xs flex items-center gap-1"
                          >
                            <Landmark size={14} /> Transferencia
                          </button>
                        )}

                        {reservaPermisos.puedeEditarInvitados(r) && (
                          <button
                            onClick={() => setReservaEditando(r)}
                            className="px-3 py-1.5 rounded bg-blue-600 text-white text-xs flex items-center gap-1"
                          >
                            <Pencil size={14} /> Invitados
                          </button>
                        )}

                        {reservaPermisos.puedeCancelar(r) && (
                          <button
                            onClick={() => handleCancelar(r)}
                            disabled={guardando}
                            className="px-3 py-1.5 rounded bg-red-600 text-white text-xs flex items-center gap-1 disabled:opacity-60"
                          >
                            <XCircle size={14} /> Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {reservaEditando && (
        <ModalEditarInvitados
          reserva={reservaEditando}
          loading={guardando}
          onClose={() => setReservaEditando(null)}
          onGuardar={handleGuardarInvitados}
        />
      )}
    </main>
  );
}
