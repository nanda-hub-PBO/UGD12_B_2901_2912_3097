const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    const cargo = await pool.query('SELECT * FROM cargo');
    console.log('CARGO:', cargo.rows);
    const vehicles = await pool.query('SELECT * FROM vehicles');
    console.log('VEHICLES:', vehicles.rows);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
test();
