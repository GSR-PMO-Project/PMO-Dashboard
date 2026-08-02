const API_BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export async function apiFetch(endpoint, options = {}, token = null) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `API request failed: ${response.status}`
    );
  }

  return response.status === 204 ? null : response.json();
}