const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create a new Pool instance with connection string for production or individual params for development
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  // Enable SSL when using DATABASE_URL (production/remote database)
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// // db/db_utils.js
// const pool = new Pool({
//   // PRIORITIZE DATABASE_URL for remote connections (like Supabase/Render)
//   connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
//   // REQUIRED for secure connections to hosted databases like Supabase from local machine
//   // Make sure this is only applied when connecting remotely/in production, otherwise it might
//   // cause issues with local self-signed certificates or non-SSL local DBs.
//   ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false // Only enable SSL if DATABASE_URL is present
// });

// Log any errors from idle clients
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Execute a SQL query using a connection from the pool
 * @param {string} text - The SQL query text
 * @param {Array} params - The parameters for the SQL query (optional)
 * @returns {Promise<Array>} - The rows returned from the query
 */
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Error executing query', { text, params, error });
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  query,
  pool,
}; 