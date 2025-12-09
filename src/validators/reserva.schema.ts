// ============================================================
// VALIDATOR — RESERVA FRONTEND (VERSIÓN FINAL SIN ERRORES)
// ============================================================

import { z } from "zod";

/* ENUMS */
export const usoReservaEnum = z.enum([
  "USO_PERSONAL",
  "CARGA_DIRECTA",
  "TERCEROS",
]);

/* HELPERS */
const emailSchema = z
  .string()
  .min(5, "Correo requerido")
  .email("Formato inválido")
  .transform((v) => v.trim().toLowerCase());

const text = (min = 1, msg = "Campo requerido") =>
  z.string().trim().min(min, msg);

const rutSchema = z.string().trim().min(3, "RUT requerido");
const telSchema = z.string().trim().min(8, "Teléfono requerido");

/* SCHEMA */
export const reservaFrontendSchema = z
  .object({
    // Identificación
    espacioId: z.string().min(1, "ID requerido"),

    // Fechas
    fechaInicio: z.string().min(10, "Fecha inicio requerida"),
    fechaFin: z.string().min(10, "Fecha fin requerida"),

    // Personas
    cantidadPersonas: z.number().int().min(1),
    cantidadPersonasPiscina: z.number().int().min(0),  // <-- FIX

    // Socio
    nombreSocio: text(2),
    rutSocio: rutSchema,
    telefonoSocio: telSchema,
    correoEnap: emailSchema,

    correoPersonal: emailSchema.nullable().default(null),

    // Uso
    usoReserva: usoReservaEnum,
    socioPresente: z.boolean(),

    // Responsable — FIX: nunca undefined
    nombreResponsable: z.string().nullable().default(null),
    rutResponsable: z.string().nullable().default(null),
    emailResponsable: emailSchema.nullable().default(null),

    // Invitados — FIX: array siempre definido
    invitados: z
      .array(
        z.object({
          nombre: text(),
          rut: z.string().min(3),
          edad: z.number().int().optional(),
        })
      )
      .default([]),

    // Términos
    terminosAceptados: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar los términos"),

    terminosVersion: z.string().nullable().default(null),
  })

  // Validación de fechas
  .refine(
    (data) => new Date(data.fechaFin) > new Date(data.fechaInicio),
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["fechaFin"],
    }
  )

  // Normalización final
  .superRefine((data, ctx) => {
    if (data.socioPresente) {
      data.nombreResponsable = null;
      data.rutResponsable = null;
      data.emailResponsable = null;
    } else {
      data.nombreResponsable = data.nombreResponsable?.trim() || null;
      data.rutResponsable = data.rutResponsable?.trim() || null;
      data.emailResponsable = data.emailResponsable?.trim() || null;

      if (
        !data.nombreResponsable ||
        !data.rutResponsable ||
        !data.emailResponsable
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes completar los datos del responsable",
          path: ["nombreResponsable"],
        });
      }
    }
  });

export type ReservaFrontendType = z.infer<typeof reservaFrontendSchema>;
