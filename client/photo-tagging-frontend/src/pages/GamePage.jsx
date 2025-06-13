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
  
  // Audio refs
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const gameStartSoundRef = useRef(null);
  const gameEndSoundRef = useRef(null);
  const bgMusicRef = useRef(null);
  
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
  
  // Countdown state
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  
  // Debug mode state
  const [debugMode, setDebugMode] = useState(false);
  
  // Hint system state
  const [currentHint, setCurrentHint] = useState({ name: '', icon: '' });
  const [showHint, setShowHint] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);
  
  // Animation states
  const [lastAttemptedCharacter, setLastAttemptedCharacter] = useState(null);
  const [lastAttemptResult, setLastAttemptResult] = useState(null); // 'correct', 'incorrect', or null
  
  // Audio state
  const [isMuted, setIsMuted] = useState(false);
  
  // Targeting box state
  const [targetingBox, setTargetingBox] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    clickedX: 0,
    clickedY: 0
  });

  // Initialize audio elements
  useEffect(() => {
    correctSoundRef.current = new Audio('/audio/correct-find.mp3');
    incorrectSoundRef.current = new Audio('/audio/incorrect-find.mp3');
    gameStartSoundRef.current = new Audio('/audio/game-start.mp3');
    gameEndSoundRef.current = new Audio('/audio/game-end.mp3');
    bgMusicRef.current = new Audio('/audio/background-music.mp3');
    
    // Configure background music
    if (bgMusicRef.current) {
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.3; // Lower volume for background music
    }
    
    // Cleanup function
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    };
  }, []);
  
  // Handle mute/unmute
  useEffect(() => {
    if (correctSoundRef.current) correctSoundRef.current.muted = isMuted;
    if (incorrectSoundRef.current) incorrectSoundRef.current.muted = isMuted;
    if (gameStartSoundRef.current) gameStartSoundRef.current.muted = isMuted;
    if (gameEndSoundRef.current) gameEndSoundRef.current.muted = isMuted;
    if (bgMusicRef.current) bgMusicRef.current.muted = isMuted;
  }, [isMuted]);

  // Reset animation state after a delay
  useEffect(() => {
    let animationTimer;
    
    if (lastAttemptResult) {
      animationTimer = setTimeout(() => {
        setLastAttemptResult(null);
        setLastAttemptedCharacter(null);
      }, 2000); // Clear animation after 2 seconds
    }
    
    return () => {
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [lastAttemptResult]);

  // Play sound helper function
  const playSound = (soundRef) => {
    if (soundRef.current && !isMuted) {
      soundRef.current.currentTime = 0; // Reset to start
      soundRef.current.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Calculate progress percentage
  const progressPercentage = () => {
    if (!charactersToFind.length && !foundCharacters.length) return 0;
    const total = charactersToFind.length + foundCharacters.length;
    return Math.round((foundCharacters.length / total) * 100);
  };

  // Countdown effect
  useEffect(() => {
    let countdownInterval;
    
    if (showCountdown && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);
    } else if (showCountdown && countdown === 0) {
      // When countdown reaches 0, hide countdown and start the game timer
      setShowCountdown(false);
      setIsRunning(true);
      
      // Play game start sound and background music
      playSound(gameStartSoundRef);
      
      // Start background music
      if (bgMusicRef.current && !isMuted) {
        bgMusicRef.current.play().catch(error => {
          console.error('Error playing background music:', error);
        });
      }
    }
    
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [showCountdown, countdown]);

  // Game timer effect
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

  // Hide hint after a few seconds
  useEffect(() => {
    let hintTimer;
    
    if (showHint) {
      hintTimer = setTimeout(() => {
        setShowHint(false);
      }, 5000); // Hide hint after 5 seconds
    }
    
    return () => {
      if (hintTimer) clearTimeout(hintTimer);
    };
  }, [showHint]);

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

  // Request a hint
  const requestHint = async () => {
    if (!gameSessionId || charactersToFind.length === 0) {
      showFeedback('No hints available!', false);
      return;
    }
    
    try {
      setIsHintLoading(true);
      const response = await fetch(`http://localhost:3000/api/game/${gameSessionId}/hint`);
      
      if (!response.ok) {
        throw new Error(`Failed to get hint: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.name && result.icon) {
        setCurrentHint({
          name: result.name,
          icon: result.icon
        });
        setShowHint(true);
        showFeedback('Hint received!', true);
      } else {
        showFeedback('No hints available!', false);
      }
    } catch (error) {
      console.error('Error getting hint:', error);
      showFeedback('Failed to get hint', false);
    } finally {
      setIsHintLoading(false);
    }
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
        
        // Start countdown instead of directly starting the timer
        setShowCountdown(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError(`Failed to load game data: ${err.message}`);
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

    // Set the attempted character for animation
    setLastAttemptedCharacter(character);

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
        // Play correct sound
        playSound(correctSoundRef);
        
        // Set animation state
        setLastAttemptResult('correct');
        
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
          
          // Stop background music and play game end sound
          if (bgMusicRef.current) {
            bgMusicRef.current.pause();
            bgMusicRef.current.currentTime = 0;
          }
          
          playSound(gameEndSoundRef);
          
          submitScore();
        }
      } else {
        // Play incorrect sound
        playSound(incorrectSoundRef);
        
        // Set animation state
        setLastAttemptResult('incorrect');
        
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
        <div className={styles.gameControls}>
          <button 
            className={`${styles.soundButton} ${isMuted ? styles.soundMuted : ''}`} 
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <div className={styles.timer}>{formatTime(timeElapsed)}</div>
        </div>
      </header>
      
      <main className={styles.gameContent}>
        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressText}>
            {foundCharacters.length} / {charactersToFind.length + foundCharacters.length} Characters Found
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progressPercentage()}%` }}
            ></div>
          </div>
        </div>

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
        
        {/* Countdown overlay */}
        {showCountdown && (
          <div className={styles.countdownOverlay}>
            <div className={styles.countdownContainer}>
              <div className={styles.countdownNumber}>{countdown}</div>
              <div className={styles.countdownText}>Get Ready!</div>
            </div>
          </div>
        )}
        
        {/* Hint overlay */}
        {showHint && !isGameComplete && !showCountdown && (
          <div className={styles.hintOverlay}>
            <div className={styles.hintContainer}>
              <img 
                src={currentHint.icon} 
                alt={currentHint.name}
                className={styles.hintIcon}
              />
              <div className={styles.hintText}>
                Looking for: <strong>{currentHint.name}</strong>
              </div>
            </div>
          </div>
        )}
        
        <div className={styles.gameArea}>
          <div className={styles.gameImageContainer} ref={gameImageContainerRef}>
            {currentPhoto && (
              <img 
                src={currentPhoto.image_url} 
                alt={currentPhoto.name}
                className={`${styles.gameImage} ${showCountdown ? styles.gameImageDimmed : ''}`}
                onClick={handleImageClick}
              />
            )}
            
            {/* Debug mode bounding boxes */}
            {debugMode && !showCountdown && charactersToFind.map(character => (
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
            {!showCountdown && foundCharacters.map(character => (
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
            {debugMode && !showCountdown && foundCharacters.map(character => (
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
            
            {targetingBox.isVisible && !isGameComplete && !showCountdown && (
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
            {feedback.isVisible && !showCountdown && (
              <div 
                className={`${styles.feedbackMessage} ${feedback.isSuccess ? styles.successFeedback : styles.errorFeedback}`}
              >
                {feedback.message}
              </div>
            )}
          </div>
          
          <div className={styles.charactersSidebar}>
            <div className={styles.charactersSection}>
              <h3 className={styles.charactersTitle}>Characters to Find</h3>
              {charactersToFind.length === 0 && foundCharacters.length > 0 ? (
                <div className={styles.allFoundMessage}>All characters found!</div>
              ) : (
                <div className={styles.charactersList}>
                  {charactersToFind.map(character => (
                    <div 
                      key={character.id} 
                      className={`${styles.characterItem} ${lastAttemptedCharacter?.id === character.id && lastAttemptResult === 'incorrect' ? styles.incorrectAttempt : ''}`}
                    >
                      <img 
                        src={character.image_url}
                        alt={character.name}
                        className={styles.characterIcon}
                      />
                      <span className={styles.characterName}>{character.name}</span>
                      
                      {/* Incorrect attempt indicator */}
                      {lastAttemptedCharacter?.id === character.id && lastAttemptResult === 'incorrect' && (
                        <span className={styles.incorrectIndicator}>✗</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Hint button */}
              {!isGameComplete && !showCountdown && charactersToFind.length > 0 && (
                <button 
                  className={styles.hintButton}
                  onClick={requestHint}
                  disabled={isHintLoading}
                >
                  {isHintLoading ? 'Loading...' : 'Get Hint'}
                </button>
              )}
            </div>
            
            {/* Found Characters Section */}
            {foundCharacters.length > 0 && (
              <div className={styles.charactersSection}>
                <h3 className={styles.charactersTitle}>Found Characters</h3>
                <div className={styles.charactersList}>
                  {foundCharacters.map(character => (
                    <div 
                      key={character.id} 
                      className={`${styles.characterItem} ${styles.foundCharacterItem} ${lastAttemptedCharacter?.id === character.id && lastAttemptResult === 'correct' ? styles.correctAttempt : ''}`}
                    >
                      <img 
                        src={character.imageUrl}
                        alt={character.name}
                        className={styles.characterIcon}
                      />
                      <span className={styles.characterName}>{character.name}</span>
                      <span className={styles.foundCheckmark}>✓</span>
                      
                      {/* Correct attempt indicator */}
                      {lastAttemptedCharacter?.id === character.id && lastAttemptResult === 'correct' && (
                        <span className={styles.correctIndicator}>FOUND!</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePage; 