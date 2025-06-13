import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Where's The Character?</h1>
        <p className={styles.heroDescription}>
          Test your observation skills by finding hidden characters in complex illustrations.
          Challenge yourself with varying difficulties and compete for the fastest times.
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/how-to-play" className={`${styles.ctaButton} ${styles.howToPlayButton}`}>
            How to Play
          </Link>
          <Link to="/play" className={`${styles.ctaButton} ${styles.playButton}`}>
            Play the Game
          </Link>
        </div>
      </section>

      {/* About the Game Section */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <h2 className={styles.sectionTitle}>About the Game</h2>
        <div className={styles.sectionContent}>
          <p>
            "Where's The Character?" is a modern take on the classic search-and-find puzzle game. 
            Players are challenged to locate specific characters hidden within detailed, bustling illustrations.
            The faster you find all characters, the higher your score!
          </p>
          <p>
            With multiple difficulty levels and various themed environments, there's always a new challenge 
            waiting for you. Test your observation skills and compete with friends to see who can achieve the highest scores.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <h2 className={styles.sectionTitle}>Game Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>Multiple Difficulty Levels</h3>
            <p>From beginner to expert, choose the challenge that suits your skill level.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⏱️</div>
            <h3 className={styles.featureTitle}>Time-based Scoring</h3>
            <p>Race against the clock to find all characters as quickly as possible.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏆</div>
            <h3 className={styles.featureTitle}>Leaderboards</h3>
            <p>Compete with players worldwide and see your ranking on global leaderboards.</p>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview Section */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <h2 className={styles.sectionTitle}>Leaderboard Preview</h2>
        <div className={styles.leaderboardPreview}>
          <h3 className={styles.leaderboardTitle}>Top Players</h3>
          <ul className={styles.leaderboardList}>
            <li className={styles.leaderboardItem}>
              <span>1. MasterFinder</span>
              <span>00:32:15</span>
            </li>
            <li className={styles.leaderboardItem}>
              <span>2. EagleEye42</span>
              <span>00:34:22</span>
            </li>
            <li className={styles.leaderboardItem}>
              <span>3. SpeedSpotter</span>
              <span>00:36:48</span>
            </li>
            <li className={styles.leaderboardItem}>
              <span>4. CharacterHunter</span>
              <span>00:39:11</span>
            </li>
            <li className={styles.leaderboardItem}>
              <span>5. WaldoWatcher</span>
              <span>00:41:33</span>
            </li>
          </ul>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/play" className={`${styles.ctaButton} ${styles.playButton}`} style={{ display: 'inline-block' }}>
              Join the Competition
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 