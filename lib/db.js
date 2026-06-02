import { Pool } from 'pg'

let connectionString = process.env.POSTGRES_URL

if (connectionString && connectionString.includes('?')) {
  connectionString = connectionString.split('?')[0]
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

export default pool
