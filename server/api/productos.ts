import { defineEventHandler, readBody, getQuery } from "h3";
import { connectToDatabase } from "../utils/mongo";

export default defineEventHandler(async (event) => {
  const db = (await connectToDatabase()).db;
  const method = event.method;

  if (method === "GET") {
    const query = getQuery(event);
    
    // Filtrar por categoría si viene en query params
    const filter: any = {};
    if (query.categoria) {
      filter.categoria = query.categoria;
    }
    
    // Filtrar productos con stock bajo
    if (query.stock_bajo === 'true') {
      filter.stock = { $lt: 10 };
    }

    const productos = await db.collection("productos").find(filter).toArray();
    
    // Si se solicitan categorías únicas
    if (query.categorias === 'true') {
      const categorias = await db.collection("productos").distinct("categoria");
      return { categorias };
    }
    
    return productos;
  }

  if (method === "POST") {
    const body = await readBody(event);
    
    // Validaciones básicas
    if (!body.nombre || !body.categoria || !body.precio) {
      throw createError({
        statusCode: 400,
        statusMessage: "Nombre, categoría y precio son requeridos"
      });
    }

    // Valores por defecto
    const productoData = {
      ...body,
      stock: body.stock || 0,
      imagen_url: body.imagen_url || "https://placehold.co/150x150"
    };

    const result = await db.collection("productos").insertOne(productoData);
    return { insertedId: result.insertedId };
  }

  return { message: "Método no permitido" };
});