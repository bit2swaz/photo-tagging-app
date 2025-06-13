import React, { useState, useEffect } from 'react';
import styles from '../styles/PlayGameStartPage.module.css';

const PlayGameStartPage = () => {
  const [playerName, setPlayerName] = useState('');
  const [selectedMapId, setSelectedMapId] = useState(null);
  const [maps, setMaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch maps from backend
  useEffect(() => {
    const fetchMaps = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/api/photos');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setMaps(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching maps:', err);
        setError('Failed to load maps. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaps();
  }, []);

  // Handle player name input change
  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  // Handle play as guest button click
  const handlePlayAsGuest = () => {
    const randomNumber = Math.floor(Math.random() * 10000);
    setPlayerName(`Guest${randomNumber}`);
  };

  // Handle map selection
  const handleMapSelect = (mapId) => {
    setSelectedMapId(mapId);
  };

  // Get estimated time based on difficulty
  const getEstimatedTime = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '2-5 min';
      case 'medium':
        return '5-10 min';
      case 'hard':
        return '10-15 min';
      default:
        return 'varies';
    }
  };

  // Get character count based on difficulty
  const getCharacterCount = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 3;
      case 'medium':
        return 5;
      case 'hard':
        return 7;
      default:
        return '?';
    }
  };

  // Check if Start Game button should be enabled
  const isStartButtonDisabled = !playerName || !selectedMapId;

  // Handle start game button click
  const handleStartGame = () => {
    // This would typically navigate to the game screen or dispatch an action
    // For now, we'll just log the selected options
    console.log('Starting game with:', {
      playerName,
      mapId: selectedMapId
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Game Setup</h1>

      {/* Player Name Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Player Name</h2>
        <div className={styles.nameInputContainer}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.nameInput}
              placeholder="Enter your name"
              value={playerName}
              onChange={handleNameChange}
            />
            <button 
              className={styles.guestButton}
              onClick={handlePlayAsGuest}
            >
              Play as Guest
            </button>
          </div>
          {playerName && (
            <p>You'll play as: <strong>{playerName}</strong></p>
          )}
        </div>
      </section>

      {/* Map Selection Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Choose Your Map</h2>
        
        {isLoading && <p>Loading maps...</p>}
        
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}
        
        {!isLoading && !error && maps.length === 0 && (
          <p>No maps available. Please check back later.</p>
        )}
        
        {!isLoading && !error && maps.length > 0 && (
          <div className={styles.difficultyOptions}>
            {maps.map((map) => (
              <div
                key={map.id}
                className={`${styles.difficultyCard} ${selectedMapId === map.id ? styles.selected : ''}`}
                onClick={() => handleMapSelect(map.id)}
              >
                <img
                  src={map.image_url}
                  alt={map.name}
                  className={styles.cardImage}
                />
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{map.name}</h3>
                  <p className={styles.cardDescription}>{map.difficulty} Difficulty</p>
                  <div className={styles.cardInfo}>
                    <span>{getCharacterCount(map.difficulty)} characters</span>
                    <span>~{getEstimatedTime(map.difficulty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Start Game Button */}
      <div className={styles.startButtonContainer}>
        <button
          className={styles.startButton}
          disabled={isStartButtonDisabled}
          onClick={handleStartGame}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default PlayGameStartPage; 