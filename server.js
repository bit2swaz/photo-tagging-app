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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 