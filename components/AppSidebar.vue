<template>
  <aside class="fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="flex h-full flex-col">
      <!-- Header -->
      <div class="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
            Sistema
          </h1>
        </div>
        
        <!-- Toggle Dark Mode -->
        <Button 
          variant="ghost" 
          size="sm"
          @click="mainStore.toggleDarkMode()"
          class="h-8 w-8 p-0"
        >
          <svg v-if="!mainStore.isDark" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </Button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4">
        <ul class="space-y-2">
          <li v-for="item in navigation" :key="item.name">
            <NuxtLink
              :to="item.href"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="[
                $route.path === item.href
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-700 dark:text-gray-300'
              ]"
            >
              <!-- Dashboard Icon -->
              <svg v-if="item.name === 'Dashboard'" class="h-5 w-5" :class="[
                $route.path === item.href 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
              </svg>
              
              <!-- Clientes Icon -->
              <svg v-else-if="item.name === 'Clientes'" class="h-5 w-5" :class="[
                $route.path === item.href 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              
              <!-- Productos Icon -->
              <svg v-else-if="item.name === 'Productos'" class="h-5 w-5" :class="[
                $route.path === item.href 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              
              <!-- Ventas Icon -->
              <svg v-else-if="item.name === 'Ventas'" class="h-5 w-5" :class="[
                $route.path === item.href 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              
              <!-- Evidencias Icon -->
              <svg v-else-if="item.name === 'Evidencias'" class="h-5 w-5" :class="[
                $route.path === item.href 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              
              <span>{{ item.name }}</span>
              
              <!-- Badge para notificaciones -->
              <Badge 
                v-if="item.badge" 
                variant="secondary" 
                class="ml-auto text-xs"
              >
                {{ item.badge }}
              </Badge>
            </NuxtLink>
          </li>
        </ul>

        <!-- Separador -->
        <Separator class="my-4" />

        <!-- Sección adicional -->
        <div class="space-y-2">
          <p class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Sistema
          </p>
          <div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            Versión 1.0.0
          </div>
        </div>
      </nav>

      <!-- Footer -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-4">
        <div class="flex items-center gap-3">
          <Avatar class="h-8 w-8">
            <img src="https://github.com/shadcn.png" alt="Usuario" />
          </Avatar>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              Usuario
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              admin@sistema.com
            </p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { Avatar } from '~/components/ui/avatar'

const mainStore = useMainStore()
const route = useRoute()

// Navegación
const navigation = [
  {
    name: 'Dashboard',
    href: '/',
  },
  {
    name: 'Clientes',
    href: '/clientes',
    badge: ''
  },
  {
    name: 'Productos',
    href: '/productos',
  },
  {
    name: 'Ventas',
    href: '/ventas',
  },
  {
    name: 'Evidencias',
    href: '/evidencias',
  },
]
</script>