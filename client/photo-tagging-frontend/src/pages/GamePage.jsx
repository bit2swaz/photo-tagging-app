import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/GamePage.module.css';
import CharacterSelectionList from '../components/CharacterSelectionList';
import Marker from '../components/Marker';
import Leaderboard from '../components/Leaderboard';

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
  
  // Game timer state
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  
  // Debug mode state
  const [debugMode, setDebugMode] = useState(false);
  
  // Targeting box state
  const [targetingBox, setTargetingBox] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    clickedX: 0,
    clickedY: 0
  });

  // Timer effect
  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 100);
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Format time as MM:SS.ms
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(prevMode => !prevMode);
  };

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
        
        // Start the timer
        setIsRunning(true);
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

  // Submit score when game is complete
  const submitScore = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameSessionId,
          playerName
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit score: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Score submitted successfully:', result);
    } catch (error) {
      console.error('Error submitting score:', error);
      setError(`Failed to submit score: ${error.message}`);
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
          characterName: character.name,
          clickX_percent: targetingBox.clickedX,
          clickY_percent: targetingBox.clickedY
        }),
      });
      
      const result = await response.json();
      
      if (result.isCorrect) {
        // Add character to found characters with bounding box information
        const foundCharacter = {
          id: character.id,
          name: character.name,
          imageUrl: character.image_url,
          x1_percent: result.x1_percent,
          y1_percent: result.y1_percent,
          x2_percent: result.x2_percent,
          y2_percent: result.y2_percent
        };
        
        setFoundCharacters(prev => [...prev, foundCharacter]);
        
        // Remove character from charactersToFind
        setCharactersToFind(prev => prev.filter(c => c.id !== character.id));
        
        // Show success feedback
        showFeedback(`Found ${character.name}!`, true);
        
        // Check if game is complete
        if (result.isGameComplete) {
          setIsGameComplete(true);
          setIsRunning(false);
          showFeedback('Game Complete!', true);
          submitScore();
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
          <button 
            className={`${styles.debugButton} ${debugMode ? styles.debugActive : ''}`} 
            onClick={toggleDebugMode}
          >
            Toggle Debug Boxes
          </button>
        </div>
        <div className={styles.timer}>{formatTime(timeElapsed)}</div>
      </header>
      
      <main className={styles.gameContent}>
        {isGameComplete && (
          <div className={styles.gameCompleteOverlay}>
            <div className={styles.gameCompleteMessage}>
              <h2>Game Over!</h2>
              <p>Congratulations, {playerName}!</p>
              <p>You found all characters in {formatTime(timeElapsed)}</p>
              <button className={styles.backButton} onClick={handleBackToSelection}>
                Play Again
              </button>
              
              {/* Display leaderboard when game is complete */}
              <div className={styles.leaderboardSection}>
                <Leaderboard photoId={currentPhoto?.id} />
              </div>
            </div>
          </div>
        )}
        
        <div className={styles.gameImageContainer} ref={gameImageContainerRef}>
          {currentPhoto && (
            <img 
              src={currentPhoto.image_url} 
              alt={currentPhoto.name}
              className={styles.gameImage}
              onClick={handleImageClick}
            />
          )}
          
          {/* Debug mode bounding boxes */}
          {debugMode && charactersToFind.map(character => (
            <div
              key={`debug-${character.id}`}
              className={styles.debugBox}
              style={{
                left: `${character.x1_percent}%`,
                top: `${character.y1_percent}%`,
                width: `${character.x2_percent - character.x1_percent}%`,
                height: `${character.y2_percent - character.y1_percent}%`
              }}
            >
              <span className={styles.debugLabel}>{character.name}</span>
            </div>
          ))}
          
          {/* Render markers for found characters */}
          {foundCharacters.map(character => (
            <Marker 
              key={character.id}
              x1_percent={character.x1_percent}
              y1_percent={character.y1_percent}
              x2_percent={character.x2_percent}
              y2_percent={character.y2_percent}
              name={character.name}
              containerRef={gameImageContainerRef}
            />
          ))}
          
          {/* Debug mode bounding boxes for found characters */}
          {debugMode && foundCharacters.map(character => (
            <div
              key={`debug-found-${character.id}`}
              className={`${styles.debugBox} ${styles.debugBoxFound}`}
              style={{
                left: `${character.x1_percent}%`,
                top: `${character.y1_percent}%`,
                width: `${character.x2_percent - character.x1_percent}%`,
                height: `${character.y2_percent - character.y1_percent}%`
              }}
            >
              <span className={styles.debugLabel}>{character.name} (Found)</span>
            </div>
          ))}
          
          {targetingBox.isVisible && !isGameComplete && (
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