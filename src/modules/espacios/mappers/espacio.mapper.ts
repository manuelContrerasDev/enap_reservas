// src/modules/espacios/mappers/espacio.mapper.ts
import type { EspacioDTO } from "@/modules/espacios/types/espacios";

const resolveImagen = (img: unknown): string | null => {
  if (!img || typeof img !== "string") return null;
  if (/^https?:\/\//i.test(img)) return img;

  try {
    return new URL(`../../assets/${img}`, import.meta.url).href;
  } catch {
    return null;
  }
};

export function mapEspacioFromApi(raw: any): EspacioDTO {
  return {
    id: raw.id,
    nombre: raw.nombre,
    tipo: raw.tipo,

    capacidad: raw.capacidad,

    descripcion: raw.descripcion ?? null,
    imagenUrl: resolveImagen(raw.imagenUrl),

    activo: raw.activo,
    visible: raw.visible,
    orden: raw.orden,

    modalidadCobro: raw.modalidadCobro,

    precioBaseSocio: raw.precioBaseSocio,
    precioBaseExterno: raw.precioBaseExterno,

    precioPersonaAdicionalSocio: raw.precioPersonaAdicionalSocio,
    precioPersonaAdicionalExterno: raw.precioPersonaAdicionalExterno,

    precioPiscinaSocio: raw.precioPiscinaSocio,
    precioPiscinaExterno: raw.precioPiscinaExterno,

    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}
