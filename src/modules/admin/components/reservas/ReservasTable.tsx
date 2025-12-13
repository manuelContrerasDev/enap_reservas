// src/components/admin/reservas/ReservasTable.tsx

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Trash2,
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react";

import type { ReservaBackend } from "@/types/ReservaBackend";
import type { ReservaEstado } from "@/types/enums";

// UI BASE
import Button from "@/components/ui/base/Button";
import Card from "@/components/ui/base/Card";
import Modal from "@/components/ui/base/Modal";
import Select from "@/components/ui/base/Select";

const CLP = new Intl.NumberFormat("es-CL");
const DATE = new Intl.DateTimeFormat("es-CL", { dateStyle: "short" });

const ESTADOS: ReservaEstado[] = [
  "PENDIENTE",
  "CONFIRMADA",
  "CANCELADA",
  "RECHAZADA",
];

const ESTADO_LABEL: Record<ReservaEstado, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
  RECHAZADA: "Rechazada",
};

const ESTADO_STYLE: Record<ReservaEstado, string> = {
  PENDIENTE: "bg-yellow-50 text-yellow-700",
  CONFIRMADA: "bg-green-50 text-green-700",
  CANCELADA: "bg-red-50 text-red-700",
  RECHAZADA: "bg-red-50 text-red-700",
};

interface Props {
  rows: ReservaBackend[];
  handleEliminar: (id: string) => void;
  handleEstadoChange: (id: string, estado: ReservaEstado) => void;
  prefersReducedMotion: boolean;
}

const ReservasTable: React.FC<Props> = ({
  rows,
  handleEliminar,
  handleEstadoChange,
  prefersReducedMotion,
}) => {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<ReservaBackend | null>(null);

  const toggleRow = useCallback((id: string) => {
    setOpenRow((prev) => (prev === id ? null : id));
  }, []);

  const confirmDelete = useCallback(() => {
    if (!toDelete) return;
    handleEliminar(toDelete.id);
    setToDelete(null);
  }, [toDelete, handleEliminar]);

  return (
    <section aria-label="Tabla de reservas">
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-enap-primary text-white">
              <tr>
                <th className="px-6 py-3 text-xs uppercase">Ver</th>
                <th className="px-6 py-3 text-xs uppercase">Usuario</th>
                <th className="px-6 py-3 text-xs uppercase">Espacio</th>
                <th className="px-6 py-3 text-xs uppercase text-center">Fechas</th>
                <th className="px-6 py-3 text-xs uppercase text-center">Personas</th>
                <th className="px-6 py-3 text-xs uppercase text-right">Total</th>
                <th className="px-6 py-3 text-xs uppercase text-center">Estado</th>
                <th className="px-6 py-3 text-xs uppercase text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {rows.map((r, i) => {
                const isOpen = openRow === r.id;

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
                          className="text-enap-primary"
                        >
                          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{r.usuario?.nombre ?? "—"}</span>
                          <span className="text-xs text-gray-500">{r.usuario?.email ?? "—"}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 flex items-center gap-2">
                        <MapPin size={14} />
                        {r.espacioNombre ?? "—"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {DATE.format(new Date(r.fechaInicio))} —{" "}
                        {DATE.format(new Date(r.fechaFin))}
                        <div className="text-xs text-gray-500">{r.dias} días</div>
                      </td>

                      <td className="px-6 py-4 text-center">{r.cantidadPersonas}</td>

                      <td className="px-6 py-4 text-right font-semibold text-enap-gold">
                        ${CLP.format(r.totalClp)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Select
                          aria-label="Estado de la reserva"
                          value={r.estado}
                          onChange={(e) =>
                            handleEstadoChange(r.id, e.target.value as ReservaEstado)
                          }
                          className={`text-xs py-1 px-2 ${ESTADO_STYLE[r.estado]}`}
                        >
                          {ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>
                              {ESTADO_LABEL[estado]}
                            </option>
                          ))}
                        </Select>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Button variant="ghost" onClick={() => setToDelete(r)}>
                          <Trash2 size={18} />
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
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <User size={16} />
                              Asistentes ({r.invitados?.length ?? 0})
                            </h4>

                            {!r.invitados?.length && (
                              <p className="text-sm text-gray-500">
                                No se registraron invitados.
                              </p>
                            )}

                            <ul className="space-y-2">
                              {r.invitados?.map((inv, idx) => (
                                <li
                                  key={idx}
                                  className="bg-white border rounded-lg px-4 py-2 flex justify-between text-sm"
                                >
                                  <span>{inv.nombre ?? "Sin nombre"}</span>
                                  <span className="text-gray-500">{inv.rut ?? "—"}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}

              {!rows.length && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-600">
                    No hay resultados para los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Eliminar reserva">
        <p className="text-sm text-gray-700 mb-6">
          ¿Estás seguro que deseas eliminar esta reserva? Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setToDelete(null)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={confirmDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default ReservasTable;
