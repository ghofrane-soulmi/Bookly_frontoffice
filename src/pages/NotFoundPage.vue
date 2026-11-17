<template>
  <div class="page">
    <VEmptyState
      icon="mdi-map-marker-question-outline"
      title="Page not found"
      text="The page you're looking for doesn't exist."
    >
      <template #actions>
        <VBtn
          to="/"
          color="primary"
          variant="flat"
        >
          Go home
        </VBtn>
      </template>
    </VEmptyState>
  </div>
</template>
