import { z } from "zod";
import { UsoReserva } from "@/types/enums";

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
 * SCHEMA PRINCIPAL — FRONT → BACK (OFICIAL ENAP)
 * ============================================================
 * ✅ Input: react-hook-form + zodResolver
 * ✅ Output: parse() normaliza y asegura consistencia
 * ⚠️ Reglas de negocio complejas (bloques ocupados, cupos, etc.)
 *    se validan además en useReservaValidator + backend.
 * ============================================================ */
export const reservaFrontendSchema = z
  .object({
    /* ---------------- Identificación ---------------- */
    espacioId: z.string().min(1, "ID requerido"),

    /* ---------------- Fechas (YYYY-MM-DD) ---------------- */
    fechaInicio: z.string().min(10, "Fecha inicio requerida"),
    fechaFin: z.string().min(10, "Fecha fin requerida"),

    /* ---------------- Cantidades ---------------- */
    cantidadPersonas: z.number().int().min(1),
    cantidadPersonasPiscina: z.number().int().min(0).default(0),

    /* ---------------- Socio ---------------- */
    nombreSocio: text(2),
    rutSocio: rutSchema,
    telefonoSocio: telSchema,
    correoEnap: emailSchema,
    correoPersonal: emailSchema.nullable().default(null),

    /* ---------------- Uso ---------------- */
    usoReserva: z.nativeEnum(UsoReserva),
    socioPresente: z.boolean(),

    /* ---------------- Responsable ---------------- */
    nombreResponsable: z.string().nullable().default(null),
    rutResponsable: z.string().nullable().default(null),
    emailResponsable: emailSchema.nullable().default(null),

    /* ---------------- Invitados ---------------- */
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

    /* ---------------- Términos ---------------- */
    terminosAceptados: z
      .boolean()
      .refine((v) => v === true, "Debes aceptar los términos"),

    terminosVersion: z.string().nullable().default(null),
  })

  /* ============================================================
   * VALIDACIONES (P0: DST Safe)
   * ============================================================
   * ⚠️ Evitamos `new Date("YYYY-MM-DD")` por bugs de timezone/DST.
   * Como las fechas vienen en formato ISO local (YYYY-MM-DD),
   * la comparación lexicográfica funciona perfectamente.
   */
  .refine((data) => data.fechaFin > data.fechaInicio, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["fechaFin"],
  })

  /* ============================================================
   * VALIDACIONES ESTRUCTURALES
   * ============================================================ */
  .superRefine((data, ctx) => {
    /* ---------- Responsable ---------- */
    if (data.socioPresente) {
      // Si el socio está presente, se limpian campos responsables.
      data.nombreResponsable = null;
      data.rutResponsable = null;
      data.emailResponsable = null;
    } else {
      // Si socio NO está presente, responsable es obligatorio.
      if (!data.nombreResponsable || !data.rutResponsable || !data.emailResponsable) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes completar los datos del responsable",
          path: ["nombreResponsable"],
        });
      }
    }

    /* ---------- Piscina ---------- */
    const piscinaMarcados = data.invitados.filter((i) => i.esPiscina).length;

    if (piscinaMarcados > data.cantidadPersonasPiscina) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Marcaste ${piscinaMarcados} personas para piscina, pero declaraste ${data.cantidadPersonasPiscina}.`,
        path: ["invitados"],
      });
    }
  });

/* ============================================================
 * TIPOS CORRECTOS (CLAVE)
 * ============================================================ */

/**
 * ✅ INPUT → para react-hook-form + zodResolver
 */
export type ReservaFrontendType = z.input<typeof reservaFrontendSchema>;

/**
 * ✅ OUTPUT → datos normalizados (parseados)
 */
export type ReservaFrontendParsed = z.output<typeof reservaFrontendSchema>;
