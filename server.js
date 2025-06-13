// Import required dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { query } = require('./db/db_utils');

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define port
const PORT = process.env.PORT || 3000;

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API Routes
app.get('/api/photos', async (req, res) => {
  try {
    const photos = await query(
      'SELECT id, name, image_url, difficulty, original_width_px, original_height_px FROM photos'
    );
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

app.get('/api/photos/:id/characters', async (req, res) => {
  try {
    const photoId = parseInt(req.params.id);
    
    // Validate that id is a valid integer
    if (isNaN(photoId) || photoId <= 0) {
      return res.status(400).json({ error: 'Invalid photo ID. Must be a positive integer.' });
    }
    
    // Check if the photo exists
    const photos = await query('SELECT id FROM photos WHERE id = $1', [photoId]);
    if (photos.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Fetch characters for the photo
    const characters = await query(
      'SELECT id, photo_id, name, image_url, x1_percent, y1_percent, x2_percent, y2_percent FROM characters WHERE photo_id = $1',
      [photoId]
    );
    
    res.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 