"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
/**
 * Cloudflare Workers Entry Point
 */
var app = (0, app_1.createServer)();
exports.default = {
    fetch: app.fetch,
};
