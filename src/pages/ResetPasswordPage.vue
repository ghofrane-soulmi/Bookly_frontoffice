<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { api, apiError } from '@/api'

const route = useRoute()

const password = ref('')
const confirmation = ref('')
const loading = ref(false)
const done = ref('')
const error = ref('')
const errors = ref<Record<string, string[]>>({})

async function submit() {
  loading.value = true
  error.value = ''
  errors.value = {}

  try {
    done.value = await api.resetPassword({
      email: String(route.query.email ?? ''),
      token: String(route.query.token ?? ''),
      password: password.value,
      password_confirmation: confirmation.value,
    })
  }
  catch (e) {
    ({ message: error.value, errors: errors.value } = apiError(e))
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
          Choose a new password
        </VCardTitle>
        <VCardSubtitle>{{ route.query.email }}</VCardSubtitle>
      </VCardItem>
      <VCardText>
        <template v-if="done">
          <VAlert
            type="success"
            variant="tonal"
            :text="done"
            class="mb-4"
          />
          <VBtn
            :to="{ name: 'login' }"
            color="primary"
            variant="flat"
            block
          >
            Log in
          </VBtn>
        </template>
        <VForm
          v-else
          @submit.prevent="submit"
        >
          <VAlert
            v-if="error && !Object.keys(errors).length"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
            :text="error"
          />
          <VTextField
            v-model="password"
            label="New password"
            type="password"
            autocomplete="new-password"
            :error-messages="errors.password"
            class="mb-2"
          />
          <VTextField
            v-model="confirmation"
            label="Confirm new password"
            type="password"
            autocomplete="new-password"
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
            Reset password
          </VBtn>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>
