// src/modules/espacios/pages/PublicoEspaciosPage.tsx
import React, { memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import EspaciosHeader from "@/modules/espacios/components/EspaciosHeader";
import EspaciosFilters from "@/modules/espacios/components/EspaciosFilters";
import EspaciosGrid from "@/modules/espacios/components/EspaciosGrid";
import EspaciosEmptyState from "@/modules/espacios/components/EspaciosEmptyState";
import ProductoEspacioCard from "@/modules/espacios/components/ProductoEspacioCard";

import { useEspacios } from "@/modules/espacios/context/EspaciosContext";
import { useAuth } from "@/modules/auth/hooks";
import { useEspaciosFiltros } from "@/modules/espacios/hooks/useEspaciosFiltros";

import { resolverPrecioPorRol } from "@/modules/espacios/helpers";
import type { EspacioDTO } from "@/modules/espacios/types/espacios";
import { PATHS } from "@/routes/paths";

const PublicoEspaciosPage: React.FC = () => {
  const { espacios, loading } = useEspacios();
  const { role } = useAuth();
  const navigate = useNavigate();

  /* ============================================================
   * Precio por rol (visual)
   * ============================================================ */
  const resolverPrecio = useCallback(
    (espacio: EspacioDTO) => resolverPrecioPorRol(espacio, role),
    [role]
  );

  /* ============================================================
   * Dummy disponibilidad (catálogo)
   * ============================================================ */
  const estaOcupadoDummy = useCallback(
    (_id: string, _fecha: string | null) => false,
    []
  );

  /* ============================================================
   * Card Adapter (V2)
   * ============================================================ */
  const CardProductoAdapter = ({
    espacio,
    fechaFiltro,
    ocupadoEnFecha,
  }: {
    espacio: EspacioDTO;
    fechaFiltro: string | null;
    ocupadoEnFecha: boolean;
  }) => {
    const precioBase = resolverPrecio(espacio);

    return (
      <ProductoEspacioCard
        espacio={espacio}
        precioBase={precioBase}
        fechaSeleccionada={fechaFiltro}
        ocupadoEnFecha={ocupadoEnFecha}
        onReservar={() =>
          navigate(PATHS.RESERVA_ID.replace(":id", espacio.id))
        }
      />
    );
  };

  /* ============================================================
   * Filtros
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
    estaOcupadoEnFecha: estaOcupadoDummy,
    resolverPrecio,
  });

  /* ============================================================
   * Contenido
   * ============================================================ */
  const contenido = useMemo(() => {
    if (loading) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EspaciosEmptyState
            title="Cargando espacios…"
            message="Estamos consultando los espacios disponibles."
            variant="info"
          />
        </motion.div>
      );
    }

    if (espacios.length === 0) {
      return (
        <EspaciosEmptyState
          title="Aún no hay espacios"
          message="El catálogo estará disponible cuando el administrador los registre."
          variant="empty"
        />
      );
    }

    if (espaciosFiltrados.length === 0) {
      return (
        <EspaciosEmptyState
          title="Sin resultados"
          message="Prueba ajustando los filtros."
          actionLabel="Limpiar filtros"
          onAction={resetFiltrosBasicos}
          variant="warning"
        />
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
          estaOcupadoEnFecha={estaOcupadoDummy}
          CardComponent={CardProductoAdapter}
        />
      </motion.div>
    );
  }, [
    loading,
    espacios,
    espaciosFiltrados,
    resetFiltrosBasicos,
    estaOcupadoDummy,
    CardProductoAdapter,
  ]);

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

export default memo(PublicoEspaciosPage);
