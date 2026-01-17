// src/modules/admin/audit/api/audit.api.ts
import { http } from "@/shared/api/http";
import type { AuditLogsResponse, AuditLogFilters } from "../types/audit";

export interface FetchAuditLogsParams extends AuditLogFilters {
  cursor?: string;
  limit?: number;
}

export async function fetchAuditLogs(
  params: FetchAuditLogsParams = {}
): Promise<AuditLogsResponse> {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });

  const qs = search.toString();
  const url = qs ? `/admin/audit-logs?${qs}` : "/admin/audit-logs";

  // ✅ AXIOS
  const { data } = await http.get<AuditLogsResponse>(url);
  return data;
}

export async function fetchAuditActions(): Promise<string[]> {
  const { data } = await http.get<{
    ok: boolean;
    data: { actions: string[] };
  }>("/admin/audit-meta/actions");

  return data.data.actions;
}
