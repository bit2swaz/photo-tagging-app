// Import required dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { query } = require('./db/db_utils');
const crypto = require('crypto');

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define port
const PORT = process.env.PORT || 3000;

// Store active game sessions in memory
const activeGameSessions = new Map();

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

app.get('/api/photos/:id', async (req, res) => {
  try {
    const photoId = parseInt(req.params.id);
    
    // Validate that id is a valid integer
    if (isNaN(photoId) || photoId <= 0) {
      return res.status(400).json({ error: 'Invalid photo ID. Must be a positive integer.' });
    }
    
    // Fetch the photo
    const photos = await query(
      'SELECT id, name, image_url, difficulty, original_width_px, original_height_px FROM photos WHERE id = $1',
      [photoId]
    );
    
    if (photos.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    res.json(photos[0]);
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ error: 'Failed to fetch photo' });
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

// Game Session Management
app.post('/api/game/start', async (req, res) => {
  try {
    const { photoId, playerName } = req.body;
    
    // Validate inputs
    if (!photoId || isNaN(parseInt(photoId)) || parseInt(photoId) <= 0) {
      return res.status(400).json({ error: 'Invalid photo ID. Must be a positive integer.' });
    }
    
    if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
      return res.status(400).json({ error: 'Player name is required.' });
    }
    
    // Check if the photo exists
    const photos = await query('SELECT id FROM photos WHERE id = $1', [parseInt(photoId)]);
    if (photos.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Fetch the total count of characters for this photo
    const characterCountResult = await query('SELECT COUNT(*) as count FROM characters WHERE photo_id = $1', [parseInt(photoId)]);
    const totalCharacters = parseInt(characterCountResult[0].count);
    
    // Generate a unique game session ID
    const gameSessionId = crypto.randomUUID();
    const startTime = Date.now();
    
    // Store the game session
    activeGameSessions.set(gameSessionId, {
      photoId: parseInt(photoId),
      playerName,
      startTime,
      foundCharacters: [],
      totalCharacters
    });
    
    // Return the game session details
    res.status(201).json({
      gameSessionId,
      startTime
    });
    
  } catch (error) {
    console.error('Error starting game session:', error);
    res.status(500).json({ error: 'Failed to start game session' });
  }
});

app.post('/api/game/validate', async (req, res) => {
  try {
    const { gameSessionId, characterName, clickX_percent, clickY_percent } = req.body;
    
    // Validate inputs
    if (!gameSessionId || typeof gameSessionId !== 'string') {
      return res.status(400).json({ error: 'Valid game session ID is required.' });
    }
    
    if (!characterName || typeof characterName !== 'string') {
      return res.status(400).json({ error: 'Character name is required.' });
    }
    
    if (clickX_percent === undefined || clickY_percent === undefined || 
        isNaN(parseFloat(clickX_percent)) || isNaN(parseFloat(clickY_percent))) {
      return res.status(400).json({ error: 'Valid click coordinates are required.' });
    }
    
    // Retrieve the game session
    const gameSession = activeGameSessions.get(gameSessionId);
    if (!gameSession) {
      return res.status(404).json({ error: 'Game session not found. The session may have expired.' });
    }
    
    // Fetch the character data
    const characters = await query(
      'SELECT id, name, x1_percent, y1_percent, x2_percent, y2_percent FROM characters WHERE photo_id = $1 AND name = $2',
      [gameSession.photoId, characterName]
    );
    
    if (characters.length === 0) {
      return res.status(404).json({ error: 'Character not found for this photo.' });
    }
    
    const character = characters[0];
    
    // Check if character has already been found
    if (gameSession.foundCharacters.includes(character.id)) {
      return res.json({ 
        isCorrect: false,
        message: 'This character has already been found.',
        isGameComplete: gameSession.foundCharacters.length === gameSession.totalCharacters
      });
    }
    
    // Convert coordinates to numbers for comparison
    const x = parseFloat(clickX_percent);
    const y = parseFloat(clickY_percent);
    const x1 = parseFloat(character.x1_percent);
    const y1 = parseFloat(character.y1_percent);
    const x2 = parseFloat(character.x2_percent);
    const y2 = parseFloat(character.y2_percent);
    
    // Check if click is within character's bounding box
    const isWithinBounds = x >= x1 && x <= x2 && y >= y1 && y <= y2;
    
    if (isWithinBounds) {
      // Add character to found characters
      gameSession.foundCharacters.push(character.id);
      
      // Check if the game is complete
      const isGameComplete = gameSession.foundCharacters.length === gameSession.totalCharacters;
      
      // Return success response with character details
      return res.json({
        isCorrect: true,
        characterId: character.id,
        x1_percent: character.x1_percent,
        y1_percent: character.y1_percent,
        x2_percent: character.x2_percent,
        y2_percent: character.y2_percent,
        isGameComplete
      });
    } else {
      // Return incorrect response
      return res.json({
        isCorrect: false,
        isGameComplete: false
      });
    }
    
  } catch (error) {
    console.error('Error validating character click:', error);
    res.status(500).json({ error: 'Failed to validate character click' });
  }
});

// Score submission endpoint
app.post('/api/scores', async (req, res) => {
  try {
    const { gameSessionId, playerName } = req.body;
    
    // Validate inputs
    if (!gameSessionId || typeof gameSessionId !== 'string') {
      return res.status(400).json({ error: 'Valid game session ID is required.' });
    }
    
    if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
      return res.status(400).json({ error: 'Player name is required.' });
    }
    
    // Retrieve the game session
    const gameSession = activeGameSessions.get(gameSessionId);
    if (!gameSession) {
      return res.status(404).json({ error: 'Game session not found. The session may have expired.' });
    }
    
    // Calculate time taken
    const time_taken_ms = Date.now() - gameSession.startTime;
    
    // Save score to database
    await query(
      'INSERT INTO scores (photo_id, player_name, time_taken_ms) VALUES ($1, $2, $3)',
      [gameSession.photoId, playerName, time_taken_ms]
    );
    
    // Delete the game session as it's completed
    activeGameSessions.delete(gameSessionId);
    
    // Return success response
    res.status(201).json({
      message: 'Score saved successfully',
      timeTaken: time_taken_ms
    });
    
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Leaderboard endpoint
app.get('/api/scores/:photoId/leaderboard', async (req, res) => {
  try {
    const photoId = parseInt(req.params.photoId);
    
    // Validate that photoId is a valid integer
    if (isNaN(photoId) || photoId <= 0) {
      return res.status(400).json({ error: 'Invalid photo ID. Must be a positive integer.' });
    }
    
    // Check if the photo exists
    const photos = await query('SELECT id FROM photos WHERE id = $1', [photoId]);
    if (photos.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Fetch leaderboard scores
    const scores = await query(
      'SELECT player_name, time_taken_ms, created_at FROM scores WHERE photo_id = $1 ORDER BY time_taken_ms ASC LIMIT 10',
      [photoId]
    );
    
    res.json(scores);
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 