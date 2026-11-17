<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiError } from '@/api'
import { safeRedirect } from '@/router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const form = ref({ name: '', email: '', phone: '', password: '', password_confirmation: '' })
const loading = ref(false)
const error = ref('')
const errors = ref<Record<string, string[]>>({})

async function submit() {
  loading.value = true
  error.value = ''
  errors.value = {}

  try {
    await auth.register({ ...form.value, phone: form.value.phone || undefined })
    router.replace(safeRedirect(route.query.redirect))
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
          Create your account
        </VCardTitle>
        <VCardSubtitle>One account for booking with any Bookly business.</VCardSubtitle>
      </VCardItem>
      <VCardText>
        <VAlert
          v-if="error && !Object.keys(errors).length"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-4"
          :text="error"
        />
        <VForm @submit.prevent="submit">
          <VTextField
            v-model="form.name"
            label="Full name"
            autocomplete="name"
            :error-messages="errors.name"
            class="mb-2"
          />
          <VTextField
            v-model="form.email"
            label="Email"
            type="email"
            autocomplete="email"
            :error-messages="errors.email"
            class="mb-2"
          />
          <VTextField
            v-model="form.phone"
            label="Phone (optional)"
            type="tel"
            autocomplete="tel"
            :error-messages="errors.phone"
            class="mb-2"
          />
          <VTextField
            v-model="form.password"
            label="Password"
            type="password"
            autocomplete="new-password"
            hint="At least 8 characters"
            :error-messages="errors.password"
            class="mb-2"
          />
          <VTextField
            v-model="form.password_confirmation"
            label="Confirm password"
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
            Sign up
          </VBtn>
        </VForm>
        <div class="text-center text-body-2 mt-4">
          Already have an account?
          <RouterLink
            :to="{ name: 'login', query: route.query }"
            class="text-primary"
          >
            Log in
          </RouterLink>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>
