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

      <div class="d-flex justify-center mb-8">
        <VBtnToggle
          v-model="tab"
          mandatory
          color="primary"
          variant="outlined"
          divided
          rounded="lg"
          class="showcase-toggle"
        >
          <VBtn
            v-for="s in showcase"
            :key="s.value"
            :value="s.value"
            :prepend-icon="s.icon"
          >
            <span class="d-none d-sm-inline">{{ s.label }}</span>
          </VBtn>
        </VBtnToggle>
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
.showcase-toggle {
  max-width: 100%;
  overflow-x: auto;
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
