// src/modules/espacios/pages/PublicoEspaciosPage.tsx
import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import EspaciosHeader from "@/modules/espacios/components/EspaciosHeader";
import EspaciosFilters from "@/modules/espacios/components/EspaciosFilters";
import EspaciosGrid from "@/modules/espacios/components/EspaciosGrid";
import EspaciosEmptyState from "@/modules/espacios/components/EspaciosEmptyState";

import { useEspacios } from "@/context/EspaciosContext";
import { useAuth } from "@/context/auth";
import { useEspaciosFiltros } from "@/modules/espacios/hooks/useEspaciosFiltros";

import type { EspacioDTO } from "@/types/espacios";

const PublicoEspaciosPage: React.FC = () => {
  const { espacios, loading } = useEspacios();
  const { role } = useAuth();

  /* ============================================================
   * Resolver de precio según rol (CATÁLOGO)
   * ============================================================ */
  const resolverPrecio = useCallback(
    (espacio: EspacioDTO) =>
      role === "EXTERNO"
        ? espacio.precioBaseExterno
        : espacio.precioBaseSocio,
    [role]
  );

  /* ============================================================
   * Filtros (catálogo público, sin fechas)
   * ============================================================ */
  const {
    search,
    tipo,
    setSearch,
    setTipo,
    espaciosFiltrados,
    resetFiltrosBasicos,
  } = useEspaciosFiltros({
    espacios,
    fechaFiltro: null,
    soloDisponibles: false,
    estaOcupadoEnFecha: () => false,
    resolverPrecio,
  });

  /* ============================================================
   * Contenido renderizado
   * ============================================================ */
  const contenido = useMemo(() => {
    if (loading) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EspaciosEmptyState
            title="Cargando espacios…"
            message="Estamos consultando los espacios disponibles."
          />
        </motion.div>
      );
    }

    if (!loading && espacios.length === 0) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EspaciosEmptyState
            title="Aún no hay espacios"
            message="El catálogo estará disponible cuando el administrador los registre."
          />
        </motion.div>
      );
    }

    if (espaciosFiltrados.length === 0) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EspaciosEmptyState
            title="Sin resultados"
            message="Prueba ajustando los filtros."
            actionLabel="Limpiar filtros"
            onAction={resetFiltrosBasicos}
          />
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <EspaciosGrid
          espacios={espaciosFiltrados}
          fechaFiltro={null}
          estaOcupadoEnFecha={() => false}
        />
      </motion.div>
    );
  }, [loading, espacios, espaciosFiltrados, resetFiltrosBasicos]);

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-10">
      <Helmet>
        <title>Espacios disponibles | Sindicato ENAP</title>
      </Helmet>

      <EspaciosHeader role={role} />

      <div className="max-w-7xl mx-auto px-6 pt-4">
        <EspaciosFilters
          search={search}
          setSearch={setSearch}
          tipo={tipo}
          setTipo={setTipo}
          resetFiltros={resetFiltrosBasicos}
        />
      </div>

      <section className="max-w-7xl mx-auto px-6 py-6">
        {contenido}
      </section>
    </main>
  );
};

export default React.memo(PublicoEspaciosPage);
