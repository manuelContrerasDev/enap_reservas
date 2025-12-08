// src/components/admin/reservas/ReservasTable.tsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Trash2, ChevronDown, ChevronRight, User } from "lucide-react";
import type { ReservaFrontend } from "@/types/ReservaFrontend";
import type { ReservaEstado } from "@/types/enums";

const CLP = new Intl.NumberFormat("es-CL");
const DATE = new Intl.DateTimeFormat("es-CL", { dateStyle: "short" });

const estadoClassMap: Record<ReservaEstado, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CONFIRMADA: "bg-green-100 text-green-800 border-green-300",
  CANCELADA: "bg-red-100 text-red-800 border-red-300",
  RECHAZADA: "bg-red-100 text-red-800 border-red-300",
};

interface Props {
  rows: ReservaFrontend[];
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

  const toggleRow = (id: string) => {
    setOpenRow((prev) => (prev === id ? null : id));
  };

  return (
    <section className="rounded-xl bg-white shadow border overflow-hidden">

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#002E3E] text-white">
            <tr>
              <th className="px-6 py-3 text-left uppercase text-xs">Ver</th>
              <th className="px-6 py-3 text-left uppercase text-xs">Usuario</th>
              <th className="px-6 py-3 text-left uppercase text-xs">Espacio</th>
              <th className="px-6 py-3 text-left uppercase text-xs">Fechas</th>
              <th className="px-6 py-3 text-center uppercase text-xs">Personas</th>
              <th className="px-6 py-3 text-right uppercase text-xs">Total</th>
              <th className="px-6 py-3 text-center uppercase text-xs">Estado</th>
              <th className="px-6 py-3 text-center uppercase text-xs">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">

            {rows.map((r, i) => {
              const isOpen = openRow === r.id;

              return (
                <React.Fragment key={r.id}>
                  {/* 🔵 FILA PRINCIPAL */}
                  <motion.tr
                    initial={!prefersReducedMotion ? { opacity: 0 } : undefined}
                    animate={!prefersReducedMotion ? { opacity: 1 } : undefined}
                    transition={{ delay: i * 0.03 }}
                    className="odd:bg-white even:bg-[#F9FAFB] hover:bg-[#F1F8FA]"
                  >
                    {/* Botón expandir */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRow(r.id)}
                        className="text-[#002E3E] hover:text-black"
                      >
                        {isOpen ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                    </td>

                    {/* Usuario */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#002E3E]">
                          {r.usuario?.nombre ?? "—"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {r.usuario?.email ?? "—"}
                        </span>
                      </div>
                    </td>

                    {/* Espacio */}
                    <td className="px-6 py-4 flex items-center gap-2">
                      <MapPin size={14} className="text-[#002E3E]" />
                      {r.espacioNombre ?? "—"}
                    </td>

                    {/* Fechas */}
                    <td className="px-6 py-4 text-center">
                      {DATE.format(new Date(r.fechaInicio))} —{" "}
                      {DATE.format(new Date(r.fechaFin))}
                      <div className="text-xs text-gray-500">{r.dias} días</div>
                    </td>

                    {/* Personas */}
                    <td className="px-6 py-4 text-center">
                      {r.cantidadPersonas}
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 text-right font-semibold text-[#DEC01F]">
                      ${CLP.format(r.totalClp)}
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 text-center">
                      <select
                        value={r.estado}
                        onChange={(e) =>
                          handleEstadoChange(
                            r.id,
                            e.target.value as ReservaEstado
                          )
                        }
                        className={`rounded px-2 py-1 text-xs font-medium border ${estadoClassMap[r.estado]}`}
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="CONFIRMADA">Confirmada</option>
                        <option value="CANCELADA">Cancelada</option>
                        <option value="RECHAZADA">Rechazada</option>
                      </select>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEliminar(r.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>

                  {/* 🔵 FILA EXPANDIDA — INVITADOS */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#F1F8FA]"
                      >
                        <td colSpan={8} className="px-10 py-4">
                          <h4 className="font-semibold text-[#002E3E] mb-2 flex items-center gap-2">
                            <User size={16} /> Lista de asistentes ({r.invitados?.length ?? 0})
                          </h4>

                          {(!r.invitados || r.invitados.length === 0) && (
                            <p className="text-sm text-gray-500">
                              No se registraron invitados.
                            </p>
                          )}

                          <ul className="space-y-1">
                            {r.invitados?.map((inv: any, idx: number) => (
                              <li
                                key={idx}
                                className="text-sm bg-white px-3 py-2 rounded-lg border flex justify-between"
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

            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-6 text-center text-gray-600">
                  No hay resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ReservasTable;
