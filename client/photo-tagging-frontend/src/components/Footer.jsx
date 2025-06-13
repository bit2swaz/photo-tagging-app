import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Photo Tagging Game</h3>
          <p className={styles.footerDescription}>
            Test your observation skills by finding hidden characters in detailed illustrations.
          </p>
        </div>
        
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Quick Links</h3>
          <ul className={styles.footerLinks}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/how-to-play">How to Play</Link></li>
            <li><Link to="/play">Play Game</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; {currentYear} Photo Tagging Game. All rights reserved.</p>
        <p className={styles.creatorInfo}>
          Made with ❤ by <a href="https://github.com/bit2swaz" className={styles.githubLink} target="_blank" rel="noopener noreferrer">bit2swaz</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 