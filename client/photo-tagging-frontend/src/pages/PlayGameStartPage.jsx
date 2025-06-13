import React, { useState } from 'react';
import styles from '../styles/PlayGameStartPage.module.css';

const PlayGameStartPage = () => {
  const [playerName, setPlayerName] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  // Map difficulty options
  const difficultyOptions = [
    {
      id: 'easy',
      title: 'Easy Map',
      description: 'Forest Adventure',
      characters: 3,
      estimatedTime: '2-5 min',
      imageUrl: '/placeholders/map1.jpg'
    },
    {
      id: 'medium',
      title: 'Medium Map',
      description: 'City Chaos',
      characters: 5,
      estimatedTime: '5-10 min',
      imageUrl: '/placeholders/map2.jpg'
    },
    {
      id: 'hard',
      title: 'Hard Map',
      description: 'Space Station',
      characters: 7,
      estimatedTime: '10-15 min',
      imageUrl: '/placeholders/map3.jpg'
    }
  ];

  // Handle player name input change
  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  // Handle play as guest button click
  const handlePlayAsGuest = () => {
    const randomNumber = Math.floor(Math.random() * 10000);
    setPlayerName(`Guest${randomNumber}`);
  };

  // Handle difficulty selection
  const handleDifficultySelect = (difficultyId) => {
    setSelectedDifficulty(difficultyId);
  };

  // Check if Start Game button should be enabled
  const isStartButtonDisabled = !playerName || !selectedDifficulty;

  // Handle start game button click
  const handleStartGame = () => {
    // This would typically navigate to the game screen or dispatch an action
    // For now, we'll just log the selected options
    console.log('Starting game with:', {
      playerName,
      difficulty: selectedDifficulty
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

      {/* Map Difficulty Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Choose Your Map Difficulty</h2>
        <div className={styles.difficultyOptions}>
          {difficultyOptions.map((difficulty) => (
            <div
              key={difficulty.id}
              className={`${styles.difficultyCard} ${selectedDifficulty === difficulty.id ? styles.selected : ''}`}
              onClick={() => handleDifficultySelect(difficulty.id)}
            >
              <img
                src={difficulty.imageUrl}
                alt={difficulty.title}
                className={styles.cardImage}
              />
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{difficulty.title}</h3>
                <p className={styles.cardDescription}>{difficulty.description}</p>
                <div className={styles.cardInfo}>
                  <span>{difficulty.characters} characters</span>
                  <span>~{difficulty.estimatedTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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