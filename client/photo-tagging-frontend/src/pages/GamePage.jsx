import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/GamePage.module.css';

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photoId, playerName } = location.state || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [charactersToFind, setCharactersToFind] = useState([]);

  // Fetch photo and characters data
  useEffect(() => {
    const fetchGameData = async () => {
      if (!photoId) {
        setError('No photo selected. Please go back and select a photo.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch photo details
        const photoResponse = await fetch(`http://localhost:3000/api/photos/${photoId}`);
        if (!photoResponse.ok) {
          throw new Error(`Failed to fetch photo: ${photoResponse.status}`);
        }
        const photoData = await photoResponse.json();
        
        // Fetch characters for this photo
        const charactersResponse = await fetch(`http://localhost:3000/api/photos/${photoId}/characters`);
        if (!charactersResponse.ok) {
          throw new Error(`Failed to fetch characters: ${charactersResponse.status}`);
        }
        const charactersData = await charactersResponse.json();
        
        setCurrentPhoto(photoData);
        setCharactersToFind(charactersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError(`Failed to load game data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [photoId]);

  // Handle going back to selection screen
  const handleBackToSelection = () => {
    navigate('/play');
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div>Loading game...</div>
        <p className={styles.loadingText}>Preparing your photo tagging adventure</p>
      </div>
    );
  }

  // Render error state
  if (error || !photoId || !playerName) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.errorContainer}>
          <h3 className={styles.errorTitle}>Error</h3>
          <p>{error || 'Missing required game information. Please go back and try again.'}</p>
          <button className={styles.backButton} onClick={handleBackToSelection}>
            Back to Selection
          </button>
        </div>
      </div>
    );
  }

  // Render game if data is loaded
  return (
    <div className={styles.gamePage}>
      <header className={styles.gameHeader}>
        <div className={styles.playerInfo}>
          <span>Player: {playerName}</span>
        </div>
        <div className={styles.timer}>00:00</div>
      </header>
      
      <main className={styles.gameContent}>
        {currentPhoto && (
          <img 
            src={currentPhoto.image_url} 
            alt={currentPhoto.name}
            className={styles.gameImage}
          />
        )}
        
        {charactersToFind.length > 0 && (
          <div className={styles.charactersPanel}>
            <h3 className={styles.charactersTitle}>Characters to Find</h3>
            <div className={styles.charactersList}>
              {charactersToFind.map(character => (
                <div key={character.id} className={styles.characterItem}>
                  <img 
                    src={character.image_url}
                    alt={character.name}
                    className={styles.characterIcon}
                  />
                  <span className={styles.characterName}>{character.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GamePage; 