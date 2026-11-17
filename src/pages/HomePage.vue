<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const demoSlug = import.meta.env.VITE_DEMO_SLUG || 'demo-salon'

const steps = [
  { icon: 'mdi-link-variant', title: 'Open the link', text: 'Every business on Bookly has its own booking page. They share the link with you.' },
  { icon: 'mdi-calendar-clock', title: 'Pick a time', text: 'Choose a service, a staff member if you like, and a free slot that suits you.' },
  { icon: 'mdi-check-decagram-outline', title: 'You\'re booked', text: 'Get a confirmation email and manage all your bookings in one place.' },
]
</script>

<template>
  <div class="page">
    <section class="text-center py-12">
      <VChip
        color="primary"
        variant="tonal"
        class="mb-4"
      >
        Online booking, made simple
      </VChip>
      <h1 class="text-h3 font-weight-bold mb-4 text-balance">
        Book your next appointment in a few taps
      </h1>
      <p
        class="text-h6 font-weight-regular text-medium-emphasis mx-auto mb-8 text-balance"
        style="max-width: 600px;"
      >
        See real availability, book instantly, and keep every appointment, from every business, in one account.
      </p>
      <div class="d-flex flex-wrap justify-center ga-3">
        <VBtn
          :to="{ name: 'business', params: { slug: demoSlug } }"
          color="primary"
          variant="flat"
          size="x-large"
          append-icon="mdi-arrow-right"
        >
          Try the demo salon
        </VBtn>
        <VBtn
          v-if="auth.isLoggedIn"
          :to="{ name: 'my-bookings' }"
          variant="outlined"
          size="x-large"
        >
          My bookings
        </VBtn>
        <VBtn
          v-else
          :to="{ name: 'register' }"
          variant="outlined"
          size="x-large"
        >
          Create an account
        </VBtn>
      </div>
    </section>

    <VRow>
      <VCol
        v-for="s in steps"
        :key="s.title"
        cols="12"
        md="4"
      >
        <VCard
          variant="flat"
          border
          class="h-100 pa-2"
        >
          <VCardItem>
            <VAvatar
              color="primary"
              variant="tonal"
              rounded="lg"
              class="mb-3"
            >
              <VIcon :icon="s.icon" />
            </VAvatar>
            <VCardTitle>{{ s.title }}</VCardTitle>
          </VCardItem>
          <VCardText>{{ s.text }}</VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
