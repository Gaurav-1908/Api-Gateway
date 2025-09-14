import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017"; // adjust for Atlas/GCP if needed
const dbName = "API-GATEWAY";
let client;
let db;

async function getDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB (Next.js API route)");
  }
  return db;
}

export async function GET() {
  try {
    const db = await getDB();
    const logs = await db
      .collection("LOGS")
      .find({})
      .sort({ timestamp: -1 })
      .limit(5000)
      .toArray();

    return Response.json(logs);
  } catch (err) {
    console.error("❌ Error fetching logs:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch logs" }), {
      status: 500,
    });
  }
}
