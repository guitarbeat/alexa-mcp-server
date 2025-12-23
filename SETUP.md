# Setup & Deployment Guide 🛠️

Follow these steps to get your Alexa MCP server running in your preferred environment.

## 1. Local Setup

### Authentication
The server requires Amazon session cookies. We provide a script to automate this:

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/sijan2/alexa-mcp-server.git
   cd alexa-mcp-server
   pnpm install
   ```

2. Run the collector:
   ```bash
   pnpm run get-cookies
   ```
   *Follow the prompts and log in to your Amazon account.*

### Running the Server
```bash
pnpm run dev:node
```

## 2. Docker Deployment (Recommended for Servers)

We provide a production-ready Dockerfile.

1. Build the image:
   ```bash
   docker build -t alexa-mcp-server .
   ```

2. Run the container:
   ```bash
   docker run -p 3001:3001 --env-file .env alexa-mcp-server
   ```

## 3. Remote Deployment (Render, Railway, etc.)

The server is compatible with any Node.js hosting platform.

- **Start Command**: `pnpm run start:node` (Make sure to run `pnpm run build` first).
- **Environment Variables**:
  - `UBID_MAIN`: (From your `.env`)
  - `AT_MAIN`: (From your `.env`)
  - `API_BASE`: The public URL of your deployment (e.g., `https://your-app.render.com`).
  - `PORT`: 3001 (or as required by provider).

## 4. Cloudflare Workers

To deploy to Cloudflare:
```bash
pnpm run deploy
```
*Note: Ensure you set your secrets using `wrangler secret put`*.

---

### Troubleshooting

- **Authentication Errors**: Cookies expire. If you see `401` or `Unauthorized` errors, re-run `pnpm run get-cookies`.
- **Discovery Issues**: If specific devices aren't found, ensure they are properly registered found in the Alexa app on your phone first.