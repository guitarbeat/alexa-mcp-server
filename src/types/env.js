"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
var zod_1 = require("zod");
// Environment validation schema for Cloudflare Workers
exports.EnvSchema = zod_1.z.object({
    /** Amazon ubid-main cookie value */
    UBID_MAIN: zod_1.z.string().min(1, "UBID_MAIN is required"),
    /** Amazon at-main authentication token */
    AT_MAIN: zod_1.z.string().min(1, "AT_MAIN is required"),
    /** API key for MCP client authentication */
    API_KEY: zod_1.z.string().optional(),
    /** Base URL for the Alexa API service */
    API_BASE: zod_1.z.string().url("API_BASE must be a valid URL"),
    /** IANA timezone (e.g. 'America/New_York') for announcement scheduling */
    TZ: zod_1.z.string().optional(),
    /** Spotify Bearer Token for Web API access */
    SPOTIFY_TOKEN: zod_1.z.string().optional(),
    /** Spotify Client ID for OAuth */
    SPOTIFY_CLIENT_ID: zod_1.z.string().optional(),
    /** Spotify Client Secret for OAuth */
    SPOTIFY_CLIENT_SECRET: zod_1.z.string().optional(),
    /** Spotify Refresh Token for OAuth */
    SPOTIFY_REFRESH_TOKEN: zod_1.z.string().optional(),
});
