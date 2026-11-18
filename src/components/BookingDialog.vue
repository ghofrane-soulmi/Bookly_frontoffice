<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { api, apiError } from '@/api'
import { UI_LOCALE, formatDate, formatDuration, formatMoney, formatTime, isoDateInZone } from '@/format'
import { useAuthStore } from '@/stores/auth'
import type { BusinessPage, CustomerAppointment, PublicService, Slot, Weekday } from '@/types'

const props = defineProps<{ page: BusinessPage, service: PublicService }>()
const emit = defineEmits<{ close: [] }>()

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const { smAndDown } = useDisplay()

const tz = computed(() => props.page.business.timezone)
const open = ref(true)
const step = ref<'time' | 'confirm' | 'done'>('time')

const staffId = ref<number | null>(null)
const date = ref(isoDateInZone(tz.value))
const slots = ref<Slot[]>([])
const loadingSlots = ref(false)
const slot = ref<Slot | null>(null)
const notes = ref('')
const submitting = ref(false)
const error = ref('')
const booked = ref<CustomerAppointment | null>(null)

const WEEKDAYS: Weekday[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

/** Every bookable day in the window, flagged closed from the opening hours. */
const days = computed(() => {
  const hours = props.page.business.operating_hours

  return Array.from({ length: props.page.booking.max_days_ahead + 1 }, (_, i) => {
    const iso = isoDateInZone(tz.value, i)
    const noon = new Date(`${iso}T12:00:00Z`)
    const weekday = WEEKDAYS[noon.getUTCDay()]
    const h = hours?.[weekday]

    return {
      iso,
      weekday: new Intl.DateTimeFormat(UI_LOCALE, { weekday: 'short', timeZone: 'UTC' }).format(noon),
      day: noon.getUTCDate(),
      month: new Intl.DateTimeFormat(UI_LOCALE, { month: 'short', timeZone: 'UTC' }).format(noon),
      closed: !!hours && !(h?.open && h?.close),
    }
  })
})

const staffOptions = computed(() => [
  { title: 'Any available staff', value: null },
  ...props.page.staff.map(s => ({ title: s.name, value: s.id })),
])

async function loadSlots() {
  slot.value = null
  loadingSlots.value = true
  error.value = ''

  try {
    slots.value = await api.slots(props.page.business.slug, { service_id: props.service.id, date: date.value, user_id: staffId.value })
  }
  catch (e) {
    slots.value = []
    error.value = apiError(e).message
  }
  finally {
    loadingSlots.value = false
  }
}

watch([date, staffId], loadSlots, { immediate: true })

const staffName = computed(() => {
  const id = staffId.value ?? slot.value?.user_ids[0]

  return staffId.value === null ? 'First available' : props.page.staff.find(s => s.id === id)?.name
})

function close() {
  open.value = false
  emit('close')

  if (route.query.service)
    router.replace({ query: { ...route.query, service: undefined } })
}

function authRedirect(name: 'login' | 'register') {
  router.push({ name, query: { redirect: `/b/${props.page.business.slug}?service=${props.service.id}` } })
}

async function confirm() {
  if (!slot.value)
    return

  submitting.value = true
  error.value = ''

  try {
    booked.value = await api.book(props.page.business.slug, {
      service_id: props.service.id,
      user_id: staffId.value,
      starts_at: slot.value.starts_at,
      notes: notes.value || undefined,
    })
    step.value = 'done'
  }
  catch (e) {
    error.value = apiError(e).message
    // Slot was taken meanwhile: go back and show fresh availability.
    step.value = 'time'
    await loadSlots()
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <VDialog
    :model-value="open"
    :fullscreen="smAndDown"
    max-width="640"
    scrollable
    @update:model-value="v => !v && close()"
  >
    <VCard>
      <VCardItem class="pb-2">
        <VCardTitle class="text-wrap">
          {{ service.name }}
        </VCardTitle>
        <VCardSubtitle>
          {{ formatDuration(service.duration_minutes) }}
          <template v-if="service.price">
            · {{ formatMoney(service.price, page.business.locale) }}
          </template>
        </VCardSubtitle>
        <template #append>
          <VBtn
            icon="mdi-close"
            variant="text"
            aria-label="Close"
            @click="close"
          />
        </template>
      </VCardItem>
      <VDivider />

      <!-- Step 1: staff, day, time -->
      <VCardText v-if="step === 'time'">
        <VSelect
          v-if="page.staff.length > 1"
          v-model="staffId"
          :items="staffOptions"
          label="With"
          prepend-inner-icon="mdi-account-outline"
          class="mb-2"
        />

        <div class="text-subtitle-2 mb-2">
          Day
        </div>
        <VSlideGroup
          v-model="date"
          mandatory
          show-arrows
          class="mb-4"
        >
          <VSlideGroupItem
            v-for="d in days"
            :key="d.iso"
            v-slot="{ isSelected, toggle }"
            :value="d.iso"
            :disabled="d.closed"
          >
            <VCard
              :color="isSelected ? 'primary' : undefined"
              variant="flat"
              :disabled="d.closed"
              class="ma-1 text-center py-2 day-card"
              :class="{ 'day-card--selected': isSelected }"
              width="64"
              rounded="lg"
              @click="toggle"
            >
              <div class="text-caption">
                {{ d.weekday }}
              </div>
              <div class="text-h6 font-weight-bold">
                {{ d.day }}
              </div>
              <div class="text-caption">
                {{ d.closed ? 'Closed' : d.month }}
              </div>
            </VCard>
          </VSlideGroupItem>
        </VSlideGroup>

        <div class="text-subtitle-2 mb-2">
          Time <span class="text-medium-emphasis font-weight-regular">({{ tz }})</span>
        </div>

        <VAlert
          v-if="error"
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-3"
          :text="error"
        />

        <div
          v-if="loadingSlots"
          class="d-flex justify-center py-8"
        >
          <VProgressCircular indeterminate />
        </div>
        <div
          v-else-if="!slots.length"
          class="text-center text-medium-emphasis py-8"
        >
          No free times on this day. Try another day.
        </div>
        <VChipGroup
          v-else
          v-model="slot"
          column
          selected-class="time-chip--selected"
        >
          <VChip
            v-for="s in slots"
            :key="s.starts_at"
            :value="s"
            variant="flat"
            size="large"
            rounded="lg"
            class="justify-center time-chip"
            style="min-width: 84px;"
          >
            {{ formatTime(s.starts_at, tz) }}
          </VChip>
        </VChipGroup>
      </VCardText>

      <!-- Step 2: review + confirm -->
      <VCardText v-else-if="step === 'confirm' && slot">
        <VList
          density="compact"
          class="bg-transparent mb-2"
        >
          <VListItem
            prepend-icon="mdi-store-outline"
            :title="page.business.name"
          />
          <VListItem
            prepend-icon="mdi-calendar"
            :title="formatDate(slot.starts_at, tz)"
            :subtitle="formatTime(slot.starts_at, tz)"
          />
          <VListItem
            prepend-icon="mdi-account-outline"
            :title="staffName"
          />
        </VList>

        <template v-if="auth.isLoggedIn">
          <VTextarea
            v-model="notes"
            label="Note for the business (optional)"
            rows="2"
            auto-grow
            counter="1000"
          />
          <div class="text-body-2 text-medium-emphasis">
            Booking as <strong>{{ auth.customer?.name }}</strong> ({{ auth.customer?.email }}).
          </div>
        </template>
        <VAlert
          v-else
          type="info"
          variant="tonal"
          title="Log in to confirm"
          text="You need a free Bookly account to book, so you can see and manage your appointments later."
        />
      </VCardText>

      <!-- Step 3: success -->
      <VCardText
        v-else-if="step === 'done' && booked"
        class="text-center py-8"
      >
        <VIcon
          icon="mdi-check-circle"
          color="success"
          size="64"
          class="mb-3"
        />
        <div class="text-h6 mb-1">
          You're booked!
        </div>
        <div class="text-body-1">
          {{ formatDate(booked.starts_at, tz) }} at {{ formatTime(booked.starts_at, tz) }}
          with {{ booked.staff.name }}.
        </div>
        <div class="text-body-2 text-medium-emphasis mt-2">
          A confirmation email is on its way (if the business has them turned on).
        </div>
      </VCardText>

      <VDivider />
      <VCardActions class="pa-4">
        <template v-if="step === 'time'">
          <VSpacer />
          <VBtn
            color="primary"
            variant="flat"
            :disabled="!slot"
            @click="step = 'confirm'"
          >
            Continue
          </VBtn>
        </template>

        <template v-else-if="step === 'confirm'">
          <VBtn
            variant="text"
            @click="step = 'time'"
          >
            Back
          </VBtn>
          <VSpacer />
          <template v-if="auth.isLoggedIn">
            <VBtn
              color="primary"
              variant="flat"
              :loading="submitting"
              @click="confirm"
            >
              Confirm booking
            </VBtn>
          </template>
          <template v-else>
            <VBtn
              variant="outlined"
              @click="authRedirect('login')"
            >
              Log in
            </VBtn>
            <VBtn
              color="primary"
              variant="flat"
              @click="authRedirect('register')"
            >
              Sign up
            </VBtn>
          </template>
        </template>

        <template v-else>
          <VBtn
            variant="text"
            @click="close"
          >
            Close
          </VBtn>
          <VSpacer />
          <VBtn
            color="primary"
            variant="flat"
            :to="{ name: 'my-bookings' }"
          >
            View my bookings
          </VBtn>
        </template>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.day-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  background: rgba(var(--v-theme-on-surface), 0.02);
  transition: border-color 0.15s, background-color 0.15s;
}

.day-card:not(.day-card--selected):not(.v-card--disabled):hover {
  border-color: rgba(var(--v-theme-primary), 0.6);
  background: rgba(var(--v-theme-primary), 0.06);
}

.day-card--selected {
  border-color: transparent;
  box-shadow: 0 8px 20px -10px rgba(var(--v-theme-primary), 0.8);
}

.time-chip {
  font-weight: 600;
  background: rgba(var(--v-theme-primary), 0.08) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.time-chip:hover {
  background: rgba(var(--v-theme-primary), 0.16) !important;
}

.time-chip--selected {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}
</style>
