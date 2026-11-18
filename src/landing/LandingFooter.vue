<script setup lang="ts">
import { backofficeUrl, contactEmail, demoSlug, navSections } from './content'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="landing-footer">
    <div class="landing-container">
      <VRow>
        <VCol
          cols="12"
          md="5"
        >
          <div class="d-flex align-center mb-3">
            <VAvatar
              color="primary"
              size="32"
              rounded="lg"
              class="me-2 font-weight-bold"
            >
              B
            </VAvatar>
            <span class="text-h6 font-weight-bold">Bookly</span>
          </div>
          <p class="text-body-2 text-medium-emphasis footer-blurb">
            Online booking, calendar, reminders and invoices for salons, studios and clinics.
          </p>
        </VCol>
        <VCol
          cols="6"
          md="2"
        >
          <h4 class="footer-heading">
            Product
          </h4>
          <RouterLink
            v-for="s in navSections"
            :key="s.id"
            :to="{ path: '/', hash: `#${s.id}` }"
            class="footer-link"
          >
            {{ s.label }}
          </RouterLink>
        </VCol>
        <VCol
          cols="6"
          md="2"
        >
          <h4 class="footer-heading">
            For businesses
          </h4>
          <a
            :href="`${backofficeUrl}/register`"
            class="footer-link"
          >Create an account</a>
          <a
            :href="`${backofficeUrl}/login`"
            class="footer-link"
          >Business login</a>
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <h4 class="footer-heading">
            For clients
          </h4>
          <RouterLink
            :to="{ name: 'business', params: { slug: demoSlug } }"
            class="footer-link"
          >
            Demo booking page
          </RouterLink>
          <RouterLink
            :to="{ name: 'my-bookings' }"
            class="footer-link"
          >
            My bookings
          </RouterLink>
          <a
            v-if="contactEmail"
            :href="`mailto:${contactEmail}`"
            class="footer-link"
          >{{ contactEmail }}</a>
        </VCol>
      </VRow>
      <VDivider class="my-6" />
      <p class="text-body-2 text-medium-emphasis text-center mb-0">
        &copy; {{ year }} Bookly. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.landing-footer {
  padding: 56px 0 32px;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
}

.footer-blurb {
  max-width: 320px;
}

.footer-heading {
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.footer-link {
  display: block;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  text-decoration: none;
  margin-bottom: 8px;
}

.footer-link:hover {
  color: rgb(var(--v-theme-primary));
}
</style>
