import React, { useEffect, useState } from 'react';
import styles from '../styles/Marker.module.css';

const Marker = ({ 
  x_percent, 
  y_percent, 
  width_percent, 
  height_percent, 
  imageUrl,
  containerRef 
}) => {
  const [dimensions, setDimensions] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });

  // Update marker position when the image size changes
  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      
      // Convert percentages to pixels based on current container dimensions
      setDimensions({
        left: (x_percent / 100) * containerWidth,
        top: (y_percent / 100) * containerHeight,
        width: (width_percent / 100) * containerWidth,
        height: (height_percent / 100) * containerHeight
      });
    };

    // Initial position calculation
    updatePosition();
    
    // Add resize event listener to handle responsive behavior
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [x_percent, y_percent, width_percent, height_percent, containerRef]);

  return (
    <div 
      className={styles.markerContainer}
      style={{
        left: `${dimensions.left}px`,
        top: `${dimensions.top}px`,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`
      }}
    >
      <img 
        src={imageUrl} 
        alt="Found character" 
        className={styles.characterIcon}
      />
    </div>
  );
};

export default Marker; 