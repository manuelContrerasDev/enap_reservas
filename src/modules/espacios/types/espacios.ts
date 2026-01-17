// src/types/espacios.ts

/* ============================================================
 * ENUMS DE DOMINIO — ESPACIOS
 * ============================================================ */

export type TipoEspacio = "CABANA" | "QUINCHO" | "PISCINA";

export type ModalidadCobro =
  | "POR_NOCHE"
  | "POR_DIA"
  | "POR_PERSONA";

/* ============================================================
 * DTO — ESPACIO (BACKEND → FRONTEND)
 * Usado en:
 * - Catálogo público
 * - Reserva
 * - Cards socio / externo
 * ============================================================ */
export interface EspacioDTO {
  id: string;
  nombre: string;
  tipo: TipoEspacio;

  descripcion: string | null;
  imagenUrl: string | null;

  capacidad: number;

  activo: boolean;
  visible: boolean;
  orden: number;

  modalidadCobro: ModalidadCobro;

  /** Precios base por espacio */
  precioBaseSocio: number;
  precioBaseExterno: number;

  /** Invitados por persona (cabaña / quincho) */
  precioPersonaAdicionalSocio: number;
  precioPersonaAdicionalExterno: number;

  /** Invitados piscina */
  precioPiscinaSocio: number;
  precioPiscinaExterno: number;

  createdAt: string;
  updatedAt: string;
}

/* ============================================================
 * DTO — ACTUALIZAR ESPACIO (ADMIN)
 * ✔ Permite cambios reales
 * ✖ No permite romper reglas estructurales
 * ============================================================ */
export interface ActualizarEspacioDTO {
  nombre?: string;
  descripcion?: string | null;
  imagenUrl?: string | null;

  activo?: boolean;
  visible?: boolean;
  orden?: number;

  modalidadCobro?: ModalidadCobro;

  precioBaseSocio?: number;
  precioBaseExterno?: number;

  precioPersonaAdicionalSocio?: number;
  precioPersonaAdicionalExterno?: number;

  precioPiscinaSocio?: number;
  precioPiscinaExterno?: number;
}

/* ============================================================
 * FILTROS UI
 * Usado en:
 * - Catálogo público
 * - Admin espacios
 * - useEspaciosFiltros
 * ============================================================ */
export type TipoFiltro = "TODOS" | TipoEspacio;
