// server/server.js
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

const uri = "mongodb://localhost:27017"; // adjust if using GCP/Atlas
const client = new MongoClient(uri);
const dbName = "API-GATEWAY"; // replace with your DB name

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

connectDB();

// API endpoint: fetch logs (latest first)
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await db
      .collection("LOGS") // replace with your collection name
      .find({})
      .sort({ timestamp: -1 }) // newest first
      .limit(5000) // adjust cap
      .toArray();

    res.json(logs);
  } catch (err) {
    console.error("❌ Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
