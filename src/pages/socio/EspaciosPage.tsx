// src/pages/socio/EspaciosPage.tsx
import React, {
  Suspense,
  useMemo,
  useState,
  useCallback,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Loader2,
  AlertCircle,
  LayoutGrid,
  Search,
  Filter,
  ArrowUpDown,
  CalendarDays,
} from "lucide-react";

import { useEspacios } from "@/context/EspaciosContext";
import { useAuth } from "@/context/AuthContext";
import MiniCalendario from "@/components/espacios/MiniCalendario";
import { fechaLocal } from "@/utils/fechaLocal";

const EspacioCard = React.lazy(() =>
  import("@/components/espacios/EspacioCardSocio")
);

type TipoFiltro = "TODOS" | "CABANA" | "QUINCHO" | "PISCINA";
type OrdenFiltro = "NOMBRE_ASC" | "NOMBRE_DESC" | "PRECIO_ASC" | "PRECIO_DESC";

type BloqueFecha = { fechaInicio: string; fechaFin: string };


const estaOcupadoEnFecha = (
  bloques: BloqueFecha[] | undefined,
  fechaISO: string | null
): boolean => {
  if (!fechaISO || !bloques || !bloques.length) return false;

  // Fecha local real (NO UTC)
  const target = fechaLocal(fechaISO);
  target.setHours(0, 0, 0, 0);

  return bloques.some((b) => {
    const inicio = fechaLocal(b.fechaInicio);
    const fin = fechaLocal(b.fechaFin);

    inicio.setHours(0, 0, 0, 0);
    fin.setHours(23, 59, 59, 999);

    return target >= inicio && target <= fin;
  });
};


const EspaciosPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { espacios, loading, obtenerDisponibilidad } = useEspacios();
  const { role } = useAuth();

  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState<TipoFiltro>("TODOS");
  const [orden, setOrden] = useState<OrdenFiltro>("NOMBRE_ASC");

  const [fechaFiltro, setFechaFiltro] = useState<string | null>(null);
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);
  const [disponibilidadMap, setDisponibilidadMap] = useState<
    Record<string, BloqueFecha[]>
  >({});

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleTipoChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTipo(e.target.value as TipoFiltro);
    },
    []
  );

  const handleOrdenChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setOrden(e.target.value as OrdenFiltro);
    },
    []
  );

  const resetFiltros = useCallback(() => {
    setSearch("");
    setTipo("TODOS");
    setOrden("NOMBRE_ASC");
    setFechaFiltro(null);
    setSoloDisponibles(false);
  }, []);

  const handleFechaSelect = useCallback(
    async (fechaISO: string | null) => {
      setFechaFiltro(fechaISO);

      if (!fechaISO || !espacios.length) return;

      setLoadingDisponibilidad(true);
      try {
        const resultados = await Promise.all(
          espacios.map(async (e) => {
            const bloques = await obtenerDisponibilidad(e.id);
            return { id: e.id, bloques };
          })
        );

        setDisponibilidadMap(
          resultados.reduce((acc, item) => {
            acc[item.id] = item.bloques;
            return acc;
          }, {} as Record<string, BloqueFecha[]>)
        );
      } catch (err) {
        console.error("❌ Error cargando disponibilidad:", err);
      } finally {
        setLoadingDisponibilidad(false);
      }
    },
    [espacios, obtenerDisponibilidad]
  );

  const espaciosFiltrados = useMemo(() => {
    const texto = search.trim().toLowerCase();

    let list = espacios.filter((e) => e.activo);

    if (tipo !== "TODOS") {
      list = list.filter((e) => e.tipo === tipo);
    }

    if (texto) {
      list = list.filter(
        (e) =>
          e.nombre.toLowerCase().includes(texto) ||
          (e.descripcion ?? "").toLowerCase().includes(texto)
      );
    }

    if (fechaFiltro) {
      list = list.filter((e) => {
        const ocupado = estaOcupadoEnFecha(disponibilidadMap[e.id], fechaFiltro);
        return soloDisponibles ? !ocupado : true;
      });
    }

    list = [...list].sort((a, b) => {
      switch (orden) {
        case "NOMBRE_ASC":
          return a.nombre.localeCompare(b.nombre);
        case "NOMBRE_DESC":
          return b.nombre.localeCompare(a.nombre);
        case "PRECIO_ASC":
          return (a.tarifaClp ?? 0) - (b.tarifaClp ?? 0);
        case "PRECIO_DESC":
          return (b.tarifaClp ?? 0) - (a.tarifaClp ?? 0);
        default:
          return 0;
      }
    });

    return list;
  }, [
    espacios,
    search,
    tipo,
    orden,
    fechaFiltro,
    disponibilidadMap,
    soloDisponibles,
  ]);

  const contenido = useMemo(() => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-[#002E3E]">
          <Loader2 className="animate-spin mb-3" size={42} />
          <p className="text-gray-600 text-sm">Cargando espacios…</p>
        </div>
      );
    }

    if (!espaciosFiltrados.length) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600 text-center space-y-4">
          <AlertCircle size={48} className="text-[#DEC01F]" />
          <p className="text-base font-medium">No hay espacios disponibles.</p>

          {fechaFiltro && (
            <p className="text-sm text-gray-500 max-w-md">
              No existen espacios disponibles para la fecha seleccionada.
            </p>
          )}

          <button
            type="button"
            onClick={resetFiltros}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#002E3E] text-white text-sm font-semibold hover:bg-[#01384A]"
          >
            Limpiar filtros
          </button>
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        }
      >
        <motion.section
          initial={!prefersReducedMotion ? { opacity: 0 } : undefined}
          animate={!prefersReducedMotion ? { opacity: 1 } : undefined}
          transition={{ duration: 0.35 }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-gray-600">
            <p>
              Mostrando{" "}
              <span className="font-semibold text-[#002E3E]">
                {espaciosFiltrados.length}
              </span>{" "}
              espacios disponibles.
            </p>

            {fechaFiltro && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5F2F7] text-[#002E3E]">
                <CalendarDays size={14} />
                <strong>{new Date(fechaFiltro).toLocaleDateString("es-CL")}</strong>
              </div>
            )}
          </div>

          {loadingDisponibilidad && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Loader2 size={14} className="animate-spin" />
              Actualizando disponibilidad…
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {espaciosFiltrados.map((e, i) => {
              const ocupado = estaOcupadoEnFecha(
                disponibilidadMap[e.id],
                fechaFiltro
              );

              return (
                <motion.div
                  key={e.id}
                  initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : undefined}
                  animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
                  transition={{ delay: i * 0.04 }}
                >
                  <EspacioCard
                    espacio={e}
                    fechaFiltro={fechaFiltro}
                    ocupadoEnFecha={ocupado}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </Suspense>
    );
  }, [
    loading,
    espaciosFiltrados,
    prefersReducedMotion,
    resetFiltros,
    fechaFiltro,
    disponibilidadMap,
    loadingDisponibilidad,
  ]);

  return (
    <main className="bg-[#F9FAFB] min-h-screen pb-10">
      <Helmet>
        <title>Espacios Disponibles | ENAP Limache</title>
      </Helmet>

      <motion.header
        initial={!prefersReducedMotion ? { opacity: 0, y: -8 } : undefined}
        animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
        className="bg-[#002E3E] text-white py-6 shadow-md"
      >
        <div className="max-w-5xl mx-auto px-5 text-center">
          <span className="inline-block px-2 py-0.5 bg-white/10 rounded text-[11px] uppercase">
            Catálogo ENAP {role === "SOCIO" && "• Socios"}
          </span>

          <h1 className="text-3xl font-extrabold mt-2 flex items-center justify-center gap-2">
            <LayoutGrid size={22} /> Espacios disponibles
          </h1>

          <p className="text-white/70 text-sm mt-1 max-w-xl mx-auto">
            Filtra por tipo, fecha o precio para encontrar tu espacio ideal.
          </p>
        </div>
      </motion.header>

      <section className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col gap-4 md:flex-1">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-500">
                Filtro por fecha
              </span>
              <MiniCalendario
                fechaSeleccionada={fechaFiltro}
                onChange={handleFechaSelect}
              />

              {fechaFiltro && (
                <label className="mt-1 inline-flex items-center gap-2 text-[12px] text-gray-700">
                  <input
                    type="checkbox"
                    checked={soloDisponibles}
                    onChange={(e) => setSoloDisponibles(e.target.checked)}
                    className="h-4 w-4 border-gray-300 text-[#002E3E]"
                  />
                  Mostrar solo espacios disponibles esa fecha
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap md:flex-nowrap">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-500">
                Tipo
              </span>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={tipo}
                  onChange={handleTipoChange}
                  className="bg-transparent text-sm outline-none"
                >
                  <option value="TODOS">Todos</option>
                  <option value="CABANA">Cabañas</option>
                  <option value="QUINCHO">Quinchos</option>
                  <option value="PISCINA">Piscinas</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-gray-500">
                Ordenar
              </span>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
                <ArrowUpDown size={16} className="text-gray-500" />
                <select
                  value={orden}
                  onChange={handleOrdenChange}
                  className="bg-transparent text-sm outline-none"
                >
                  <option value="NOMBRE_ASC">Nombre (A-Z)</option>
                  <option value="NOMBRE_DESC">Nombre (Z-A)</option>
                  <option value="PRECIO_ASC">Precio (menor a mayor)</option>
                  <option value="PRECIO_DESC">Precio (mayor a menor)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-6">{contenido}</section>
    </main>
  );
};

export default React.memo(EspaciosPage);
