const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Altering cargo table...');
    await pool.query(`
      ALTER TABLE cargo 
      ADD COLUMN IF NOT EXISTS item_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS item_status VARCHAR(50),
      ADD COLUMN IF NOT EXISTS transaction_status VARCHAR(50)
    `);
    console.log('Success!');
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
