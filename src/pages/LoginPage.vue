<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiError } from '@/api'
import { safeRedirect } from '@/router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const errors = ref<Record<string, string[]>>({})

async function submit() {
  loading.value = true
  error.value = ''
  errors.value = {}

  try {
    await auth.login(email.value, password.value)
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
          Welcome back
        </VCardTitle>
        <VCardSubtitle>Log in to book and manage your appointments.</VCardSubtitle>
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
            v-model="email"
            label="Email"
            type="email"
            autocomplete="email"
            :error-messages="errors.email"
            class="mb-2"
          />
          <VTextField
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            :error-messages="errors.password"
            @click:append-inner="showPassword = !showPassword"
          />
          <div class="d-flex justify-end mb-4">
            <RouterLink
              :to="{ name: 'forgot-password' }"
              class="text-body-2 text-primary"
            >
              Forgot password?
            </RouterLink>
          </div>
          <VBtn
            type="submit"
            color="primary"
            variant="flat"
            size="large"
            block
            :loading="loading"
          >
            Log in
          </VBtn>
        </VForm>
        <div class="text-center text-body-2 mt-4">
          New here?
          <RouterLink
            :to="{ name: 'register', query: route.query }"
            class="text-primary"
          >
            Create an account
          </RouterLink>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>
