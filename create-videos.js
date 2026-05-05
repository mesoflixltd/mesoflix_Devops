const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log("Creating videos table...");
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS videos (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        lead_id uuid REFERENCES leads(id) NOT NULL,
        title text NOT NULL,
        description text,
        youtube_url text NOT NULL,
        bot_name text,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log("Videos table created successfully");
  } catch (e) {
    console.error("Failed to create videos table:", e.message);
  }
  console.log("Done");
}

run();
