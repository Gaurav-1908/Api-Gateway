const conf = require("../conf.json");

const { MongoClient } = require("mongodb");

class Logger {
  constructor() {
    this.mongoUrl = conf.mongo.url;
    this.dbName = "API-GATEWAY";
    this.collectionName = "LOGS";
    this.messageBuffer = [];
    this.client = new MongoClient(this.mongoUrl);

    this.init();
    this.startFlushInterval();
  }

  async init() {
    try {
      await this.client.connect();
      this.collection = this.client.db(this.dbName).collection(this.collectionName);
      console.log("✅ Connected to MongoDB for logging");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
    }
  }

  write(message) {
    // push raw object (not stringified)
    this.messageBuffer.push({
      ...message,
      timestamp: new Date(), // add timestamp automatically
    });
  }

  async flush() {
    if (this.messageBuffer.length === 0 || !this.collection) return;

    const dataToInsert = this.messageBuffer;
    this.messageBuffer = []; // clear buffer

    try {
      await this.collection.insertMany(dataToInsert);
      console.log(`✅ Flushed ${dataToInsert.length} logs to MongoDB`);
    } catch (err) {
      console.error("❌ Error writing logs to MongoDB:", err);
      // requeue messages if failed
      this.messageBuffer.unshift(...dataToInsert);
    }
  }

  startFlushInterval() {
    setInterval(() => {
      this.flush();
    }, 10_000); // every 10 seconds
  }
}

module.exports = Logger;

