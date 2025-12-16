const mongoose = require("mongoose");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in environment");
  process.exit(1);
}

async function dropIndex() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    const collection = mongoose.connection.collection("profiles");

    // List indexes before
    const indexes = await collection.indexes();
    console.log(
      "Current indexes:",
      indexes.map((i) => i.name)
    );

    if (indexes.find((i) => i.name === "email_1")) {
      console.log("Found 'email_1' index. Dropping...");
      await collection.dropIndex("email_1");
      console.log("Successfully dropped index 'email_1'");
    } else {
      console.log("'email_1' index not found.");
    }
  } catch (error) {
    console.error("Script error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
    process.exit(0);
  }
}

dropIndex();
