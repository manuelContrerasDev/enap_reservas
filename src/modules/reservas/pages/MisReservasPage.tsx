import React from "react";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";

import { useReservasSocio } from "@/modules/reservas/hooks/useReservasSocio";
import { clp } from "@/lib/format";
import { useNavigate } from "react-router-dom";
import { ReservaEstado } from "@/types/enums";
import { reservaPermisos } from "@/modules/reservas/utils/reservaPermisos";

import ModalEditarReserva from "@/modules/admin/reservas/components/modals/ModalEditarReserva";
import { editarReserva } from "@/modules/admin/reservas/services/editarReserva";
import { useNotificacion } from "@/context/NotificacionContext";
import type { ReservaFrontend } from "@/types/BuscarReservaFrontend";

export default function MisReservasPage() {
  const { reservas, loading, reload } = useReservasSocio();
  const { agregarNotificacion } = useNotificacion();
  const [filtro, setFiltro] = React.useState("");
  const navigate = useNavigate();

  const [reservaEditando, setReservaEditando] =
    React.useState<ReservaFrontend | null>(null);
  const [guardando, setGuardando] = React.useState(false);

  const filtered = reservas.filter((r) =>
    r.espacioNombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleGuardarEdicion = async (payload: any) => {
    if (!reservaEditando) return;

    try {
      setGuardando(true);
      await editarReserva(reservaEditando.id, payload);
      agregarNotificacion("Reserva actualizada correctamente", "success");
      setReservaEditando(null);
      reload();
    } catch (err: any) {
      agregarNotificacion(err.message ?? "Error al editar la reserva", "error");
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
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-extrabold text-[#002E3E] mb-4">
          Mis Reservas
        </h1>

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
                      {clp(r.totalClp)}
                    </td>

                    <td className="text-center px-4 py-4">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-gray-200 text-gray-700">
                        {r.estado.replace("_", " ")}
                      </span>
                    </td>

                    <td className="text-center px-4 py-4 space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/reserva/preview?reservaId=${r.id}`)
                        }
                        className="px-3 py-1 rounded bg-[#002E3E] text-white text-xs"
                      >
                        Ver
                      </button>

                      {reservaPermisos.puedeEditarReserva(r) && (
                        <button
                          onClick={() => setReservaEditando(r)}
                          className="px-3 py-1 rounded bg-blue-600 text-white text-xs"
                        >
                          Editar
                        </button>
                      )}

                      {reservaPermisos.puedePagar(r) && (
                        <button
                          onClick={() =>
                            navigate(`/pago?reservaId=${r.id}`)
                          }
                          className="px-3 py-1 rounded bg-[#DEC01F] text-black text-xs"
                        >
                          Pagar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {reservaEditando && (
        <ModalEditarReserva
          reserva={reservaEditando}
          loading={guardando}
          onClose={() => setReservaEditando(null)}
          onGuardar={handleGuardarEdicion}
        />
      )}
    </main>
  );
}
