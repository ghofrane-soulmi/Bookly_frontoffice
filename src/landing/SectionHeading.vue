<script setup lang="ts">
defineProps<{ eyebrow: string, title: string, subtitle?: string }>()
</script>

<template>
  <div class="section-heading text-center mb-10">
    <VChip
      color="primary"
      variant="tonal"
      size="small"
      class="mb-3 font-weight-medium"
    >
      {{ eyebrow }}
    </VChip>
    <h2 class="section-title mb-3">
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="text-body-1 text-medium-emphasis mx-auto"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<style scoped>
.section-title {
  font-size: clamp(1.6rem, 3.2vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.015em;
  text-wrap: balance;
}

.section-heading p {
  max-width: 600px;
  text-wrap: pretty;
}
</style>
