import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api } from '@/api'
import type { AuthPayload, Customer } from '@/types'

const TOKEN_KEY = 'bookly.customer.token'
const USER_KEY = 'bookly.customer'

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)

    return raw ? JSON.parse(raw) as T : null
  }
  catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null)
      localStorage.removeItem(key)
    else
      localStorage.setItem(key, JSON.stringify(value))
  }
  catch {
    // Storage unavailable (private mode): the session just won't persist.
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(read<string>(TOKEN_KEY))
  const customer = ref<Customer | null>(read<Customer>(USER_KEY))
  const isLoggedIn = computed(() => !!token.value)

  function setSession(payload: AuthPayload) {
    token.value = payload.token
    customer.value = payload.customer
    write(TOKEN_KEY, payload.token)
    write(USER_KEY, payload.customer)
  }

  function setCustomer(value: Customer) {
    customer.value = value
    write(USER_KEY, value)
  }

  function clear() {
    token.value = null
    customer.value = null
    write(TOKEN_KEY, null)
    write(USER_KEY, null)
  }

  async function login(email: string, password: string) {
    setSession(await api.login({ email, password }))
  }

  async function register(payload: Parameters<typeof api.register>[0]) {
    setSession(await api.register(payload))
  }

  async function refresh() {
    const { token: fresh } = await api.refresh()

    token.value = fresh
    write(TOKEN_KEY, fresh)
  }

  async function logout() {
    try {
      await api.logout()
    }
    finally {
      clear()
    }
  }

  return { token, customer, isLoggedIn, login, register, refresh, logout, clear, setCustomer }
})
