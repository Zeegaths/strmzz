const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

interface ApiResponse {
  success: boolean
  message?: any
  data?: any
  error?: any
  timestamps?: number
  path?: string
}

async function authFetch(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  const json = await res.json()
  return json
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('strimz_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper to extract data from response (backend uses both res.data and res.message)
function extractData(res: ApiResponse): any {
  return res.data || res.message || null
}

// ============================================================================
// Auth API
// ============================================================================

export async function signUp(data: {
  username: string
  email: string
  password: string
}) {
  return authFetch('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify({ ...data, type: 'eth' }),
  })
}

export async function signIn(data: { email: string; password: string }) {
  const res = await authFetch('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // Store token if login successful (verified users get token directly)
  const resData = extractData(res)
  if (res.success && resData?.accessToken) {
    localStorage.setItem('strimz_token', resData.accessToken)
    localStorage.setItem('strimz_user', JSON.stringify(resData))
  }

  return res
}

export async function verifyOtp(otp: string) {
  const res = await authFetch(`/auth/verify/${otp}`, {
    method: 'GET',
  })

  // Store token after verification
  const resData = extractData(res)
  if (res.success && resData?.accessToken) {
    localStorage.setItem('strimz_token', resData.accessToken)
    localStorage.setItem('strimz_user', JSON.stringify(resData))
  }

  return res
}

export async function resendVerification(email: string) {
  return authFetch('/auth/send-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function resetPassword(newPassword: string) {
  return authFetch('/auth/reset-password', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ newPassword }),
  })
}

export async function changePassword(oldPassword: string, newPassword: string) {
  return authFetch('/auth/change-password', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ oldPassword, newPassword }),
  })
}

// ============================================================================
// Token helpers
// ============================================================================

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('strimz_token')
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('strimz_user')
  return user ? JSON.parse(user) : null
}

export function logout() {
  localStorage.removeItem('strimz_token')
  localStorage.removeItem('strimz_user')
}

export function isAuthenticated(): boolean {
  return !!getStoredToken()
}