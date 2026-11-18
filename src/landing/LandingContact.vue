<script setup lang="ts">
import { ref } from 'vue'
import { backofficeUrl, contactEmail, demoSlug } from './content'
import SectionHeading from './SectionHeading.vue'

const form = ref({ name: '', business: '', message: '' })

// No contact endpoint on the API yet: hand the message to the visitor's
// own mail app, pre-filled, rather than pretending it was sent.
function send() {
  const subject = `Bookly enquiry${form.value.business ? ` — ${form.value.business}` : ''}`
  const body = `${form.value.message}\n\n${form.value.name}`
  window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
</script>

<template>
  <section
    id="contact"
    class="landing-section"
  >
    <div class="landing-container">
      <VCard
        color="primary"
        variant="flat"
        class="cta pa-8 pa-md-12 mb-16 text-center"
      >
        <h2 class="cta-title mb-3">
          Ready to take bookings online?
        </h2>
        <p class="text-body-1 mb-8 cta-sub mx-auto">
          Create your business in minutes, or try the demo salon as a client first.
        </p>
        <div class="d-flex flex-wrap justify-center ga-3">
          <VBtn
            :href="`${backofficeUrl}/register`"
            color="white"
            variant="flat"
            size="x-large"
            class="text-primary"
          >
            Start for free
          </VBtn>
          <VBtn
            :to="{ name: 'business', params: { slug: demoSlug } }"
            color="white"
            variant="outlined"
            size="x-large"
          >
            Book at the demo salon
          </VBtn>
        </div>
      </VCard>

      <SectionHeading
        eyebrow="Contact"
        title="Let's talk about your business"
        :subtitle="contactEmail ? 'Questions about plans, setup or moving from another tool? We usually reply within a day.' : 'Try the demo salon as a client, or open the back office and look around.'"
      />

      <VRow justify="center">
        <VCol
          cols="12"
          md="4"
        >
          <VCard
            variant="flat"
            border
            class="pa-6 h-100"
          >
            <VList class="bg-transparent pa-0">
              <VListItem
                v-if="contactEmail"
                prepend-icon="mdi-email-outline"
                title="Email"
                :subtitle="contactEmail"
                :href="`mailto:${contactEmail}`"
                class="px-0"
              />
              <VListItem
                prepend-icon="mdi-map-marker-outline"
                title="Based in"
                subtitle="Tunis, Tunisia"
                class="px-0"
              />
              <VListItem
                prepend-icon="mdi-briefcase-outline"
                title="Already a customer?"
                subtitle="Log in to your back office"
                :href="`${backofficeUrl}/login`"
                class="px-0"
              />
            </VList>
          </VCard>
        </VCol>
        <VCol
          v-if="contactEmail"
          cols="12"
          md="6"
        >
          <VCard
            variant="flat"
            border
            class="pa-6"
          >
            <VForm @submit.prevent="send">
              <VRow>
                <VCol
                  cols="12"
                  sm="6"
                >
                  <VTextField
                    v-model="form.name"
                    label="Your name"
                    hide-details="auto"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="6"
                >
                  <VTextField
                    v-model="form.business"
                    label="Business name"
                    hide-details="auto"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextarea
                    v-model="form.message"
                    label="Message"
                    rows="4"
                    :rules="[v => !!v || 'Please write a message']"
                    hide-details="auto"
                  />
                </VCol>
                <VCol cols="12">
                  <VBtn
                    type="submit"
                    color="primary"
                    variant="flat"
                    size="large"
                    append-icon="mdi-send"
                    :disabled="!form.message"
                  >
                    Send message
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </section>
</template>

<style scoped>
.cta {
  border-radius: 24px !important;
  background-image:
    radial-gradient(50% 80% at 100% 0%, rgba(255, 255, 255, 0.18), transparent 70%),
    radial-gradient(40% 60% at 0% 100%, rgba(255, 255, 255, 0.12), transparent 70%);
}

.cta-title {
  font-size: clamp(1.6rem, 3.4vw, 2.4rem);
  font-weight: 800;
  text-wrap: balance;
}

.cta-sub {
  max-width: 520px;
  opacity: 0.9;
}
</style>
