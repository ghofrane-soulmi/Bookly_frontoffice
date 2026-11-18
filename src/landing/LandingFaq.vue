<script setup lang="ts">
import { contactEmail, faqs } from './content'
import SectionHeading from './SectionHeading.vue'
</script>

<template>
  <section
    id="faq"
    class="landing-section landing-section--tinted"
  >
    <div class="landing-container landing-container--narrow">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        :subtitle="contactEmail ? 'Can’t find what you’re looking for? Send us a message below.' : 'The short answers to what businesses ask most.'"
      />
      <VExpansionPanels
        variant="accordion"
        class="faq"
      >
        <VExpansionPanel
          v-for="f in faqs"
          :key="f.q"
          :title="f.q"
          :text="f.a"
          elevation="0"
        />
      </VExpansionPanels>
    </div>
  </section>
</template>

<style scoped>
.faq :deep(.v-expansion-panel) {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.faq :deep(.v-expansion-panel-title) {
  font-weight: 600;
}
</style>
