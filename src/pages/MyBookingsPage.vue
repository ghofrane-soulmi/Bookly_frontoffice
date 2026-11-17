<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { api, apiError } from '@/api'
import { formatDate, formatMoney, formatTime } from '@/format'
import type { AppointmentStatus, CustomerAppointment } from '@/types'

const tab = ref<'upcoming' | 'past'>('upcoming')
const items = ref<CustomerAppointment[]>([])
const loading = ref(true)
const error = ref('')

const toCancel = ref<CustomerAppointment | null>(null)
const cancelling = ref(false)
const cancelError = ref('')

async function load() {
  loading.value = true
  error.value = ''

  try {
    items.value = await api.appointments(tab.value)
  }
  catch (e) {
    error.value = apiError(e).message
  }
  finally {
    loading.value = false
  }
}

watch(tab, load, { immediate: true })

const STATUS: Record<AppointmentStatus, { label: string, color: string }> = {
  scheduled: { label: 'Upcoming', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'secondary' },
  no_show: { label: 'Missed', color: 'warning' },
}

function statusOf(a: CustomerAppointment) {
  // A scheduled appointment in the past just hasn't been marked by the business yet.
  if (a.status === 'scheduled' && new Date(a.starts_at) < new Date())
    return { label: 'Past', color: 'secondary' }

  return STATUS[a.status]
}

const emptyText = computed(() => tab.value === 'upcoming'
  ? 'You have no upcoming appointments. Use the booking link a business shared with you to book one.'
  : 'Your past and cancelled appointments will show up here.')

async function cancel() {
  if (!toCancel.value)
    return

  cancelling.value = true
  cancelError.value = ''

  try {
    await api.cancel(toCancel.value.id)
    toCancel.value = null
    await load()
  }
  catch (e) {
    cancelError.value = apiError(e).message
  }
  finally {
    cancelling.value = false
  }
}
</script>

<template>
  <div class="page">
    <h1 class="text-h5 font-weight-bold mb-4">
      My bookings
    </h1>

    <VTabs
      v-model="tab"
      color="primary"
      class="mb-4"
    >
      <VTab value="upcoming">
        Upcoming
      </VTab>
      <VTab value="past">
        Past &amp; cancelled
      </VTab>
    </VTabs>

    <VAlert
      v-if="error"
      type="error"
      variant="tonal"
      :text="error"
    />

    <VSkeletonLoader
      v-else-if="loading"
      type="list-item-three-line@3"
      class="bg-transparent"
    />

    <VEmptyState
      v-else-if="!items.length"
      icon="mdi-calendar-blank-outline"
      title="Nothing here yet"
      :text="emptyText"
    />

    <div
      v-else
      class="d-flex flex-column ga-3"
    >
      <VCard
        v-for="a in items"
        :key="a.id"
        variant="flat"
        border
      >
        <VCardItem>
          <template #prepend>
            <div
              class="text-center me-2 rounded-lg pa-2"
              style="min-width: 64px; background: rgba(var(--v-theme-primary), 0.1);"
            >
              <div class="text-caption text-primary font-weight-medium">
                {{ new Intl.DateTimeFormat(undefined, { month: 'short', timeZone: a.business.timezone }).format(new Date(a.starts_at)) }}
              </div>
              <div class="text-h5 font-weight-bold text-primary">
                {{ new Intl.DateTimeFormat(undefined, { day: 'numeric', timeZone: a.business.timezone }).format(new Date(a.starts_at)) }}
              </div>
            </div>
          </template>
          <VCardTitle class="text-wrap">
            {{ a.service.name }}
          </VCardTitle>
          <VCardSubtitle class="opacity-100">
            <RouterLink
              :to="{ name: 'business', params: { slug: a.business.slug } }"
              class="text-primary text-decoration-none"
            >
              {{ a.business.name }}
            </RouterLink>
            · with {{ a.staff.name }}
          </VCardSubtitle>
          <template #append>
            <VChip
              :color="statusOf(a).color"
              size="small"
              variant="tonal"
            >
              {{ statusOf(a).label }}
            </VChip>
          </template>
        </VCardItem>
        <VCardText class="d-flex flex-wrap align-center ga-4 pt-0">
          <span><VIcon
            icon="mdi-calendar"
            size="16"
          /> {{ formatDate(a.starts_at, a.business.timezone) }}</span>
          <span><VIcon
            icon="mdi-clock-outline"
            size="16"
          /> {{ formatTime(a.starts_at, a.business.timezone) }} – {{ formatTime(a.ends_at, a.business.timezone) }}</span>
          <span v-if="a.price"><VIcon
            icon="mdi-cash"
            size="16"
          /> {{ formatMoney(a.price) }}</span>
          <VSpacer />
          <VBtn
            v-if="a.can_cancel"
            color="error"
            variant="text"
            size="small"
            @click="toCancel = a; cancelError = ''"
          >
            Cancel
          </VBtn>
          <VBtn
            v-else-if="tab === 'past'"
            :to="{ name: 'business', params: { slug: a.business.slug }, query: { service: a.service.id } }"
            variant="text"
            size="small"
            color="primary"
          >
            Book again
          </VBtn>
          <span
            v-else-if="a.status === 'scheduled' && a.business.phone"
            class="text-caption text-medium-emphasis"
          >
            To change, call {{ a.business.phone }}
          </span>
        </VCardText>
      </VCard>
    </div>

    <VDialog
      :model-value="!!toCancel"
      max-width="420"
      @update:model-value="v => !v && (toCancel = null)"
    >
      <VCard
        v-if="toCancel"
        title="Cancel this appointment?"
      >
        <VCardText>
          {{ toCancel.service.name }} at {{ toCancel.business.name }},
          {{ formatDate(toCancel.starts_at, toCancel.business.timezone) }}
          at {{ formatTime(toCancel.starts_at, toCancel.business.timezone) }}.
          <VAlert
            v-if="cancelError"
            type="error"
            variant="tonal"
            density="compact"
            class="mt-3"
            :text="cancelError"
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            @click="toCancel = null"
          >
            Keep it
          </VBtn>
          <VBtn
            color="error"
            variant="flat"
            :loading="cancelling"
            @click="cancel"
          >
            Cancel appointment
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
