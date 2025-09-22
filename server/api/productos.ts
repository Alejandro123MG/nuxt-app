import { defineEventHandler, readBody } from "h3";
import { connectToDatabase } from "../utils/mongo";

export default defineEventHandler(async (event) => {
  const db = (await connectToDatabase()).db;
  const method = event.method;

  if (method === "GET") {
    const productos = await db.collection("productos").find({}).toArray();
    return productos;
  }

  if (method === "POST") {
    const body = await readBody(event);
    const result = await db.collection("productos").insertOne(body);
    return { insertedId: result.insertedId };
  }

  return { message: "Método no permitido" };
});
