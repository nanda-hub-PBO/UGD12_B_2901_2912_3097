const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateCargo() {
  try {
    // Update cargo items with test data for itemName, itemStatus, and transactionStatus
    await pool.query(`
      UPDATE cargo 
      SET 
        item_name = CASE 
          WHEN resi = 'RESI-2026-0004' THEN 'Elektronik Consumer'
          WHEN resi = 'RESI-2026-0003' THEN 'Tekstil Premium'
          WHEN resi = 'RESI-2026-0001' THEN 'Peralatan Rumah Tangga'
          ELSE item_name
        END,
        item_status = CASE 
          WHEN resi = 'RESI-2026-0004' THEN 'Diproses'
          WHEN resi = 'RESI-2026-0003' THEN 'Sampai Tujuan'
          WHEN resi = 'RESI-2026-0001' THEN 'Diproses'
          ELSE item_status
        END,
        transaction_status = CASE 
          WHEN resi = 'RESI-2026-0004' THEN 'Menunggu Pembayaran'
          WHEN resi = 'RESI-2026-0003' THEN 'Sudah Dibayar'
          WHEN resi = 'RESI-2026-0001' THEN 'Menunggu Pembayaran'
          ELSE transaction_status
        END
      WHERE resi IN ('RESI-2026-0004', 'RESI-2026-0003', 'RESI-2026-0001')
    `);
    
    const result = await pool.query('SELECT * FROM cargo ORDER BY id DESC');
    console.log('Cargo data updated successfully!');
    console.log('Updated records:', result.rows);
  } catch (e) {
    console.error('Error updating cargo:', e);
  } finally {
    pool.end();
  }
}

updateCargo();
