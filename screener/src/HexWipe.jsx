// src/HexWipe.jsx
import React, { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './hex.css'

export default function HexWipe({
  children,
  hexSize    = 80,    // px
  speed      = 1.2,   // flip duration (sec)
  startDelay = 0.5    // pause before flip (sec)
}) {
  const container = useRef(null)
  const [grid, setGrid]   = useState({ rows: 0, cols: 0 })
  const [phase, setPhase] = useState('idle') // idle → wipe → done

  // 1) measure screen once
  useLayoutEffect(() => {
    if (!container.current) return
    const { width, height } = container.current.getBoundingClientRect()
    const cols = Math.ceil(width  / hexSize) + 1
    const rows = Math.ceil(height / (hexSize * 0.866)) + 1
    setGrid({ rows, cols })
  }, [hexSize])

  // 2) after pause, start wipe
  useEffect(() => {
    const t = setTimeout(() => setPhase('wipe'), startDelay * 1000)
    return () => clearTimeout(t)
  }, [startDelay])

  // 3) after flip, reveal content
  useEffect(() => {
    if (phase !== 'wipe') return
    const total = (startDelay + speed) * 1000
    const t = setTimeout(() => setPhase('done'), total)
    return () => clearTimeout(t)
  }, [phase, speed, startDelay])

  // 4) Framer variants
  const containerV = {
    idle: {},
    wipe: { transition: { delayChildren: startDelay } }
  }
  const hexV = {
    idle: { rotateX: 0, opacity: 1 },
    wipe: {
      rotateX: 90,
      opacity: 0,
      transition: { duration: speed, ease: 'easeInOut' }
    }
  }

  // 5) build hexes
  const hexes = []
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      hexes.push(
        <motion.div
          key={`${r}-${c}`}
          className="hexagon"
          style={{ '--size': `${hexSize}px` }}
          variants={hexV}
        />
      )
    }
  }

  return (
    <div ref={container} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* show grid until done */}
      {phase !== 'done' && (
        <motion.div
          className="hexagon-grid"
          style={{ '--cols': grid.cols, '--size': `${hexSize}px` }}
          variants={containerV}
          initial="idle"
          animate={phase === 'wipe' ? 'wipe' : 'idle'}
        >
          {hexes}
        </motion.div>
      )}

      {/* then reveal your content */}
      {phase === 'done' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}
