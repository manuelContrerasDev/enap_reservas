import { z } from "zod";

/* ============================================================
 * ENUMS — igual que en el backend
 * ============================================================ */
export const usoReservaEnum = z.enum([
  "USO_PERSONAL",
  "CARGA_DIRECTA",
  "TERCEROS",
]);

/* ============================================================
 * Helpers
 * ============================================================ */
const emailSchema = z
  .string()
  .min(5, "Correo requerido")
  .email("Formato de correo inválido")
  .transform((v) => v.trim().toLowerCase());

const text = (min = 1, msg = "Campo requerido") =>
  z.string().trim().min(min, msg);

const rutSchema = z.string().trim().min(3, "RUT requerido");

const telSchema = z.string().trim().min(8, "Teléfono requerido");

/* ============================================================
 * SCHEMA PRINCIPAL — EXACTO A useReservaForm()
 * ============================================================ */
export const reservaFrontendSchema = z.object({
  /* Identificación */
  espacioId: z.string().min(1, "ID de espacio requerido"),

  /* Fechas */
  fechaInicio: z.string().min(10, "Fecha de inicio requerida"),
  fechaFin: z.string().min(10, "Fecha de fin requerida"),

  /* Cantidad de personas */
  cantidadPersonas: z.number().int().min(1, "Debe haber al menos una persona"),

  /* Piscina (aunque no siempre se usa) */
  cantidadPersonasPiscina: z.number().int().min(0),

  /* Datos socio */
  nombreSocio: text(2, "Nombre requerido"),
  rutSocio: rutSchema,
  telefonoSocio: telSchema,
  correoEnap: emailSchema,

  /* Opcional */
  correoPersonal: emailSchema.optional().or(z.literal("")),

  /* Uso de la reserva */
  usoReserva: usoReservaEnum,
  socioPresente: z.boolean(),

  /* Responsable (solo para carga directa / terceros) */
  nombreResponsable: text().optional(),
  rutResponsable: z.string().optional(),
  emailResponsable: emailSchema.optional(),

  /* Invitados */
  invitados: z
    .array(
      z.object({
        nombre: text(),
        rut: text(),
        edad: z.number().int().min(0).optional(),
      })
    )
    .optional(),

  /* Términos */
  terminosAceptados: z
    .boolean()
    .refine((v) => v === true, "Debes aceptar los términos"),

  terminosVersion: z.string().optional(),
});

export type ReservaFrontendType = z.infer<typeof reservaFrontendSchema>;
