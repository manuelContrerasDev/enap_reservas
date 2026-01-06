import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Trash2,
  ChevronDown,
  ChevronRight,
  User,
  Edit,
  Paperclip,
  CheckCircle,
} from "lucide-react";

import type { ReservaFrontend } from "@/types/ReservaFrontend";
import { ReservaEstado } from "@/types/enums";

// UI
import Button from "@/components/ui/base/Button";
import Card from "@/components/ui/base/Card";
import Modal from "@/components/ui/base/Modal";
import Select from "@/components/ui/base/Select";

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

// ✅ Transiciones válidas ADMIN (sin confirmar manual aquí)
const TRANSICIONES_VALIDAS: Record<ReservaEstado, ReservaEstado[]> = {
  PENDIENTE_PAGO: [ReservaEstado.CANCELADA, ReservaEstado.RECHAZADA],
  CONFIRMADA: [ReservaEstado.FINALIZADA, ReservaEstado.CANCELADA],
  FINALIZADA: [],
  CANCELADA: [],
  CADUCADA: [],
  RECHAZADA: [],
};

interface Props {
  rows: ReservaFrontend[];
  onEditar: (reserva: ReservaFrontend) => void;
  handleEliminar: (id: string) => void;
  handleEstadoChange: (id: string, estado: ReservaEstado) => void;

  // ✅ Acciones manuales
  onSubirComprobante: (reserva: ReservaFrontend) => void;
  onConfirmarManual: (id: string) => void;

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
  handleEstadoChange,
  onSubirComprobante,
  onConfirmarManual,
  prefersReducedMotion,
}) => {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [toCancel, setToCancel] = useState<ReservaFrontend | null>(null);

  const toggleRow = useCallback((id: string) => {
    setOpenRow((prev) => (prev === id ? null : id));
  }, []);

  const confirmCancel = useCallback(() => {
    if (!toCancel) return;
    handleEliminar(toCancel.id);
    setToCancel(null);
  }, [toCancel, handleEliminar]);

  const hasRows = rows.length > 0;

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
                const opciones = TRANSICIONES_VALIDAS[r.estado] ?? [];
                const puedeEditarEstado = opciones.length > 0;

                const esTerminal = [
                  ReservaEstado.CANCELADA,
                  ReservaEstado.CADUCADA,
                  ReservaEstado.RECHAZADA,
                  ReservaEstado.FINALIZADA,
                ].includes(r.estado);

                const puedeSubirComprobante = r.estado === ReservaEstado.PENDIENTE_PAGO;
                const puedeConfirmar = r.estado === ReservaEstado.PENDIENTE_PAGO && !!r.comprobanteUrl;

                return (
                  <React.Fragment key={r.id}>
                    <motion.tr
                      initial={!prefersReducedMotion ? { opacity: 0 } : undefined}
                      animate={!prefersReducedMotion ? { opacity: 1 } : undefined}
                      transition={{ delay: i * 0.02 }}
                      className="odd:bg-white even:bg-gray-50 hover:bg-enap-bg/40"
                    >
                      <td className="px-6 py-4">
                        <button
                          aria-label={isOpen ? "Cerrar detalle" : "Ver detalle"}
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
                        {safeDateLabel(r.fechaInicio)} — {safeDateLabel(r.fechaFin)}
                        <div className="text-xs text-gray-500">{r.dias} días</div>
                      </td>

                      <td className="px-6 py-4 text-center">{r.cantidadPersonas}</td>

                      <td className="px-6 py-4 text-right font-semibold text-enap-gold">
                        ${CLP.format(r.totalClp)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Select
                          value={r.estado}
                          disabled={!puedeEditarEstado}
                          onChange={(e) => {
                            const nuevo = e.target.value as ReservaEstado;
                            if (
                              nuevo === r.estado ||
                              !(TRANSICIONES_VALIDAS[r.estado] ?? []).includes(nuevo)
                            ) {
                              return;
                            }
                            handleEstadoChange(r.id, nuevo);
                          }}
                          className={`text-xs py-1 px-2 ${ESTADO_STYLE[r.estado]}`}
                        >
                          <option value={r.estado}>{ESTADO_LABEL[r.estado]}</option>

                          {opciones
                            .filter((x) => x !== r.estado)
                            .map((estado) => (
                              <option key={estado} value={estado}>
                                {ESTADO_LABEL[estado]}
                              </option>
                            ))}
                        </Select>

                        {!puedeEditarEstado && (
                          <div className="mt-1 text-[11px] text-gray-500">
                            Estado final (no editable)
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center space-x-2">
                        <Button
                          variant="ghost"
                          onClick={() => onEditar(r)}
                          disabled={esTerminal}
                          title={esTerminal ? "No editable en estado final" : "Editar"}
                        >
                          <Edit size={16} />
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => setToCancel(r)}
                          disabled={esTerminal}
                          title={esTerminal ? "No se puede cancelar en estado final" : "Cancelar"}
                        >
                          <Trash2 size={16} />
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => onSubirComprobante(r)}
                          disabled={!puedeSubirComprobante}
                          title={
                            puedeSubirComprobante
                              ? "Subir comprobante"
                              : "Solo disponible en PENDIENTE_PAGO"
                          }
                        >
                          <Paperclip size={16} />
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={() => onConfirmarManual(r.id)}
                          disabled={!puedeConfirmar}
                          title={
                            puedeConfirmar
                              ? "Confirmar reserva"
                              : "Requiere comprobante para confirmar"
                          }
                        >
                          <CheckCircle size={16} />
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
                                  <li key={inv.id} className="text-sm flex justify-between">
                                    <span>{inv.nombre}</span>
                                    <span className="text-gray-500">{inv.rut}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}

              {!hasRows && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-600">
                    No hay resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={!!toCancel}
        onClose={() => setToCancel(null)}
        title="Cancelar reserva"
      >
        <p className="text-sm mb-4">
          Esta acción cambiará el estado a <strong>CANCELADA</strong>.
          <br />
          No se puede revertir desde el sistema.
        </p>

        <div className="flex justify-end gap-3">
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
