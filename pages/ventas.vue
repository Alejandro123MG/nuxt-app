<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Ventas</h1>
        <p class="text-gray-600 dark:text-gray-400">Administra las transacciones y pedidos</p>
      </div>
      <button 
        @click="mostrarFormulario = true"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        + Nueva Venta
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Total Ventas</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ ventas.length }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Ingresos Totales</h3>
        <p class="text-2xl font-bold text-emerald-600">${{ ingresosTotales.toLocaleString() }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Venta Promedio</h3>
        <p class="text-2xl font-bold text-blue-600">${{ ventaPromedio.toLocaleString() }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 class="text-sm text-gray-600 dark:text-gray-400">Este Mes</h3>
        <p class="text-2xl font-bold text-purple-600">{{ ventasMes }}</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
          <select 
            v-model="filtroCliente" 
            @change="aplicarFiltros"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Todos los clientes</option>
            <option v-for="cliente in clientes" :key="cliente._id" :value="cliente._id">
              {{ cliente.nombre }} {{ cliente.apellido }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Desde</label>
          <input 
            v-model="fechaDesde"
            @change="aplicarFiltros"
            type="date" 
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Hasta</label>
          <input 
            v-model="fechaHasta"
            @change="aplicarFiltros"
            type="date" 
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monto Mínimo</label>
          <input 
            v-model.number="montoMinimo"
            @input="aplicarFiltros"
            type="number" 
            placeholder="0"
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

    <!-- Tabla de Ventas -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Historial de Ventas ({{ ventasFiltradas.length }})
        </h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">ID</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Cliente</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Fecha</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Productos</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Total</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-for="venta in ventasFiltradas" :key="venta._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                #{{ venta._id }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-medium text-gray-700">{{ obtenerIniciales(venta.cliente?.nombre, venta.cliente?.apellido) }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ venta.cliente ? `${venta.cliente.nombre} ${venta.cliente.apellido}` : 'Cliente no encontrado' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ venta.cliente?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {{ formatearFecha(venta.fecha_venta) }}
              </td>
              <td class="px-4 py-3">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ venta.detalles.length }} producto{{ venta.detalles.length > 1 ? 's' : '' }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ venta.detalles.reduce((total, d) => total + d.cantidad, 0) }} unidades
                </div>
              </td>
              <td class="px-4 py-3 text-sm font-bold text-emerald-600">
                ${{ venta.total.toLocaleString() }}
              </td>
              <td class="px-4 py-3">
                <button 
                  @click="verDetalle(venta)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Detalle de Venta -->
    <div v-if="ventaDetalle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Detalle de Venta #{{ ventaDetalle._id }}</h3>
          <button @click="ventaDetalle = null" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
        </div>
        
        <div class="space-y-4">
          <!-- Info del Cliente -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">Cliente</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ ventaDetalle.cliente?.nombre }} {{ ventaDetalle.cliente?.apellido }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ ventaDetalle.cliente?.email }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ ventaDetalle.cliente?.telefono }}</p>
          </div>

          <!-- Productos -->
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">Productos</h4>
            <div class="space-y-2">
              <div v-for="detalle in ventaDetalle.detalles" :key="detalle.detalle_id" 
                   class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex-1">
                  <p class="font-medium text-gray-900 dark:text-white">{{ obtenerNombreProducto(detalle.producto_id) }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ detalle.cantidad }} × ${{ detalle.precio_unitario.toLocaleString() }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-gray-900 dark:text-white">
                    ${{ (detalle.cantidad * detalle.precio_unitario).toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen -->
          <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
              <span class="text-xl font-bold text-emerald-600">${{ ventaDetalle.total.toLocaleString() }}</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Fecha: {{ formatearFechaCompleta(ventaDetalle.fecha_venta) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal/Formulario Nueva Venta -->
    <div v-if="mostrarFormulario" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nueva Venta</h3>
        
        <form @submit.prevent="crearVenta" class="space-y-4">
          <!-- Cliente -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente *</label>
            <select 
              v-model="nuevaVenta.cliente_id"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Seleccionar cliente</option>
              <option v-for="cliente in clientes" :key="cliente._id" :value="cliente._id">
                {{ cliente.nombre }} {{ cliente.apellido }} - {{ cliente.email }}
              </option>
            </select>
          </div>

          <!-- Productos -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Productos *</label>
              <button 
                type="button"
                @click="agregarProducto"
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                + Agregar
              </button>
            </div>
            
            <div v-if="nuevaVenta.detalles.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
              No hay productos agregados
            </div>
            
            <div v-else class="space-y-3">
              <div v-for="(detalle, index) in nuevaVenta.detalles" :key="index" 
                   class="flex gap-3 items-end p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex-1">
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Producto</label>
                  <select 
                    v-model="detalle.producto_id"
                    @change="actualizarPrecio(detalle)"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">Seleccionar</option>
                    <option v-for="producto in productos" :key="producto._id" :value="producto._id">
                      {{ producto.nombre }} - ${{ producto.precio }}
                    </option>
                  </select>
                </div>
                <div class="w-20">
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Cantidad</label>
                  <input 
                    v-model.number="detalle.cantidad"
                    type="number" 
                    min="1"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                </div>
                <div class="w-24">
                  <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Precio</label>
                  <input 
                    v-model.number="detalle.precio_unitario"
                    type="number" 
                    step="0.01"
                    min="0"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                </div>
                <button 
                  type="button"
                  @click="removerProducto(index)"
                  class="text-red-600 hover:text-red-800 p-1"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div v-if="totalVenta > 0" class="bg-emerald-50 dark:bg-emerald-900 p-3 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="font-medium text-gray-900 dark:text-white">Total:</span>
              <span class="text-lg font-bold text-emerald-600">${{ totalVenta.toLocaleString() }}</span>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="submit"
              :disabled="guardando || nuevaVenta.detalles.length === 0"
              class="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2 rounded-lg transition-colors"
            >
              {{ guardando ? 'Guardando...' : 'Crear Venta' }}
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
const ventas = ref([])
const clientes = ref([])
const productos = ref([])
const ventasFiltradas = ref([])
const ventaDetalle = ref(null)
const mostrarFormulario = ref(false)
const guardando = ref(false)

const filtroCliente = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')
const montoMinimo = ref('')

const nuevaVenta = ref({
  cliente_id: '',
  detalles: []
})

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    cargarVentas(),
    cargarClientes(),
    cargarProductos()
  ])
})

// Funciones para cargar datos
async function cargarVentas() {
  try {
    const data = await $fetch('/api/ventas')
    ventas.value = data
    ventasFiltradas.value = data
  } catch (error) {
    console.error('Error al cargar ventas:', error)
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

async function verDetalle(venta) {
  try {
    const data = await $fetch(`/api/ventas/${venta._id}`)
    ventaDetalle.value = data
  } catch (error) {
    console.error('Error al cargar detalle:', error)
  }
}

async function crearVenta() {
  guardando.value = true
  try {
    await $fetch('/api/ventas', {
      method: 'POST',
      body: nuevaVenta.value
    })
    
    await cargarVentas()
    await aplicarFiltros()
    cerrarFormulario()
    
  } catch (error) {
    console.error('Error al crear venta:', error)
    alert('Error al crear la venta')
  } finally {
    guardando.value = false
  }
}

function aplicarFiltros() {
  let filtradas = ventas.value

  if (filtroCliente.value) {
    filtradas = filtradas.filter(v => v.cliente_id === parseInt(filtroCliente.value))
  }

  if (fechaDesde.value) {
    const desde = new Date(fechaDesde.value)
    filtradas = filtradas.filter(v => new Date(v.fecha_venta) >= desde)
  }

  if (fechaHasta.value) {
    const hasta = new Date(fechaHasta.value)
    hasta.setHours(23, 59, 59)
    filtradas = filtradas.filter(v => new Date(v.fecha_venta) <= hasta)
  }

  if (montoMinimo.value) {
    filtradas = filtradas.filter(v => v.total >= montoMinimo.value)
  }

  ventasFiltradas.value = filtradas
}

function limpiarFiltros() {
  filtroCliente.value = ''
  fechaDesde.value = ''
  fechaHasta.value = ''
  montoMinimo.value = ''
  ventasFiltradas.value = ventas.value
}

function agregarProducto() {
  nuevaVenta.value.detalles.push({
    producto_id: '',
    cantidad: 1,
    precio_unitario: 0
  })
}

function removerProducto(index) {
  nuevaVenta.value.detalles.splice(index, 1)
}

function actualizarPrecio(detalle) {
  const producto = productos.value.find(p => p._id === detalle.producto_id)
  if (producto) {
    detalle.precio_unitario = producto.precio
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  nuevaVenta.value = {
    cliente_id: '',
    detalles: []
  }
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function formatearFechaCompleta(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function obtenerIniciales(nombre, apellido) {
  if (!nombre || !apellido) return '?'
  return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase()
}

function obtenerNombreProducto(productoId) {
  const producto = productos.value.find(p => p._id === productoId)
  return producto ? producto.nombre : 'Producto no encontrado'
}

// Computed properties
const ingresosTotales = computed(() => {
  return ventas.value.reduce((total, venta) => total + venta.total, 0)
})

const ventaPromedio = computed(() => {
  return ventas.value.length > 0 ? ingresosTotales.value / ventas.value.length : 0
})

const ventasMes = computed(() => {
  const haceUnMes = new Date()
  haceUnMes.setMonth(haceUnMes.getMonth() - 1)
  
  return ventas.value.filter(venta => 
    new Date(venta.fecha_venta) > haceUnMes
  ).length
})

const totalVenta = computed(() => {
  return nuevaVenta.value.detalles.reduce((total, detalle) => {
    return total + (detalle.cantidad * detalle.precio_unitario)
  }, 0)
})
</script>