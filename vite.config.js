import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ポートは 5173 で固定。使用中なら、別の番号にずれずにエラーで止まる
  server: { port: 5173, strictPort: true },
})
