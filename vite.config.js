import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: true, // Allows Vite to accept external requests
    port: 5173,
    allowedHosts: ['renz.tailf44045.ts.net'], // Add this line
  },
})
