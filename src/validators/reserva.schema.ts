// src/validators/reserva.schema.ts
import { z } from "zod";

/* ============================================================
 * HELPERS
 * ============================================================ */
const emailSchema = z
  .string()
  .min(5, "Correo requerido")
  .email("Formato de correo inválido")
  .transform((v) => v.trim().toLowerCase());

const text = (min = 1, msg = "Campo requerido") =>
  z.string().trim().min(min, msg);

const rutSchema = z
  .string()
  .trim()
  .min(3, "RUT requerido");

const telSchema = z
  .string()
  .trim()
  .min(8, "Teléfono requerido");

/* ============================================================
 * SCHEMA COMPLETO DE LA RESERVA (FRONT → BACK)
 * ============================================================ */
export const reservaFrontendSchema = z.object({
  espacioId: z.string().min(1, "ID de espacio requerido"),

  fechaInicio: z.string().min(10, "Fecha inicio requerida"),
  fechaFin: z.string().min(10, "Fecha fin requerida"),

  cantidadPersonas: z.number().min(1, "Debe haber al menos 1 persona"),

  /* SOCIO */
  nombreSocio: text(2, "Nombre requerido"),
  correoEnap: emailSchema,
  correoPersonal: emailSchema,

  rutSocio: rutSchema,
  telefonoSocio: telSchema,

  /* USO DE RESERVA */
  usoReserva: z.enum(["USO_PERSONAL", "TERCEROS", "CARGA_DIRECTA"]),
  socioPresente: z.boolean(),

  /* RESPONSABLE */
  nombreResponsable: text().optional(),
  rutResponsable: z.string().optional(),
  emailResponsable: emailSchema.optional(),

  /* INVITADOS OPCIONALES */
  invitados: z
    .array(
      z.object({
        nombre: text(),
        rut: text(),
      })
    )
    .optional(),

  /* TÉRMINOS */
  terminosAceptados: z
    .boolean()
    .refine((v) => v === true, "Debes aceptar los términos para continuar"),
});

export type ReservaFrontendType = z.infer<typeof reservaFrontendSchema>;
