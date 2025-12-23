import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { bedroomApp } from "./api/v1/bedroom";
import { announceApp } from "./api/v1/announce";
import { musicApp } from "./api/v1/music";
import { lightsApp } from "./api/v1/lights";
import { volumeApp } from "./api/v1/volume";
import { sensorsApp } from "./api/v1/sensors";
import { dndApp } from "./api/v1/dnd";
import { alexaMcp } from "./mcp/server";
import { Env } from "./types/env";

/**
 * Creates and configures the main Hono application.
 */
export function createServer() {
    const app = new Hono<{ Bindings: Env }>();

    app.use("*", cors());

    // Health check
    app.get("/health", (c) => c.json({ status: "healthy", timestamp: new Date().toISOString() }));

    app.get("/", (c) => c.json({
        name: "Alexa MCP Server",
        version: "1.2.0",
        endpoints: { api: "/api", mcp: "/mcp", sse: "/sse" }
    }));

    // API Routes
    const api = new Hono<{ Bindings: Env }>();
    api.route("/bedroom", bedroomApp);
    api.route("/announce", announceApp);
    api.route("/music", musicApp);
    api.route("/lights", lightsApp);
    api.route("/volume", volumeApp);
    api.route("/sensors", sensorsApp);
    api.route("/dnd", dndApp);
    app.route("/api", api);

    // --- MCP Integration ---

    app.get("/sse", async (c) => {
        const mcpServer = alexaMcp.getMcpServer();
        const transport = new SSEServerTransport("/api/mcp", c.res.raw as any);
        await mcpServer.connect(transport);

        return streamSSE(c, async (stream) => {
            c.res.headers.set("Content-Type", "text/event-stream");
            c.res.headers.set("Cache-Control", "no-cache");
            c.res.headers.set("Connection", "keep-alive");

            // Transport will handle sending messages via c.res.raw
            // We just need to keep the stream alive
            while (true) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (stream.aborted) break;
            }
        });
    });

    app.post("/api/mcp", async (c) => {
        // This should be handled by the transport's post message handler
        // But we can also use our handleRequest if it's simpler
        return alexaMcp.handleRequest(c.req.raw, c.env);
    });

    return app;
}
