import { defineEventHandler, readBody, getRouterParam } from "h3";
import { connectToDatabase } from "../utils/mongo";

export default defineEventHandler(async (event) => {
  const db = (await connectToDatabase()).db;
  const method = event.method;

  if (method === "GET") {
    // Si viene un ID específico en la URL
    const id = getRouterParam(event, 'id');
    
    if (id) {
      // Obtener una venta específica con datos de cliente y productos
      const venta = await db.collection("ventas").aggregate([
        { $match: { _id: parseInt(id) } },
        {
          $lookup: {
            from: "clientes",
            localField: "cliente_id",
            foreignField: "_id",
            as: "cliente"
          }
        },
        {
          $lookup: {
            from: "productos",
            localField: "detalles.producto_id",
            foreignField: "_id",
            as: "productos"
          }
        },
        { $unwind: "$cliente" }
      ]).toArray();
      
      return venta[0] || null;
    }
    
    // Obtener todas las ventas con información de clientes
    const ventas = await db.collection("ventas").aggregate([
      {
        $lookup: {
          from: "clientes",
          localField: "cliente_id",
          foreignField: "_id",
          as: "cliente"
        }
      },
      { $unwind: "$cliente" },
      { $sort: { fecha_venta: -1 } }
    ]).toArray();
    
    return ventas;
  }

  if (method === "POST") {
    const body = await readBody(event);
    
    // Validar que venga cliente_id y detalles
    if (!body.cliente_id || !body.detalles || body.detalles.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cliente ID y detalles son requeridos"
      });
    }

    // Calcular total automáticamente
    const total = body.detalles.reduce((sum: number, detalle: any) => {
      return sum + (detalle.cantidad * detalle.precio_unitario);
    }, 0);

    // Agregar fecha actual si no viene
    const ventaData = {
      ...body,
      total,
      fecha_venta: body.fecha_venta || new Date()
    };

    const result = await db.collection("ventas").insertOne(ventaData);
    return { insertedId: result.insertedId, total };
  }

  return { message: "Método no permitido" };
});