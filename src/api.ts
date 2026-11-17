import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { AuthPayload, BusinessPage, Customer, CustomerAppointment, Envelope, Slot } from './types'
import { useAuthStore } from './stores/auth'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: 'application/json' },
})

http.interceptors.request.use(config => {
  const auth = useAuthStore()

  if (auth.token)
    config.headers.Authorization = `Bearer ${auth.token}`

  return config
})

type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

// A JWT can only be refreshed once, so concurrent 401s share one refresh.
let refreshing: Promise<void> | null = null

http.interceptors.response.use(undefined, async (error: AxiosError) => {
  const auth = useAuthStore()
  const original = error.config as RetryableConfig | undefined
  const isAuthCall = original?.url?.startsWith('/customer/auth/')

  if (error.response?.status === 401 && original && !original._retried && !isAuthCall && auth.token) {
    original._retried = true

    try {
      refreshing ??= auth.refresh().finally(() => { refreshing = null })
      await refreshing

      return http(original)
    }
    catch {
      auth.clear()
    }
  }

  return Promise.reject(error)
})

/** Pulls `{ status, errors }` out of a failed request so pages can show it. */
export function apiError(error: unknown): { message: string, errors: Record<string, string[]> } {
  const data = (error as AxiosError<Envelope<unknown>>)?.response?.data

  return {
    message: data?.status?.message ?? 'Something went wrong. Please try again.',
    errors: data?.errors ?? {},
  }
}

export const api = {
  business: (slug: string) =>
    http.get<Envelope<BusinessPage>>(`/public/businesses/${encodeURIComponent(slug)}`).then(r => r.data.data),

  slots: (slug: string, params: { service_id: number, date: string, user_id?: number | null }) =>
    http.get<Envelope<{ date: string, slots: Slot[] }>>(`/public/businesses/${encodeURIComponent(slug)}/slots`, { params })
      .then(r => r.data.data.slots),

  register: (payload: { name: string, email: string, phone?: string, password: string, password_confirmation: string }) =>
    http.post<Envelope<AuthPayload>>('/customer/auth/register', payload).then(r => r.data.data),

  login: (payload: { email: string, password: string }) =>
    http.post<Envelope<AuthPayload>>('/customer/auth/login', payload).then(r => r.data.data),

  refresh: () =>
    http.post<Envelope<{ token: string }>>('/customer/auth/refresh').then(r => r.data.data),

  logout: () => http.post('/customer/auth/logout'),

  forgotPassword: (email: string) =>
    http.post<Envelope<null>>('/customer/auth/forgot-password', { email }).then(r => r.data.status.message),

  resetPassword: (payload: { email: string, token: string, password: string, password_confirmation: string }) =>
    http.post<Envelope<null>>('/customer/auth/reset-password', payload).then(r => r.data.status.message),

  me: () => http.get<Envelope<Customer>>('/customer/me').then(r => r.data.data),

  updateMe: (payload: Partial<Customer> & { password?: string, password_confirmation?: string, current_password?: string }) =>
    http.put<Envelope<Customer>>('/customer/me', payload).then(r => r.data.data),

  appointments: (scope?: 'upcoming' | 'past') =>
    http.get<Envelope<CustomerAppointment[]>>('/customer/appointments', { params: { scope } }).then(r => r.data.data),

  book: (slug: string, payload: { service_id: number, user_id?: number | null, starts_at: string, notes?: string }) =>
    http.post<Envelope<CustomerAppointment>>(`/customer/businesses/${encodeURIComponent(slug)}/appointments`, payload)
      .then(r => r.data.data),

  cancel: (id: number) =>
    http.post<Envelope<CustomerAppointment>>(`/customer/appointments/${id}/cancel`).then(r => r.data.data),
}
