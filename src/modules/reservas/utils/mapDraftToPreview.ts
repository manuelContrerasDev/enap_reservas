// src/modules/reservas/utils/mapDraftToPreview.ts
import type { ReservaDraft } from "@/modules/reservas/context/ReservaContext";
import type { ReservaPreview } from "@/modules/reservas/types/ReservaPreview";
import { UsoReserva } from "@/shared/types/enums";

type TotalesInput = ReservaPreview["totales"];

const safeStr = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback;

const safeNumber = (v: unknown, fallback = 0): number =>
  typeof v === "number" && !isNaN(v) ? v : fallback;

/**
 * Mapper DRAFT → PREVIEW
 * - No calcula
 * - No muta
 * - No asume datos inexistentes
 * - Falla rápido si el draft está incompleto
 */
export function mapDraftToPreview(
  draft: ReservaDraft,
  totales: TotalesInput
): ReservaPreview {
  /* ============================================================
   * Guards críticos (flujo Step 1 → Step 2)
   * ============================================================ */
  if (
    !draft.espacioId ||
    !draft.espacioNombre ||
    !draft.fechaInicio ||
    !draft.fechaFin ||
    !draft.usoReserva ||
    typeof draft.cantidadPersonas !== "number"
  ) {
    throw new Error("DRAFT_INCOMPLETO");
  }

  /* ============================================================
   * Preview
   * ============================================================ */
  return {
    /* ================= ESPACIO ================= */
    espacioId: draft.espacioId,
    espacioNombre: draft.espacioNombre,
    espacioTipo: draft.espacioTipo ?? null,

    /* ================= FECHAS ================= */
    fechaInicio: draft.fechaInicio,
    fechaFin: draft.fechaFin,
    dias: safeNumber(draft.dias),

    /* ================= CANTIDADES ================= */
    cantidadPersonas: safeNumber(draft.cantidadPersonas),

    /* ================= SOCIO ================= */
    socio: {
      nombre: safeStr(draft.socio?.nombre),
      rut: safeStr(draft.socio?.rut),
      telefono: safeStr(draft.socio?.telefono),
      correoEnap: safeStr(draft.socio?.correoEnap),
      correoPersonal: draft.socio?.correoPersonal ?? null,
    },

    /* ================= USO ================= */
    usoReserva: draft.usoReserva as UsoReserva,
    socioPresente: Boolean(draft.socioPresente),

    /* ================= RESPONSABLE ================= */
    responsable: {
      nombre: draft.responsable?.nombre ?? null,
      rut: draft.responsable?.rut ?? null,
      email: draft.responsable?.email ?? null,
    },

    /* ================= INVITADOS ================= */
    invitados: (draft.invitados ?? []).map((i: any) => ({
      nombre: safeStr(i.nombre),
      rut: safeStr(i.rut),
      edad:
        typeof i.edad === "number"
          ? i.edad
          : i.edad ?? null,
      esPiscina: Boolean(i.esPiscina),
    })),

    /* ================= TOTALES ================= */
    totales: {
      valorEspacio: safeNumber(totales.valorEspacio),
      pagoPersonas: safeNumber(totales.pagoPersonas),
      pagoPiscina: safeNumber(totales.pagoPiscina),
      total: safeNumber(totales.total),
    },
  };
}
