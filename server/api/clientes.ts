import { defineEventHandler, readBody } from "h3";
import { connectToDatabase } from "../utils/mongo";

export default defineEventHandler(async (event) => {
  const db = (await connectToDatabase()).db;
  const method = event.method;

  if (method === "GET") {
    const clientes = await db.collection("clientes").find({}).toArray();
    return clientes;
  }

  if (method === "POST") {
    const body = await readBody(event);
    const result = await db.collection("clientes").insertOne(body);
    return { insertedId: result.insertedId };
  }

  return { message: "Método no permitido" };
});
