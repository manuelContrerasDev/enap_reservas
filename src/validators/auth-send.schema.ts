import { z } from "zod";

export const registerSendSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterSendType = z.infer<typeof registerSendSchema>;
