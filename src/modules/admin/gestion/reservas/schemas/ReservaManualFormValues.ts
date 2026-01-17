import type { z } from "zod";
import { reservaManualFormSchema } from "@/modules/admin/gestion/reservas/types/reservaManual.schema";

export type ReservaManualFormValues =
  z.input<typeof reservaManualFormSchema>;

  type ReservaManualParsed =
  z.output<typeof reservaManualFormSchema>;
