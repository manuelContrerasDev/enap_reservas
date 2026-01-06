import { z } from "zod";

/* ===================== SOCIO ===================== */
const socioSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  rut: z.string().min(1, "RUT requerido"),
  telefono: z.string().min(1, "Teléfono requerido"),
  correoEnap: z.string().email("Correo ENAP inválido"),
  correoPersonal: z
    .string()
    .email("Correo personal inválido")
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v)),
});

/* ================= RESPONSABLE =================== */
const responsableSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  rut: z.string().min(1, "RUT requerido"),
  email: z.string().email("Email inválido").optional(),
  telefono: z.string().optional(),
});

/* ================= RESERVA FORM ================== */
export const reservaManualFormSchema = z
  .object({
    userId: z.string().uuid("ID usuario inválido"),
    creadaPor: z.string().uuid("ID admin inválido"),
    espacioId: z.string().uuid("ID espacio inválido"),

    fechaInicio: z.string().min(1, "Fecha inicio requerida"),
    fechaFin: z.string().min(1, "Fecha fin requerida"),

    cantidadAdultos: z.coerce.number().int().min(1, "Mínimo 1 adulto"),
    cantidadNinos: z.coerce.number().int().min(0),
    cantidadPiscina: z.coerce.number().int().min(0),

    usoReserva: z.enum(["USO_PERSONAL", "CARGA_DIRECTA", "TERCEROS"]),
    marcarPagada: z.boolean().optional(),

    // ✅ regla real
    socioPresente: z.boolean(),

    socio: socioSchema,
    responsable: responsableSchema.nullable().optional(),
  })
  .superRefine((data, ctx) => {
    // ✅ Responsable SOLO si el titular NO asiste
    if (data.socioPresente === false) {
      if (!data.responsable) {
        ctx.addIssue({
          path: ["responsable"],
          code: z.ZodIssueCode.custom,
          message: "Responsable requerido si el titular no asistirá",
        });
      }
      // mínimo razonable
      if (data.responsable && (!data.responsable.nombre || !data.responsable.rut)) {
        ctx.addIssue({
          path: ["responsable"],
          code: z.ZodIssueCode.custom,
          message: "Responsable debe tener nombre y RUT",
        });
      }
    } else {
      // si asiste, responsable debe ser null
      if (data.responsable) {
        ctx.addIssue({
          path: ["responsable"],
          code: z.ZodIssueCode.custom,
          message: "No debe haber responsable si el titular asistirá",
        });
      }
    }
  });

export type ReservaManualFormValues = z.input<typeof reservaManualFormSchema>;
export type ReservaManualFormParsed = z.output<typeof reservaManualFormSchema>;
