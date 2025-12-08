// ============================================================
// VALIDATOR — RESERVA FRONTEND (VERSIÓN SIN ERRORES)
// ============================================================

import { z } from "zod";

/* ============================================================
 * ENUMS
 * ============================================================ */
export const usoReservaEnum = z.enum([
  "USO_PERSONAL",
  "CARGA_DIRECTA",
  "TERCEROS",
]);

/* ============================================================
 * HELPERS
 * ============================================================ */
const emailSchema = z
  .string()
  .min(5, "Correo requerido")
  .email("Formato inválido")
  .transform((v) => v.trim().toLowerCase());

const text = (min = 1, msg = "Campo requerido") =>
  z.string().trim().min(min, msg);

const rutSchema = z.string().trim().min(3, "RUT requerido");
const telSchema = z.string().trim().min(8, "Teléfono requerido");

/* ============================================================
 * SCHEMA PRINCIPAL
 * ============================================================ */
export const reservaFrontendSchema = z
  .object({
    /* Identificación */
    espacioId: z.string().min(1, "ID requerido"),

    /* Fechas */
    fechaInicio: z.string().min(10, "Fecha inicio requerida"),
    fechaFin: z.string().min(10, "Fecha fin requerida"),

    /* Personas */
    cantidadPersonas: z.number().int().min(1),
    cantidadPersonasPiscina: z
      .number()
      .int()
,



    /* Datos socio */
    nombreSocio: text(2),
    rutSocio: rutSchema,
    telefonoSocio: telSchema,
    correoEnap: emailSchema,

    /* Email personal opcional */
    correoPersonal: emailSchema.optional().nullable(),

    /* Uso reserva */
    usoReserva: usoReservaEnum,
    socioPresente: z.boolean(),

    /* Responsable */
    nombreResponsable: z.string().optional().nullable(),
    rutResponsable: z.string().optional().nullable(),
    emailResponsable: emailSchema.optional().nullable(),

    /* Invitados */
    invitados: z
      .array(
        z.object({
          nombre: text(),
          rut: z.string().min(3),
          edad: z.number().int().optional(),
        })
      )
      .optional(),

    /* Términos */
    terminosAceptados: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar los términos"),

    terminosVersion: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      const f1 = new Date(data.fechaInicio);
      const f2 = new Date(data.fechaFin);
      return f2 > f1;
    },
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["fechaFin"],
    }
  )
  .refine(
    (data) => {
      if (!data.socioPresente) {
        return (
          data.nombreResponsable &&
          data.rutResponsable &&
          data.emailResponsable
        );
      }
      return true;
    },
    {
      message: "Debes completar los datos del responsable",
      path: ["nombreResponsable"],
    }
  );

export type ReservaFrontendType = z.infer<typeof reservaFrontendSchema>;
