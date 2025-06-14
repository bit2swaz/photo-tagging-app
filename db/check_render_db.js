const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns').promises;

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkRenderDatabaseConnection() {
  console.log('Testing Render/Supabase database connection...');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.log('Please set DATABASE_URL in your .env file or in your Render environment variables.');
    return;
  }
  
  console.log('DATABASE_URL is set. Attempting to connect...');
  
  // Extract hostname from DATABASE_URL for DNS lookup
  try {
    const url = new URL(process.env.DATABASE_URL);
    const hostname = url.hostname;
    
    console.log(`Performing DNS lookup for hostname: ${hostname}`);
    try {
      const addresses = await dns.lookup(hostname, { all: true });
      console.log('DNS lookup results:');
      addresses.forEach(a => {
        console.log(`- ${a.address} (${a.family === 4 ? 'IPv4' : 'IPv6'})`);
      });
    } catch (dnsError) {
      console.error('DNS lookup failed:', dnsError.message);
    }
  } catch (urlError) {
    console.error('Failed to parse DATABASE_URL:', urlError.message);
  }
  
  // Create a pool specifically for the remote database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('Attempting to connect to the database...');
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Successfully connected to the remote database!');
    
    // Test query execution
    console.log('\nTesting simple query...');
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Query executed successfully!');
    console.log('Current database time:', result.rows[0].current_time);
    
    // Check if tables exist
    console.log('\nChecking for required tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name IN ('photos', 'characters', 'scores')
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('Found tables:', tables);
    
    const requiredTables = ['photos', 'characters', 'scores'];
    const missingTables = requiredTables.filter(table => !tables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('❌ Missing required tables:', missingTables);
      console.log('\nYou need to create the missing tables. Run the db_setup.js script on your production database.');
    } else {
      console.log('✅ All required tables exist!');
      
      // Check if photos table has data
      console.log('\nChecking for data in photos table...');
      const photosResult = await client.query('SELECT COUNT(*) FROM photos');
      const photoCount = parseInt(photosResult.rows[0].count);
      
      if (photoCount > 0) {
        console.log(`✅ Photos table has ${photoCount} records`);
        
        // Show sample photo data
        const samplePhotoResult = await client.query('SELECT id, name, image_url, difficulty FROM photos LIMIT 3');
        console.log('Sample photos:');
        samplePhotoResult.rows.forEach(photo => {
          console.log(`  - ID ${photo.id}: ${photo.name} (${photo.difficulty})`);
          console.log(`    Image URL: ${photo.image_url}`);
        });
      } else {
        console.log('❌ Photos table is empty! You need to add some photos.');
        console.log('\nRun the db_setup.js script to seed your database with sample data.');
      }
    }
    
    client.release();
  } catch (error) {
    console.error('❌ Remote database connection test failed:', error);
    
    // Provide helpful troubleshooting tips
    console.log('\n--- TROUBLESHOOTING TIPS ---');
    console.log('1. Check if your DATABASE_URL is correct');
    console.log('2. Ensure your IP is allowed in Supabase/database firewall settings');
    console.log('3. Verify SSL settings are correct for your database provider');
    console.log('4. Check if your database server is running and accessible');
    console.log('5. Make sure your Render service has the DATABASE_URL environment variable set');
    console.log('\nYou may need to use a direct connection from Render to Supabase instead of trying to connect locally.');
  } finally {
    // Close the pool
    await pool.end();
  }
}

checkRenderDatabaseConnection().catch(console.error); 