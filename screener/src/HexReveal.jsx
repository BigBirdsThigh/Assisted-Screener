import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import './hex-mask.css';

export default function HexReveal({ hexSize = 20, duration = 3000, startDelay = 0, children }) {
  const containerRef = useRef(null);
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const spacingFactor = 0.985;

    const dx = hexSize * Math.sqrt(3) * spacingFactor;
    const dy = hexSize * 1.5 * spacingFactor;

    const cols = Math.ceil(width / dx) + 6;
    const rows = Math.ceil(height / dy) + 6;

    setGridSize({ rows, cols });
    setContainerSize({ width, height });
  }, [hexSize]);

  useEffect(() => {
    let start = null;
    let raf;
    let delayTimeout;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const p = Math.min(elapsed / duration, 1.2);
      setProgress(p);

      if (p < 1.2) raf = requestAnimationFrame(animate);
    };

    // Delay animation, but render hexes at full scale initially
    delayTimeout = setTimeout(() => {
      raf = requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(delayTimeout);
      cancelAnimationFrame(raf);
    };
  }, [duration, startDelay]);

  const spacingFactor = 0.985;
  const dx = hexSize * Math.sqrt(3) * spacingFactor;
  const dy = hexSize * 1.5 * spacingFactor;

  const centerX = containerSize.width / 2;
  const centerY = containerSize.height / 2;

  const corners = [
    { x: 0, y: 0 },
    { x: containerSize.width, y: 0 },
    { x: 0, y: containerSize.height },
    { x: containerSize.width, y: containerSize.height }
  ];
  const maxDistance = Math.max(...corners.map(c => Math.hypot(centerX - c.x, centerY - c.y)));

  const hexes = [];

  for (let row = 0; row < gridSize.rows; row++) {
    for (let col = 0; col < gridSize.cols; col++) {
      const x = col * dx + (row % 2 === 0 ? 0 : dx / 2) - dx * 3;
      const y = row * dy - dy * 3;

      const distance = Math.hypot(centerX - x, centerY - y);
      const norm = distance / maxDistance;

      const falloff = 0.08;
      let scale = 1;

      // Before animation starts, hexes should all be fully visible
      if (progress === 0 && startDelay > 0) {
        scale = 1;
      } else {
        if (norm < progress - falloff) {
          scale = 0;
        } else if (norm < progress) {
          scale = 1 - ((progress - norm) / falloff);
        }
      }

      hexes.push(
        <div
          key={`${row}-${col}`}
          className="hex-tile"
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
    <div className="hex-reveal-wrapper" ref={containerRef}>
      <div className="content-layer">{children}</div>
      <div className="hex-overlay">{hexes}</div>
    </div>
  );
}
