const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create a new Pool instance
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

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