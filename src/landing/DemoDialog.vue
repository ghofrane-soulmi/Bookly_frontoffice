<script setup lang="ts">
import { backofficeUrl, demoSlug } from './content'

// The live demo has two sides, so let visitors pick which one they want to
// see instead of dropping them on a list of services without explanation.
const open = defineModel<boolean>({ default: false })
</script>

<template>
  <VDialog
    v-model="open"
    max-width="720"
  >
    <VCard class="pa-2 pa-sm-4">
      <VCardItem>
        <VCardTitle class="text-h5 font-weight-bold text-wrap">
          Explore the live demo
        </VCardTitle>
        <VCardSubtitle class="text-wrap opacity-100 text-medium-emphasis">
          "Demo Salon" is a sample business with real data. Pick the side you want to see.
        </VCardSubtitle>
        <template #append>
          <VBtn
            icon="mdi-close"
            variant="text"
            aria-label="Close"
            @click="open = false"
          />
        </template>
      </VCardItem>

      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <RouterLink
              :to="{ name: 'business', params: { slug: demoSlug } }"
              class="demo-option"
              @click="open = false"
            >
              <VAvatar
                color="primary"
                variant="tonal"
                rounded="lg"
                size="48"
                class="mb-4"
              >
                <VIcon icon="mdi-account-outline" />
              </VAvatar>
              <div class="text-subtitle-1 font-weight-bold mb-1">
                As a client
              </div>
              <p class="text-body-2 text-medium-emphasis mb-4">
                The salon's public booking page: pick a service, a time, and book a test appointment.
              </p>
              <span class="demo-link">Open booking page <VIcon
                icon="mdi-arrow-right"
                size="18"
              /></span>
            </RouterLink>
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <a
              :href="`${backofficeUrl}/login?demo=1`"
              class="demo-option"
            >
              <VAvatar
                color="primary"
                variant="tonal"
                rounded="lg"
                size="48"
                class="mb-4"
              >
                <VIcon icon="mdi-view-dashboard-outline" />
              </VAvatar>
              <div class="text-subtitle-1 font-weight-bold mb-1">
                As the business owner
              </div>
              <p class="text-body-2 text-medium-emphasis mb-4">
                The back office: dashboard, calendar, clients, staff and invoices. Login is filled in for you.
              </p>
              <span class="demo-link">Open dashboard <VIcon
                icon="mdi-arrow-right"
                size="18"
              /></span>
            </a>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>
.demo-option {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  color: inherit;
  text-decoration: none;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.demo-option:hover,
.demo-option:focus-visible {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 12px 32px -16px rgba(var(--v-theme-primary), 0.5);
  transform: translateY(-2px);
  outline: none;
}

.demo-option p {
  flex-grow: 1;
}

.demo-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}
</style>
