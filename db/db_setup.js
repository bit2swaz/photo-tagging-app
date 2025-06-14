const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure PostgreSQL client
// // --- CHANGES START HERE ---
// const client = new Client({
//     // Prioritize DATABASE_URL for remote/production connections (like Supabase)
//     connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
//     // REQUIRED for secure connections to hosted databases like Supabase from local machine
//     // This makes sure SSL is used when DATABASE_URL is present, but not for local non-SSL DBs.
//     ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
// });
// // --- CHANGES END HERE ---

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
                (${photoIds[0]}, 'Zebra', '/icons/zebra_easy.png', 28.46, 35.39, 35.94, 42.26),
                (${photoIds[0]}, 'Hippo', '/icons/hippo_easy.png', 31.68, 2.87, 43.66, 8.35),
                (${photoIds[0]}, 'Pig', '/icons/pig_easy.png', 19.47, 74.35, 29.95, 79.04);
        `);

        // Medium photo (5 characters)
        await client.query(`
            INSERT INTO characters (photo_id, name, image_url, x1_percent, y1_percent, x2_percent, y2_percent)
            VALUES 
                (${photoIds[1]}, 'Crab', '/icons/crab_medium.png', 10.25, 90.03, 18.66, 96.71),
                (${photoIds[1]}, 'Glass', '/icons/glass_medium.png', 69.59, 59.62, 74.77, 66.90),
                (${photoIds[1]}, 'Strawberry', '/icons/strawberry_medium.png', 66.71, 38.99, 69.93, 42.03),
                (${photoIds[1]}, 'Boat', '/icons/boat_medium.png', 10.60, 67.59, 16.59, 73.31),
                (${photoIds[1]}, 'Whale', '/icons/whale_medium.png', 44.93, 55.46, 51.73, 58.75);
        `);

        // Hard photo (7 characters)
        await client.query(`
            INSERT INTO characters (photo_id, name, image_url, x1_percent, y1_percent, x2_percent, y2_percent)
            VALUES 
                (${photoIds[2]}, 'Bell', '/icons/bell_hard.png', 87.10, 5.36, 92.28, 9.86),
                (${photoIds[2]}, 'Candy Cane', '/icons/candycane_hard.png', 7.95, 74.39, 16.13, 76.30),
                (${photoIds[2]}, 'Carrot', '/icons/carrot_hard.png', 16.01, 17.99, 21.31, 20.16),
                (${photoIds[2]}, 'Cup', '/icons/cup_hard.png', 19.70, 43.86, 27.76, 48.62),
                (${photoIds[2]}, 'Ice Cream', '/icons/icecream_hard.png', 39.06, 39.88, 45.05, 44.98),
                (${photoIds[2]}, 'Reindeer', '/icons/reindeer_hard.png', 62.10, 83.22, 72.12, 87.46),
                (${photoIds[2]}, 'Snowflake', '/icons/snowflake_hard.png', 43.89, 8.04, 50.00, 12.54);
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