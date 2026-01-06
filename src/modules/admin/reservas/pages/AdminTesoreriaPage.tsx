// src/pages/admin/TesoreriaPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { Navigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { Loader2, Filter, DollarSign } from "lucide-react";
import { api } from "@/lib/axios";
import { Helmet } from "react-helmet-async";

type PagoStatus = "created" | "pending" | "approved" | "rejected" | "cancelled";

interface PagoAdminDTO {
  id: string;
  provider: string;
  amountClp: number;
  status: PagoStatus;
  createdAt: string;
  reserva: {
    id: string;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
    espacio: {
      id: string;
      nombre: string;
      tipo: string;
    };
    user: {
      email: string;
      name: string | null;
      role: string;
    };
  };
}

/** Tipo fuerte de la respuesta del backend */
interface PagosResponse {
  pagos: PagoAdminDTO[];
}

const TesoreriaPage: React.FC = () => {
  const { role } = useAuth();
  const [pagos, setPagos] = useState<PagoAdminDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  /** 🔐 Verificación de rol ADMIN */
  if (role !== "ADMIN") {
    return <Navigate to={PATHS.APP_HOME} replace />;
  }

  /**
   * 📌 Cargar pagos (usando axios con token automático + tipado fuerte)
   */
  const fetchPagos = async (estado?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = estado ? `?estado=${estado}` : "";

      /** Tipado seguro de la respuesta del backend */
      const resp = await api.get<PagosResponse>(`/pagos/admin${params}`);
      const data = resp.data;

      setPagos(data.pagos || []);
    } catch (err: any) {
      console.error("❌ [TesoreriaPage ERROR]:", err);
      setError(err.response?.data?.error || "Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  const totalRecaudado = pagos
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.amountClp, 0);

  return (
    <>
      <Helmet>
        <title>Administración | Tesoreria</title>
      </Helmet>
      <main className="min-h-[calc(100vh-120px)] bg-[#F3F4F6] py-8 px-4">
        <section className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#002E3E]">
                Tesorería - Pagos ENAP
              </h1>
              <p className="text-sm text-gray-600">
                Resumen de pagos realizados por socios y externos.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <DollarSign className="text-green-600" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Total recaudado</p>
                  <p className="font-semibold text-gray-800">
                    ${totalRecaudado.toLocaleString("es-CL")}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Filtrar por estado:
              </span>
            </div>

            <select
              value={estadoFiltro}
              onChange={(e) => {
                const value = e.target.value;
                setEstadoFiltro(value);
                fetchPagos(value || undefined);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#002E3E]"
            >
              <option value="">Todos</option>
              <option value="approved">Aprobado</option>
              <option value="pending">Pendiente</option>
              <option value="rejected">Rechazado</option>
              <option value="created">Creado</option>
              <option value="cancelled">Cancelado</option>
            </select>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
                <Loader2 className="animate-spin" size={16} />
                Cargando pagos...
              </div>
            )}
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            {error ? (
              <div className="p-6 text-center text-red-500 text-sm">{error}</div>
            ) : pagos.length === 0 && !loading ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No hay pagos registrados.
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-left">Socio</th>
                    <th className="px-4 py-2 text-left">Espacio</th>
                    <th className="px-4 py-2 text-left">Proveedor</th>
                    <th className="px-4 py-2 text-right">Monto</th>
                    <th className="px-4 py-2 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {new Date(pago.createdAt).toLocaleString("es-CL")}
                      </td>

                      <td className="px-4 py-2">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {pago.reserva.user.name || "Sin nombre"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {pago.reserva.user.email}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-2">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {pago.reserva.espacio.nombre}
                          </span>
                          <span className="text-xs text-gray-500">
                            {pago.reserva.espacio.tipo}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-2 uppercase text-xs text-gray-600">
                        {pago.provider}
                      </td>

                      <td className="px-4 py-2 text-right font-semibold text-gray-800">
                        ${pago.amountClp.toLocaleString("es-CL")}
                      </td>

                      <td className="px-4 py-2 text-center">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            pago.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : pago.status === "pending" ||
                                pago.status === "created"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {pago.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default TesoreriaPage;
