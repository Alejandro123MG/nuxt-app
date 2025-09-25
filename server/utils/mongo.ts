import { MongoClient } from "mongodb";

let client: MongoClient;
let db: any;

export async function connectToDatabase() {
  const config = useRuntimeConfig();
  
  // Verificar que las variables de entorno existan
  if (!config.MONGO_URI || !config.MONGO_DB) {
    throw new Error('MONGO_URI y MONGO_DB deben estar definidas en las variables de entorno');
  }

  if (!client) {
    try {
      client = new MongoClient(config.MONGO_URI);
      await client.connect();
      db = client.db(config.MONGO_DB);
      console.log("Conectado a MongoDB");
    } catch (error) {
      console.error("Error conectando a MongoDB:", error);
      throw error;
    }
  }

  return { client, db };
}