import type { Money } from './types'

/** Prices arrive in minor units (e.g. 2500 = 25.00). */
export function formatMoney(price: Money | null | undefined, locale = 'en'): string {
  if (!price)
    return ''

  const digits = new Intl.NumberFormat(locale, { style: 'currency', currency: price.currency })
    .resolvedOptions().maximumFractionDigits ?? 2

  return new Intl.NumberFormat(locale, { style: 'currency', currency: price.currency })
    .format(price.amount / 10 ** digits)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60)
    return `${minutes} min`

  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return m ? `${h} h ${m} min` : `${h} h`
}

/** Times are shown in the business's timezone, not the visitor's. */
export function formatTime(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', timeZone }).format(new Date(iso))
}

export function formatDate(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone })
    .format(new Date(iso))
}

/** YYYY-MM-DD for "today + offset days" in the given timezone. */
export function isoDateInZone(timeZone: string, offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000)

  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}
