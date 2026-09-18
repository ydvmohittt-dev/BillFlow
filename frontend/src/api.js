const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api(path, options = {}) {
  let token = localStorage.getItem("invoice_token");

  const makeRequest = async (accessToken) => {
    const headers = {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  // First request
  let response = await makeRequest(token);

  // Access token expired
  if (response.status === 401 && path !== "/auth/refresh") {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();

      // Save new access token
      localStorage.setItem("invoice_token", refreshData.token);

      // Retry original request
      response = await makeRequest(refreshData.token);
    } else {
      // Refresh token expired/invalid
      clearSession();
    }
  }

  const data =
    response.status === 204
      ? null
      : await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}

export function saveSession(result) {
  localStorage.setItem("invoice_token", result.token);
  localStorage.setItem(
    "invoice_user",
    JSON.stringify(result.user)
  );
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("invoice_user")) || null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("invoice_token");
  localStorage.removeItem("invoice_user");
}