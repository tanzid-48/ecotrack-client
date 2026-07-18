const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("ecotrack_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function saveAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("ecotrack_token", token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("ecotrack_token");
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(errBody.error || `Request failed with ${res.status}`);
  }

  return res.json();
}

export { API_URL };
