import { createServer } from './app';

/**
 * Cloudflare Workers Entry Point
 */
const app = createServer();

export default {
  fetch: app.fetch,
};
