const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    const cargoCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cargo'
    `);
    console.log('CARGO COLUMNS:', cargoCols.rows);
    
    const vehiclesCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'vehicles'
    `);
    console.log('VEHICLES COLUMNS:', vehiclesCols.rows);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
test();
