import React, { useEffect, useRef, useState } from 'react';
import './hex-intro.css';

export default function HexIntro({ hexSize = 30, duration = 2000, children, onComplete }) {
    const [hexes, setHexes] = useState([]);
    const [progress, setProgress] = useState(0);
    const maskId = 'hex-mask-dynamic';
  
    const svgRef = useRef(null);
  
    useEffect(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
  
      const dx = hexSize * Math.sqrt(3);
      const dy = hexSize * 1.5;
      const cols = Math.ceil(width / dx) + 4;
      const rows = Math.ceil(height / dy) + 4;
  
      const centerX = width / 2;
      const centerY = height / 2;
  
      const hexArray = [];
  
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * dx + (row % 2 === 0 ? 0 : dx / 2) - dx * 2;
          const y = row * dy - dy * 2;
  
          const distance = Math.hypot(centerX - x, centerY - y);
          hexArray.push({ x, y, distance });
        }
      }
  
      const maxDist = Math.max(...hexArray.map(h => h.distance));
      hexArray.forEach(h => {
        h.delay = (h.distance / maxDist) * duration;
      });
  
      setHexes(hexArray);
    }, [hexSize, duration]);
  
    useEffect(() => {
      let start;
      const animate = (ts) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        setProgress(elapsed);
        if (elapsed < duration + 500) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [duration]);
  
    return (
      <>
        <svg
          ref={svgRef}
          className="hidden-svg"
          width="0"
          height="0"
        >
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="black" />
            {hexes.map((h, i) => {
              const appear = progress >= h.delay;
              const scale = appear ? 1 : 0;
              return (
                <polygon
                  key={i}
                  points={hexPoints(h.x, h.y, hexSize * scale)}
                  fill="white"
                />
              );
            })}
          </mask>
        </svg>
  
        <div
          className="masked-container"
          style={{ maskImage: `url(#${maskId})`, WebkitMaskImage: `url(#${maskId})` }}
        >
          {children}
        </div>
      </>
    );
  }
  
  function hexPoints(cx, cy, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i - Math.PI / 6; // <- rotate by -30° (π/6)
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }
  
