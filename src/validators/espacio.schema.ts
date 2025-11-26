import { z } from "zod";

export const CrearEspacioSchema = z.object({
  nombre: z.string(),
  tipo: z.string(),
  capacidad: z.number(),
  capacidadExtra: z.number().nullable().optional(),
  tarifaClp: z.number(),
  tarifaExterno: z.number().nullable().optional(),
  extraSocioPorPersona: z.number().nullable().optional(),
  extraTerceroPorPersona: z.number().nullable().optional(),
  descripcion: z.string().nullable().optional(),
  imagenUrl: z.string().nullable().optional(),
  modalidadCobro: z.string(),
  activo: z.boolean(),
});

export type CrearEspacioType = z.infer<typeof CrearEspacioSchema>;
export type EditarEspacioType = Partial<CrearEspacioType>;
