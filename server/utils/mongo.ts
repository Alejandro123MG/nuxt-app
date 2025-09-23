import { MongoClient } from "mongodb";
import { useRuntimeConfig } from "#imports";

let client: MongoClient;
let db: any;

export async function connectToDatabase() {
  const config = useRuntimeConfig();

  if (!client) {
    client = new MongoClient(config.MONGO_URI);
    await client.connect();
    db = client.db(config.MONGO_DB);
    console.log("Conectado a MongoDB Atlas");
  }

  return { client, db };
}