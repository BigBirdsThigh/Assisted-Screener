import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import './hex.css';

export default function HexGrid({ hexSize = 20 }) {
  const containerRef = useRef(null);
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [animationProgress, setAnimationProgress] = useState(0);

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

  useEffect(() => {
    let start = null;
    let rafId;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const duration = 3000;

      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const dx = hexSize * Math.sqrt(3);
  const dy = hexSize * 1.5;

  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;
  const maxDistance = Math.hypot(centerX, centerY);

  const hexes = [];

  for (let row = 0; row < gridSize.rows; row++) {
    for (let col = 0; col < gridSize.cols; col++) {
      const x = col * dx + (row % 2 === 0 ? 0 : dx / 2) - dx;
      const y = row * dy - dy;

      const distance = Math.hypot(centerX - x, centerY - y);
      const normalizedDistance = distance / maxDistance;

      const waveFront = animationProgress; // 0 → 1
      const falloff = 0.1; // ripple width

      // shrink hex once wave reaches it
      let scale = 1;

      if (normalizedDistance <= waveFront - falloff) {
        scale = 0;
      } else if (normalizedDistance <= waveFront) {
        const t = (waveFront - normalizedDistance) / falloff;
        scale = 1 - t;
      }

      hexes.push(
        <div
          key={`${row}-${col}`}
          className="hex"
          style={{
            width: `${hexSize * 2}px`,
            height: `${hexSize * 2}px`,
            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.4s ease-out',
          }}
        >
          <div className="hex-inner" />
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
