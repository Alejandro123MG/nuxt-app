import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', () => {
  // Modo oscuro
  const isDark = ref(false)

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }


  return { isDark, toggleDarkMode }
})
