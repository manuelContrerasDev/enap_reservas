import type { z } from "zod";
import { reservaManualFormSchema } from "@/validators/reservaManual.schema";

// 🔹 Tipo INPUT del form (antes del parse)
export type ReservaManualFormValues = z.input<typeof reservaManualFormSchema>;
