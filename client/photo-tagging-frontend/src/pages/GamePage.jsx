import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/GamePage.module.css';
import CharacterSelectionList from '../components/CharacterSelectionList';
import Marker from '../components/Marker';

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photoId, playerName } = location.state || {};
  const gameImageContainerRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [charactersToFind, setCharactersToFind] = useState([]);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [gameSessionId, setGameSessionId] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', isVisible: false, isSuccess: false });
  
  // Targeting box state
  const [targetingBox, setTargetingBox] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    clickedX: 0,
    clickedY: 0
  });

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

        // Start a new game session
        await startGameSession();
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError(`Failed to load game data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [photoId]);

  // Start a new game session
  const startGameSession = async () => {
    if (gameSessionId) return; // Already have a session

    try {
      const response = await fetch('http://localhost:3000/api/game/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoId,
          playerName
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to start game session: ${response.status}`);
      }
      
      const result = await response.json();
      setGameSessionId(result.gameSessionId);
    } catch (error) {
      console.error('Error starting game session:', error);
      setError(`Failed to start game session: ${error.message}`);
    }
  };

  // Handle image click
  const handleImageClick = (event) => {
    // Get click coordinates relative to the image
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
    
    // Get rendered image dimensions
    const offsetWidth = event.target.offsetWidth;
    const offsetHeight = event.target.offsetHeight;
    
    // Normalize coordinates to percentages
    const clickedXPercent = (offsetX / offsetWidth) * 100;
    const clickedYPercent = (offsetY / offsetHeight) * 100;
    
    // Update targeting box state
    setTargetingBox({
      isVisible: true,
      x: offsetX,
      y: offsetY,
      clickedX: clickedXPercent,
      clickedY: clickedYPercent
    });
  };

  // Show feedback message
  const showFeedback = (message, isSuccess) => {
    setFeedback({
      message,
      isVisible: true,
      isSuccess
    });

    // Hide feedback after 2 seconds
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, isVisible: false }));
    }, 2000);
  };

  // Handle character selection
  const handleSelectCharacter = async (character) => {
    if (!gameSessionId) {
      await startGameSession();
    }

    try {
      // Send validation request to server
      const response = await fetch('http://localhost:3000/api/game/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameSessionId,
          characterId: character.id,
          x: targetingBox.clickedX,
          y: targetingBox.clickedY
        }),
      });
      
      const result = await response.json();
      
      if (result.isCorrect) {
        // Add character to found characters with bounding box information
        const foundCharacter = {
          id: character.id,
          name: character.name,
          imageUrl: character.image_url,
          x_percent: result.boundingBox.x,
          y_percent: result.boundingBox.y,
          width_percent: result.boundingBox.width,
          height_percent: result.boundingBox.height
        };
        
        setFoundCharacters(prev => [...prev, foundCharacter]);
        
        // Remove character from charactersToFind
        setCharactersToFind(prev => prev.filter(c => c.id !== character.id));
        
        // Show success feedback
        showFeedback(`Found ${character.name}!`, true);
        
        // Check if all characters are found
        if (charactersToFind.length - 1 === 0) {
          // TODO: Handle game completion
          alert('Congratulations! You found all characters!');
        }
      } else {
        // Incorrect selection
        showFeedback('Try again!', false);
      }
      
      // Hide targeting box after selection
      setTargetingBox(prev => ({ ...prev, isVisible: false }));
      
    } catch (error) {
      console.error('Error validating character selection:', error);
      showFeedback('Error validating selection', false);
    }
  };

  // Close targeting box when clicking elsewhere
  const handlePageClick = (event) => {
    if (!event.target.closest(`.${styles.gameImage}`) && 
        !event.target.closest(`.${styles.selectionContainer}`)) {
      setTargetingBox(prev => ({ ...prev, isVisible: false }));
    }
  };

  useEffect(() => {
    // Add event listener to handle clicks outside the image
    document.addEventListener('click', handlePageClick);
    
    return () => {
      document.removeEventListener('click', handlePageClick);
    };
  }, []);

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
        <div className={styles.gameImageContainer} ref={gameImageContainerRef}>
          {currentPhoto && (
            <img 
              src={currentPhoto.image_url} 
              alt={currentPhoto.name}
              className={styles.gameImage}
              onClick={handleImageClick}
            />
          )}
          
          {/* Render markers for found characters */}
          {foundCharacters.map(character => (
            <Marker 
              key={character.id}
              x_percent={character.x_percent}
              y_percent={character.y_percent}
              width_percent={character.width_percent}
              height_percent={character.height_percent}
              imageUrl={character.imageUrl}
              containerRef={gameImageContainerRef}
            />
          ))}
          
          {targetingBox.isVisible && (
            <>
              <div 
                className={styles.targetingBox}
                style={{ 
                  left: `${targetingBox.x}px`, 
                  top: `${targetingBox.y}px` 
                }}
              >
                <div className={styles.targetingCrosshair}></div>
              </div>
              
              <CharacterSelectionList 
                characters={charactersToFind}
                onSelectCharacter={handleSelectCharacter}
                position={{ 
                  x: targetingBox.x + 30, 
                  y: targetingBox.y + 30 
                }}
                foundCharacters={foundCharacters.map(c => c.id)}
              />
            </>
          )}
          
          {/* Feedback message */}
          {feedback.isVisible && (
            <div 
              className={`${styles.feedbackMessage} ${feedback.isSuccess ? styles.successFeedback : styles.errorFeedback}`}
            >
              {feedback.message}
            </div>
          )}
        </div>
        
        {charactersToFind.length > 0 && (
          <div className={styles.charactersPanel}>
            <h3 className={styles.charactersTitle}>Characters to Find</h3>
            <div className={styles.charactersList}>
              {charactersToFind.map(character => (
                <div 
                  key={character.id} 
                  className={styles.characterItem}
                >
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
        
        {/* Found Characters Section */}
        {foundCharacters.length > 0 && (
          <div className={styles.foundCharactersPanel}>
            <h3 className={styles.charactersTitle}>Found Characters</h3>
            <div className={styles.charactersList}>
              {foundCharacters.map(character => (
                <div 
                  key={character.id} 
                  className={`${styles.characterItem} ${styles.foundCharacterItem}`}
                >
                  <img 
                    src={character.imageUrl}
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