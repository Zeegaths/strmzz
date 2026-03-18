/**
 * API helper for the frontend dashboard.
 * Uses JWT auth (stored in localStorage from login flow).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  // Your auth flow stores the token; adjust the key to match your login response
  const user = localStorage.getItem('strimzBusiness') || localStorage.getItem('strimzUser')
  if (!user) return null
  try {
    const parsed = JSON.parse(user)
    return parsed.accessToken || parsed.token || null
  } catch {
    return null
  }
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  const token = getToken()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const json = await res.json()

  if (!res.ok) {
    return {
      success: false,
      error: json.error || json.message || `Request failed (${res.status})`,
    }
  }

  return json
}

// Convenience wrappers
export const apiGet = <T = any>(path: string) => apiFetch<T>(path)

export const apiPost = <T = any>(path: string, body?: any) =>
  apiFetch<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })

export const apiPut = <T = any>(path: string, body?: any) =>
  apiFetch<T>(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })

export const apiDelete = <T = any>(path: string) =>
  apiFetch<T>(path, { method: 'DELETE' })
