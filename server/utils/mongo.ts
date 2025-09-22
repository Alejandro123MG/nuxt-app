import { MongoClient } from "mongodb";

let client: MongoClient;
let db: any;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI as string);
    await client.connect();
    db = client.db(process.env.MONGO_DB);
    console.log("✅ Conectado a MongoDB Atlas");
  }
  return { client, db };
}
