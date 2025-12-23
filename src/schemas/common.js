"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = exports.ssmlSchema = exports.colorValueSchema = exports.colorModeSchema = exports.brightnessLevelSchema = exports.transitionTimeSchema = exports.lightIdSchema = void 0;
var zod_1 = require("zod");
// Common validation schemas used across tools
exports.lightIdSchema = zod_1.z
    .string()
    .describe("Light entity ID (use 'b34d9c5a-b511-478c-b79a-bbfb0f21442d' for bedroom light)");
exports.transitionTimeSchema = zod_1.z
    .number()
    .min(0)
    .max(10000)
    .optional()
    .describe("Transition time in milliseconds (0-10000)");
exports.brightnessLevelSchema = zod_1.z
    .union([zod_1.z.number(), zod_1.z.string()])
    .transform(function (val) {
    var num = typeof val === "string" ? Number.parseInt(val, 10) : val;
    return Math.max(0, Math.min(100, num));
})
    .describe("Brightness level (0-100)");
exports.colorModeSchema = zod_1.z
    .enum(["name", "hex", "hsv", "tempK"])
    .describe("Color mode: 'name' for color names, 'hex' for hex codes, 'hsv' for HSV values, 'tempK' for Kelvin temperature");
exports.colorValueSchema = zod_1.z
    .union([
    zod_1.z.string(), // For color names and hex codes
    zod_1.z.number(), // For Kelvin temperature
    zod_1.z.object({ h: zod_1.z.number(), s: zod_1.z.number(), v: zod_1.z.number() }), // For HSV
])
    .describe("Color value based on mode - string for names/hex, number for Kelvin, object {h,s,v} for HSV");
exports.ssmlSchema = zod_1.z
    .boolean()
    .optional()
    .describe("Whether the message contains SSML markup for advanced speech synthesis");
// Environment type for validation
exports.envSchema = zod_1.z.object({
    API_BASE: zod_1.z.string().optional(),
    ALEXA_COOKIES: zod_1.z.string().optional(),
});
