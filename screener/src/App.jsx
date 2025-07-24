import React, { useState, useEffect } from 'react'
import {
  ChakraProvider,
  ColorModeScript,
  Box,
  Heading
} from '@chakra-ui/react'
import { theme } from './theme'
import HexIntro from './HexIntro'

export default function App() {
  const [showIntro, setShowIntro] = useState(false)
  const [revealComplete, setRevealComplete] = useState(false)

  useEffect(() => {
    const preDelay = 2000
    const introDuration = 3000
  
    const showTimeout = setTimeout(() => {
      setShowIntro(true)
    }, preDelay)
  
    const hideWelcomeTimeout = setTimeout(() => {
      setRevealComplete(true)
    }, preDelay + 500) // delay before Welcome screen disappears
  
    return () => {
      clearTimeout(showTimeout)
      clearTimeout(hideWelcomeTimeout)
    }
  }, [])
  

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="dark" />

      {/* WELCOME SCREEN — stays fixed until revealComplete */}
      {!revealComplete && (
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

      {/* HEX INTRO OVERLAY — appears after delay, overlays full screen */}
      {showIntro && (
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
