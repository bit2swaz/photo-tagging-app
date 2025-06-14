const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create a pool configuration based on environment
let poolConfig;

// Check if we're running in production (Render)
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  console.log('Using production database configuration with DATABASE_URL');
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
} else {
  // Use local database configuration for development
  console.log('Using local database configuration');
  poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  };
}

// Create the pool with the appropriate configuration
const pool = new Pool(poolConfig);

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