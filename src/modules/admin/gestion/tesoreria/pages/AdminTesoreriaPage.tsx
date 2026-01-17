// src/modules/admin/tesoreria/pages/AdminTesoreriaPage.tsx
import React, { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { Download } from "lucide-react";

import { useAuth } from "@/modules/auth/hooks";
import { useTesoreriaAdmin } from "../../../components/hooks/useTesoreriaAdmin";

import TesoreriaKPIs from "../../../components/kpis/TesoreriaKPIs";
import TesoreriaFilters from "../../../components/filters/TesoreriaFilters";
import TesoreriaTable from "../../../components/table/TesoreriaTable";
import ModalExportarTesoreria from "../../../components/modals/ModalExportarTesoreria";

import { Panel, Divider, LoaderPage, Button } from "@/shared/ui/loaders";

const AdminTesoreriaPage: React.FC = () => {
  const { role } = useAuth();
  const [openExport, setOpenExport] = useState(false);

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const { movimientos, kpis, loading, filtros, setFiltros } =
    useTesoreriaAdmin();

  /* ============================================================
   * 📤 EXPORT CSV — Backend como fuente de verdad
   * ============================================================ */
  const handleExportCSV = useCallback(() => {
    const params = new URLSearchParams();

    if (filtros.desde) params.set("desde", filtros.desde);
    if (filtros.hasta) params.set("hasta", filtros.hasta);

    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/api/admin/tesoreria/movimientos/export${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    window.open(url, "_blank");
  }, [filtros]);

  return (
    <>
      <Helmet>
        <title>Administración | Tesorería</title>
      </Helmet>

      <main className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] px-6 py-10">
        {loading ? (
          <LoaderPage />
        ) : (
          <div className="mx-auto max-w-6xl space-y-6">
            {/* ====================================================
             * HEADER
             * ==================================================== */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-enap-primary">
                  Tesorería
                </h1>
                <p className="text-gray-600 text-sm">
                  Control financiero de pagos confirmados y movimientos registrados.
                </p>
              </div>

              <Button
                variant="secondary"
                onClick={() => setOpenExport(true)}
                disabled={movimientos.length === 0}
                title={
                  movimientos.length === 0
                    ? "No hay movimientos para exportar"
                    : "Exportar movimientos financieros"
                }
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>

            {/* ====================================================
             * KPIs — BACKEND
             * ==================================================== */}
            <TesoreriaKPIs
              totalIngresos={kpis.totalIngresos}
              totalMovimientos={kpis.totalMovimientos}
            />

            {/* ====================================================
             * TABLA
             * ==================================================== */}
            <Panel title="Movimientos financieros">
              <TesoreriaFilters filtros={filtros} setFiltros={setFiltros} />
              <Divider />
              <TesoreriaTable rows={movimientos} />
            </Panel>
          </div>
        )}
      </main>

      {/* ====================================================
       * MODAL EXPORTACIÓN
       * ==================================================== */}
      <ModalExportarTesoreria
        open={openExport}
        onClose={() => setOpenExport(false)}
        filtros={filtros}
        onExportExcel={handleExportCSV} // CSV hoy, XLSX mañana
      />
    </>
  );
};

export default AdminTesoreriaPage;
