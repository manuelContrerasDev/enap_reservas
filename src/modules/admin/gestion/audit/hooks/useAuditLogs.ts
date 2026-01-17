// src/modules/admin/audit/hooks/useAuditLogs.ts
import { useCallback, useState } from "react";
import { fetchAuditLogs } from "../api/audit.api";
import type { AuditLogItem, AuditLogFilters } from "../types/audit";

export function useAuditLogs() {
  const [data, setData] = useState<AuditLogItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(
    async (filters: AuditLogFilters, reset = false) => {
      if (loading) return;
      setLoading(true);

      const res = await fetchAuditLogs({
        ...filters,
        cursor: reset ? undefined : cursor ?? undefined,
        limit: 50,
      });

      setData((prev) => (reset ? res.data : [...prev, ...res.data]));
      setCursor(res.nextCursor);
      setHasMore(Boolean(res.nextCursor));
      setLoading(false);
    },
    [cursor, loading]
  );

  return {
    data,
    loading,
    hasMore,
    load,
    reset: () => {
      setData([]);
      setCursor(null);
      setHasMore(true);
    },
  };
}
