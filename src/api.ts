const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

type Tokens = { access: string; refresh: string }

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

function getTokens(): Tokens | null {
  try {
    return JSON.parse(localStorage.getItem("hh-tokens") || "null")
  } catch {
    return null
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const tokens = getTokens()
  const isForm = options.body instanceof FormData
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(tokens?.access ? { Authorization: `Bearer ${tokens.access}` } : {}),
      ...options.headers,
    },
  })
  if (response.status === 401 && retry && tokens?.refresh) {
    const refreshed = await fetch(`${API_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: tokens.refresh }),
    })
    if (refreshed.ok) {
      const next = await refreshed.json()
      localStorage.setItem(
        "hh-tokens",
        JSON.stringify({
          access: next.access,
          refresh: next.refresh || tokens.refresh,
        }),
      )
      return request<T>(path, options, false)
    }
    localStorage.removeItem("hh-tokens")
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      body.detail ||
        Object.values(body).flat().join(" ") ||
        "Something went wrong.",
    )
  }
  return response.status === 204 ? undefined as T : response.json()
}

export type ApiUser = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  phone: string
  role: "user" | "agent" | "admin"
}

export function hasTokens() {
  return Boolean(getTokens()?.access)
}

export const api = {
  properties: (query = "") =>
    request(`/properties/${query ? `?${query}` : ""}`),
  property: (id: number) => request(`/properties/${id}/`),
  createProperty: (data: FormData) =>
    request("/properties/", { method: "POST", body: data }),
  register: (data: {
    email: string
    password: string
    first_name?: string
    last_name?: string
    role?: "user" | "agent"
  }) =>
    request<ApiUser>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  async login(email: string, password: string) {
    const tokens = await request<Tokens>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem("hh-tokens", JSON.stringify(tokens))
    return request<ApiUser>("/auth/profile/")
  },
  profile: () => request<ApiUser>("/auth/profile/"),
  favourites: () => request("/favourites/"),
  addFavourite: (property: number) =>
    request("/favourites/", {
      method: "POST",
      body: JSON.stringify({ property }),
    }),
  removeFavourite: (id: number) =>
    request(`/favourites/${id}/`, { method: "DELETE" }),
  inquiry: (data: unknown) =>
    request("/inquiries/", { method: "POST", body: JSON.stringify(data) }),
  async logout() {
    const tokens = getTokens()
    if (tokens?.refresh)
      await request("/auth/logout/", {
        method: "POST",
        body: JSON.stringify({ refresh: tokens.refresh }),
      }).catch(() => undefined)
    localStorage.removeItem("hh-tokens")
  },
}
