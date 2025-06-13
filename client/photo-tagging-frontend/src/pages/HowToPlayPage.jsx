import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/HowToPlayPage.module.css';

const HowToPlayPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`${styles.howToPlayContainer} ${isVisible ? styles.visible : ''}`}>
      <h1 className={styles.title}>How to Play</h1>
      
      <div className={styles.instructionsContainer}>
        <ol className={styles.stepsList}>
          <li className={styles.stepItem}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Choose a Difficulty Level</h3>
              <p className={styles.stepDescription}>
                Start by selecting your preferred difficulty level: Easy (3 characters), 
                Medium (5 characters), or Hard (7 characters). Each level features a 
                different photo with varying complexity.
              </p>
            </div>
          </li>
          
          <li className={styles.stepItem}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Observe the Photo</h3>
              <p className={styles.stepDescription}>
                Once the game begins, you'll see a detailed illustration with many characters 
                and objects. Take a moment to familiarize yourself with the scene and the 
                characters you need to find, shown in the character list.
              </p>
            </div>
          </li>
          
          <li className={styles.stepItem}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Find and Click on Characters</h3>
              <p className={styles.stepDescription}>
                When you spot one of the characters, click on their location in the photo. 
                This will open a targeting box and a dropdown menu of available characters.
              </p>
            </div>
          </li>
          
          <li className={styles.stepItem}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Select the Character</h3>
              <p className={styles.stepDescription}>
                From the dropdown menu, select which character you think you've found. 
                If you're correct, the character will be marked as found in your list. 
                If not, keep searching!
              </p>
            </div>
          </li>
          
          <li className={styles.stepItem}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Track Your Time</h3>
              <p className={styles.stepDescription}>
                A timer starts as soon as the game begins. Your goal is to find all characters 
                as quickly as possible. The faster you find them all, the higher your score!
              </p>
            </div>
          </li>
          
          <li className={styles.stepItem}>
            <div className={styles.stepNumber}>6</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Complete the Game</h3>
              <p className={styles.stepDescription}>
                Once you've found all characters, the game ends. You'll see your completion 
                time and have the option to submit your score to the leaderboard.
              </p>
            </div>
          </li>
        </ol>
      </div>
      
      <div className={styles.hintSection}>
        <h3 className={styles.hintTitle}>
          <span className={styles.hintIcon}>💡</span>
          Hint System
        </h3>
        <p>
          Stuck on finding a particular character? Don't worry! Our hint system can help:
        </p>
        <ul>
          <li>Click the "Hint" button to get help finding a character.</li>
          <li>The hint will show you the character's name and icon.</li>
          <li>Use hints wisely to improve your gameplay experience!</li>
        </ul>
      </div>
      
      <div className={styles.buttonsContainer}>
        <Link to="/" className={`${styles.button} ${styles.secondaryButton}`}>
          Back to Home
        </Link>
        <Link to="/play" className={`${styles.button} ${styles.primaryButton}`}>
          Start Playing
        </Link>
      </div>
    </div>
  );
};

export default HowToPlayPage; 