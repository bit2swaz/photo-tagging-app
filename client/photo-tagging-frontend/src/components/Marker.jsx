import React, { useEffect, useState } from 'react';
import styles from '../styles/Marker.module.css';

const Marker = ({ 
  x1_percent, 
  y1_percent, 
  x2_percent, 
  y2_percent, 
  name,
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
        left: (x1_percent / 100) * containerWidth,
        top: (y1_percent / 100) * containerHeight,
        width: ((x2_percent - x1_percent) / 100) * containerWidth,
        height: ((y2_percent - y1_percent) / 100) * containerHeight
      });
    };

    // Initial position calculation
    updatePosition();
    
    // Add resize event listener to handle responsive behavior
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [x1_percent, y1_percent, x2_percent, y2_percent, containerRef]);

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
      <div className={styles.characterIcon}>
        {name.charAt(0)}
      </div>
    </div>
  );
};

export default Marker; 