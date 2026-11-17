<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()
const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

async function logout() {
  await auth.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <VApp>
    <VAppBar
      flat
      border="b"
      density="comfortable"
    >
      <RouterLink
        to="/"
        class="d-flex align-center text-decoration-none ms-4"
        style="color: inherit;"
      >
        <VAvatar
          color="primary"
          size="30"
          rounded="lg"
          class="me-2 font-weight-bold"
        >
          B
        </VAvatar>
        <span class="text-h6 font-weight-bold">Bookly</span>
      </RouterLink>

      <VSpacer />

      <VBtn
        icon="mdi-theme-light-dark"
        variant="text"
        aria-label="Toggle dark mode"
        @click="toggleTheme"
      />

      <template v-if="auth.isLoggedIn">
        <VBtn
          :to="{ name: 'my-bookings' }"
          variant="text"
          prepend-icon="mdi-calendar-check"
          class="d-none d-sm-flex"
        >
          My bookings
        </VBtn>
        <VMenu>
          <template #activator="{ props }">
            <VBtn
              v-bind="props"
              variant="text"
              class="me-2"
            >
              <VAvatar
                color="primary"
                variant="tonal"
                size="30"
              >
                {{ auth.customer?.name?.charAt(0).toUpperCase() }}
              </VAvatar>
            </VBtn>
          </template>
          <VList density="compact">
            <VListItem
              :title="auth.customer?.name"
              :subtitle="auth.customer?.email"
            />
            <VDivider />
            <VListItem
              :to="{ name: 'my-bookings' }"
              prepend-icon="mdi-calendar-check"
              title="My bookings"
            />
            <VListItem
              :to="{ name: 'profile' }"
              prepend-icon="mdi-account-cog"
              title="Profile"
            />
            <VListItem
              prepend-icon="mdi-logout"
              title="Log out"
              @click="logout"
            />
          </VList>
        </VMenu>
      </template>
      <template v-else>
        <VBtn
          :to="{ name: 'login', query: { redirect: $route.fullPath } }"
          variant="text"
        >
          Log in
        </VBtn>
        <VBtn
          :to="{ name: 'register', query: { redirect: $route.fullPath } }"
          color="primary"
          variant="flat"
          class="me-4"
        >
          Sign up
        </VBtn>
      </template>
    </VAppBar>

    <VMain>
      <RouterView />
    </VMain>

    <VFooter
      class="justify-center text-medium-emphasis text-body-2"
      color="transparent"
    >
      Bookly · online booking for small businesses
    </VFooter>
  </VApp>
</template>
