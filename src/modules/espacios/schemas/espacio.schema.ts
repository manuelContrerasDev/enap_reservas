import { z } from "zod";

/* ============================================================
 * FRONTEND — Crear Espacio
 * ============================================================ */
export const CrearEspacioSchema = z.object({
  nombre: z.string().min(3),
  tipo: z.enum(["CABANA", "QUINCHO", "PISCINA"]),

  capacidad: z.number().int().min(1),

  descripcion: z.string().nullable().optional(),
  imagenUrl: z.string().url().nullable().optional(),

  // Estado / visibilidad
  activo: z.boolean().optional(),
  visible: z.boolean().optional(),
  orden: z.number().int().min(0).optional(),

  modalidadCobro: z.enum(["POR_NOCHE", "POR_DIA", "POR_PERSONA"]),

  // Tarifas base
  precioBaseSocio: z.number().int().min(0),
  precioBaseExterno: z.number().int().min(0),

  precioPersonaAdicionalSocio: z.number().int().min(0),
  precioPersonaAdicionalExterno: z.number().int().min(0),

  precioPiscinaSocio: z.number().int().min(0),
  precioPiscinaExterno: z.number().int().min(0),
});

export type CrearEspacioType = z.infer<typeof CrearEspacioSchema>;
export type EditarEspacioType = Partial<CrearEspacioType>;
