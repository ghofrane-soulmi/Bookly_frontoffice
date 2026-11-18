// All marketing copy for the landing page lives here, so wording, prices and
// FAQ answers can be changed without touching layout code.

export const backofficeUrl = (import.meta.env.VITE_BACKOFFICE_URL || 'http://localhost:5173').replace(/\/$/, '')
export const demoSlug = import.meta.env.VITE_DEMO_SLUG || 'demo-salon'

export const navSections = [
  { id: 'features', label: 'Features' },
  { id: 'product', label: 'Product' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
]

export const industries = [
  { icon: 'mdi-content-cut', label: 'Hair salons' },
  { icon: 'mdi-mustache', label: 'Barbers' },
  { icon: 'mdi-spa-outline', label: 'Spas & beauty' },
  { icon: 'mdi-hand-back-left-outline', label: 'Nail studios' },
  { icon: 'mdi-stethoscope', label: 'Clinics' },
  { icon: 'mdi-dumbbell', label: 'Coaches & trainers' },
]

export const features = [
  { icon: 'mdi-web', title: 'Your own booking page', text: 'A public page at bookly/b/your-name with your services, prices, opening hours and live availability.' },
  { icon: 'mdi-calendar-month-outline', title: 'Smart calendar', text: 'Day, week, month and list views with staff filters. Double bookings are blocked automatically.' },
  { icon: 'mdi-bell-ring-outline', title: 'Automatic reminders', text: 'Confirmation, reschedule, cancellation and reminder emails, with a lead time you choose.' },
  { icon: 'mdi-account-group-outline', title: 'Team & roles', text: 'Invite staff, give each person exactly the permissions they need, and keep the owner in control.' },
  { icon: 'mdi-account-heart-outline', title: 'Client history', text: 'Every client’s visits, notes and total spend in one place. Customers keep their own account too.' },
  { icon: 'mdi-receipt-text-outline', title: 'Invoices', text: 'Turn appointments into professional invoices, record payments and track what is still due.' },
  { icon: 'mdi-chart-box-outline', title: 'Dashboard & revenue', text: 'Today’s bookings, revenue by month, top services and busiest staff at a glance.' },
  { icon: 'mdi-earth', title: 'Local by default', text: 'Your timezone, your currency (TND, EUR, USD…) and your opening hours, respected everywhere.' },
]

export const steps = [
  { icon: 'mdi-store-plus-outline', title: 'Create your business', text: 'Sign up, add your services, prices and opening hours. It takes about five minutes.' },
  { icon: 'mdi-share-variant-outline', title: 'Share your link', text: 'Put your booking page on Instagram, Google Maps, WhatsApp or your website.' },
  { icon: 'mdi-calendar-check-outline', title: 'Get booked 24/7', text: 'Clients pick a free slot themselves. You see it instantly in your calendar.' },
]

export const showcase = [
  { value: 'dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard-outline', image: '/landing/dashboard.png', title: 'Know how your business is doing', text: 'Bookings, revenue and your best services, updated with every appointment.' },
  { value: 'calendar', label: 'Calendar', icon: 'mdi-calendar-month-outline', image: '/landing/calendar.png', title: 'One calendar for the whole team', text: 'Filter by staff member, drag through days and weeks, open any appointment in one click.' },
  { value: 'booking', label: 'Booking page', icon: 'mdi-gesture-tap', image: '/landing/booking.png', title: 'Booking your clients actually enjoy', text: 'Real availability in the business’s timezone, any staff or a favourite one, confirmed in seconds.' },
  { value: 'invoices', label: 'Invoices', icon: 'mdi-receipt-text-outline', image: '/landing/invoice.png', title: 'Get paid without the paperwork', text: 'Create, send and track invoices with taxes, discounts and partial payments.' },
]

export const highlights = [
  { value: '5 min', label: 'to set up your page' },
  { value: '24/7', label: 'online booking' },
  { value: '0', label: 'double bookings' },
  { value: '7', label: 'currencies supported' },
]

export interface Plan {
  name: string
  tagline: string
  monthly: number
  yearly: number
  popular?: boolean
  cta: string
  features: string[]
}

export const currency = 'TND'

export const plans: Plan[] = [
  {
    name: 'Starter',
    tagline: 'For independents getting started',
    monthly: 0,
    yearly: 0,
    cta: 'Start for free',
    features: ['1 staff member', 'Online booking page', 'Calendar & clients', 'Confirmation emails'],
  },
  {
    name: 'Pro',
    tagline: 'For growing salons and studios',
    monthly: 39,
    yearly: 390,
    popular: true,
    cta: 'Start free trial',
    features: ['Up to 5 staff members', 'Everything in Starter', 'Reminder emails', 'Invoices & payments', 'Dashboard & revenue'],
  },
  {
    name: 'Business',
    tagline: 'For teams with several roles',
    monthly: 89,
    yearly: 890,
    cta: 'Start free trial',
    features: ['Unlimited staff', 'Everything in Pro', 'Custom roles & permissions', 'Priority support'],
  },
]

export const faqs = [
  { q: 'Do my clients need to install an app?', a: 'No. Your booking page works in any browser, on phone or desktop. Clients create a free account so they can see all their bookings and cancel online.' },
  { q: 'Can two clients book the same slot?', a: 'No. Bookly checks each staff member’s calendar when the booking is made, so the same person can never be booked twice at the same time.' },
  { q: 'What happens outside my opening hours?', a: 'Clients only see free slots inside the opening hours you set for each day. Closed days are shown as closed.' },
  { q: 'Which currencies and timezones are supported?', a: 'Each business chooses its own timezone and currency, including TND, EUR, USD, GBP, MAD, DZD and JPY. Prices and times are shown in your local format.' },
  { q: 'Can my staff see everything?', a: 'Only what you allow. Owners, admins and staff have different default permissions, and you can create your own roles.' },
  { q: 'Is there a contract?', a: 'No. Start on the free plan and upgrade or cancel whenever you want.' },
]

// Set VITE_CONTACT_EMAIL to an inbox you own. When it's empty the email link
// and the contact form are hidden, so nothing points at someone else's domain.
export const contactEmail = (import.meta.env.VITE_CONTACT_EMAIL || '').trim()
