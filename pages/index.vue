<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
      Dashboard
    </h1>
    <p class="text-gray-600 dark:text-gray-300">
      Bienvenido al sistema de gestión
    </p>
    
    <!-- Cards de resumen -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Clientes</h3>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">0</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Productos</h3>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">0</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ventas</h3>
        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">0</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Evidencias</h3>
        <p class="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Definir el layout
definePageMeta({
  layout: 'default'
})
</script>