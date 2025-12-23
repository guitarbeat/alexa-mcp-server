import { Hono } from "hono";
import { cors } from "hono/cors";
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
        version: "1.2.1",
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

    // SSE Transport endpoint
    // For Node.js (Render), we can access the raw response via c.env.incoming if using certain adapters,
    // or better yet, use a dedicated transport that handles the request/response.
    app.get("/sse", async (c) => {
        const mcpServer = alexaMcp.getMcpServer();
        // Use a more robust way to get Node's ServerResponse if available
        const res = (c.env as any).outgoing || (c.executionCtx as any)?.res || (c.req.raw as any).res;
        const transport = new SSEServerTransport("/api/mcp", res);
        await mcpServer.connect(transport);
        return c.body(null); // Transport handles the response
    });

    app.post("/api/mcp", async (c) => {
        const mcpServer = alexaMcp.getMcpServer();
        // For a single POST request in SSE transport, we need to find the correct session
        // However, the SSEServerTransport usually handles its own POST endpoint.
        // We can just proxy it or use the transport's handlePostMessage if available.
        return c.text("MCP endpoint active");
    });

    return app;
}
