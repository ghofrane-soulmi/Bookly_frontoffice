<script setup lang="ts">
import { features, steps } from './content'
import SectionHeading from './SectionHeading.vue'
</script>

<template>
  <section
    id="features"
    class="landing-section"
  >
    <div class="landing-container">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need to run your bookings"
        subtitle="From the first click on your booking page to the final invoice, Bookly handles the busywork so you can focus on your clients."
      />

      <VRow>
        <VCol
          v-for="f in features"
          :key="f.title"
          cols="12"
          sm="6"
          lg="3"
        >
          <div class="feature h-100">
            <VAvatar
              color="primary"
              variant="tonal"
              rounded="lg"
              size="48"
              class="mb-4"
            >
              <VIcon
                :icon="f.icon"
                size="26"
              />
            </VAvatar>
            <h3 class="text-subtitle-1 font-weight-bold mb-1">
              {{ f.title }}
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ f.text }}
            </p>
          </div>
        </VCol>
      </VRow>

      <div class="steps mt-16">
        <h3 class="text-h5 font-weight-bold text-center mb-8">
          Up and running in three steps
        </h3>
        <VRow>
          <VCol
            v-for="(s, i) in steps"
            :key="s.title"
            cols="12"
            md="4"
          >
            <VCard
              variant="flat"
              border
              class="h-100 pa-6 step"
            >
              <div class="step-number">
                {{ i + 1 }}
              </div>
              <VIcon
                :icon="s.icon"
                color="primary"
                size="32"
                class="mb-3"
              />
              <h4 class="text-h6 font-weight-bold mb-2">
                {{ s.title }}
              </h4>
              <p class="text-body-2 text-medium-emphasis mb-0">
                {{ s.text }}
              </p>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature {
  padding: 8px 4px;
}

.step {
  position: relative;
  overflow: hidden;
}

.step-number {
  position: absolute;
  top: -10px;
  right: 12px;
  font-size: 5.5rem;
  font-weight: 800;
  line-height: 1;
  color: rgba(var(--v-theme-primary), 0.08);
  pointer-events: none;
}
</style>
