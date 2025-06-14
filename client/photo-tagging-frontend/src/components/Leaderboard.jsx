import React, { useState, useEffect } from 'react';
import styles from '../styles/Leaderboard.module.css';

const Leaderboard = ({ photoId }) => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get API base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/scores/${photoId}/leaderboard`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard: ${response.status}`);
        }
        
        const data = await response.json();
        setScores(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (photoId) {
      fetchLeaderboard();
    }
  }, [photoId, API_BASE_URL]);

  // Format time from milliseconds to MM:SS.ms
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Format date from ISO string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.leaderboardContainer}>
        <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
        <div className={styles.loadingMessage}>Loading leaderboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.leaderboardContainer}>
        <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.leaderboardContainer}>
      <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
      
      {scores.length === 0 ? (
        <div className={styles.emptyMessage}>No scores recorded yet. Be the first!</div>
      ) : (
        <table className={styles.leaderboardTable}>
          <thead>
            <tr>
              <th className={styles.rankColumn}>Rank</th>
              <th className={styles.playerColumn}>Player</th>
              <th className={styles.timeColumn}>Time</th>
              <th className={styles.dateColumn}>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index} className={styles.leaderboardRow}>
                <td className={styles.rankCell}>{index + 1}</td>
                <td className={styles.playerCell}>{score.player_name}</td>
                <td className={styles.timeCell}>{formatTime(score.time_taken_ms)}</td>
                <td className={styles.dateCell}>{formatDate(score.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard; 