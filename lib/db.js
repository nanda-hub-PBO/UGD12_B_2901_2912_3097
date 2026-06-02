import { Pool } from 'pg'

let connectionString = process.env.POSTGRES_URL || "postgresql://neondb_owner:npg_I7OuB8rxKmbZ@ep-orange-forest-a44tkobt-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

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
