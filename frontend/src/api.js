// Every call to the FastAPI backend goes through here. The "/api" prefix is forwarded
// to http://localhost:8000 by the "proxy" line in package.json.
export const getToken = () => localStorage.getItem("pharmaToken");

export function saveSession({ token, user }) {
  localStorage.setItem("pharmaToken", token);
  localStorage.setItem("pharmaUser", JSON.stringify({ name: user.name, pharmacy: user.pharmacy }));
}

export function clearSession() {
  localStorage.removeItem("pharmaToken");
  localStorage.removeItem("pharmaUser");
}

export async function api(path, { method = "GET", body } = {}) {
  const token = getToken();
  const res = await fetch("/api" + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && !path.startsWith("/auth/")) {
    clearSession();
    window.location.assign("/login");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const d = err.detail;
    throw new Error(typeof d === "string" ? d : d?.[0]?.msg?.replace("Value error, ", "") || "Something went wrong");
  }
  return res.status === 204 ? null : res.json();
}
