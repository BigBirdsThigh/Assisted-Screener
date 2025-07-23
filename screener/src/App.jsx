// import './App.css'
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  Box,
  Heading
} from '@chakra-ui/react'
import { theme } from './theme'
import HexWipe from './HexWIpe'
export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="dark" />

      <HexWipe hexSize={80} speed={1.5} startDelay={0.35}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bg="gray.900"
        >
          <Heading
            size="4xl"
            color="neon.500"
            textShadow="0 0 8px #00ff9f, 0 0 16px #00ff9f"
          >
            Name
          </Heading>
        </Box>
      </HexWipe>
    </ChakraProvider>
  )
}