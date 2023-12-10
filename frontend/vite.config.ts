import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'settings': ['src/pages/Settings.tsx'],
          'timeline': ['src/pages/Timeline.tsx'],
          'login': ['src/pages/Login.tsx'],
          'signup': ['src/pages/Signup.tsx'],
          'UpdatePassword': ['src/pages/UpdatePassword.tsx'],
          'DeveloperTool' : ['src/pages/ComponentLab.tsx']
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
