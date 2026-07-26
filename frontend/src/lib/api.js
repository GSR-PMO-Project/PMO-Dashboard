const API_BASE_URL = "http://localhost:4000";

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

  return response.json();
}