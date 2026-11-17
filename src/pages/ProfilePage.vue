<script setup lang="ts">
import { ref } from 'vue'
import { api, apiError } from '@/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const form = ref({
  name: auth.customer?.name ?? '',
  email: auth.customer?.email ?? '',
  phone: auth.customer?.phone ?? '',
  password: '',
  password_confirmation: '',
  current_password: '',
})
const saving = ref(false)
const success = ref('')
const error = ref('')
const errors = ref<Record<string, string[]>>({})

// Pick up changes made elsewhere (e.g. another device).
api.me().then(c => {
  auth.setCustomer(c)
  Object.assign(form.value, { name: c.name, email: c.email, phone: c.phone ?? '' })
}).catch(() => {})

async function save() {
  saving.value = true
  success.value = ''
  error.value = ''
  errors.value = {}

  const { password, password_confirmation, current_password, ...details } = form.value

  try {
    const updated = await api.updateMe({
      ...details,
      phone: details.phone || null,
      ...(password ? { password, password_confirmation, current_password } : {}),
    })

    auth.setCustomer(updated)
    Object.assign(form.value, { password: '', password_confirmation: '', current_password: '' })
    success.value = 'Your profile was saved.'
  }
  catch (e) {
    ({ message: error.value, errors: errors.value } = apiError(e))
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div
    class="page"
    style="max-width: 640px;"
  >
    <h1 class="text-h5 font-weight-bold mb-4">
      Profile
    </h1>

    <VAlert
      v-if="success"
      type="success"
      variant="tonal"
      closable
      class="mb-4"
      :text="success"
    />
    <VAlert
      v-if="error && !Object.keys(errors).length"
      type="error"
      variant="tonal"
      class="mb-4"
      :text="error"
    />

    <VForm @submit.prevent="save">
      <VCard
        variant="flat"
        border
        title="Your details"
        subtitle="Shared with the businesses you book with."
        class="mb-4"
      >
        <VCardText>
          <VTextField
            v-model="form.name"
            label="Full name"
            :error-messages="errors.name"
            class="mb-2"
          />
          <VTextField
            v-model="form.email"
            label="Email"
            type="email"
            :error-messages="errors.email"
            class="mb-2"
          />
          <VTextField
            v-model="form.phone"
            label="Phone"
            type="tel"
            :error-messages="errors.phone"
          />
        </VCardText>
      </VCard>

      <VCard
        variant="flat"
        border
        title="Change password"
        subtitle="Leave blank to keep your current password."
        class="mb-4"
      >
        <VCardText>
          <VTextField
            v-model="form.password"
            label="New password"
            type="password"
            autocomplete="new-password"
            :error-messages="errors.password"
            class="mb-2"
          />
          <template v-if="form.password">
            <VTextField
              v-model="form.password_confirmation"
              label="Confirm new password"
              type="password"
              autocomplete="new-password"
              class="mb-2"
            />
            <VTextField
              v-model="form.current_password"
              label="Current password"
              type="password"
              autocomplete="current-password"
              :error-messages="errors.current_password"
            />
          </template>
        </VCardText>
      </VCard>

      <VBtn
        type="submit"
        color="primary"
        variant="flat"
        size="large"
        :loading="saving"
      >
        Save changes
      </VBtn>
    </VForm>
  </div>
</template>
