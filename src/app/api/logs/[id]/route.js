import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
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

export async function GET(req, { params }) {
  try {
    const db = await getDB();

    // convert string to ObjectId
    const log = await db
      .collection("LOGS")
      .findOne({ _id: new ObjectId(params.id) });

    if (!log) {
      return new Response(JSON.stringify({ error: "Log not found" }), {
        status: 404,
      });
    }

    return Response.json(log);
  } catch (err) {
    console.error("❌ Error fetching log:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch log" }), {
      status: 500,
    });
  }
}
