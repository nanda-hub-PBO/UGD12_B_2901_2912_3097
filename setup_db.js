const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
})

async function setup() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS cargo (
        id VARCHAR(20) PRIMARY KEY,
        resi VARCHAR(50) NOT NULL,
        "shippingDate" DATE,
        "senderName" VARCHAR(255) NOT NULL,
        "receiverName" VARCHAR(255) NOT NULL,
        "phoneNumber" VARCHAR(20),
        "originCity" VARCHAR(100),
        "destinationCity" VARCHAR(100),
        "itemType" VARCHAR(100),
        "itemName" VARCHAR(255) NOT NULL,
        "itemWeight" NUMERIC,
        "shippingPrice" NUMERIC NOT NULL,
        "vehicleType" VARCHAR(100),
        "shippingType" VARCHAR(50),
        "deliveryStatus" VARCHAR(50),
        "itemStatus" VARCHAR(50),
        "transactionStatus" VARCHAR(50),
        description TEXT
      );
    `)
    console.log('Cargo table created successfully')

    await client.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        code VARCHAR(50),
        capacity VARCHAR(100),
        status VARCHAR(50)
      );
    `)
    console.log('Vehicles table created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

setup()
