import { defineEventHandler } from "h3";
import { connectToDatabase } from "../utils/mongo";
import { ObjectId } from "mongodb";

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

    // Ventas del mes actual - versión corregida
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59);

    let ventasMesActual;

    // Intentar con Date objects
    ventasMesActual = await db.collection("ventas").countDocuments({
      fecha_venta: { 
        $gte: inicioMes,
        $lte: finMes
      }
    });

    // Si no encuentra nada, intentar con strings (por si las fechas están como string)
    if (ventasMesActual === 0) {
      const inicioMesStr = inicioMes.toISOString();
      const finMesStr = finMes.toISOString();
      
      ventasMesActual = await db.collection("ventas").countDocuments({
        fecha_venta: { 
          $gte: inicioMesStr,
          $lte: finMesStr
        }
      });
    }

    // Últimas 5 ventas CON datos del cliente
    const ultimasVentas = await db.collection("ventas").aggregate([
      { $sort: { fecha_venta: -1 } },
      { $limit: 5 },
      {
        $addFields: {
          cliente_id_converted: {
            $cond: {
              if: { $type: "$cliente_id" },
              then: {
                $cond: {
                  if: { $eq: [{ $type: "$cliente_id" }, "string"] },
                  then: { $toObjectId: "$cliente_id" },
                  else: "$cliente_id"
                }
              },
              else: null
            }
          }
        }
      },
      {
        $lookup: {
          from: "clientes",
          localField: "cliente_id_converted",
          foreignField: "_id",
          as: "cliente"
        }
      },
      {
        $unwind: {
          path: "$cliente",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          total: 1,
          fecha_venta: 1,
          detalles: 1,
          cliente: 1
        }
      }
    ]).toArray();

    // Productos más vendidos CON datos del producto
    const productosVendidos = await db.collection("ventas").aggregate([
      { $unwind: "$detalles" },
      {
        $addFields: {
          "detalles.producto_id_converted": {
            $cond: {
              if: { $type: "$detalles.producto_id" },
              then: {
                $cond: {
                  if: { $eq: [{ $type: "$detalles.producto_id" }, "string"] },
                  then: { $toObjectId: "$detalles.producto_id" },
                  else: "$detalles.producto_id"
                }
              },
              else: null
            }
          }
        }
      },
      { 
        $group: { 
          _id: "$detalles.producto_id_converted", 
          cantidad_vendida: { $sum: "$detalles.cantidad" },
          ingresos: { $sum: { $multiply: ["$detalles.cantidad", "$detalles.precio_unitario"] } }
        }
      },
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "_id",
          as: "producto"
        }
      },
      {
        $unwind: {
          path: "$producto",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: "$producto._id",
          nombre: "$producto.nombre",
          categoria: "$producto.categoria",
          cantidad_vendida: 1,
          ingresos: 1
        }
      },
      { $sort: { cantidad_vendida: -1 } },
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
    console.error("Error en dashboard:", error);
    return { error: "Error al obtener métricas del dashboard" };
  }
});