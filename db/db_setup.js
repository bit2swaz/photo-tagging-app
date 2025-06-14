const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure PostgreSQL client
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Setup database function
async function setupDatabase() {
  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // Read and execute schema SQL
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'db_schema.sql'), 'utf8');
    await client.query(schemaSQL);
    console.log('Database schema created successfully');

    // Insert sample photos
    const photosResult = await client.query(`
      INSERT INTO photos (name, image_url, difficulty, original_width_px, original_height_px)
      VALUES 
        ('Park Safari', '/images/easy_map_final.png', 'easy', 3327, 4412),
        ('Pool Party', '/images/medium_map_final.png', 'medium', 3416, 4545),
        ('Winter Whimsy', '/images/hard_map_final.png', 'hard', 3410, 4545)
      RETURNING id;
    `);
    
    const photoIds = photosResult.rows.map(row => row.id);
    console.log('Sample photos added successfully');

    // Insert sample characters for each photo
    // Easy photo (3 characters)
    await client.query(`
      INSERT INTO characters (photo_id, name, image_url, x1_percent, y1_percent, x2_percent, y2_percent)
      VALUES 
        (${photoIds[0]}, 'Zebra', '/icons/zebra_easy.png', 10.00, 15.00, 15.00, 20.00),
        (${photoIds[0]}, 'Hippo', '/icons/hippo_easy.png', 45.00, 50.00, 50.00, 55.00),
        (${photoIds[0]}, 'Pig', '/icons/pig_easy.png', 75.00, 30.00, 80.00, 35.00);
    `);

    // Medium photo (5 characters)
    await client.query(`
      INSERT INTO characters (photo_id, name, image_url, x1_percent, y1_percent, x2_percent, y2_percent)
      VALUES 
        (${photoIds[1]}, 'Crab', '/icons/crab_medium.png', 20.00, 25.00, 25.00, 30.00),
        (${photoIds[1]}, 'Glass', '/icons/glass_medium.png', 55.00, 40.00, 60.00, 45.00),
        (${photoIds[1]}, 'Strawberry', '/icons/strawberry_medium.png', 85.00, 70.00, 90.00, 75.00),
        (${photoIds[1]}, 'Boat', '/icons/boat_medium.png', 30.00, 60.00, 35.00, 65.00),
        (${photoIds[1]}, 'Whale', '/icons/whale_medium.png', 65.00, 15.00, 70.00, 20.00);
    `);

    // Hard photo (7 characters)
    await client.query(`
      INSERT INTO characters (photo_id, name, image_url, x1_percent, y1_percent, x2_percent, y2_percent)
      VALUES 
        (${photoIds[2]}, 'Bell', '/icons/bell_hard.png', 15.00, 35.00, 20.00, 40.00),
        (${photoIds[2]}, 'Candy Cane', '/icons/candycane_hard.png', 45.00, 60.00, 50.00, 65.00),
        (${photoIds[2]}, 'Carrot', '/icons/carrot_hard.png', 75.00, 20.00, 80.00, 25.00),
        (${photoIds[2]}, 'Cup', '/icons/cup_hard.png', 25.00, 75.00, 30.00, 80.00),
        (${photoIds[2]}, 'Ice Cream', '/icons/icecream_hard.png', 60.00, 10.00, 65.00, 15.00),
        (${photoIds[2]}, 'Reindeer', '/icons/reindeer_hard.png', 90.00, 45.00, 95.00, 50.00),
        (${photoIds[2]}, 'Snowflake', '/icons/snowflake_hard.png', 40.00, 85.00, 45.00, 90.00);
    `);
    
    console.log('Sample characters added successfully');

    // Insert sample scores
    await client.query(`
      INSERT INTO scores (photo_id, player_name, time_taken_ms)
      VALUES 
        (${photoIds[0]}, 'PlayerOne', 45000),
        (${photoIds[0]}, 'FastFinder', 32000),
        (${photoIds[0]}, 'WaldoFan', 58000),
        (${photoIds[1]}, 'PlayerOne', 120000),
        (${photoIds[1]}, 'MasterSpotter', 95000),
        (${photoIds[2]}, 'ElitePlayer', 240000),
        (${photoIds[2]}, 'ProFinder', 210000);
    `);
    
    console.log('Sample scores added successfully');

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    // Close the client connection
    await client.end();
    console.log('Database connection closed');
  }
}

// Execute the setup function
setupDatabase().catch(err => {
  console.error('Failed to set up database:', err);
  process.exit(1);
}); 