<script setup lang="ts">
import { computed, ref } from 'vue'
import { highlights, showcase } from './content'
import SectionHeading from './SectionHeading.vue'

const tab = ref(showcase[0].value)
const current = computed(() => showcase.find(s => s.value === tab.value) ?? showcase[0])
</script>

<template>
  <section
    id="product"
    class="landing-section landing-section--tinted"
  >
    <div class="landing-container">
      <SectionHeading
        eyebrow="Product tour"
        title="One tool for you, your team and your clients"
        subtitle="A back office for your business and a booking page for your clients, always in sync."
      />

      <div class="d-flex justify-center mb-10">
        <div
          class="segmented"
          role="tablist"
          aria-label="Product screens"
        >
          <button
            v-for="s in showcase"
            :key="s.value"
            type="button"
            role="tab"
            class="segmented__item"
            :class="{ 'segmented__item--active': tab === s.value }"
            :aria-selected="tab === s.value"
            :aria-label="s.label"
            @click="tab = s.value"
          >
            <VIcon
              :icon="s.icon"
              size="18"
            />
            <span class="d-none d-sm-inline">{{ s.label }}</span>
          </button>
        </div>
      </div>

      <VRow align="center">
        <VCol
          cols="12"
          md="4"
          class="text-center text-md-start"
        >
          <h3 class="text-h5 font-weight-bold mb-3">
            {{ current.title }}
          </h3>
          <p class="text-body-1 text-medium-emphasis">
            {{ current.text }}
          </p>
        </VCol>
        <VCol
          cols="12"
          md="8"
        >
          <VFadeTransition mode="out-in">
            <img
              :key="current.value"
              :src="current.image"
              :alt="`${current.label} screenshot`"
              class="showcase-image"
              loading="lazy"
            >
          </VFadeTransition>
        </VCol>
      </VRow>

      <VRow class="mt-12">
        <VCol
          v-for="h in highlights"
          :key="h.label"
          cols="6"
          md="3"
          class="text-center"
        >
          <div class="highlight-value text-primary">
            {{ h.value }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ h.label }}
          </div>
        </VCol>
      </VRow>
    </div>
  </section>
</template>

<style scoped>
.segmented {
  display: inline-flex;
  gap: 4px;
  padding: 5px;
  max-width: 100%;
  overflow-x: auto;
  border-radius: 999px;
  background: rgba(var(--v-theme-on-surface), 0.05);
  border: 1px solid rgba(var(--v-border-color), 0.08);
}

.segmented__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
  color: rgba(var(--v-theme-on-surface), 0.65);
  transition: color 0.15s, background-color 0.15s, box-shadow 0.15s;
}

.segmented__item:hover {
  color: rgb(var(--v-theme-on-surface));
}

.segmented__item:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.segmented__item--active {
  color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 1px 2px rgba(20, 20, 50, 0.08), 0 4px 12px -4px rgba(20, 20, 50, 0.12);
}

.showcase-image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 14px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 24px 60px -24px rgba(30, 30, 80, 0.35);
  background: rgb(var(--v-theme-surface));
}

.highlight-value {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.1;
}
</style>
