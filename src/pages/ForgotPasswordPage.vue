<script setup lang="ts">
import { ref } from 'vue'
import { api, apiError } from '@/api'

const email = ref('')
const loading = ref(false)
const message = ref('')
const errors = ref<Record<string, string[]>>({})

async function submit() {
  loading.value = true
  errors.value = {}

  try {
    message.value = await api.forgotPassword(email.value)
  }
  catch (e) {
    errors.value = apiError(e).errors
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-narrow">
    <VCard
      variant="flat"
      border
      class="pa-4"
    >
      <VCardItem>
        <VCardTitle class="text-h5 font-weight-bold">
          Forgot your password?
        </VCardTitle>
        <VCardSubtitle>We'll email you a link to choose a new one.</VCardSubtitle>
      </VCardItem>
      <VCardText>
        <VAlert
          v-if="message"
          type="success"
          variant="tonal"
          :text="message"
        />
        <VForm
          v-else
          @submit.prevent="submit"
        >
          <VTextField
            v-model="email"
            label="Email"
            type="email"
            autocomplete="email"
            :error-messages="errors.email"
            class="mb-4"
          />
          <VBtn
            type="submit"
            color="primary"
            variant="flat"
            size="large"
            block
            :loading="loading"
          >
            Send reset link
          </VBtn>
        </VForm>
        <div class="text-center text-body-2 mt-4">
          <RouterLink
            :to="{ name: 'login' }"
            class="text-primary"
          >
            Back to log in
          </RouterLink>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>
