import { defineEventHandler } from "h3";
import { connectToDatabase } from "../utils/mongo";

export default defineEventHandler(async (event) => {
  const db = (await connectToDatabase()).db;
  
  if (event.method !== "GET") {
    return { message: "Método no permitido" };
  }

  try {
    // Conteos básicos
    const totalClientes = await db.collection("clientes").countDocuments();
    const totalProductos = await db.collection("productos").countDocuments();
    const totalVentas = await db.collection("ventas").countDocuments();
    const totalEvidencias = await db.collection("evidencias").countDocuments();

    // Total de ingresos
    const ventasData = await db.collection("ventas").find({}).toArray();
    const totalIngresos = ventasData.reduce((sum: number, venta: any) => sum + venta.total, 0);

    // Productos con bajo stock (menos de 10)
    const productosStockBajo = await db.collection("productos").countDocuments({ stock: { $lt: 10 } });

    // Ventas del mes actual
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const ventasMesActual = await db.collection("ventas").countDocuments({
      fecha_venta: { $gte: inicioMes }
    });

    // Últimas 5 ventas
    const ultimasVentas = await db.collection("ventas")
      .find({})
      .sort({ fecha_venta: -1 })
      .limit(5)
      .toArray();

    // Productos más vendidos (top 5)
    const productosVendidos = await db.collection("ventas").aggregate([
      { $unwind: "$detalles" },
      { $group: { 
          _id: "$detalles.producto_id", 
          totalVendido: { $sum: "$detalles.cantidad" },
          ingresos: { $sum: { $multiply: ["$detalles.cantidad", "$detalles.precio_unitario"] } }
        }
      },
      { $sort: { totalVendido: -1 } },
      { $limit: 5 }
    ]).toArray();

    return {
      resumen: {
        totalClientes,
        totalProductos,
        totalVentas,
        totalEvidencias,
        totalIngresos,
        productosStockBajo,
        ventasMesActual
      },
      ultimasVentas,
      productosVendidos
    };
    
  } catch (error) {
    return { error: "Error al obtener métricas del dashboard" };
  }
});