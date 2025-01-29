import { MongoClient, Database } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

// URI et nom de la base MongoDB
const MONGO_URI = Deno.env.get("MONGO_URI") || "mongodb://localhost:27017";
const MONGO_DB_NAME = Deno.env.get("MONGO_DB_NAME") || "my_database";

// Création du client MongoDB
const client = new MongoClient();

try {
  await client.connect(MONGO_URI);
  console.log("✅ Connecté à MongoDB");
} catch (err) {
  console.error("❌ Erreur de connexion à MongoDB :", err);
}

// Export de la base MongoDB
const db: Database = client.database(MONGO_DB_NAME);
export { db };