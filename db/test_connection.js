const { pool, query } = require('./db_utils');

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    // Test basic connection
    console.log('Attempting to connect to database...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to the database!');
    
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
    } else {
      console.log('✅ All required tables exist!');
    }
    
    // Check if photos table has data
    console.log('\nChecking for data in photos table...');
    const photosResult = await client.query('SELECT COUNT(*) FROM photos');
    const photoCount = parseInt(photosResult.rows[0].count);
    
    if (photoCount > 0) {
      console.log(`✅ Photos table has ${photoCount} records`);
      
      // Show sample photo data
      const samplePhotoResult = await client.query('SELECT id, name, image_url, difficulty FROM photos LIMIT 1');
      console.log('Sample photo:', samplePhotoResult.rows[0]);
    } else {
      console.log('❌ Photos table is empty! You need to add some photos.');
    }
    
    client.release();
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    console.log('\nConnection details:');
    
    // Print connection details (careful with sensitive info)
    if (process.env.DATABASE_URL) {
      console.log('Using DATABASE_URL for connection');
      // Safely print part of the connection string without credentials
      const urlParts = process.env.DATABASE_URL.split('@');
      if (urlParts.length > 1) {
        console.log('Host part:', urlParts[1]);
      }
    } else {
      console.log('Using individual connection parameters:');
      console.log('- DB_HOST:', process.env.DB_HOST);
      console.log('- DB_DATABASE:', process.env.DB_DATABASE);
      console.log('- DB_PORT:', process.env.DB_PORT);
      console.log('- DB_USER: [HIDDEN]');
      console.log('- DB_PASSWORD: [HIDDEN]');
    }
  } finally {
    // Close the pool
    await pool.end();
  }
}

testDatabaseConnection().catch(console.error); 