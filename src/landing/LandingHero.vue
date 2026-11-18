<script setup lang="ts">
import { backofficeUrl, demoSlug, industries } from './content'
</script>

<template>
  <section class="hero">
    <div class="landing-container">
      <VRow
        align="center"
        class="py-md-10"
      >
        <VCol
          cols="12"
          md="6"
          class="text-center text-md-start"
        >
          <VChip
            color="primary"
            variant="tonal"
            prepend-icon="mdi-star-four-points-outline"
            class="mb-5"
          >
            Online booking for small businesses
          </VChip>
          <h1 class="hero-title mb-5">
            Your appointments,
            <span class="text-primary">booked for you</span>,
            day and night.
          </h1>
          <p class="text-h6 font-weight-regular text-medium-emphasis mb-8 hero-sub">
            Bookly gives your salon, studio or clinic a booking page, a team calendar,
            reminders and invoices &mdash; in one simple tool.
          </p>
          <div class="d-flex flex-wrap ga-3 justify-center justify-md-start">
            <VBtn
              :href="`${backofficeUrl}/register`"
              color="primary"
              variant="flat"
              size="x-large"
              append-icon="mdi-arrow-right"
            >
              Start for free
            </VBtn>
            <VBtn
              :to="{ name: 'business', params: { slug: demoSlug } }"
              variant="outlined"
              size="x-large"
              prepend-icon="mdi-play-circle-outline"
            >
              Try a live demo
            </VBtn>
          </div>
          <p class="text-body-2 text-medium-emphasis mt-4">
            Free plan forever &middot; No credit card &middot; Set up in 5 minutes
          </p>
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <div class="hero-visual">
            <div class="browser-frame">
              <div class="browser-bar">
                <span /><span /><span />
              </div>
              <img
                src="/landing/dashboard.png"
                alt="Bookly dashboard showing revenue, appointments and top services"
                width="1440"
                height="900"
              >
            </div>
            <div class="phone-frame d-none d-sm-block">
              <img
                src="/landing/mobile.png"
                alt="Bookly booking page on a phone"
                width="780"
                height="1688"
              >
            </div>
          </div>
        </VCol>
      </VRow>

      <div class="industries">
        <p class="text-overline text-medium-emphasis text-center mb-3">
          Made for appointment-based businesses
        </p>
        <div class="d-flex flex-wrap justify-center ga-2">
          <VChip
            v-for="i in industries"
            :key="i.label"
            :prepend-icon="i.icon"
            variant="outlined"
            size="large"
          >
            {{ i.label }}
          </VChip>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 48px 0 56px;
  background:
    radial-gradient(60% 60% at 85% 10%, rgba(var(--v-theme-primary), 0.14), transparent 70%),
    radial-gradient(50% 50% at 0% 100%, rgba(var(--v-theme-info), 0.10), transparent 70%);
}

.hero-title {
  font-size: clamp(2.1rem, 4.6vw, 3.4rem);
  line-height: 1.12;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.hero-sub {
  max-width: 540px;
  text-wrap: pretty;
}

@media (max-width: 959px) {
  .hero-sub { margin-inline: auto; }
}

.hero-visual {
  position: relative;
  padding-bottom: 24px;
}

.browser-frame {
  border-radius: 14px;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 24px 60px -20px rgba(30, 30, 80, 0.35);
}

.browser-bar {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.browser-bar span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(var(--v-theme-on-surface), 0.15);
}

.browser-frame img,
.phone-frame img {
  display: block;
  width: 100%;
  height: auto;
}

.phone-frame {
  position: absolute;
  right: -12px;
  bottom: -8px;
  width: 26%;
  border-radius: 22px;
  overflow: hidden;
  border: 6px solid #1c1c24;
  box-shadow: 0 20px 40px -12px rgba(30, 30, 80, 0.45);
}

.industries {
  margin-top: 40px;
}
</style>
