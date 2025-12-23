"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
var zod_1 = require("zod");
// Environment validation schema
exports.EnvSchema = zod_1.z.object({
    UBID_MAIN: zod_1.z.string().min(1, "UBID_MAIN is required"),
    AT_MAIN: zod_1.z.string().min(1, "AT_MAIN is required"),
    API_BASE: zod_1.z.string().optional(),
    ALEXA_COOKIES: zod_1.z.string().optional(),
    API_KEY: zod_1.z.string().optional(),
    TZ: zod_1.z.string().optional(),
    SPOTIFY_TOKEN: zod_1.z.string().optional(),
    SPOTIFY_CLIENT_ID: zod_1.z.string().optional(),
    SPOTIFY_CLIENT_SECRET: zod_1.z.string().optional(),
    SPOTIFY_REFRESH_TOKEN: zod_1.z.string().optional(),
});
