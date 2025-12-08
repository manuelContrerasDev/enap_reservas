// src/pages/socio/EspaciosPage.tsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import EspaciosHeader from "@/modules/espacios/components/EspaciosHeader";
import EspaciosFilters from "@/modules/espacios/components/EspaciosFilters";
import EspaciosGrid from "@/modules/espacios/components/EspaciosGrid";
import EspaciosEmptyState from "@/modules/espacios/components/EspaciosEmptyState";

import { useEspacios } from "@/context/EspaciosContext";
import { useAuth } from "@/context/auth";
import { useEspaciosFiltros } from "@/modules/espacios/hooks/useEspaciosFiltros";

const EspaciosPage: React.FC = () => {
  const { espacios, loading } = useEspacios();
  const { role } = useAuth();

  /* ============================================================
   * FILTROS BÁSICOS
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
    fechaFiltro: null, // ya no se usa fecha aquí
    soloDisponibles: false,
    estaOcupadoEnFecha: () => false, // placeholder al remover disponibilidad
  });

  const resetFiltros = () => {
    resetFiltrosBasicos();
  };

  /* ============================================================
   * RENDER PRINCIPAL optimizado
   * ============================================================ */
  const contenido = useMemo(() => {
    if (loading) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <EspaciosEmptyState
            title="Cargando espacios…"
            message="Estamos consultando los espacios disponibles del sindicato."
          />
        </motion.div>
      );
    }

    if (!loading && espacios.length === 0) {
      return (
        <motion.div
          key="empty-db"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <EspaciosEmptyState
            title="Aún no hay espacios disponibles"
            message="Cuando el administrador registre los espacios del sindicato, podrás verlos aquí."
          />
        </motion.div>
      );
    }

    if (espaciosFiltrados.length === 0) {
      return (
        <motion.div
          key="empty-filter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <EspaciosEmptyState
            title="No se encontraron espacios"
            message="Prueba ajustando los filtros o busca otro término."
            actionLabel="Limpiar filtros"
            onAction={resetFiltros}
          />
        </motion.div>
      );
    }

    return (
      <motion.div
        key="grid"
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
  }, [loading, espacios, espaciosFiltrados]);

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-10">
      <Helmet>
        <title>Espacios disponibles | Sindicato ENAP</title>
      </Helmet>

      {/* HEADER */}
      <EspaciosHeader role={role} />

      {/* FILTROS SIMPLIFICADOS */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <EspaciosFilters
          search={search}
          setSearch={setSearch}
          tipo={tipo}
          setTipo={setTipo}
          resetFiltros={resetFiltros}
        />
      </div>

      {/* CONTENIDO */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        {contenido}
      </section>
    </main>
  );
};

export default React.memo(EspaciosPage);
