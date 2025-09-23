<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Clientes</h1>
        <p class="text-gray-600 dark:text-gray-400">Administra la información de tus clientes</p>
      </div>
      <button 
        @click="mostrarFormulario = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        + Nuevo Cliente
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Total Clientes</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ clientes.length }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Nuevos Este Mes</h3>
        <p class="text-2xl font-bold text-green-600">{{ clientesNuevosMes }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Activos</h3>
        <p class="text-2xl font-bold text-blue-600">{{ clientes.length }}</p>
      </div>
    </div>

    <!-- Tabla de Clientes -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Lista de Clientes</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">ID</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Nombre</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Email</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Teléfono</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Registro</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="cliente in clientes" :key="cliente._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{{ cliente._id }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                {{ cliente.nombre }} {{ cliente.apellido }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ cliente.email }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ cliente.telefono }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {{ formatearFecha(cliente.fecha_registro) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal/Formulario Nuevo Cliente -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nuevo Cliente</h3>
        
        <form @submit.prevent="crearCliente" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
            <input 
              v-model="nuevoCliente.nombre"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
            <input 
              v-model="nuevoCliente.apellido"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input 
              v-model="nuevoCliente.email"
              type="email" 
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
            <input 
              v-model="nuevoCliente.telefono"
              type="tel" 
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="submit"
              :disabled="guardando"
              class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg transition-colors"
            >
              {{ guardando ? 'Guardando...' : 'Crear Cliente' }}
            </button>
            <button 
              type="button"
              @click="cerrarFormulario"
              class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Datos reactivos
const clientes = ref([])
const mostrarFormulario = ref(false)
const guardando = ref(false)
const nuevoCliente = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: ''
})

// Cargar clientes al montar el componente
onMounted(async () => {
  await cargarClientes()
})

// Funciones
async function cargarClientes() {
  try {
    const data = await $fetch('/api/clientes')
    clientes.value = data
  } catch (error) {
    console.error('Error al cargar clientes:', error)
  }
}

async function crearCliente() {
  guardando.value = true
  try {
    await $fetch('/api/clientes', {
      method: 'POST',
      body: nuevoCliente.value
    })
    
    await cargarClientes() // Recargar la lista
    cerrarFormulario()
    
  } catch (error) {
    console.error('Error al crear cliente:', error)
    alert('Error al crear el cliente')
  } finally {
    guardando.value = false
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  nuevoCliente.value = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  }
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Computed para estadísticas simples
const clientesNuevosMes = computed(() => {
  const haceUnMes = new Date()
  haceUnMes.setMonth(haceUnMes.getMonth() - 1)
  
  return clientes.value.filter(cliente => 
    new Date(cliente.fecha_registro) > haceUnMes
  ).length
})
</script>