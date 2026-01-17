import { z } from "zod";
import { UsoReserva } from "@/shared/types/enums";

/* ===================== HELPERS ===================== */

const emailSchema = z
  .string()
  .min(5, "Correo requerido")
  .email("Formato inválido")
  .transform((v) => v.trim().toLowerCase());

const text = (min = 1, msg = "Campo requerido") =>
  z.string().trim().min(min, msg);

const rutSchema = z.string().trim().min(3, "RUT requerido");
const telSchema = z.string().trim().min(8, "Teléfono requerido");

/* ===================== SCHEMA ===================== */

export const reservaFrontendSchema = z
  .object({
    espacioId: z.string().min(1, "ID requerido"),

    fechaInicio: z.string().min(10),
    fechaFin: z.string().min(10),

    cantidadPersonas: z.number().int().min(1),

    /** ⬅️ se recalcula, no se confía en input */
    cantidadPersonasPiscina: z.number().int().min(0).default(0),

    nombreSocio: text(2),
    rutSocio: rutSchema,
    telefonoSocio: telSchema,
    correoEnap: emailSchema,
    correoPersonal: emailSchema.nullable().default(null),

    usoReserva: z.nativeEnum(UsoReserva),
    socioPresente: z.boolean(),

    nombreResponsable: z.string().nullable().default(null),
    rutResponsable: z.string().nullable().default(null),
    emailResponsable: emailSchema.nullable().default(null),

    invitados: z
      .array(
        z.object({
          nombre: text(),
          rut: z.string().min(3),
          edad: z.number().int().optional(),
          esPiscina: z.boolean().default(false),
        })
      )
      .default([]),

    terminosAceptados: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar los términos"),

    terminosVersion: z.string().nullable().default(null),
  })

  /* ===== Fechas (DST safe) ===== */
  .refine((d) => d.fechaFin > d.fechaInicio, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["fechaFin"],
  })

  /* ===== Reglas estructurales ===== */
  .superRefine((data, ctx) => {
    /* RESPONSABLE */
    if (data.socioPresente) {
      data.nombreResponsable = null;
      data.rutResponsable = null;
      data.emailResponsable = null;
    } else if (
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

    /* PISCINA (FUENTE ÚNICA: invitados) */
    const piscinaMarcados = data.invitados.filter(
      (i) => i.esPiscina
    ).length;

    data.cantidadPersonasPiscina = piscinaMarcados;
  });

/* ===================== TIPOS ===================== */

export type ReservaFrontendType = z.input<
  typeof reservaFrontendSchema
>;

export type ReservaFrontendParsed = z.output<
  typeof reservaFrontendSchema
>;
