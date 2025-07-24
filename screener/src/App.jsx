import React, { useState, useEffect } from 'react'
import {
  ChakraProvider,
  ColorModeScript,
  Box,
  Heading
} from '@chakra-ui/react'
import { theme } from './theme'
import HexIntro from './HexIntro'
import HexReveal from './HexReveal'

export default function App() {
  const [revealStage, setRevealStage] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [startIntro, setStartIntro] = useState(false)

  useEffect(() => {
    const hexRevealDuration = 4000
    const introStartDelay = 5200     // When HexIntro begins (e.g. 1.2s after reveal ends)
    const welcomeHideDelay = 6000    // When WELCOME disappears (e.g. 1.8s after intro starts)

    // When to end reveal and show static WELCOME
    setTimeout(() => {
      setRevealStage(false)
      setShowWelcome(true)
    }, hexRevealDuration + 1000) // small buffer

    // When to start HexIntro
    setTimeout(() => {
      setStartIntro(true)
    }, introStartDelay)

    // When to hide WELCOME during/after HexIntro
    setTimeout(() => {
      setShowWelcome(false)
    }, welcomeHideDelay)
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="dark" />

      {/* 1️⃣ HEX REVEAL */}
      {revealStage && (
        <HexReveal hexSize={20} duration={3000} startDelay={1000}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bg="black"
          >
            <Heading size="3xl" color="white">
              WELCOME
            </Heading>
          </Box>
        </HexReveal>
      )}

      {/* 2️⃣ STATIC WELCOME SCREEN */}
      {showWelcome && (
        <Box
          position="fixed"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="black"
          zIndex={1}
        >
          <Heading size="3xl" color="white">
            WELCOME
          </Heading>
        </Box>
      )}

      {/* 3️⃣ HEX INTRO OVERLAY */}
      {startIntro && (
        <Box position="fixed" inset={0} zIndex={2}>
          <HexIntro hexSize={17} duration={3000}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100vh"
              bg="green.900"
            >
              <Heading
                as="h1"
                size="4xl"
                color="neon.500"
                textShadow="0 0 8px #00ff9f, 0 0 16px #00ff9f"
              >
                Sweta Nerdcharya
              </Heading>
            </Box>
          </HexIntro>
        </Box>
      )}
    </ChakraProvider>
  )
}
