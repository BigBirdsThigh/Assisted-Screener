// import './App.css'
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  Box,
  Heading
} from '@chakra-ui/react'
import { theme } from './theme'
import HexGrid from './HexGrid'
export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="dark" />

      <HexGrid>
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
      </HexGrid>
    </ChakraProvider>
  )
}