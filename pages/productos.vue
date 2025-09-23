<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
        <p class="text-gray-600 dark:text-gray-400">Administra tu inventario y catálogo</p>
      </div>
      <button 
        @click="mostrarFormulario = true"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        + Nuevo Producto
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Total Productos</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ productos.length }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Stock Total</h3>
        <p class="text-2xl font-bold text-blue-600">{{ stockTotal }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Stock Bajo</h3>
        <p class="text-2xl font-bold text-red-600">{{ productosStockBajo }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Valor Inventario</h3>
        <p class="text-2xl font-bold text-green-600">${{ valorInventario.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
          <select 
            v-model="filtroCategoria" 
            @change="aplicarFiltros"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Todas las categorías</option>
            <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
          <select 
            v-model="filtroStock" 
            @change="aplicarFiltros"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Todo el stock</option>
            <option value="bajo">Stock bajo (&lt; 10)</option>
            <option value="disponible">Disponible (&gt; 0)</option>
            <option value="agotado">Sin stock (0)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar</label>
          <input 
            v-model="busqueda"
            @input="aplicarFiltros"
            type="text" 
            placeholder="Buscar producto..."
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
        </div>
        <button 
          @click="limpiarFiltros"
          class="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Tabla de Productos -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Lista de Productos ({{ productosFiltrados.length }})
        </h2>
        <div class="flex gap-2">
          <button 
            @click="vistaTabla = true"
            :class="vistaTabla ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
            class="px-3 py-1 rounded text-sm"
          >
            📋 Tabla
          </button>
          <button 
            @click="vistaTabla = false"
            :class="!vistaTabla ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
            class="px-3 py-1 rounded text-sm"
          >
            🏷️ Cards
          </button>
        </div>
      </div>
      
      <!-- Vista Tabla -->
      <div v-if="vistaTabla" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Producto</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Categoría</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Precio</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Stock</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Valor</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="producto in productosFiltrados" :key="producto._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <img :src="producto.imagen_url" :alt="producto.nombre" class="w-10 h-10 rounded-lg mr-3 bg-gray-100">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ producto.nombre }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ producto._id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span :class="obtenerColorCategoria(producto.categoria)" 
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ producto.categoria }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                ${{ producto.precio.toLocaleString() }}
              </td>
              <td class="px-4 py-3">
                <span :class="producto.stock < 10 ? 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200' : producto.stock === 0 ? 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400' : 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-200'" 
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ producto.stock }} unidades
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                ${{ (producto.precio * producto.stock).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vista Cards -->
      <div v-else class="p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="producto in productosFiltrados" :key="producto._id" 
               class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-3">
              <img :src="producto.imagen_url" :alt="producto.nombre" class="w-16 h-16 rounded-lg bg-gray-100">
              <span :class="obtenerColorCategoria(producto.categoria)" 
                    class="px-2 py-1 rounded-full text-xs font-medium">
                {{ producto.categoria }}
              </span>
            </div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">{{ producto.nombre }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ producto.descripcion }}</p>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900 dark:text-white">${{ producto.precio.toLocaleString() }}</span>
              <span :class="producto.stock < 10 ? 'text-red-600' : producto.stock === 0 ? 'text-gray-600' : 'text-green-600'" 
                    class="text-sm font-medium">
                Stock: {{ producto.stock }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal/Formulario Nuevo Producto -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nuevo Producto</h3>
        
        <form @submit.prevent="crearProducto" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre *</label>
            <input 
              v-model="nuevoProducto.nombre"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría *</label>
            <select 
              v-model="nuevoProducto.categoria"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Seleccionar categoría</option>
              <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio *</label>
            <input 
              v-model.number="nuevoProducto.precio"
              type="number" 
              step="0.01"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Inicial</label>
            <input 
              v-model.number="nuevoProducto.stock"
              type="number" 
              min="0"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
            <textarea 
              v-model="nuevoProducto.descripcion"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de Imagen</label>
            <input 
              v-model="nuevoProducto.imagen_url"
              type="url" 
              placeholder="https://ejemplo.com/imagen.jpg"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="submit"
              :disabled="guardando"
              class="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2 rounded-lg transition-colors"
            >
              {{ guardando ? 'Guardando...' : 'Crear Producto' }}
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
const productos = ref([])
const categorias = ref([])
const mostrarFormulario = ref(false)
const guardando = ref(false)
const vistaTabla = ref(true)

const filtroCategoria = ref('')
const filtroStock = ref('')
const busqueda = ref('')
const productosFiltrados = ref([])

const nuevoProducto = ref({
  nombre: '',
  categoria: '',
  precio: 0,
  stock: 0,
  descripcion: '',
  imagen_url: ''
})

// Cargar datos al montar el componente
onMounted(async () => {
  await cargarProductos()
  await cargarCategorias()
})

// Funciones para cargar datos
async function cargarProductos() {
  try {
    const data = await $fetch('/api/productos')
    productos.value = data
    productosFiltrados.value = data
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

async function cargarCategorias() {
  try {
    const data = await $fetch('/api/productos?categorias=true')
    categorias.value = data.categorias
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  }
}

async function aplicarFiltros() {
  try {
    let url = '/api/productos'
    const params = []
    
    if (filtroCategoria.value) {
      params.push(`categoria=${encodeURIComponent(filtroCategoria.value)}`)
    }
    
    if (filtroStock.value === 'bajo') {
      params.push('stock_bajo=true')
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&')
    }
    
    let data = await $fetch(url)
    
    // Aplicar filtros adicionales en frontend
    if (filtroStock.value === 'disponible') {
      data = data.filter(p => p.stock > 0)
    } else if (filtroStock.value === 'agotado') {
      data = data.filter(p => p.stock === 0)
    }
    
    if (busqueda.value) {
      const buscar = busqueda.value.toLowerCase()
      data = data.filter(p => 
        p.nombre.toLowerCase().includes(buscar) ||
        p.descripcion.toLowerCase().includes(buscar)
      )
    }
    
    productosFiltrados.value = data
  } catch (error) {
    console.error('Error al aplicar filtros:', error)
  }
}

async function crearProducto() {
  guardando.value = true
  try {
    await $fetch('/api/productos', {
      method: 'POST',
      body: nuevoProducto.value
    })
    
    await cargarProductos()
    await aplicarFiltros()
    cerrarFormulario()
    
  } catch (error) {
    console.error('Error al crear producto:', error)
    alert('Error al crear el producto')
  } finally {
    guardando.value = false
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  nuevoProducto.value = {
    nombre: '',
    categoria: '',
    precio: 0,
    stock: 0,
    descripcion: '',
    imagen_url: ''
  }
}

function limpiarFiltros() {
  filtroCategoria.value = ''
  filtroStock.value = ''
  busqueda.value = ''
  productosFiltrados.value = productos.value
}

function obtenerColorCategoria(categoria) {
  const colores = {
    'CPU': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
    'GPU': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    'RAM': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    'Motherboard': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
    'Almacenamiento': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    'Monitor': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200'
  }
  return colores[categoria] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

// Computed properties
const stockTotal = computed(() => {
  return productos.value.reduce((total, producto) => total + producto.stock, 0)
})

const productosStockBajo = computed(() => {
  return productos.value.filter(p => p.stock < 10).length
})

const valorInventario = computed(() => {
  return productos.value.reduce((total, producto) => total + (producto.precio * producto.stock), 0)
})
</script>