# 📁 Estructura del Proyecto Actualizada

```
/
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   │   ├── button/
│   │   ├── badge/
│   │   ├── separator/
│   │   └── avatar/
│   └── AppSidebar.vue         # ✅ Sidebar principal con navegación
├── layouts/
│   └── default.vue            # ✅ Layout principal de la aplicación
├── pages/
│   ├── index.vue              # ✅ Dashboard/página de inicio
│   ├── clientes.vue           # ✅ Página de gestión de clientes
│   ├── evidencias.vue         # ✅ Página de gestión de evidencias
│   ├── productos.vue          # ✅ Página de gestión de productos
│   └── ventas.vue             # ✅ Página de gestión de ventas
├── server/
│   ├── api/
│   │   ├── clientes.ts        # ✅ Endpoints GET y POST básicos
│   │   ├── evidencias.ts      # ✅ Endpoints GET y POST básicos
│   │   ├── productos.ts       # 🔄 MEJORADO - Filtros y validaciones
│   │   ├── ventas.ts          # 🔄 MEJORADO - Joins con clientes
│   │   ├── dashboard.ts       # 🆕 Métricas principales del dashboard
│   │   └── estadisticas.ts    # 🆕 Estadísticas avanzadas por tipo
│   └── utils/
│       └── mongo.ts           # ✅ Helper para conexión a MongoDB Atlas
└── store/
    └── main.ts                # ✅ Store de Pinia para modo oscuro
```

---

## 🎯 Contexto y Estado Actual

### **Framework y Tecnologías:**
- **Nuxt.js 3** - Framework principal
- **Vue 3** con Composition API
- **Pinia** - Para manejo de estado
- **Tailwind CSS** - Para estilos
- **shadcn/ui** - Componentes de UI (shand-nuxt)
- **MongoDB Atlas** - Base de datos (preparado y poblado)

---

## 🗄️ Estructura de Base de Datos (MongoDB Atlas)

### **📊 Colección: Clientes (10 registros)**
```javascript
{
  _id: number,           // ID único (1-10)
  nombre: string,        // Nombre del cliente
  apellido: string,      // Apellido del cliente
  email: string,         // Correo electrónico único
  telefono: string,      // Número de teléfono (formato: "555-XXXX")
  fecha_registro: Date   // Fecha de registro ISO
}
```
**Ejemplos de datos:** Juan Pérez, María García, Luis Ramírez, Ana Torres, Carlos Mendoza, etc.

### **🛍️ Colección: Productos (15 registros)**
```javascript
{
  _id: number,           // ID único (101-115)
  nombre: string,        // Nombre del producto
  categoria: string,     // Categoría (CPU, GPU, RAM, etc.)
  descripcion: string,   // Descripción del producto
  precio: number,        // Precio en unidad monetaria
  stock: number,         // Cantidad disponible
  imagen_url: string     // URL de imagen placeholder
}
```
**Categorías disponibles:** Tarjeta gráfica, CPU, RAM, Almacenamiento, Motherboard, Fuente, Gabinete, Cooling, Monitor, Periférico, Mobiliario

### **💰 Colección: Ventas (20 registros)**
```javascript
{
  _id: number,           // ID único (1001-1020)
  cliente_id: number,    // Referencia al cliente
  fecha_venta: Date,     // Fecha de la venta ISO
  total: number,         // Monto total de la venta
  detalles: [            // Array de productos vendidos
    {
      detalle_id: number,      // ID del detalle
      producto_id: number,     // Referencia al producto
      cantidad: number,        // Cantidad vendida
      precio_unitario: number  // Precio al momento de la venta
    }
  ]
}
```
**Rango de ventas:** $400 - $14,000 | **Total aproximado:** $120,000+

### **📄 Colección: Evidencias (30 registros)**
```javascript
{
  _id: number,           // ID único (5001-5030)
  cliente_id: number,    // Referencia al cliente
  producto_id: number,   // Referencia al producto
  descripcion: string,   // Tipo de evidencia (Comprobante/Factura)
  archivo_url: string,   // URL del archivo (placeholder)
  fecha_subida: Date     // Fecha de subida ISO
}
```
**Tipos de evidencias:** Comprobantes y Facturas de productos específicos

---

## 🚀 APIs Implementadas y Mejoradas

### **📍 Endpoints Básicos (Sin cambios)**

#### **`/api/clientes`**
- **GET** - Lista todos los clientes
- **POST** - Crear nuevo cliente

#### **`/api/evidencias`**
- **GET** - Lista todas las evidencias
- **POST** - Crear nueva evidencia

---

### **📍 Endpoints Mejorados**

#### **`/api/productos`**
```javascript
// GET - Obtener productos con filtros
GET /api/productos                    // Todos los productos
GET /api/productos?categoria=GPU      // Filtrar por categoría
GET /api/productos?stock_bajo=true    // Productos con stock < 10
GET /api/productos?categorias=true    // Lista de categorías únicas

// POST - Crear producto con validaciones
POST /api/productos
{
  nombre: string,      // REQUERIDO
  categoria: string,   // REQUERIDO  
  precio: number,      // REQUERIDO
  descripcion?: string,
  stock?: number,      // Default: 0
  imagen_url?: string  // Default: placeholder
}
```

#### **`/api/ventas`**
```javascript
// GET - Obtener ventas con datos relacionados
GET /api/ventas           // Todas las ventas con info de clientes
GET /api/ventas/1001      // Venta específica con cliente y productos

// POST - Crear venta con cálculos automáticos
POST /api/ventas
{
  cliente_id: number,     // REQUERIDO
  detalles: [             // REQUERIDO
    {
      producto_id: number,
      cantidad: number,
      precio_unitario: number
    }
  ],
  fecha_venta?: Date      // Default: fecha actual
  // total se calcula automáticamente
}
```

---

### **📍 Endpoints Nuevos**

#### **`/api/dashboard`** 🆕
```javascript
// GET - Métricas principales para el dashboard
{
  resumen: {
    totalClientes: number,
    totalProductos: number, 
    totalVentas: number,
    totalEvidencias: number,
    totalIngresos: number,
    productosStockBajo: number,
    ventasMesActual: number
  },
  ultimasVentas: [...]     // Últimas 5 ventas
  productosVendidos: [...]  // Top 5 productos más vendidos
}
```

#### **`/api/estadisticas`** 🆕
```javascript
// GET - Estadísticas por tipo
GET /api/estadisticas?tipo=ventas_mes
GET /api/estadisticas?tipo=productos_categoria  
GET /api/estadisticas?tipo=clientes_activos
GET /api/estadisticas?tipo=inventario_valor

// Respuestas estructuradas para gráficos y análisis
```

---

## 📈 Funcionalidades de los Nuevos Endpoints

### **🎯 Dashboard API (`/api/dashboard`)**
✅ **Contadores principales** - Clientes, Productos, Ventas, Evidencias  
✅ **Métricas financieras** - Total de ingresos, ventas del mes  
✅ **Alertas de inventario** - Productos con stock bajo  
✅ **Actividad reciente** - Últimas 5 ventas  
✅ **Top productos** - Más vendidos con cantidades e ingresos  

### **📊 Estadísticas API (`/api/estadisticas`)**
✅ **Análisis temporal** - Ventas por mes (últimos 6 meses)  
✅ **Análisis de productos** - Distribución por categorías  
✅ **Análisis de clientes** - Clientes más activos y rentables  
✅ **Análisis financiero** - Valor de inventario por categoría  

### **🔍 Productos API (Mejorado)**
✅ **Filtros dinámicos** - Por categoría y stock bajo  
✅ **Lista de categorías** - Para filtros en frontend  
✅ **Validaciones** - Campos requeridos y valores por defecto  

### **🛒 Ventas API (Mejorado)**
✅ **Joins automáticos** - Datos de clientes incluidos  
✅ **Cálculo automático** - Total calculado del array de detalles  
✅ **Venta individual** - Con todos los datos relacionados  
✅ **Validaciones** - Cliente y detalles requeridos  

---

## 📊 Datos Listos Para Dashboard

### **Métricas Principales:**
- **👥 Clientes:** 10 registrados
- **📦 Productos:** 15 en inventario  
- **🛒 Ventas:** 20 transacciones
- **📋 Evidencias:** 30 documentos
- **💰 Ingresos:** $120,000+ total

### **Análisis Disponibles:**
- **Productos más vendidos** con cantidades e ingresos
- **Clientes más activos** por compras y gasto total
- **Ventas por mes** para gráficos temporales
- **Inventario por categoría** con valores
- **Productos con stock bajo** para alertas

### **Datos Relacionales:**
- **Ventas con clientes** - Nombre completo en cada venta
- **Evidencias por cliente/producto** - Trazabilidad completa
- **Detalles de venta** - Productos específicos en cada transacción

---

## 🛠 Archivos del Sistema (Sin cambios)

### **1. Store de Estado (`store/main.ts`)**
```typescript
// Manejo del modo oscuro/claro
- Estado: isDark (ref)
- Acción: toggleDarkMode()
- Aplica clase 'dark' al documento
```

### **2. Layout Principal (`layouts/default.vue`)**
```vue
// Layout con sidebar fijo
- Estructura: Sidebar + Main Content
- Integra AppSidebar component
- Aplica modo oscuro inicial
- Main content con margen izquierdo de 64 (ml-64)
```

### **3. Sidebar Profesional (`components/AppSidebar.vue`)**
```vue
// Sidebar completo y profesional
- Header: Logo + Toggle modo oscuro
- Navegación: 5 secciones principales con iconos SVG
- Estados activos con indicadores visuales
- Badges para notificaciones
- Footer con información del usuario
- Responsive y animado
- Soporte completo modo oscuro/claro
```

---

## 🎨 Características del Diseño (Sin cambios)

### **Sidebar Profesional:**
✅ **Diseño Moderno** - Glassmorphism y sombras sutiles  
✅ **Navegación Intuitiva** - Estados activos con bordes y colores  
✅ **Iconos Personalizados** - SVG para cada sección  
✅ **Modo Oscuro/Claro** - Toggle integrado y transiciones suaves  
✅ **Badges de Notificación** - Ejemplo en "Clientes (5)"  
✅ **Footer de Usuario** - Avatar y información  
✅ **Animaciones** - Hover effects y transiciones  

---

## 🔧 Componentes shadcn/ui Disponibles

```bash
✅ button     # Botones del sistema
✅ badge      # Indicadores y contadores  
✅ separator  # Divisores visuales
✅ avatar     # Imágenes de perfil
```

---

## ✅ Estado Actual del Desarrollo

### **🎯 Completado:**
1. **✅ Arquitectura Base** - Nuxt.js, Vue 3, Pinia, Tailwind
2. **✅ Diseño UI/UX** - Sidebar, layout, modo oscuro
3. **✅ Base de Datos** - MongoDB Atlas poblado con datos reales
4. **✅ APIs Básicas** - CRUD para todas las entidades
5. **✅ APIs Avanzadas** - Dashboard, estadísticas, filtros
6. **✅ Validaciones** - Campos requeridos y cálculos automáticos
7. **✅ Datos Relacionales** - Joins entre colecciones

### **🔄 Listo Para Desarrollar:**
1. **📊 Dashboard Principal** - Usar `/api/dashboard` para métricas
2. **👥 Página de Clientes** - Lista, crear, editar con `/api/clientes`
3. **📦 Página de Productos** - Inventario con filtros `/api/productos`
4. **🛒 Página de Ventas** - Historial detallado `/api/ventas`  
5. **📋 Página de Evidencias** - Documentos `/api/evidencias`
