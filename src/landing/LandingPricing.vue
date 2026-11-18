<script setup lang="ts">
import { ref } from 'vue'
import { backofficeUrl, currency, plans } from './content'
import SectionHeading from './SectionHeading.vue'

const yearly = ref(false)
</script>

<template>
  <section
    id="pricing"
    class="landing-section"
  >
    <div class="landing-container">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple plans that grow with you"
        subtitle="Start free and upgrade when your team grows. All plans include your own booking page."
      />

      <div class="d-flex align-center justify-center ga-3 mb-10">
        <span :class="yearly ? 'text-medium-emphasis' : 'font-weight-bold'">Monthly</span>
        <VSwitch
          v-model="yearly"
          color="primary"
          hide-details
          inset
          density="compact"
          class="flex-grow-0"
          aria-label="Bill yearly"
        />
        <span :class="yearly ? 'font-weight-bold' : 'text-medium-emphasis'">Yearly</span>
        <VChip
          color="success"
          variant="tonal"
          size="small"
        >
          2 months free
        </VChip>
      </div>

      <VRow justify="center">
        <VCol
          v-for="p in plans"
          :key="p.name"
          cols="12"
          sm="8"
          md="4"
        >
          <VCard
            :variant="p.popular ? 'elevated' : 'flat'"
            :border="!p.popular"
            :elevation="p.popular ? 12 : 0"
            class="h-100 pa-6 d-flex flex-column plan"
            :class="{ 'plan--popular': p.popular }"
          >
            <div class="d-flex align-center justify-space-between mb-1">
              <h3 class="text-h6 font-weight-bold">
                {{ p.name }}
              </h3>
              <VChip
                v-if="p.popular"
                color="primary"
                size="small"
                variant="flat"
              >
                Most popular
              </VChip>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-5">
              {{ p.tagline }}
            </p>
            <div class="d-flex align-end mb-6">
              <span class="price">{{ yearly ? p.yearly : p.monthly }}</span>
              <span class="text-body-1 text-medium-emphasis ms-2 mb-2">
                {{ currency }} / {{ yearly ? 'year' : 'month' }}
              </span>
            </div>
            <VList
              density="compact"
              class="bg-transparent pa-0 mb-6 flex-grow-1"
            >
              <VListItem
                v-for="f in p.features"
                :key="f"
                class="px-0"
                min-height="32"
              >
                <template #prepend>
                  <VIcon
                    icon="mdi-check-circle"
                    color="success"
                    size="20"
                    class="me-2"
                  />
                </template>
                <span class="text-body-2">{{ f }}</span>
              </VListItem>
            </VList>
            <VBtn
              :href="`${backofficeUrl}/register`"
              :color="p.popular ? 'primary' : undefined"
              :variant="p.popular ? 'flat' : 'outlined'"
              size="large"
              block
            >
              {{ p.cta }}
            </VBtn>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </section>
</template>

<style scoped>
.price {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.plan--popular {
  border: 2px solid rgb(var(--v-theme-primary));
}
</style>
