"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
var hono_1 = require("hono");
var cors_1 = require("hono/cors");
var sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
var bedroom_1 = require("./api/v1/bedroom");
var announce_1 = require("./api/v1/announce");
var music_1 = require("./api/v1/music");
var lights_1 = require("./api/v1/lights");
var volume_1 = require("./api/v1/volume");
var sensors_1 = require("./api/v1/sensors");
var dnd_1 = require("./api/v1/dnd");
var server_1 = require("./mcp/server");
// Store active transports in memory
var transports = new Map();
/**
 * Creates and configures the main Hono application.
 */
function createServer() {
    var _this = this;
    var app = new hono_1.Hono();
    app.use("*", (0, cors_1.cors)());
    // Health check
    app.get("/health", function (c) { return c.json({ status: "healthy", timestamp: new Date().toISOString() }); });
    app.get("/", function (c) { return c.json({
        name: "Alexa MCP Server",
        version: "1.2.2",
        endpoints: { api: "/api", mcp: "/mcp", sse: "/sse" }
    }); });
    // API Routes
    var api = new hono_1.Hono();
    api.route("/bedroom", bedroom_1.bedroomApp);
    api.route("/announce", announce_1.announceApp);
    api.route("/music", music_1.musicApp);
    api.route("/lights", lights_1.lightsApp);
    api.route("/volume", volume_1.volumeApp);
    api.route("/sensors", sensors_1.sensorsApp);
    api.route("/dnd", dnd_1.dndApp);
    app.route("/api", api);
    // --- MCP Integration ---
    app.get("/sse", function (c) { return __awaiter(_this, void 0, void 0, function () {
        var mcpServer, rawRes, rawReq, transport, sessionId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mcpServer = server_1.alexaMcp.getMcpServer();
                    rawRes = c.env.outgoing;
                    rawReq = c.env.incoming;
                    if (!rawRes || !rawReq) {
                        return [2 /*return*/, c.text("SSE transport requires a Node.js environment (Hono node-server)", 500)];
                    }
                    console.log("Creating new SSE transport...");
                    transport = new sse_js_1.SSEServerTransport("/api/mcp", rawRes);
                    return [4 /*yield*/, mcpServer.connect(transport)];
                case 1:
                    _a.sent();
                    sessionId = transport.sessionId;
                    console.log("SSE connection established. Session: ".concat(sessionId));
                    transports.set(sessionId, transport);
                    rawReq.on("close", function () {
                        console.log("SSE connection closed for session: ".concat(sessionId));
                        transports.delete(sessionId);
                    });
                    // We return a null body because transport.start() (via connect) handles the response headers and body
                    return [2 /*return*/, new Response(null)];
            }
        });
    }); });
    app.post("/api/mcp", function (c) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, transport, rawReq, rawRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = c.req.query("sessionId");
                    if (!sessionId) {
                        return [2 /*return*/, c.text("Missing sessionId", 400)];
                    }
                    transport = transports.get(sessionId);
                    if (!transport) {
                        console.error("Session not found: ".concat(sessionId));
                        return [2 /*return*/, c.text("Session not found", 404)];
                    }
                    rawReq = c.env.incoming;
                    rawRes = c.env.outgoing;
                    if (!rawReq || !rawRes) {
                        return [2 /*return*/, c.text("POST hand-off requires a Node.js environment", 500)];
                    }
                    return [4 /*yield*/, transport.handlePostMessage(rawReq, rawRes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, new Response(null)];
            }
        });
    }); });
    return app;
}
