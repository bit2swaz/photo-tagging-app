const fs = require('fs');
const path = require('path');
const { pool, query } = require('./db_utils');

async function setupDatabase() {
  console.log('Setting up database...');
  
  try {
    // Read the schema SQL file
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'db_schema.sql'), 'utf8');
    
    // Execute the schema SQL
    console.log('Creating database schema...');
    await query(schemaSQL);
    console.log('✅ Database schema created successfully!');
    
    // Seed the database with sample data
    console.log('\nSeeding database with sample data...');
    
    // Insert sample photos
    const photos = [
      {
        name: 'Park Safari',
        image_url: '/images/easy_map_final.png',
        difficulty: 'easy',
        original_width_px: 3327,
        original_height_px: 4412
      },
      {
        name: 'Pool Party',
        image_url: '/images/medium_map_final.png',
        difficulty: 'medium',
        original_width_px: 3416,
        original_height_px: 4545
      },
      {
        name: 'Winter Whimsy',
        image_url: '/images/hard_map_final.png',
        difficulty: 'hard',
        original_width_px: 3410,
        original_height_px: 4545
      }
    ];
    
    for (const photo of photos) {
      const result = await query(
        'INSERT INTO photos (name, image_url, difficulty, original_width_px, original_height_px) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [photo.name, photo.image_url, photo.difficulty, photo.original_width_px, photo.original_height_px]
      );
      
      const photoId = result[0].id;
      console.log(`✅ Added photo: ${photo.name} (ID: ${photoId})`);
      
      // Insert characters for each photo
      const characters = [];
      
      if (photo.name === 'Park Safari') {
        characters.push(
          {
            name: 'Waldo',
            image_url: '/images/characters/waldo.png',
            x1_percent: 15.25,
            y1_percent: 45.75,
            x2_percent: 22.50,
            y2_percent: 65.25
          },
          {
            name: 'Wizard',
            image_url: '/images/characters/wizard.png',
            x1_percent: 65.30,
            y1_percent: 70.20,
            x2_percent: 72.80,
            y2_percent: 85.60
          },
          {
            name: 'Odlaw',
            image_url: '/images/characters/odlaw.png',
            x1_percent: 82.10,
            y1_percent: 25.40,
            x2_percent: 92.30,
            y2_percent: 45.70
          }
        );
      } else if (photo.name === 'Pool Party') {
        characters.push(
          {
            name: 'Waldo',
            image_url: '/images/characters/waldo.png',
            x1_percent: 75.20,
            y1_percent: 10.50,
            x2_percent: 90.40,
            y2_percent: 25.80
          },
          {
            name: 'Wizard',
            image_url: '/images/characters/wizard.png',
            x1_percent: 25.60,
            y1_percent: 40.30,
            x2_percent: 32.90,
            y2_percent: 60.70
          },
          {
            name: 'Odlaw',
            image_url: '/images/characters/odlaw.png',
            x1_percent: 45.10,
            y1_percent: 65.40,
            x2_percent: 52.30,
            y2_percent: 80.20
          },
          {
            name: 'Wenda',
            image_url: '/images/characters/wenda.png',
            x1_percent: 10.70,
            y1_percent: 75.90,
            x2_percent: 18.40,
            y2_percent: 90.60
          },
          {
            name: 'Whitebeard',
            image_url: '/images/characters/whitebeard.png',
            x1_percent: 60.30,
            y1_percent: 15.20,
            x2_percent: 68.90,
            y2_percent: 35.80
          }
        );
      } else if (photo.name === 'Winter Whimsy') {
        characters.push(
          {
            name: 'Waldo',
            image_url: '/images/characters/waldo.png',
            x1_percent: 15.70,
            y1_percent: 35.90,
            x2_percent: 22.40,
            y2_percent: 50.60
          },
          {
            name: 'Wizard',
            image_url: '/images/characters/wizard.png',
            x1_percent: 60.30,
            y1_percent: 45.20,
            x2_percent: 68.90,
            y2_percent: 65.80
          },
          {
            name: 'Odlaw',
            image_url: '/images/characters/odlaw.png',
            x1_percent: 80.10,
            y1_percent: 20.40,
            x2_percent: 95.60,
            y2_percent: 30.20
          },
          {
            name: 'Wenda',
            image_url: '/images/characters/wenda.png',
            x1_percent: 33.70,
            y1_percent: 55.90,
            x2_percent: 42.40,
            y2_percent: 70.60
          },
          {
            name: 'Whitebeard',
            image_url: '/images/characters/whitebeard.png',
            x1_percent: 50.30,
            y1_percent: 25.20,
            x2_percent: 58.90,
            y2_percent: 45.80
          },
          {
            name: 'Woof',
            image_url: '/images/characters/woof.png',
            x1_percent: 88.10,
            y1_percent: 75.40,
            x2_percent: 95.60,
            y2_percent: 85.20
          },
          {
            name: 'Woof Tail',
            image_url: '/images/characters/woof-tail.png',
            x1_percent: 5.70,
            y1_percent: 85.90,
            x2_percent: 12.40,
            y2_percent: 95.60
          }
        );
      }
      
      for (const character of characters) {
        await query(
          'INSERT INTO characters (photo_id, name, image_url, x1_percent, y1_percent, x2_percent, y2_percent) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [photoId, character.name, character.image_url, character.x1_percent, character.y1_percent, character.x2_percent, character.y2_percent]
        );
        console.log(`  - Added character: ${character.name} to ${photo.name}`);
      }
    }
    
    console.log('\n✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

setupDatabase().catch(console.error);