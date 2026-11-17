export interface Envelope<T> {
  data: T
  status: { message: string, code: number }
  errors?: Record<string, string[]>
}

export interface Customer {
  id: number
  name: string
  email: string
  phone: string | null
}

export interface AuthPayload {
  customer: Customer
  token: string
  token_type: string
  expires_in: number
}

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface PublicBusiness {
  name: string
  slug: string
  email: string | null
  phone: string | null
  timezone: string
  currency_code: string
  locale: string
  operating_hours: Partial<Record<Weekday, { open: string | null, close: string | null }>> | null
}

export interface Money {
  amount: number
  currency: string
}

export interface PublicService {
  id: number
  name: string
  description: string | null
  category: string | null
  duration_minutes: number
  price: Money | null
  color: string | null
}

export interface StaffMember {
  id: number
  name: string
}

export interface BusinessPage {
  business: PublicBusiness
  services: PublicService[]
  staff: StaffMember[]
  booking: { max_days_ahead: number, cancel_cutoff_hours: number }
}

export interface Slot {
  starts_at: string
  user_ids: number[]
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'

export interface CustomerAppointment {
  id: number
  status: AppointmentStatus
  starts_at: string
  ends_at: string
  price: Money | null
  can_cancel: boolean
  business: { name: string, slug: string, timezone: string, phone: string | null, email: string | null }
  service: { id: number, name: string, duration_minutes: number }
  staff: StaffMember
}
