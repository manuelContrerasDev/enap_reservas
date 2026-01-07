// src/shared/api/http.ts

export class HttpError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

interface HttpOptions extends RequestInit {
  auth?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function http<T>(
  endpoint: string,
  { auth = true, ...options }: HttpOptions = {}
): Promise<T> {
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: finalHeaders,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new HttpError(res.status, data?.message || "HTTP Error", data);
  }

  return data as T;
}
