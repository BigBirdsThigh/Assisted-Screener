import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#111111',            // pitch black
        color: '#e0e0e0',         // light gray text
        margin: 0,
        padding: 0,
        fontFamily: 'Space Mono, monospace',
      },
    },
  },
  colors: {
    neon: { 500: '#00ff9f' },    // your neon‑green
    accent: '#ff005d',           // hot‑pink accent
  },
  fonts: {
    heading: 'Space Mono, monospace',
    body:    'Space Mono, monospace',
  },
})