import { createVuetify } from 'vuetify'

const shared = {
  primary: '#5B5BD6',
  secondary: '#8B8D98',
  success: '#2E9E6B',
  warning: '#D9822B',
  error: '#D93F4C',
  info: '#3B82C4',
}

export const vuetify = createVuetify({
  theme: {
    defaultTheme: window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    themes: {
      light: {
        dark: false,
        colors: { ...shared, background: '#F7F7FB', surface: '#FFFFFF' },
      },
      dark: {
        dark: true,
        colors: { ...shared, primary: '#8E8CF0', background: '#121218', surface: '#1C1C24' },
      },
    },
  },
  defaults: {
    VBtn: { rounded: 'lg', style: 'text-transform: none; letter-spacing: 0;' },
    VCard: { rounded: 'xl' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VTextarea: { variant: 'outlined', density: 'comfortable' },
    VSelect: { variant: 'outlined', density: 'comfortable' },
  },
})
