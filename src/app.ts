import { Hono } from "hono";
import { cors } from "hono/cors";
import { bedroomApp } from "./api/v1/bedroom";
import { announceApp } from "./api/v1/announce";
import { musicApp } from "./api/v1/music";
import { lightsApp } from "./api/v1/lights";
import { volumeApp } from "./api/v1/volume";
import { sensorsApp } from "./api/v1/sensors";
import { dndApp } from "./api/v1/dnd";
import { HomeIOMCP } from "./mcp/server";
import { Env } from "./types/alexa";

/**
 * Creates and configures the main Hono application.
 * This app is shared between Cloudflare Workers and Node.js entry points.
 */
export function createServer() {
    const app = new Hono<{ Bindings: Env }>();

    // Middleware
    app.use("*", cors());

    // Base Information & Health
    app.get("/", (context) => {
        return context.json({
            name: "Alexa MCP Server",
            version: "1.2.0",
            description: "Smart home automation bridge for AI agents via MCP",
            endpoints: {
                api: "/api",
                mcp: "/mcp",
                sse: "/sse",
                health: "/health",
            },
        });
    });

    app.get("/health", (context) => {
        return context.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
        });
    });

    // API v1 Routes
    const api = new Hono<{ Bindings: Env }>();

    api.route("/bedroom", bedroomApp);
    api.route("/announce", announceApp);
    api.route("/music", musicApp);
    api.route("/lights", lightsApp);
    api.route("/volume", volumeApp);
    api.route("/sensors", sensorsApp);
    api.route("/dnd", dndApp);

    app.route("/api", api);

    // MCP SSE endpoints
    app.get("/sse", async (context) => {
        return HomeIOMCP.serveSSE("/sse").fetch(
            context.req.raw,
            context.env,
            {} as any
        );
    });

    app.post("/sse/message", async (context) => {
        return HomeIOMCP.serveSSE("/sse").fetch(
            context.req.raw,
            context.env,
            {} as any
        );
    });

    // MCP basic endpoint
    app.all("/mcp", async (context) => {
        return HomeIOMCP.serve("/mcp").fetch(
            context.req.raw,
            context.env,
            {} as any
        );
    });

    return app;
}
