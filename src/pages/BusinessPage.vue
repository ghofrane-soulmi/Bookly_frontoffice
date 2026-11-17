<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'
import BookingDialog from '@/components/BookingDialog.vue'
import { formatDuration, formatMoney } from '@/format'
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

  return WEEKDAYS.map(day => ({
    day: day.charAt(0).toUpperCase() + day.slice(1),
    text: configured[day]?.open && configured[day]?.close
      ? `${configured[day]!.open} – ${configured[day]!.close}`
      : 'Closed',
  }))
})
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
      <VCard
        class="mb-6 pa-2"
        variant="flat"
        border
      >
        <VCardItem>
          <template #prepend>
            <VAvatar
              color="primary"
              size="56"
              rounded="lg"
              class="text-h5 font-weight-bold"
            >
              {{ page.business.name.charAt(0).toUpperCase() }}
            </VAvatar>
          </template>
          <VCardTitle class="text-h5 font-weight-bold text-wrap">
            {{ page.business.name }}
          </VCardTitle>
          <VCardSubtitle class="d-flex flex-wrap ga-4 mt-1 opacity-100">
            <span v-if="page.business.phone"><VIcon
              icon="mdi-phone-outline"
              size="16"
            /> {{ page.business.phone }}</span>
            <span v-if="page.business.email"><VIcon
              icon="mdi-email-outline"
              size="16"
            /> {{ page.business.email }}</span>
            <span><VIcon
              icon="mdi-earth"
              size="16"
            /> Times shown in {{ page.business.timezone }}</span>
          </VCardSubtitle>
        </VCardItem>
      </VCard>

      <VRow>
        <VCol
          cols="12"
          md="8"
        >
          <h2 class="text-h6 font-weight-bold mb-3">
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
            <div class="text-overline text-medium-emphasis mb-1">
              {{ category }}
            </div>
            <VCard
              variant="flat"
              border
            >
              <template
                v-for="(service, i) in services"
                :key="service.id"
              >
                <VDivider v-if="i" />
                <VListItem
                  class="py-4"
                  lines="three"
                >
                  <template #prepend>
                    <div
                      class="me-3 rounded-pill"
                      :style="{ width: '4px', alignSelf: 'stretch', background: service.color || 'rgb(var(--v-theme-primary))' }"
                    />
                  </template>
                  <VListItemTitle class="font-weight-medium">
                    {{ service.name }}
                  </VListItemTitle>
                  <VListItemSubtitle v-if="service.description">
                    {{ service.description }}
                  </VListItemSubtitle>
                  <div class="text-body-2 text-medium-emphasis mt-1">
                    <VIcon
                      icon="mdi-clock-outline"
                      size="14"
                    /> {{ formatDuration(service.duration_minutes) }}
                    <template v-if="service.price">
                      · <strong class="text-high-emphasis">{{ formatMoney(service.price, page.business.locale) }}</strong>
                    </template>
                  </div>
                  <template #append>
                    <VBtn
                      color="primary"
                      variant="flat"
                      @click="selected = service"
                    >
                      Book
                    </VBtn>
                  </template>
                </VListItem>
              </template>
            </VCard>
          </div>
        </VCol>

        <VCol
          cols="12"
          md="4"
        >
          <VCard
            variant="flat"
            border
            title="Opening hours"
            prepend-icon="mdi-clock-outline"
          >
            <VCardText v-if="hours">
              <div
                v-for="h in hours"
                :key="h.day"
                class="d-flex justify-space-between py-1 text-body-2"
              >
                <span>{{ h.day }}</span>
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
