import { defineEventHandler, getQuery } from "h3";
import { connectToDatabase } from "../utils/mongo";

export default defineEventHandler(async (event) => {
  const db = (await connectToDatabase()).db;
  
  if (event.method !== "GET") {
    return { message: "Método no permitido" };
  }

  const query = getQuery(event);
  const tipo = query.tipo as string;

  try {
    switch (tipo) {
      case 'ventas_mes':
        // Ventas por mes (últimos 6 meses)
        const ventasPorMes = await db.collection("ventas").aggregate([
          {
            $group: {
              _id: {
                año: { $year: "$fecha_venta" },
                mes: { $month: "$fecha_venta" }
              },
              totalVentas: { $sum: 1 },
              totalIngresos: { $sum: "$total" }
            }
          },
          { $sort: { "_id.año": -1, "_id.mes": -1 } },
          { $limit: 6 }
        ]).toArray();
        
        return { ventasPorMes };

      case 'productos_categoria':
        // Productos por categoría
        const productosPorCategoria = await db.collection("productos").aggregate([
          {
            $group: {
              _id: "$categoria",
              cantidad: { $sum: 1 },
              valorInventario: { $sum: { $multiply: ["$precio", "$stock"] } }
            }
          },
          { $sort: { cantidad: -1 } }
        ]).toArray();
        
        return { productosPorCategoria };

      case 'clientes_activos':
        // Clientes más activos
        const clientesActivos = await db.collection("ventas").aggregate([
          {
            $group: {
              _id: "$cliente_id",
              totalCompras: { $sum: 1 },
              totalGastado: { $sum: "$total" }
            }
          },
          {
            $lookup: {
              from: "clientes",
              localField: "_id",
              foreignField: "_id",
              as: "cliente"
            }
          },
          { $unwind: "$cliente" },
          { $sort: { totalGastado: -1 } },
          { $limit: 10 }
        ]).toArray();
        
        return { clientesActivos };

      case 'inventario_valor':
        // Valor total del inventario por categoría
        const valorInventario = await db.collection("productos").aggregate([
          {
            $group: {
              _id: "$categoria",
              productos: { $sum: 1 },
              stockTotal: { $sum: "$stock" },
              valorTotal: { $sum: { $multiply: ["$precio", "$stock"] } }
            }
          },
          { $sort: { valorTotal: -1 } }
        ]).toArray();
        
        return { valorInventario };

      default:
        return { error: "Tipo de estadística no válido. Usar: ventas_mes, productos_categoria, clientes_activos, inventario_valor" };
    }
    
  } catch (error) {
    return { error: "Error al obtener estadísticas" };
  }
});