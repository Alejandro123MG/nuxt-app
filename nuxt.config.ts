// https://nuxt.com/docs/api/configuration/nuxt-config

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  typescript: {
    typeCheck: false
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image-edge',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
     [
      '@nuxtjs/color-mode',
      {
        preference: 'system', // default value
        fallback: 'light',    // fallback value if not system preference found
        classSuffix: ''       // default: '-mode'
      }
    ]
  ]
  ,
  shadcn: {
    prefix: '', // Puedes usar 'Ui' si prefieres nombres como UiButton
    componentDir: './components/ui' // Carpeta donde se copiarán los componentes
  
  },

  css: [
    '~/assets/css/app.css'
    , '@/assets/css/tailwind.css'
  ],
  

  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB: process.env.MONGO_DB,

    public: {
      siteUrl: "http://localhost:3000"
    }
  },

  image: {
    format: ['webp', 'png', 'jpeg']
  }
})