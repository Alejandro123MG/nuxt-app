<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Main Content -->
    <main class="flex-1 ml-64 transition-all duration-300">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '~/components/AppSidebar.vue'

// Aplicar el modo oscuro inicial
const mainStore = useMainStore()

onMounted(() => {
  // Aplicar la clase dark si está activo
  if (mainStore.isDark) {
    document.documentElement.classList.add('dark')
  }
})
</script>