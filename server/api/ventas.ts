import { defineEventHandler, readBody } from "h3";
import { connectToDatabase } from "../utils/mongo";

export default defineEventHandler(async (event) => {
  const db = (await connectToDatabase()).db;
  const method = event.method;

  if (method === "GET") {
    const ventas = await db.collection("ventas").find({}).toArray();
    return ventas;
  }

  if (method === "POST") {
    const body = await readBody(event);
    const result = await db.collection("ventas").insertOne(body);
    return { insertedId: result.insertedId };
  }

  return { message: "Método no permitido" };
});
