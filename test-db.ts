import { db } from "./src/db/index";
import { leads } from "./src/db/schema";
import "dotenv/config";

async function testConnection() {
  try {
    console.log("Testing Neon Connection...");
    // Just a simple query
    const result = await db.select().from(leads).limit(1);
    console.log("Connection Successful:", result);
  } catch (error) {
    console.error("Connection Failed:", error);
  }
}

testConnection();
