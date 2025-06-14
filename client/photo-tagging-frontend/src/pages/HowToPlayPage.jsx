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
      <header className={styles.pageHeader}>
      <h1 className={styles.title}>How to Play</h1>
        <p className={styles.subtitle}>Master the art of finding hidden characters in our photo tagging adventure</p>
      </header>
      
      <section className={styles.gameOverview}>
        <div className={styles.overviewContent}>
          <h2 className={styles.sectionTitle}>Game Overview</h2>
          <p className={styles.overviewText}>
            Photo Tagging is a fun, challenging game where your observation skills are put to the test. 
            Find hidden characters in detailed illustrations as quickly as possible to earn a top spot on the leaderboard!
          </p>
        </div>
        <div className={styles.overviewImage}>
          <div className={styles.imagePlaceholder}>
            <span className={styles.placeholderIcon}>🔍</span>
          </div>
        </div>
      </section>
      
      <section className={styles.instructionsSection}>
        <h2 className={styles.sectionTitle}>Step-by-Step Instructions</h2>
        
        <div className={styles.instructionsGrid}>
          <div className={styles.instructionCard}>
            <div className={styles.cardHeader}>
            <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Choose Difficulty</h3>
            </div>
            <div className={styles.cardIcon}>🎮</div>
              <p className={styles.stepDescription}>
              Select your preferred difficulty level: Easy (3 characters), 
                Medium (5 characters), or Hard (7 characters). Each level features a 
                different photo with varying complexity.
              </p>
            </div>
          
          <div className={styles.instructionCard}>
            <div className={styles.cardHeader}>
            <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Study the Scene</h3>
            </div>
            <div className={styles.cardIcon}>👁️</div>
              <p className={styles.stepDescription}>
              Once the game begins, you'll see a detailed illustration. Take a moment 
              to familiarize yourself with the scene and the characters you need to find, 
              shown in the character list.
              </p>
            </div>
          
          <div className={styles.instructionCard}>
            <div className={styles.cardHeader}>
            <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Spot & Click</h3>
            </div>
            <div className={styles.cardIcon}>🖱️</div>
              <p className={styles.stepDescription}>
                When you spot one of the characters, click on their location in the photo. 
                This will open a targeting box and a dropdown menu of available characters.
              </p>
            </div>
          
          <div className={styles.instructionCard}>
            <div className={styles.cardHeader}>
            <div className={styles.stepNumber}>4</div>
              <h3 className={styles.stepTitle}>Make Your Selection</h3>
            </div>
            <div className={styles.cardIcon}>✅</div>
              <p className={styles.stepDescription}>
                From the dropdown menu, select which character you think you've found. 
                If you're correct, the character will be marked as found in your list. 
                If not, keep searching!
              </p>
            </div>
          
          <div className={styles.instructionCard}>
            <div className={styles.cardHeader}>
            <div className={styles.stepNumber}>5</div>
              <h3 className={styles.stepTitle}>Beat the Clock</h3>
            </div>
            <div className={styles.cardIcon}>⏱️</div>
              <p className={styles.stepDescription}>
                A timer starts as soon as the game begins. Your goal is to find all characters 
                as quickly as possible. The faster you find them all, the higher your score!
              </p>
            </div>
          
          <div className={styles.instructionCard}>
            <div className={styles.cardHeader}>
            <div className={styles.stepNumber}>6</div>
              <h3 className={styles.stepTitle}>Claim Victory</h3>
            </div>
            <div className={styles.cardIcon}>🏆</div>
              <p className={styles.stepDescription}>
                Once you've found all characters, the game ends. You'll see your completion 
                time and have the option to submit your score to the leaderboard.
              </p>
            </div>
      </div>
      </section>
      
      <section className={styles.featuresSection}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>💡</div>
          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Hint System</h3>
            <p className={styles.featureDescription}>
              Stuck on finding a particular character? Click the "Hint" button to get help. 
              The hint will show you the character's name and icon. Use hints wisely to improve 
              your gameplay experience!
        </p>
          </div>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🔊</div>
          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Sound Effects</h3>
            <p className={styles.featureDescription}>
              Enjoy immersive sound effects that enhance your gaming experience. Hear satisfying 
              sounds when you find characters correctly or complete the game. You can toggle sounds 
              on/off at any time.
            </p>
          </div>
        </div>
        
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📊</div>
          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Leaderboards</h3>
            <p className={styles.featureDescription}>
              Compare your times with other players on our global leaderboards. Can you claim the 
              top spot for the fastest completion time on each difficulty level?
            </p>
          </div>
      </div>
      </section>
      
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Test Your Skills?</h2>
        <p className={styles.ctaText}>Jump into the game and start finding characters!</p>
      <div className={styles.buttonsContainer}>
        <Link to="/" className={`${styles.button} ${styles.secondaryButton}`}>
            <span className={styles.buttonIcon}>🏠</span>
            <span>Back to Home</span>
        </Link>
        <Link to="/play" className={`${styles.button} ${styles.primaryButton}`}>
            <span className={styles.buttonIcon}>🎮</span>
            <span>Start Playing</span>
        </Link>
      </div>
      </section>
    </div>
  );
};

export default HowToPlayPage; 