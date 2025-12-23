"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_server_1 = require("@hono/node-server");
var app_1 = require("./app");
require("dotenv/config");
/**
 * Node.js Entry Point
 */
// Load environment variables into the Hono context for Node.js
var env = {
    UBID_MAIN: process.env.UBID_MAIN || "",
    AT_MAIN: process.env.AT_MAIN || "",
    API_BASE: process.env.API_BASE || "",
    ALEXA_COOKIES: process.env.ALEXA_COOKIES || "",
    API_KEY: process.env.API_KEY || "",
    TZ: process.env.TZ || "",
    SPOTIFY_TOKEN: process.env.SPOTIFY_TOKEN || "",
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || "",
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || "",
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN || "",
};
var app = (0, app_1.createServer)();
var port = Number(process.env.PORT) || 8787;
console.log("\uD83D\uDE80 Alexa MCP Server is running on http://localhost:".concat(port));
(0, node_server_1.serve)({
    fetch: function (request, nodeEnv) { return app.fetch(request, __assign(__assign({}, nodeEnv), env)); },
    port: port,
});
