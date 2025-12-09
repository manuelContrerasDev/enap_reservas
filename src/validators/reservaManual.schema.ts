import { z } from "zod";

export const datosContactoSchema = z.object({
  nombre: z.string().min(1, "Nombre del socio es requerido"),
  rut: z.string().min(1, "RUT del socio es requerido"),
  telefono: z.string().min(1, "Teléfono es requerido"),

  correoEnap: z.string().email("Correo ENAP inválido"),

  correoPersonal: z
    .string()
    .email("Correo personal inválido")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  nombreResponsable: z.string().optional(),
  rutResponsable: z.string().optional(),

  emailResponsable: z.string().email().optional(),


  telefonoResponsable: z.string().optional(),
});

export const reservaManualSchema = z.object({
  userId: z.string().min(1, "ID de usuario requerido"),
  espacioId: z.string().min(1, "Debe seleccionar un espacio"),

  fechaInicio: z.string().min(1, "Fecha de inicio requerida"),
  fechaFin: z.string().min(1, "Fecha de término requerida"),

  cantidadAdultos: z.coerce.number().int().min(1, "Al menos 1 adulto"),
  cantidadNinos: z.coerce.number().int().min(0),
  cantidadPiscina: z.coerce.number().int().min(0),

  marcarPagada: z.boolean().optional(),

  datosContacto: datosContactoSchema,
});

export type ReservaManualPayload = z.infer<typeof reservaManualSchema>;
