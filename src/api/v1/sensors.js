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
exports.sensorsApp = void 0;
var hono_1 = require("hono");
var alexa_1 = require("@/utils/alexa");
exports.sensorsApp = new hono_1.Hono();
var DEVICES_API = "https://alexa.amazon.com/api/devices-v2/device?cached=true";
var PHOENIX_API = "https://alexa.amazon.com/api/phoenix/state";
/**
 * Lists all Alexa devices that support sensor capabilities.
 */
exports.sensorsApp.get("/", function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var response, _a, devices, sensors, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch(DEVICES_API, {
                        method: "GET",
                        headers: (0, alexa_1.buildAlexaHeaders)(context.env, { "Accept": "application/json; charset=utf-8" }),
                    })];
            case 1:
                response = _b.sent();
                if (!response.ok)
                    throw new Error("Alexa API error: ".concat(response.status));
                return [4 /*yield*/, response.json()];
            case 2:
                _a = (_b.sent()).devices, devices = _a === void 0 ? [] : _a;
                sensors = devices
                    .filter(function (d) { var _a, _b; return d.deviceFamily === "ECHO" || ((_a = d.deviceType) === null || _a === void 0 ? void 0 : _a.includes("ECHO")) || ((_b = d.accountName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("echo")); })
                    .map(function (d) { return ({
                    id: "AlexaBridge_".concat(d.serialNumber, "@").concat(d.deviceType, "_").concat(d.serialNumber),
                    name: d.accountName || d.deviceName || "Alexa Device",
                    type: d.deviceType,
                    isOnline: d.online !== false,
                    capabilities: ["temperature", "illuminance", "motion"],
                }); });
                return [2 /*return*/, context.json({ sensors: sensors, count: sensors.length })];
            case 3:
                error_1 = _b.sent();
                return [2 /*return*/, context.json({ error: "Sensor discovery failed", details: error_1.message }, 500)];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Retrieves sensor data for a specific entity.
 */
exports.sensorsApp.get("/:entityId", function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var entityId, response, _a, deviceStates, state, data, caps, _i, caps_1, c, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                entityId = context.req.param("entityId");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch(PHOENIX_API, {
                        method: "POST",
                        headers: (0, alexa_1.buildAlexaHeaders)(context.env, { "Content-Type": "application/json" }),
                        body: JSON.stringify({
                            stateRequests: [{
                                    entityId: entityId,
                                    entityType: "APPLIANCE",
                                    properties: [
                                        { namespace: "Alexa.TemperatureSensor", name: "temperature" },
                                        { namespace: "Alexa.LightSensor", name: "illuminance" },
                                        { namespace: "Alexa.MotionSensor", name: "detectionState" },
                                    ],
                                }],
                        }),
                    })];
            case 2:
                response = _b.sent();
                if (!response.ok)
                    throw new Error("Alexa API error: ".concat(response.status));
                return [4 /*yield*/, response.json()];
            case 3:
                _a = (_b.sent()).deviceStates, deviceStates = _a === void 0 ? [] : _a;
                if (deviceStates.length === 0)
                    return [2 /*return*/, context.json({ error: "Entity not found" }, 404)];
                state = deviceStates[0];
                data = {};
                caps = (state.capabilityStates || []).map(function (c) { return JSON.parse(c); });
                for (_i = 0, caps_1 = caps; _i < caps_1.length; _i++) {
                    c = caps_1[_i];
                    if (c.namespace.includes("Temperature"))
                        data.temperature = c.value;
                    if (c.namespace.includes("LightSensor"))
                        data.illuminance = c.value;
                    if (c.namespace.includes("MotionSensor"))
                        data.motion = c.value === "DETECTED";
                }
                return [2 /*return*/, context.json({ id: entityId, data: data, timestamp: new Date().toISOString() })];
            case 4:
                error_2 = _b.sent();
                return [2 /*return*/, context.json({ error: "Sensor lookup failed", details: error_2.message }, 500)];
            case 5: return [2 /*return*/];
        }
    });
}); });
