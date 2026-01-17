import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Trash2,
  ChevronDown,
  ChevronRight,
  User,
  Paperclip,
  CheckCircle,
} from "lucide-react";

import type { ReservaFrontend } from "@/modules/reservas/types/ReservaFrontend";
import { ReservaEstado } from "@/shared/types/enums";

// UI
import Button from "@/shared/ui/base/Button";
import Card from "@/shared/ui/base/Card";
import Modal from "@/shared/ui/base/Modal";
import Input from "@/shared/ui/base/Input";

const CLP = new Intl.NumberFormat("es-CL");
const DATE = new Intl.DateTimeFormat("es-CL", { dateStyle: "short" });

const ESTADO_LABEL: Record<ReservaEstado, string> = {
  PENDIENTE_PAGO: "Pendiente de pago",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
  CADUCADA: "Caducada",
  RECHAZADA: "Rechazada",
  FINALIZADA: "Finalizada",
};

const ESTADO_STYLE: Record<ReservaEstado, string> = {
  PENDIENTE_PAGO: "bg-yellow-50 text-yellow-700",
  CONFIRMADA: "bg-green-50 text-green-700",
  CANCELADA: "bg-red-50 text-red-700",
  CADUCADA: "bg-gray-200 text-gray-600",
  RECHAZADA: "bg-red-50 text-red-700",
  FINALIZADA: "bg-blue-50 text-blue-700",
};

interface Props {
  rows: ReservaFrontend[];
  onEditar: (reserva: ReservaFrontend) => void;
  handleEliminar: (id: string, motivo?: string) => void;
  onSubirComprobante: (reserva: ReservaFrontend) => void;
  onValidarPago: (reserva: ReservaFrontend) => void;
  prefersReducedMotion: boolean;
}

function safeDateLabel(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return DATE.format(d);
}

const ReservasTable: React.FC<Props> = ({
  rows,
  onEditar,
  handleEliminar,
  onSubirComprobante,
  onValidarPago,
  prefersReducedMotion,
}) => {
  const [openRow, setOpenRow] = useState<string | null>(null);

  const [toCancel, setToCancel] = useState<ReservaFrontend | null>(null);
  const [cancelMotivo, setCancelMotivo] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);

  const toggleRow = useCallback((id: string) => {
    setOpenRow((prev) => (prev === id ? null : id));
  }, []);

  const confirmCancel = useCallback(() => {
    if (!toCancel) return;

    const motivo = cancelMotivo.trim();
    if (!motivo) {
      setCancelError("Debes indicar un motivo de cancelación.");
      return;
    }

    handleEliminar(toCancel.id, motivo);

    setToCancel(null);
    setCancelMotivo("");
    setCancelError(null);
  }, [toCancel, cancelMotivo, handleEliminar]);

  const estadosTerminales = useMemo(
    () =>
      new Set<ReservaEstado>([
        ReservaEstado.CANCELADA,
        ReservaEstado.CADUCADA,
        ReservaEstado.RECHAZADA,
        ReservaEstado.FINALIZADA,
      ]),
    []
  );

  return (
    <section aria-label="Tabla de reservas">
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-enap-primary text-white">
              <tr>
                <th className="px-6 py-3">Ver</th>
                <th className="px-6 py-3">Socio</th>
                <th className="px-6 py-3">Espacio</th>
                <th className="px-6 py-3 text-center">Fechas</th>
                <th className="px-6 py-3 text-center">Personas</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-center">Estado</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {rows.map((r, i) => {
                const isOpen = openRow === r.id;

                const puedeSubirComprobante =
                  r.estado === ReservaEstado.PENDIENTE_PAGO;

                const puedeValidarPago =
                  r.estado === ReservaEstado.PENDIENTE_PAGO &&
                  !!r.comprobanteUrl;

                const esTerminal = estadosTerminales.has(r.estado);

                return (
                  <React.Fragment key={r.id}>
                    <motion.tr
                      initial={
                        !prefersReducedMotion ? { opacity: 0 } : undefined
                      }
                      animate={
                        !prefersReducedMotion ? { opacity: 1 } : undefined
                      }
                      transition={{ delay: i * 0.02 }}
                      className="odd:bg-white even:bg-gray-50 hover:bg-enap-bg/40"
                    >
                      <td className="px-6 py-4">
                        <button
                          aria-label={
                            isOpen ? "Cerrar detalle" : "Ver detalle"
                          }
                          onClick={() => toggleRow(r.id)}
                        >
                          {isOpen ? <ChevronDown /> : <ChevronRight />}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{r.socio.nombre}</span>
                          <span className="text-xs text-gray-500">
                            {r.socio.correoEnap}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {r.espacioNombre}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {safeDateLabel(r.fechaInicio)} —{" "}
                        {safeDateLabel(r.fechaFin)}
                        <div className="text-xs text-gray-500">
                          {r.dias} días
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        {r.cantidadPersonas}
                      </td>

                      <td className="px-6 py-4 text-right font-semibold text-enap-gold">
                        ${CLP.format(r.totalClp)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${ESTADO_STYLE[r.estado]}`}
                        >
                          {ESTADO_LABEL[r.estado]}
                        </span>

                        {esTerminal && (
                          <div className="mt-1 text-[11px] text-gray-500">
                            Estado final — no admite acciones
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center space-x-2">
                        <Button
                          variant="ghost"
                          onClick={() => onValidarPago(r)}
                          disabled={!puedeValidarPago}
                          title={
                            puedeValidarPago
                              ? "Validar comprobante (impacta tesorería)"
                              : !r.comprobanteUrl
                              ? "Sin comprobante cargado"
                              : "Solo disponible en estado Pendiente de pago"
                          }
                        >
                          <CheckCircle size={16} />
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => onSubirComprobante(r)}
                          disabled={!puedeSubirComprobante}
                          title={
                            puedeSubirComprobante
                              ? "Subir comprobante (evidencia de pago)"
                              : "Solo disponible en estado Pendiente de pago"
                          }
                        >
                          <Paperclip size={16} />
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            setToCancel(r);
                            setCancelMotivo("");
                            setCancelError(null);
                          }}
                          disabled={esTerminal}
                          title={
                            esTerminal
                              ? "No se puede cancelar en un estado final"
                              : "Cancelar reserva"
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </motion.tr>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-enap-bg/60"
                        >
                          <td colSpan={8} className="px-10 py-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <User size={16} /> Invitados
                                </h4>

                                {!r.invitados.length ? (
                                  <p className="text-sm text-gray-500">
                                    Sin invitados registrados.
                                  </p>
                                ) : (
                                  <ul className="space-y-1">
                                    {r.invitados.map((inv) => (
                                      <li
                                        key={inv.id}
                                        className="text-sm flex justify-between"
                                      >
                                        <span>{inv.nombre}</span>
                                        <span className="text-gray-500">
                                          {inv.rut}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Paperclip size={16} /> Comprobante
                                </h4>

                                {r.comprobanteUrl ? (
                                  <div className="text-sm">
                                    <a
                                      href={r.comprobanteUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-enap-primary underline"
                                    >
                                      Ver comprobante
                                    </a>
                                    <div className="text-xs text-gray-500 mt-1">
                                      (Aprobar impacta tesorería y estado)
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    Sin comprobante asociado.
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Cancelación */}
      <Modal
        open={!!toCancel}
        onClose={() => setToCancel(null)}
        title="Cancelar reserva"
      >
        <p className="text-sm mb-4">
          Esta acción cambiará el estado a{" "}
          <strong>CANCELADA</strong>.
          <br />
          <span className="text-gray-600">
            Debes indicar un motivo (quedará registrado).
          </span>
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Motivo de cancelación
          </label>
          <Input
            placeholder="Ej: solicitud administrativa / error de fechas / no cumple requisitos"
            value={cancelMotivo}
            onChange={(e) => {
              setCancelMotivo(e.target.value);
              if (cancelError) setCancelError(null);
            }}
            error={!!cancelError}
          />
          {cancelError && (
            <p className="text-sm text-red-600">{cancelError}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setToCancel(null)}>
            Volver
          </Button>
          <Button variant="primary" onClick={confirmCancel}>
            Confirmar
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default ReservasTable;
