<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Evidencias</h1>
        <p class="text-gray-600 dark:text-gray-400">Administra comprobantes y facturas</p>
      </div>
      <button 
        @click="mostrarFormulario = true"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        + Nueva Evidencia
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Total Evidencias</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ evidencias.length }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Comprobantes</h3>
        <p class="text-2xl font-bold text-blue-600">{{ comprobantes }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Facturas</h3>
        <p class="text-2xl font-bold text-purple-600">{{ facturas }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Este Mes</h3>
        <p class="text-2xl font-bold text-green-600">{{ evidenciasMes }}</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
          <select 
            v-model="filtroTipo" 
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Todos</option>
            <option value="Comprobante">Comprobantes</option>
            <option value="Factura">Facturas</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
          <select 
            v-model="filtroCliente" 
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Todos</option>
            <option v-for="cliente in clientes" :key="cliente._id" :value="cliente._id">
              {{ cliente.nombre }} {{ cliente.apellido }}
            </option>
          </select>
        </div>
        <button 
          @click="limpiarFiltros"
          class="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Tabla de Evidencias -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Lista de Evidencias</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">ID</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Tipo</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Cliente</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Producto</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Fecha</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Archivo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="evidencia in evidenciasFiltradas" :key="evidencia._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{{ evidencia._id }}</td>
              <td class="px-4 py-3 text-sm">
                <span :class="evidencia.descripcion.includes('Comprobante') ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200'" 
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ evidencia.descripcion.includes('Comprobante') ? 'Comprobante' : 'Factura' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                {{ obtenerNombreCliente(evidencia.cliente_id) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {{ obtenerNombreProducto(evidencia.producto_id) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {{ formatearFecha(evidencia.fecha_subida) }}
              </td>
              <td class="px-4 py-3 text-sm">
                <a href="#" class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                  📄 Ver archivo
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal/Formulario Nueva Evidencia -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nueva Evidencia</h3>
        
        <form @submit.prevent="crearEvidencia" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
            <select 
              v-model="nuevaEvidencia.cliente_id"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Seleccionar cliente</option>
              <option v-for="cliente in clientes" :key="cliente._id" :value="cliente._id">
                {{ cliente.nombre }} {{ cliente.apellido }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Producto</label>
            <select 
              v-model="nuevaEvidencia.producto_id"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Seleccionar producto</option>
              <option v-for="producto in productos" :key="producto._id" :value="producto._id">
                {{ producto.nombre }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Evidencia</label>
            <select 
              v-model="nuevaEvidencia.descripcion"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Seleccionar tipo</option>
              <option value="Comprobante de compra">Comprobante de compra</option>
              <option value="Factura de venta">Factura de venta</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL del Archivo</label>
            <input 
              v-model="nuevaEvidencia.archivo_url"
              type="url" 
              placeholder="https://ejemplo.com/archivo.pdf"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="submit"
              :disabled="guardando"
              class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg transition-colors"
            >
              {{ guardando ? 'Guardando...' : 'Crear Evidencia' }}
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
const evidencias = ref([])
const clientes = ref([])
const productos = ref([])
const mostrarFormulario = ref(false)
const guardando = ref(false)
const filtroTipo = ref('')
const filtroCliente = ref('')

const nuevaEvidencia = ref({
  cliente_id: '',
  producto_id: '',
  descripcion: '',
  archivo_url: ''
})

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    cargarEvidencias(),
    cargarClientes(),
    cargarProductos()
  ])
})

// Funciones para cargar datos
async function cargarEvidencias() {
  try {
    const data = await $fetch('/api/evidencias')
    evidencias.value = data
  } catch (error) {
    console.error('Error al cargar evidencias:', error)
  }
}

async function cargarClientes() {
  try {
    const data = await $fetch('/api/clientes')
    clientes.value = data
  } catch (error) {
    console.error('Error al cargar clientes:', error)
  }
}

async function cargarProductos() {
  try {
    const data = await $fetch('/api/productos')
    productos.value = data
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

async function crearEvidencia() {
  guardando.value = true
  try {
    await $fetch('/api/evidencias', {
      method: 'POST',
      body: nuevaEvidencia.value
    })
    
    await cargarEvidencias() // Recargar la lista
    cerrarFormulario()
    
  } catch (error) {
    console.error('Error al crear evidencia:', error)
    alert('Error al crear la evidencia')
  } finally {
    guardando.value = false
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  nuevaEvidencia.value = {
    cliente_id: '',
    producto_id: '',
    descripcion: '',
    archivo_url: ''
  }
}

function limpiarFiltros() {
  filtroTipo.value = ''
  filtroCliente.value = ''
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function obtenerNombreCliente(clienteId) {
  const cliente = clientes.value.find(c => c._id === clienteId)
  return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente no encontrado'
}

function obtenerNombreProducto(productoId) {
  const producto = productos.value.find(p => p._id === productoId)
  return producto ? producto.nombre : 'Producto no encontrado'
}

// Computed properties
const evidenciasFiltradas = computed(() => {
  let filtradas = evidencias.value

  if (filtroTipo.value) {
    filtradas = filtradas.filter(e => 
      e.descripcion.includes(filtroTipo.value)
    )
  }

  if (filtroCliente.value) {
    filtradas = filtradas.filter(e => 
      e.cliente_id === parseInt(filtroCliente.value)
    )
  }

  return filtradas
})

const comprobantes = computed(() => {
  return evidencias.value.filter(e => e.descripcion.includes('Comprobante')).length
})

const facturas = computed(() => {
  return evidencias.value.filter(e => e.descripcion.includes('Factura')).length
})

const evidenciasMes = computed(() => {
  const haceUnMes = new Date()
  haceUnMes.setMonth(haceUnMes.getMonth() - 1)
  
  return evidencias.value.filter(evidencia => 
    new Date(evidencia.fecha_subida) > haceUnMes
  ).length
})
</script>