import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
          <span className={styles.logoText}>Photo Tagging Game</span>
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/how-to-play" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            How to Play
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/play" 
            className={({ isActive }) => 
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Play Game
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar; 