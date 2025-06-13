import React from 'react';
import styles from '../styles/CharacterSelectionList.module.css';

const CharacterSelectionList = ({ 
  characters, 
  onSelectCharacter, 
  position, 
  foundCharacters = [] 
}) => {
  // Calculate position for the selection list
  const listStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  // Check if a character has been found
  const isCharacterFound = (characterId) => {
    return foundCharacters.includes(characterId);
  };

  return (
    <div className={styles.selectionContainer} style={listStyle}>
      <div className={styles.title}>Select Character</div>
      <ul className={styles.charactersList}>
        {characters.map((character) => (
          <li 
            key={character.id}
            className={`${styles.characterItem} ${isCharacterFound(character.id) ? styles.foundCharacter : ''}`}
            onClick={() => onSelectCharacter(character)}
          >
            <img 
              src={character.image_url}
              alt={character.name}
              className={styles.characterIcon}
            />
            <span className={styles.characterName}>{character.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharacterSelectionList; 