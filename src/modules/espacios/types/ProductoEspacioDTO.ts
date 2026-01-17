// ============================================================
// ProductoEspacioDTO.ts — Contrato backend
// ============================================================

export interface ProductoEspacioDTO {
  id: string;
  nombre: string;
  tipo: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  capacidad: number;
  modalidadCobro: string;

  // precios referenciales
  precioBaseSocio: number;
  precioBaseExterno: number;

  // flags de disponibilidad
  totalUnidades?: number;
  unidadesDisponibles?: number;
  reservable?: boolean;
}
