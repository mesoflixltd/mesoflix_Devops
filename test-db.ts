import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./src/db/schema";
import { config } from "dotenv";

config(); // load .env

async function test() {
  const databaseUrl = "postgresql://neondb_owner:npg_JdFtWl62gXEp@ep-quiet-hall-am16sq3p.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  try {
    console.log("Fetching leads...");
    const leads = await db.select().from(schema.leads).limit(1);
    console.log("Leads success:", leads.length);

    console.log("Fetching projects...");
    const projects = await db.select().from(schema.projects).limit(1);
    console.log("Projects success:", projects.length);
    
    console.log("Fetching admins...");
    const admins = await db.select().from(schema.admins).limit(1);
    console.log("Admins success:", admins.length);

  } catch (error) {
    console.error("DB Error:", error);
  }
}

test();
