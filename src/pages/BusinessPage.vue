<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import BookingDialog from '@/components/BookingDialog.vue'
import { formatDuration, formatMoney } from '@/format'
import { backofficeUrl, demoSlug } from '@/landing/content'
import type { BusinessPage, PublicService, Weekday } from '@/types'

const props = defineProps<{ slug: string }>()
const route = useRoute()

const page = ref<BusinessPage | null>(null)
const loading = ref(true)
const notFound = ref(false)
const selected = ref<PublicService | null>(null)

const WEEKDAYS: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

async function load() {
  loading.value = true
  notFound.value = false

  try {
    page.value = await api.business(props.slug)
    document.title = `${page.value.business.name} — Book online`

    // Coming back from login/sign-up: reopen the booking for that service.
    const serviceId = Number(route.query.service)
    if (serviceId)
      selected.value = page.value.services.find(s => s.id === serviceId) ?? null
  }
  catch {
    notFound.value = true
  }
  finally {
    loading.value = false
  }
}

watch(() => props.slug, load, { immediate: true })

const categories = computed(() => {
  const groups = new Map<string, PublicService[]>()

  for (const service of page.value?.services ?? []) {
    const key = service.category || 'Services'
    groups.set(key, [...(groups.get(key) ?? []), service])
  }

  return [...groups.entries()]
})

const hours = computed(() => {
  const configured = page.value?.business.operating_hours

  if (!configured)
    return null

  // "Today" in the business's own timezone, not the visitor's.
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: page.value!.business.timezone })
    .format(new Date()).toLowerCase()

  return WEEKDAYS.map(day => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    isToday: day === today,
    text: configured[day]?.open && configured[day]?.close
      ? `${configured[day]!.open} – ${configured[day]!.close}`
      : 'Closed',
  }))
})

const isDemo = computed(() => props.slug === demoSlug)
const initials = computed(() => (page.value?.business.name ?? '')
  .split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join(''))
</script>

<template>
  <div class="page">
    <template v-if="loading">
      <VSkeletonLoader
        type="heading, text, card, card"
        class="bg-transparent"
      />
    </template>

    <VEmptyState
      v-else-if="notFound"
      icon="mdi-store-search-outline"
      title="Business not found"
      text="This booking page doesn't exist or is no longer active. Check the link you were given."
    />

    <template v-else-if="page">
      <VAlert
        v-if="isDemo"
        color="primary"
        variant="tonal"
        icon="mdi-information-outline"
        class="mb-6 demo-banner"
      >
        <div class="d-flex flex-wrap align-center ga-3">
          <div class="flex-grow-1">
            <strong>This is a demo booking page.</strong>
            It's what your clients see: pick a service below to try booking. Nothing real is charged.
          </div>
          <VBtn
            :href="`${backofficeUrl}/login?demo=1`"
            variant="flat"
            color="primary"
            size="small"
            append-icon="mdi-arrow-right"
          >
            See the owner's dashboard
          </VBtn>
        </div>
      </VAlert>

      <div class="business-header mb-8">
        <VAvatar
          color="primary"
          size="72"
          rounded="xl"
          class="text-h5 font-weight-bold business-avatar"
        >
          {{ initials }}
        </VAvatar>
        <div class="min-w-0">
          <h1 class="business-name">
            {{ page.business.name }}
          </h1>
          <div class="d-flex flex-wrap ga-2 mt-3">
            <a
              v-if="page.business.phone"
              :href="`tel:${page.business.phone.replace(/\s+/g, '')}`"
              class="info-pill"
            >
              <VIcon
                icon="mdi-phone-outline"
                size="16"
              /> {{ page.business.phone }}
            </a>
            <a
              v-if="page.business.email"
              :href="`mailto:${page.business.email}`"
              class="info-pill"
            >
              <VIcon
                icon="mdi-email-outline"
                size="16"
              /> {{ page.business.email }}
            </a>
            <span class="info-pill">
              <VIcon
                icon="mdi-earth"
                size="16"
              /> Times in {{ page.business.timezone }}
            </span>
          </div>
        </div>
      </div>

      <VRow>
        <VCol
          cols="12"
          md="8"
        >
          <h2 class="text-h6 font-weight-bold mb-4">
            Choose a service
          </h2>

          <VEmptyState
            v-if="!page.services.length"
            icon="mdi-calendar-blank-outline"
            title="No services yet"
            text="This business hasn't published any bookable services."
          />

          <div
            v-for="[category, services] in categories"
            :key="category"
            class="mb-6"
          >
            <div class="category-label mb-2">
              {{ category }}
            </div>
            <div class="d-flex flex-column ga-3">
              <button
                v-for="service in services"
                :key="service.id"
                type="button"
                class="service-row"
                @click="selected = service"
              >
                <span
                  class="service-dot"
                  :style="{ background: service.color || 'rgb(var(--v-theme-primary))' }"
                />
                <span class="service-body">
                  <span class="service-name">{{ service.name }}</span>
                  <span
                    v-if="service.description"
                    class="service-desc"
                  >{{ service.description }}</span>
                  <span class="service-meta">
                    <span><VIcon
                      icon="mdi-clock-outline"
                      size="15"
                    /> {{ formatDuration(service.duration_minutes) }}</span>
                    <strong
                      v-if="service.price"
                      class="service-price"
                    >{{ formatMoney(service.price, page.business.locale) }}</strong>
                  </span>
                </span>
                <span class="service-cta">
                  Book
                  <VIcon
                    icon="mdi-arrow-right"
                    size="18"
                  />
                </span>
              </button>
            </div>
          </div>
        </VCol>

        <VCol
          cols="12"
          md="4"
        >
          <VCard
            variant="flat"
            border
            class="hours-card"
          >
            <VCardItem class="pb-1">
              <VCardTitle class="d-flex align-center ga-2 text-subtitle-1 font-weight-bold">
                <VIcon
                  icon="mdi-clock-outline"
                  size="20"
                  color="primary"
                />
                Opening hours
              </VCardTitle>
            </VCardItem>
            <VCardText v-if="hours">
              <div
                v-for="h in hours"
                :key="h.day"
                class="hours-row"
                :class="{ 'hours-row--today': h.isToday }"
              >
                <span>{{ h.day }}<span
                  v-if="h.isToday"
                  class="today-tag"
                >Today</span></span>
                <span :class="h.text === 'Closed' ? 'text-medium-emphasis' : 'font-weight-medium'">{{ h.text }}</span>
              </div>
            </VCardText>
            <VCardText v-else>
              Open by appointment. Pick a service to see available times.
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <BookingDialog
        v-if="selected"
        :page="page"
        :service="selected"
        @close="selected = null"
      />
    </template>
  </div>
</template>

<style scoped>
.demo-banner :deep(.v-alert__content) {
  width: 100%;
}

.business-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
  border-radius: 24px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background:
    radial-gradient(70% 120% at 100% 0%, rgba(var(--v-theme-primary), 0.12), transparent 60%),
    rgb(var(--v-theme-surface));
}

.business-avatar {
  box-shadow: 0 10px 24px -10px rgba(var(--v-theme-primary), 0.7);
  flex-shrink: 0;
}

.business-name {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.015em;
  line-height: 1.15;
}

.info-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.75);
  background: rgba(var(--v-theme-on-surface), 0.05);
  text-decoration: none;
}

a.info-pill:hover {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
}

.category-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.service-row {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 18px 20px;
  text-align: start;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
  color: inherit;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.service-row:hover,
.service-row:focus-visible {
  border-color: rgba(var(--v-theme-primary), 0.6);
  box-shadow: 0 12px 28px -18px rgba(var(--v-theme-primary), 0.6);
  transform: translateY(-1px);
  outline: none;
}

.service-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 7px;
}

.service-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-grow: 1;
  min-width: 0;
}

.service-name {
  font-size: 1rem;
  font-weight: 600;
}

.service-desc {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.service-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.service-price {
  color: rgb(var(--v-theme-on-surface));
}

.service-cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
  transition: background-color 0.15s, color 0.15s;
}

.service-row:hover .service-cta,
.service-row:focus-visible .service-cta {
  color: rgb(var(--v-theme-on-primary));
  background: rgb(var(--v-theme-primary));
}

@media (min-width: 960px) {
  .hours-card {
    position: sticky;
    top: 92px;
  }
}

.hours-row {
  display: flex;
  justify-content: space-between;
  padding: 7px 10px;
  margin: 0 -10px;
  border-radius: 10px;
  font-size: 0.875rem;
}

.hours-row--today {
  background: rgba(var(--v-theme-primary), 0.08);
  font-weight: 600;
}

.today-tag {
  margin-inline-start: 8px;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-primary));
  background: rgb(var(--v-theme-primary));
}

@media (max-width: 599px) {
  .business-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }

  .service-row {
    padding: 16px;
  }
}
</style>
