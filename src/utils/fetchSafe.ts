export async function fetchSafe(url: string, options: RequestInit = {}) {
  const resp = await fetch(url, {
    cache: "no-store",
    ...options,
  });

  // Si la respuesta es 304 → devolver respuesta vacía segura
  if (resp.status === 304) {
    return { ok: true, data: null };
  }

  let json: any = null;
  try {
    json = await resp.json();
  } catch {
    json = null;
  }

  return { ok: resp.ok, status: resp.status, data: json };
}
