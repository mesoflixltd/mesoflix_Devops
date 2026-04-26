import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

let dbInstance: any = null;

export const getDb = () => {
  if (!dbInstance) {
    if (!databaseUrl) {
      if (process.env.NODE_ENV === "production") {
        console.warn("WARNING: DATABASE_URL is not set. Database operations will fail.");
      }
      // Provide a minimal fallback for build-time safety
      const sql = neon("postgresql://mock:mock@localhost:5432/mock"); 
      dbInstance = drizzle(sql, { schema });
    } else {
      const sql = neon(databaseUrl);
      dbInstance = drizzle(sql, { schema });
    }
  }
  return dbInstance;
};

export const db = new Proxy({} as any, {
  get(target, prop) {
    return getDb()[prop];
  }
});
