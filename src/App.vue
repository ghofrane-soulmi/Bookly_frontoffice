<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import LandingFooter from './landing/LandingFooter.vue'
import { backofficeUrl, navSections } from './landing/content'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const theme = useTheme()
const drawer = ref(false)

const isDark = computed(() => theme.global.current.value.dark)
const initials = computed(() => (auth.customer?.name ?? '?')
  .split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join(''))

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

async function logout() {
  await auth.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <VApp>
    <VNavigationDrawer
      v-model="drawer"
      temporary
      location="left"
      width="280"
    >
      <div class="pa-5 d-flex align-center">
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
      <VList
        nav
        density="comfortable"
        class="px-3"
      >
        <VListItem
          v-for="s in navSections"
          :key="s.id"
          :to="{ path: '/', hash: `#${s.id}` }"
          :title="s.label"
          rounded="lg"
          active-class="no-active"
          @click="drawer = false"
        />
        <VDivider class="my-3" />
        <VListItem
          :href="`${backofficeUrl}/login`"
          prepend-icon="mdi-briefcase-outline"
          title="For businesses"
          rounded="lg"
        />
      </VList>
    </VNavigationDrawer>

    <VAppBar
      flat
      height="68"
      class="app-bar"
    >
      <div class="app-bar__inner">
        <VAppBarNavIcon
          class="d-md-none me-1"
          aria-label="Open menu"
          @click="drawer = !drawer"
        />

        <RouterLink
          to="/"
          class="brand"
        >
          <VAvatar
            color="primary"
            size="34"
            rounded="lg"
            class="me-2 font-weight-bold"
          >
            B
          </VAvatar>
          <span class="text-h6 font-weight-bold">Bookly</span>
        </RouterLink>

        <nav
          class="nav-links d-none d-md-flex"
          aria-label="Sections"
        >
          <RouterLink
            v-for="s in navSections"
            :key="s.id"
            :to="{ path: '/', hash: `#${s.id}` }"
            class="nav-link"
            active-class=""
            exact-active-class=""
          >
            {{ s.label }}
          </RouterLink>
        </nav>

        <VSpacer />

        <div class="bar-actions">
          <VBtn
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            variant="text"
            size="40"
            rounded="circle"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          />

          <VBtn
            :href="`${backofficeUrl}/login`"
            variant="text"
            prepend-icon="mdi-briefcase-outline"
            class="d-none d-lg-flex"
          >
            For businesses
          </VBtn>

          <VDivider
            vertical
            class="mx-2 my-auto d-none d-lg-flex"
            length="24"
          />

          <template v-if="auth.isLoggedIn">
            <VBtn
              :to="{ name: 'my-bookings' }"
              variant="tonal"
              color="primary"
              prepend-icon="mdi-calendar-check-outline"
              class="d-none d-sm-flex"
            >
              My bookings
            </VBtn>
            <VMenu
              location="bottom end"
              offset="10"
            >
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  icon
                  variant="text"
                  size="44"
                  rounded="circle"
                  aria-label="Account menu"
                >
                  <VAvatar
                    color="primary"
                    size="36"
                    class="text-body-2 font-weight-bold"
                  >
                    {{ initials }}
                  </VAvatar>
                </VBtn>
              </template>
              <VCard
                min-width="260"
                class="account-menu"
              >
                <div class="d-flex align-center pa-4">
                  <VAvatar
                    color="primary"
                    size="40"
                    class="me-3 text-body-1 font-weight-bold"
                  >
                    {{ initials }}
                  </VAvatar>
                  <div class="text-truncate">
                    <div class="text-body-1 font-weight-bold text-truncate">
                      {{ auth.customer?.name }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis text-truncate">
                      {{ auth.customer?.email }}
                    </div>
                  </div>
                </div>
                <VDivider />
                <VList
                  density="comfortable"
                  class="pa-2"
                >
                  <VListItem
                    :to="{ name: 'my-bookings' }"
                    prepend-icon="mdi-calendar-check-outline"
                    title="My bookings"
                    rounded="lg"
                  />
                  <VListItem
                    :to="{ name: 'profile' }"
                    prepend-icon="mdi-account-cog-outline"
                    title="Profile"
                    rounded="lg"
                  />
                  <VListItem
                    prepend-icon="mdi-logout"
                    title="Log out"
                    rounded="lg"
                    base-color="error"
                    @click="logout"
                  />
                </VList>
              </VCard>
            </VMenu>
          </template>
          <template v-else>
            <VBtn
              :to="{ name: 'login', query: { redirect: route.fullPath } }"
              variant="text"
            >
              Log in
            </VBtn>
            <VBtn
              :to="{ name: 'register', query: { redirect: route.fullPath } }"
              color="primary"
              variant="flat"
            >
              Sign up
            </VBtn>
          </template>
        </div>
      </div>
    </VAppBar>

    <VMain>
      <RouterView />
    </VMain>

    <LandingFooter />
  </VApp>
</template>

<style scoped>
.app-bar {
  background: rgba(var(--v-theme-surface), 0.82) !important;
  backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
}

.app-bar__inner {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.brand {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

.nav-links {
  align-items: center;
  gap: 4px;
  margin-inline-start: 32px;
}

.nav-link {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.7);
  text-decoration: none;
  transition: color 0.15s, background-color 0.15s;
}

.nav-link:hover,
.nav-link:focus-visible {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
  outline: none;
}

.bar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-menu :deep(.v-list-item-title) {
  text-transform: none;
  letter-spacing: normal;
}
</style>
