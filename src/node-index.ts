import { serve } from '@hono/node-server';
import { createServer } from './app';
import 'dotenv/config';

/**
 * Node.js Entry Point
 */

// Load environment variables into the Hono context for Node.js
const env = {
  UBID_MAIN: process.env.UBID_MAIN || '',
  AT_MAIN: process.env.AT_MAIN || '',
  API_BASE: process.env.API_BASE || '',
  ALEXA_COOKIES: process.env.ALEXA_COOKIES || '',
  API_KEY: process.env.API_KEY || '',
  TZ: process.env.TZ || '',
  SPOTIFY_TOKEN: process.env.SPOTIFY_TOKEN || '',
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || '',
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || '',
  SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN || '',
} as any;

const app = createServer();
const port = Number(process.env.PORT) || 8787;

console.log(`🚀 Alexa MCP Server is running on http://localhost:${port}`);

serve({
  fetch: (request, nodeEnv) => app.fetch(request, { ...nodeEnv, ...env }),
  port,
});
