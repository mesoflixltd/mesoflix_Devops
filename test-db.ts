import "dotenv/config";
import { db } from "./src/db";
import { admins } from "./src/db/schema";

async function test() {
  try {
    const result = await db.select().from(admins).limit(1);
    console.log("Database connection successful.");
    if (result.length > 0) {
      console.log("Admin found:", result[0].email);
      console.log("Magic Key:", result[0].magicKey);
    } else {
      console.log("No admin found.");
    }
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

test();
