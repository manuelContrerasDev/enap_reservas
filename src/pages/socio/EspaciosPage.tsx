// src/pages/socio/EspaciosPage.tsx
import React, {
  Suspense,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Loader2,
  AlertCircle,
  LayoutGrid,
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
type OrdenFiltro =
  | "NOMBRE_ASC"
  | "NOMBRE_DESC"
  | "PRECIO_ASC"
  | "PRECIO_DESC";

type BloqueFecha = { fechaInicio: string; fechaFin: string };

// 🔵 Verificar ocupación de un espacio en una fecha dada
const estaOcupadoEnFecha = (
  bloques: BloqueFecha[] | undefined,
  fechaISO: string | null
) => {
  if (!fechaISO || !bloques) return false;

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

  // 🔎 Filtros
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState<TipoFiltro>("TODOS");
  const [orden, setOrden] = useState<OrdenFiltro>("NOMBRE_ASC");
  const [fechaFiltro, setFechaFiltro] = useState<string | null>(null);
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  // 📅 Disponibilidad
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);
  const [disponibilidadMap, setDisponibilidadMap] = useState<
    Record<string, BloqueFecha[]>
  >({});

  /* ==============================
   * Handlers básicos
   * ============================== */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setTipo(e.target.value as TipoFiltro);

  const handleOrdenChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setOrden(e.target.value as OrdenFiltro);

  const resetFiltros = () => {
    setSearch("");
    setTipo("TODOS");
    setOrden("NOMBRE_ASC");
    setFechaFiltro(null);
    setSoloDisponibles(false);
    setDisponibilidadMap({});
  };

  /* ==============================
   * Manejo de fecha & disponibilidad
   * ============================== */
  const cargarDisponibilidad = useCallback(
    async (fechaISO: string | null) => {
      if (!fechaISO || espacios.length === 0) return;

      setLoadingDisponibilidad(true);
      try {
        const resultados = await Promise.all(
          espacios.map(async (e) => {
            const bloques = await obtenerDisponibilidad(e.id);
            return { id: e.id, bloques };
          })
        );

        const map = resultados.reduce<Record<string, BloqueFecha[]>>(
          (acc, item) => {
            acc[item.id] = item.bloques;
            return acc;
          },
          {}
        );

        setDisponibilidadMap(map);
      } catch (err: unknown) {
        console.error("❌ Error al obtener disponibilidad:", err);
      } finally {
        setLoadingDisponibilidad(false);
      }
    },
    [espacios, obtenerDisponibilidad]
  );

  const handleFechaSelect = useCallback(
    async (fechaISO: string | null) => {
      setFechaFiltro(fechaISO);
      setSoloDisponibles(false); // al cambiar fecha, reseteamos “solo disponibles”
      setDisponibilidadMap({});
      if (!fechaISO) return;
      await cargarDisponibilidad(fechaISO);
    },
    [cargarDisponibilidad]
  );

  // ↪ Si se cargan espacios después de seleccionar fecha, sincronizamos disponibilidad
  useEffect(() => {
    if (fechaFiltro && espacios.length > 0 && !loading && !loadingDisponibilidad) {
      if (Object.keys(disponibilidadMap).length === 0) {
        void cargarDisponibilidad(fechaFiltro);
      }
    }
  }, [
    fechaFiltro,
    espacios,
    loading,
    loadingDisponibilidad,
    disponibilidadMap,
    cargarDisponibilidad,
  ]);

  /* ==============================
   * Filtrado optimizado
   * ============================== */
  const espaciosFiltrados = useMemo(() => {
    let list = [...espacios];
    const texto = search.trim().toLowerCase();

    // Tipo
    if (tipo !== "TODOS") {
      list = list.filter((e) => e.tipo === tipo);
    }

    // Texto (nombre / descripción)
    if (texto) {
      list = list.filter(
        (e) =>
          e.nombre.toLowerCase().includes(texto) ||
          (e.descripcion ?? "").toLowerCase().includes(texto)
      );
    }

    // Fecha + disponibilidad
    if (fechaFiltro) {
      list = list.filter((e) => {
        const ocupado = estaOcupadoEnFecha(
          disponibilidadMap[e.id],
          fechaFiltro
        );
        return soloDisponibles ? !ocupado : true;
      });
    }

    // Orden
    return list.sort((a, b) => {
      switch (orden) {
        case "NOMBRE_ASC":
          return a.nombre.localeCompare(b.nombre);
        case "NOMBRE_DESC":
          return b.nombre.localeCompare(a.nombre);
        case "PRECIO_ASC":
          return a.tarifaClp - b.tarifaClp;
        case "PRECIO_DESC":
          return b.tarifaClp - a.tarifaClp;
        default:
          return 0;
      }
    });
  }, [
    espacios,
    search,
    tipo,
    orden,
    fechaFiltro,
    disponibilidadMap,
    soloDisponibles,
  ]);

  /* ==============================
   * Render contenido principal
   * ============================== */
  const contenido = useMemo(() => {
    // ⏳ Cargando espacios base
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-[#005D73]">
          <Loader2 className="animate-spin mb-3" size={42} aria-hidden="true" />
          <p className="text-gray-600 text-sm">Cargando espacios…</p>
        </div>
      );
    }

    // Sin espacios en BD
    if (!loading && espacios.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
          <AlertCircle size={48} className="text-[#DCAB12]" aria-hidden="true" />
          <p className="text-base text-gray-800 font-semibold">
            Aún no hay espacios Disponibles.
          </p>
          <p className="text-sm text-gray-500 max-w-md">
            Cuando el administrador registre los espacios del sindicato, podrás
            verlos aquí para realizar tus reservas.
          </p>
        </div>
      );
    }

    // No se encontraron resultados según filtros
    if (!espaciosFiltrados.length) {
      return (
        <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
          <AlertCircle size={48} className="text-[#DCAB12]" aria-hidden="true" />
          <p className="text-base text-gray-800 font-semibold">
            No se encontraron espacios con los filtros actuales.
          </p>

          {fechaFiltro && (
            <p className="text-sm text-gray-500 max-w-md">
              No hay espacios disponibles para la fecha seleccionada. Puedes
              probar cambiando la fecha o limpiando los filtros.
            </p>
          )}

          <button
            type="button"
            onClick={resetFiltros}
            className="
              mt-3 px-5 py-2 rounded-xl text-sm font-semibold
              bg-[#01546B] text-white shadow hover:bg-[#016A85]
              transition
            "
          >
            Limpiar filtros
          </button>
        </div>
      );
    }

    // Lista normal
    return (
      <Suspense
        fallback={
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {espaciosFiltrados.map((e, i) => {
            const ocupado = estaOcupadoEnFecha(
              disponibilidadMap[e.id],
              fechaFiltro
            );

            return (
              <motion.div
                key={e.id}
                initial={
                  !prefersReducedMotion ? { opacity: 0, y: 16 } : undefined
                }
                animate={
                  !prefersReducedMotion ? { opacity: 1, y: 0 } : undefined
                }
                transition={{ duration: 0.25, delay: i * 0.03 }}
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
      </Suspense>
    );
  }, [
    loading,
    espacios,
    espaciosFiltrados,
    fechaFiltro,
    disponibilidadMap,
    prefersReducedMotion,
  ]);

  /* ==============================
   * Render principal
   * ============================== */
  return (
    <main className="min-h-screen pb-10 bg-[#F9FAFB]">
      <Helmet>
        <title>Espacios disponibles | Sindicato ENAP</title>
      </Helmet>

      {/* HERO HEADER */}
      <motion.header
        initial={!prefersReducedMotion ? { opacity: 0, y: -8 } : undefined}
        animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
        className="
          bg-gradient-to-r from-[#002E3E] via-[#005D73] to-[#0088CC]
          text-white py-6 px-4 shadow-lg rounded-b-3xl
        "
      >
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-white/80 rounded-full text-[11px] uppercase tracking-wide">
            <LayoutGrid size={14} aria-hidden="true" />
            Catálogo de espacios •{" "}
            {role === "SOCIO" ? "Perfil socio" : "Navegación"}
          </span>

          <h1 className="text-3xl font-extrabold mt-2 flex items-center justify-center gap-2">
            <CalendarDays size={22} aria-hidden="true" /> Espacios disponibles
          </h1>

          <p className="text-white/75 text-sm mt-1 max-w-xl mx-auto">
            Explora cabañas, quinchos y piscinas. Filtra por tipo, fecha o
            precio para encontrar el espacio ideal para tu familia.
          </p>
        </div>
      </motion.header>

      {/* FILTROS */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div
          className="
            bg-white rounded-2xl shadow-md border border-gray-200
            p-5 flex flex-col gap-6 md:flex-row md:items-stretch
          "
        >
          {/* Calendario + controles de disponibilidad */}
          <div className="flex flex-col gap-3 md:w-1/3">
            <span className="text-[11px] font-semibold text-gray-500">
              Fecha tentativa de reserva
            </span>

            <MiniCalendario
              fechaSeleccionada={fechaFiltro}
              onChange={handleFechaSelect}
            />

            <div className="min-h-[22px]">
              {loadingDisponibilidad && fechaFiltro && (
                <p className="flex items-center gap-2 text-[11px] text-[#005D73] mt-1">
                  <Loader2
                    size={14}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  Consultando disponibilidad para esa fecha…
                </p>
              )}
            </div>

            {fechaFiltro && (
              <>
                <p className="text-[11px] text-gray-500 mt-1">
                  Fecha seleccionada:{" "}
                  <span className="font-semibold">
                    {fechaLocal(fechaFiltro).toLocaleDateString("es-CL", {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </p>

                <label className="mt-1 inline-flex items-center gap-2 text-[12px] text-gray-700">
                  <input
                    type="checkbox"
                    checked={soloDisponibles}
                    onChange={(e) => setSoloDisponibles(e.target.checked)}
                    disabled={loadingDisponibilidad}
                    className="h-4 w-4 border-gray-300 text-[#003B4D] disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  Mostrar solo espacios disponibles para esa fecha
                </label>
              </>
            )}
          </div>

          {/* Buscador, tipo & orden */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
            {/* Buscador texto */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-[11px] font-semibold text-gray-500">
                Buscar
              </span>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <span className="text-xs text-gray-500">Nombre / descripción</span>
                <input
                  type="text"
                  placeholder="Ej: Cabaña familiar, Quincho piscina…"
                  value={search}
                  onChange={handleSearchChange}
                  className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Tipo */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-gray-500">
                Tipo
              </span>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <Filter size={16} className="text-gray-500" aria-hidden="true" />
                <select
                  value={tipo}
                  onChange={handleTipoChange}
                  className="bg-transparent text-sm outline-none flex-1"
                >
                  <option value="TODOS">Todos</option>
                  <option value="CABANA">Cabañas</option>
                  <option value="QUINCHO">Quinchos</option>
                  <option value="PISCINA">Piscinas</option>
                </select>
              </div>
            </div>

            {/* Orden */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-gray-500">
                Ordenar
              </span>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <ArrowUpDown
                  size={16}
                  className="text-gray-500"
                  aria-hidden="true"
                />
                <select
                  value={orden}
                  onChange={handleOrdenChange}
                  className="bg-transparent text-sm outline-none flex-1"
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

      {/* LISTA PRINCIPAL */}
      <section className="max-w-7xl mx-auto px-6 py-6" aria-live="polite">
        {contenido}
      </section>
    </main>
  );
};

export default React.memo(EspaciosPage);
