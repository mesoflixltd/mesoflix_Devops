import { config } from "dotenv";
config();
import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    await sql`ALTER TABLE projects ADD COLUMN github_repo text;`;
    console.log("Column added successfully.");
  } catch (e: any) {
    if (e.message.includes("already exists")) {
       console.log("Column already exists.");
    } else {
       console.error("Error adding column:", e);
    }
  }
}
main();
