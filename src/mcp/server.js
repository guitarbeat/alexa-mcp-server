"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alexaMcp = exports.HomeIOMCP = void 0;
var mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
var announcements_1 = require("@/mcp/tools/announcements");
var bedroom_1 = require("@/mcp/tools/bedroom");
var lights_1 = require("@/mcp/tools/lights");
var music_1 = require("@/mcp/tools/music");
var volume_1 = require("@/mcp/tools/volume");
var sensors_1 = require("@/mcp/tools/sensors");
var devices_1 = require("@/mcp/tools/devices");
var dnd_1 = require("@/mcp/tools/dnd");
var alexa_1 = require("@/schemas/alexa");
/**
 * Alexa Home Automation MCP Server Logic
 * Uses the official @modelcontextprotocol/sdk.
 */
var HomeIOMCP = /** @class */ (function () {
    function HomeIOMCP() {
        this.server = new mcp_js_1.McpServer({
            name: "Alexa Home Automation",
            version: "1.2.1",
        });
        this.registerTools();
    }
    HomeIOMCP.prototype.registerTools = function () {
        // Announcements
        this.server.tool("alexa_announce", "Send voice announcements to Alexa devices", alexa_1.AlexaAnnounceSchema.shape, function (args, _a) {
            var env = _a.env;
            return (0, announcements_1.announceAlexa)(args, { env: env });
        });
        // State Monitoring
        this.server.tool("get_bedroom_state", "Get bedroom sensors (temp, light, motion) and lighting status", {}, function (args, _a) {
            var env = _a.env;
            return (0, bedroom_1.getBedroomState)(args, { env: env });
        });
        this.server.tool("get_music_status", "Get current track and playback info from Alexa", {}, function (args, _a) {
            var env = _a.env;
            return (0, music_1.getMusicStatus)(args, { env: env });
        });
        this.server.tool("get_all_sensor_data", "List all available sensors and their basic capabilities", {}, function (args, _a) {
            var env = _a.env;
            return (0, sensors_1.getAllSensorData)(args, { env: env });
        });
        // Device Control
        this.server.tool("list_lights", "List discovered lights and their IDs", {}, function (args, _a) {
            var env = _a.env;
            return (0, lights_1.listLights)(args, { env: env });
        });
        this.server.tool("set_light_power", "Turn light ON or OFF", alexa_1.SetLightPowerSchema.shape, function (args, _a) {
            var env = _a.env;
            return (0, lights_1.setLightPower)(args, { env: env });
        });
        this.server.tool("set_light_brightness", "Set light brightness (0-100)", alexa_1.SetLightBrightnessSchema.shape, function (args, _a) {
            var env = _a.env;
            return (0, lights_1.setLightBrightness)(args, { env: env });
        });
        this.server.tool("set_light_color", "Set light color or temperature", alexa_1.SetLightColorSchema.shape, function (args, _a) {
            var env = _a.env;
            return (0, lights_1.setLightColor)(args, { env: env });
        });
        this.server.tool("get_device_volumes", "Show volume level for all devices", {}, function (args, _a) {
            var env = _a.env;
            return (0, volume_1.getAllDeviceVolumes)(args, { env: env });
        });
        this.server.tool("set_device_volume", "Set absolute volume level (0-100)", alexa_1.SetVolumeSchema.shape, function (args, _a) {
            var env = _a.env;
            return (0, volume_1.setVolume)(args, { env: env });
        });
        this.server.tool("adjust_device_volume", "Adjust volume relatively (-100 to 100)", alexa_1.AdjustVolumeSchema.shape, function (args, _a) {
            var env = _a.env;
            return (0, volume_1.adjustVolume)(args, { env: env });
        });
        this.server.tool("get_dnd_status", "Get Do Not Disturb status", {}, function (args, _a) {
            var env = _a.env;
            return (0, dnd_1.getDndStatus)(args, { env: env });
        });
        this.server.tool("set_dnd_status", "Set Do Not Disturb status", alexa_1.SetDndStatusSchema.shape, function (args, _a) {
            var env = _a.env;
            return (0, dnd_1.setDndStatus)(args, { env: env });
        });
        // Discovery
        this.server.tool("list_smarthome_devices", "Discover all devices and capabilities on the account", {}, function (args, _a) {
            var env = _a.env;
            return (0, devices_1.listSmartHomeDevices)(args, { env: env });
        });
    };
    /**
     * Returns the underlying McpServer instance.
     */
    HomeIOMCP.prototype.getMcpServer = function () {
        return this.server;
    };
    return HomeIOMCP;
}());
exports.HomeIOMCP = HomeIOMCP;
exports.alexaMcp = new HomeIOMCP();
