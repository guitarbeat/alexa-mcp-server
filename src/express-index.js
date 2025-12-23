#!/usr/bin/env node
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
var node_crypto_1 = require("node:crypto");
var express_js_1 = require("@modelcontextprotocol/sdk/server/express.js");
var sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
var dotenv_1 = require("dotenv");
var server_js_1 = require("./mcp/server.js");
dotenv_1.default.config();
var PORT = Number(process.env.PORT) || 8787;
// Create MCP server instance
var server = server_js_1.alexaMcp.getMcpServer();
// Create Express app with MCP SDK helper
var app = (0, express_js_1.createMcpExpressApp)({
    host: '0.0.0.0',
    allowedHosts: ['localhost', '127.0.0.1', '::1', '[::1]', 'alexa-mcp-server.onrender.com', process.env.RENDER_EXTERNAL_HOSTNAME].filter(function (h) { return !!h; }),
});
// CORS middleware
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});
// Store SSE transports by session ID
var sseTransports = new Map();
// Health check
app.get('/health', function (_req, res) {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// Root endpoint
app.get('/', function (_req, res) {
    res.json({
        name: 'Alexa MCP Server',
        version: '1.3.0',
        endpoints: { sse: '/sse', messages: '/api/mcp' }
    });
});
// SSE endpoint
app.get('/sse', function (req, res) {
    var clientIp = req.ip || req.socket.remoteAddress;
    var sessionId = "sse-".concat((0, node_crypto_1.randomUUID)());
    console.log("[SSE] Connection attempt from ".concat(clientIp, " (session: ").concat(sessionId, ")"));
    // Create SSE transport with raw Express response object
    var transport = new sse_js_1.SSEServerTransport('/api/mcp', res);
    // Get actual session ID from transport
    var actualSessionId = transport.sessionId || sessionId;
    // Store transport
    sseTransports.set(actualSessionId, transport);
    // Setup cleanup handler
    transport.onclose = function () {
        console.log("[SSE] Transport closed for session ".concat(actualSessionId));
        sseTransports.delete(actualSessionId);
    };
    console.log("[SSE] Creating transport (session: ".concat(actualSessionId, ")..."));
    server
        .connect(transport)
        .then(function () {
        console.log("[SSE] \u2705 Transport connected successfully (session: ".concat(actualSessionId, ")"));
    })
        .catch(function (error) {
        console.error('[SSE] ❌ Error connecting SSE transport:', error);
        sseTransports.delete(actualSessionId);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to establish SSE connection' });
        }
    });
    // Clean up on connection close
    res.on('close', function () {
        console.log("[SSE] Connection closed (session: ".concat(actualSessionId, ")"));
        if (sseTransports.has(actualSessionId)) {
            try {
                var t = sseTransports.get(actualSessionId);
                if (t) {
                    t.close();
                }
            }
            catch (_e) {
                // Ignore cleanup errors
            }
            sseTransports.delete(actualSessionId);
        }
    });
});
// Messages endpoint
app.post('/api/mcp', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionId, transportsArray, _a, transport_1, transport, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                sessionId = req.query.sessionId;
                if (!!sessionId) return [3 /*break*/, 3];
                transportsArray = Array.from(sseTransports.entries());
                if (!(transportsArray.length === 1)) return [3 /*break*/, 2];
                _a = transportsArray[0], transport_1 = _a[1];
                return [4 /*yield*/, transport_1.handlePostMessage(req, res, req.body)];
            case 1:
                _b.sent();
                return [2 /*return*/];
            case 2:
                if (transportsArray.length === 0) {
                    res.status(503).json({
                        error: 'Transport not initialized',
                        message: 'No active SSE connections. Connect to /sse first.',
                    });
                    return [2 /*return*/];
                }
                else {
                    res.status(400).json({
                        error: 'Session ID required',
                        message: 'Multiple active sessions detected. Please include sessionId parameter.',
                    });
                    return [2 /*return*/];
                }
                _b.label = 3;
            case 3:
                transport = sseTransports.get(sessionId);
                if (!transport) {
                    res.status(404).json({
                        error: 'Session not found',
                        message: "No active transport found for session: ".concat(sessionId),
                    });
                    return [2 /*return*/];
                }
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, transport.handlePostMessage(req, res, req.body)];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.error("[SSE] Error handling message for session ".concat(sessionId, ":"), error_1);
                if (!res.headersSent) {
                    res.status(500).json({
                        error: 'Internal server error',
                        message: error_1 instanceof Error ? error_1.message : 'Unknown error',
                    });
                }
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Start server
app.listen(PORT, '0.0.0.0', function () {
    console.log("\uD83D\uDE80 Alexa MCP Server is running on http://0.0.0.0:".concat(PORT));
    console.log("   SSE endpoint: http://0.0.0.0:".concat(PORT, "/sse"));
    console.log("   Messages endpoint: http://0.0.0.0:".concat(PORT, "/api/mcp"));
});
