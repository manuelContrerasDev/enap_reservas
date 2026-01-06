import { z } from "zod";

/* ============================================================
 * HELPERS
 * ============================================================*/
const emailSchema = z
  .string()
  .min(5, "Correo requerido")
  .email("Formato de correo inválido")
  .transform((v) => v.trim().toLowerCase());

const optionalString = z
  .string()
  .trim()
  .min(1, "Valor inválido");

const optionalStringMax = (max: number) =>
  optionalString.max(max).optional();

/* ============================================================
 * ENUM ROLES
 * ============================================================*/
export const UserRoleEnum = z.enum(["ADMIN", "SOCIO", "EXTERNO"]);

/* ============================================================
 * REGISTRO
 * ============================================================*/
export const registerSchema = z.object({
  name: optionalStringMax(80),
  email: emailSchema,
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña es demasiado larga"),
});
export type RegisterSchemaType = z.infer<typeof registerSchema>;

/* ============================================================
 * LOGIN
 * ============================================================*/
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(4, "Debes ingresar tu contraseña")
    .max(100, "Contraseña demasiado larga"),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;

/* ============================================================
 * RESET PASSWORD — REQUEST
 * ============================================================*/
export const resetRequestSchema = z.object({
  email: emailSchema,
});
export type ResetRequestSchemaType = z.infer<typeof resetRequestSchema>;

/* ============================================================
 * RESET PASSWORD — CONFIRM
 * ============================================================*/
export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, "Token inválido"),

    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña es demasiado larga"),

    confirmPassword: z
      .string()
      .min(6, "Debes confirmar la contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });



export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
