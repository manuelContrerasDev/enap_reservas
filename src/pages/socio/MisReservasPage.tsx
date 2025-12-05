import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Loader2, Search } from "lucide-react";

import { useReservasSocio } from "@/hooks/useReservasSocio";
import { clp } from "@/lib/format";
import { useNavigate } from "react-router-dom";


export default function MisReservasPage() {
  const { reservas, loading, reload } = useReservasSocio();
  const [filtro, setFiltro] = React.useState("");
  const navigate = useNavigate();

  const filtered = reservas.filter((r) =>
    r.espacioNombre.toLowerCase().includes(filtro.toLowerCase())
  );

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

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#002E3E]" size={40} />
          </div>
        )}

        {/* Tabla */}
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
                    {/* Espacio */}
                    <td className="px-4 py-4">
                      <strong>{r.espacioNombre}</strong>
                      <div className="text-xs text-gray-500">
                        {r.espacioTipo}
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="text-center px-4 py-4">
                      {new Date(r.fechaInicio).toLocaleDateString("es-CL")} <br />
                      —
                      <br />
                      {new Date(r.fechaFin).toLocaleDateString("es-CL")}
                    </td>

                    {/* Personas */}
                    <td className="text-center px-4 py-4">
                      {r.cantidadPersonas}
                    </td>

                    {/* Total */}
                    <td className="text-center px-4 py-4">
                      {clp(r.totalClp)}
                    </td>

                    {/* Estado */}
                    <td className="text-center px-4 py-4">
                      <span
                        className={`
                          px-2 py-1 rounded text-xs font-bold
                          ${
                            r.estado === "CONFIRMADA"
                              ? "bg-green-100 text-green-700"
                              : r.estado === "PENDIENTE"
                              ? "bg-yellow-100 text-yellow-700"
                              : r.estado === "CANCELADA"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-200 text-gray-700"
                          }
                        `}
                      >
                        {r.estado}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="text-center px-4 py-4 space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/reserva/preview?reservaId=${r.id}`)
                        }
                        className="px-3 py-1 rounded bg-[#002E3E] text-white text-xs hover:bg-[#01384A]"
                      >
                        Ver
                      </button>

                      {r.estado === "PENDIENTE" && (
                        <button
                          onClick={() =>
                            navigate(`/pago?reservaId=${r.id}`)
                          }
                          className="px-3 py-1 rounded bg-[#DEC01F] text-black text-xs hover:bg-[#c6aa19]"
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
    </main>
  );
}
