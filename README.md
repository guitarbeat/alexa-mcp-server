# Alexa Home Automation MCP Server 🏠🔋

A powerful [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides AI agents (like Claude Desktop) with full control over your Alexa-connected smart home.

This server acts as a bridge between the Alexa API and the MCP ecosystem, enabling capabilities like voice announcements, music control, lighting automation, and sensor monitoring.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io/)
[![CI](https://github.com/guitarbeat/alexa-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/guitarbeat/alexa-mcp-server/actions/workflows/ci.yml)
[![Code Style: Airbnb](https://img.shields.io/badge/code_style-airbnb-brightgreen.svg)](https://github.com/airbnb/javascript)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## ✨ Features

- 📢 **Voice Announcements**: Send customized voice messages to any Alexa device with smart night-time suppression.
- 🎵 **Music Control**: Get real-time status of current tracks and playback on your Echo devices.
- 💡 **Smart Lighting**: Full control over power, brightness, and colors for all discovered smart lights.
- 🌡️ **Sensor Integration**: Access temperature, light, and motion sensor data from your Alexa devices.
- 🔊 **Volume Management**: Precise control over volume levels across your entire device fleet.
- 🤖 **Self-Documenting**: Clean, descriptive API handlers designed for LLM consumption.

## 🚀 Getting Started

### 1. Requirements

- [pnpm](https://pnpm.io/) installed.
- An Amazon account with connected Alexa devices.

### 2. Authentication (Automated Cookie Collection)

We've automated the tedious process of collecting Amazon cookies.

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run the cookie automation script:
   ```bash
   pnpm run get-cookies
   ```
3. A local proxy will start. Complete the login in the browser window that appears.
4. The script will automatically generate your `.env` file with the required `UBID_MAIN` and `AT_MAIN` tokens.

### 3. Local Development

Start the server in Node.js mode:

```bash
pnpm run dev:node
```

The server will be available at `http://localhost:3001`.

## 🛠️ MCP Configuration

Add this to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "alexa": {
      "command": "node",
      "args": ["/absolute/path/to/alexa-mcp-server/dist/node-index.js"],
      "env": {
        "API_BASE": "http://localhost:3001"
      }
    }
  }
}
```

## 🏗️ Architecture

This project is built using:

- **Hono**: A fast, lightweight web framework.
- **TypeScript**: For robust, type-safe development.
- **MCP SDK**: To enable seamless integration with AI agents.
- **Cloudflare Workers Ready**: Can be deployed to Cloudflare or any Node.js environment via Docker.

## ☕ Support

If you find this project helpful, consider buying me a coffee!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-orange?style=for-the-badge&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/guitarbeat)

## 📄 License

MIT © [guitarbeat](https://github.com/guitarbeat)
