import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy: {
          '/express': {
            target: 'http://localhost:5173', // Your express server URL
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/express/, '')
          }
        }
  }
})
//i am getting this error
//  POST http://localhost:5173/select 404 (Not Found)