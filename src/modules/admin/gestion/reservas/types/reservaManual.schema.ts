import { z } from "zod";

export const TipoClienteEnum = z.enum(["SOCIO", "EXTERNO"]);

export const invitadoFormSchema = z.object({
  nombre: z.string().min(2),
  rut: z.string().min(3),
  edad: z.coerce.number().int().min(0).optional(),
  esPiscina: z.boolean().optional(),
});

export const reservaManualFormSchema = z.object({
  tipoCliente: TipoClienteEnum,

  // ⚠️ solo frontend (NO va al backend)
  userId: z.string().uuid().optional(),
  creadaPor: z.string().uuid(),

  espacioId: z.string().uuid(),
  fechaInicio: z.string().min(8),
  fechaFin: z.string().min(8),

  cantidadAdultos: z.coerce.number().int().min(1),
  cantidadNinos: z.coerce.number().int().min(0),
  cantidadPiscina: z.coerce.number().int().min(0),

  usoReserva: z.enum(["USO_PERSONAL", "CARGA_DIRECTA", "TERCEROS"]),
  marcarPagada: z.boolean().optional().default(false),

  socioPresente: z.boolean(),

  socio: z.object({
    nombre: z.string().min(2),
    rut: z.string().min(3),
    telefono: z.string().min(8),
    correoEnap: z.string().email(),
    correoPersonal: z.string().email().nullable().optional(),
  }),

  responsable: z
    .object({
      nombre: z.string().min(2),
      rut: z.string().min(3),
      email: z.string().email(),
      telefono: z.string().min(8),
    })
    .nullable()
    .optional(),

  invitados: z.array(invitadoFormSchema).default([]),
}).superRefine((data, ctx) => {
  if (data.tipoCliente === "SOCIO" && !data.userId) {
    ctx.addIssue({
      path: ["userId"],
      message: "Debe seleccionar un socio registrado",
      code: z.ZodIssueCode.custom,
    });
  }

  if (!data.socioPresente && !data.responsable) {
    ctx.addIssue({
      path: ["responsable"],
      message: "Responsable obligatorio si el socio no está presente",
      code: z.ZodIssueCode.custom,
    });
  }

  if (data.socioPresente && data.responsable) {
    ctx.addIssue({
      path: ["responsable"],
      message: "No debe haber responsable si el socio está presente",
      code: z.ZodIssueCode.custom,
    });
  }
});
