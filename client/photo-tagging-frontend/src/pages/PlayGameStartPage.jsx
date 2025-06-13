import React from 'react';

const PlayGameStartPage = () => {
  return (
    <div className="play-game-start-page">
      <h1>Select Difficulty Level</h1>
      <div className="difficulty-options">
        <div className="difficulty-option">
          <h2>Easy</h2>
          <p>Find 3 characters</p>
          <button>Start Game</button>
        </div>
        <div className="difficulty-option">
          <h2>Medium</h2>
          <p>Find 5 characters</p>
          <button>Start Game</button>
        </div>
        <div className="difficulty-option">
          <h2>Hard</h2>
          <p>Find 7 characters</p>
          <button>Start Game</button>
        </div>
      </div>
    </div>
  );
};

export default PlayGameStartPage; 