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
        ('Forest Adventure', '/images/easy_map.jpg', 'easy', 1000, 750),
        ('City Chaos', '/images/medium_map.jpg', 'medium', 1200, 800),
        ('Space Station', '/images/hard_map.jpg', 'hard', 1500, 1000)
      RETURNING id;
    `);
    
    const photoIds = photosResult.rows.map(row => row.id);
    console.log('Sample photos added successfully');

    // Insert sample characters for each photo
    // Easy photo (3 characters)
    await client.query(`
      INSERT INTO characters (photo_id, name, image_url, x1_percent, y1_percent, x2_percent, y2_percent)
      VALUES 
        (${photoIds[0]}, 'Waldo', '/icons/waldo_icon.png', 10.00, 15.00, 15.00, 20.00),
        (${photoIds[0]}, 'Wizard', '/icons/wizard_icon.png', 45.00, 50.00, 50.00, 55.00),
        (${photoIds[0]}, 'Odlaw', '/icons/odlaw_icon.png', 75.00, 30.00, 80.00, 35.00);
    `);

    // Medium photo (5 characters)
    await client.query(`
      INSERT INTO characters (photo_id, name, image_url, x1_percent, y1_percent, x2_percent, y2_percent)
      VALUES 
        (${photoIds[1]}, 'Waldo', '/icons/waldo_icon.png', 20.00, 25.00, 25.00, 30.00),
        (${photoIds[1]}, 'Wizard', '/icons/wizard_icon.png', 55.00, 40.00, 60.00, 45.00),
        (${photoIds[1]}, 'Odlaw', '/icons/odlaw_icon.png', 85.00, 70.00, 90.00, 75.00),
        (${photoIds[1]}, 'Wenda', '/icons/wenda_icon.png', 30.00, 60.00, 35.00, 65.00),
        (${photoIds[1]}, 'Whitebeard', '/icons/whitebeard_icon.png', 65.00, 15.00, 70.00, 20.00);
    `);

    // Hard photo (7 characters)
    await client.query(`
      INSERT INTO characters (photo_id, name, image_url, x1_percent, y1_percent, x2_percent, y2_percent)
      VALUES 
        (${photoIds[2]}, 'Waldo', '/icons/waldo_icon.png', 15.00, 35.00, 20.00, 40.00),
        (${photoIds[2]}, 'Wizard', '/icons/wizard_icon.png', 45.00, 60.00, 50.00, 65.00),
        (${photoIds[2]}, 'Odlaw', '/icons/odlaw_icon.png', 75.00, 20.00, 80.00, 25.00),
        (${photoIds[2]}, 'Wenda', '/icons/wenda_icon.png', 25.00, 75.00, 30.00, 80.00),
        (${photoIds[2]}, 'Whitebeard', '/icons/whitebeard_icon.png', 60.00, 10.00, 65.00, 15.00),
        (${photoIds[2]}, 'Woof', '/icons/woof_icon.png', 90.00, 45.00, 95.00, 50.00),
        (${photoIds[2]}, 'Wilma', '/icons/wilma_icon.png', 40.00, 85.00, 45.00, 90.00);
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