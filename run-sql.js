const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL);

async function run() {
  try {
    await sql`ALTER TABLE leads ADD COLUMN passcode text DEFAULT ''`;
    console.log("Added passcode");
  } catch (e) { console.error(e.message); }
  try {
    await sql`ALTER TABLE leads ADD COLUMN biometrics_enabled boolean DEFAULT false`;
    console.log("Added biometrics_enabled");
  } catch (e) { console.error(e.message); }
  try {
    await sql`ALTER TABLE leads ADD COLUMN auto_lock_time text DEFAULT '0'`;
    console.log("Added auto_lock_time");
  } catch (e) { console.error(e.message); }
  try {
    await sql`ALTER TABLE leads ADD COLUMN push_subscription jsonb`;
    console.log("Added push_subscription");
  } catch (e) { console.error(e.message); }
  
  try {
    await sql`ALTER TABLE admins ADD COLUMN push_subscription jsonb`;
    console.log("Added admin push_subscription");
  } catch (e) { console.error(e.message); }

  console.log("Done");
}

run();
