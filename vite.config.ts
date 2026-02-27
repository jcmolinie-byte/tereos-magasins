import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const certPath = path.resolve(__dirname, 'server/certs/cert.pem');
const keyPath  = path.resolve(__dirname, 'server/certs/key.pem');
const hasSSL   = fs.existsSync(certPath) && fs.existsSync(keyPath);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      publicDir: 'public',
      server: {
        port: 3000,
        host: '0.0.0.0',
        https: hasSSL ? { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) } : false,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
