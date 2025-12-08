import { useEffect, useMemo, useState } from "react";

/** Paginación genérica para cualquier lista */
export function usePagination<T>(
  items: T[],
  rowsOptions: readonly number[] = [10, 15, 20, 50],
  initialRows = 15
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(initialRows);

  const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, items.length);

  const currentSlice = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  useEffect(() => {
    const nextTotal = Math.max(1, Math.ceil(items.length / rowsPerPage));
    if (currentPage > nextTotal) setCurrentPage(nextTotal);
  }, [items.length, rowsPerPage, currentPage]);

  return {
    currentPage, setCurrentPage,
    rowsPerPage, setRowsPerPage,
    rowsOptions,
    totalPages, startIndex, endIndex,
    currentSlice,
  };
}
