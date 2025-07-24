import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './hex.css';

export default function HexGrid({ hexSize = 20 }) {
  const containerRef = useRef(null);
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();

    const dx = hexSize * Math.sqrt(3);
    const dy = hexSize * 1.5;

    const cols = Math.ceil(width / dx) + 3;
    const rows = Math.ceil(height / dy) + 3;

    setGridSize({ rows, cols });
    setContainerSize({ width, height });
  }, [hexSize]);

  // Wait a moment before triggering animation (for layout to stabilize)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTriggerAnimation(true);
    }, 500); // 0.5s delay before animation starts

    return () => clearTimeout(timeout);
  }, []);

  const dx = hexSize * Math.sqrt(3);
  const dy = hexSize * 1.5;
  const hexes = [];

  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;

  for (let row = 0; row < gridSize.rows; row++) {
    for (let col = 0; col < gridSize.cols; col++) {
      const x = col * dx + (row % 2 === 0 ? 0 : dx / 2) - dx;
      const y = row * dy - dy;

      const distanceFromCenter = Math.hypot(centerX - x, centerY - y);
      const delay = distanceFromCenter * 0.005; // Slower wave spread

      hexes.push(
        <div
          key={`${row}-${col}`}
          className="hex"
          style={{
            width: `${hexSize * 2}px`,
            height: `${hexSize * 2}px`,
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <motion.div
            className="hex-inner"
            initial={{ opacity: 1, scale: 1 }}
            animate={triggerAnimation ? { opacity: 0, scale: 0 } : {}}
            transition={{
              duration: 2.5,
              delay,
              ease: 'easeInOut',
            }}
          />
        </div>
      );
    }
  }

  return (
    <div ref={containerRef} className="hex-grid">
      {hexes}
    </div>
  );
}
