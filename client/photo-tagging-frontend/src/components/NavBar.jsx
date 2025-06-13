import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Photo Tagging App</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/how-to-play">How to Play</Link></li>
        <li><Link to="/play">Play Game</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar; 