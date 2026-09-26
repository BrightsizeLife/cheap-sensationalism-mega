import path from 'path';
import { execSync } from 'child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Which commit is this build? Vercel says so in an environment variable;
// locally, ask git. The footer links it, so every page names its version.
function commit(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

// Nothing from the environment reaches the browser except the commit id.
// (The old AI Studio config copied GEMINI_API_KEY into the client bundle,
// where anyone could read it. Nothing here uses a key, so it is gone.)
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  define: {
    __BUILD__: JSON.stringify({ sha: commit(), date: new Date().toISOString().slice(0, 10) }),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
