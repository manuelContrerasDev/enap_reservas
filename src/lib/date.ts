export const ymdLocal = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // YYYY-MM-DD local
};

export const parseYmdLocal = (s?: string) => (s ? new Date(`${s}T00:00:00`) : null);

export const daysBetweenInclusive = (ini?: string, fin?: string) => {
  const a = parseYmdLocal(ini);
  const b = parseYmdLocal(fin);
  if (!a || !b) return 0;
  const diff = b.getTime() - a.getTime();
  if (!Number.isFinite(diff) || diff < 0) return 0;
  return Math.max(1, Math.ceil(diff / 86_400_000));
};
