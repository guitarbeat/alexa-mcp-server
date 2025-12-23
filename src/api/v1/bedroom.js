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
exports.bedroomApp = void 0;
var hono_1 = require("hono");
var alexa_1 = require("@/utils/alexa");
var alexa_dynamic_1 = require("@/utils/alexa-dynamic");
exports.bedroomApp = new hono_1.Hono();
var PHOENIX_API = "https://alexa.amazon.com/api/phoenix/state";
/**
 * Aggregates bedroom sensor and light state.
 */
exports.bedroomApp.get("/", function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var stateRequests_1, discoveredIds_1, addTarget, _a, echoId, lightId, endpoints, _i, endpoints_1, ep, eid, response, _b, deviceStates, temperature, illuminance, motion, light, _c, deviceStates_1, ds, caps, _d, caps_1, c, error_1;
    var _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 5, , 6]);
                stateRequests_1 = [];
                discoveredIds_1 = new Set();
                addTarget = function (id, type) {
                    if (id && !discoveredIds_1.has(id)) {
                        stateRequests_1.push({ entityId: id, entityType: type });
                        discoveredIds_1.add(id);
                    }
                };
                return [4 /*yield*/, Promise.all([
                        (0, alexa_dynamic_1.getEchoDeviceEntityId)(context.env).catch(function () { return null; }),
                        (0, alexa_dynamic_1.getLightApplianceId)(context.env).catch(function () { return null; }),
                    ])];
            case 1:
                _a = _h.sent(), echoId = _a[0], lightId = _a[1];
                if (echoId)
                    addTarget(echoId, "ENTITY");
                if (lightId)
                    addTarget(lightId, "APPLIANCE");
                return [4 /*yield*/, (0, alexa_dynamic_1.getCustomerSmartHomeEndpoints)(context.env).catch(function () { return []; })];
            case 2:
                endpoints = _h.sent();
                for (_i = 0, endpoints_1 = endpoints; _i < endpoints_1.length; _i++) {
                    ep = endpoints_1[_i];
                    eid = ((_f = (_e = ep.legacyIdentifiers) === null || _e === void 0 ? void 0 : _e.chrsIdentifier) === null || _f === void 0 ? void 0 : _f.entityId) || ep.endpointId;
                    if (eid)
                        addTarget(eid, "ENTITY");
                    if ((_g = ep.legacyAppliance) === null || _g === void 0 ? void 0 : _g.applianceId)
                        addTarget(ep.legacyAppliance.applianceId, "APPLIANCE");
                }
                if (stateRequests_1.length === 0)
                    return [2 /*return*/, context.json({ error: "No control entities found" }, 404)];
                return [4 /*yield*/, fetch(PHOENIX_API, {
                        method: "POST",
                        headers: (0, alexa_1.buildAlexaHeaders)(context.env, { "Content-Type": "application/json" }),
                        body: JSON.stringify({ stateRequests: stateRequests_1 }),
                    })];
            case 3:
                response = _h.sent();
                if (!response.ok)
                    return [2 /*return*/, context.json({ error: "Alexa API unreachable" }, 503)];
                return [4 /*yield*/, response.json()];
            case 4:
                _b = (_h.sent()).deviceStates, deviceStates = _b === void 0 ? [] : _b;
                temperature = null, illuminance = null, motion = false, light = { on: false, brightness: 0 };
                for (_c = 0, deviceStates_1 = deviceStates; _c < deviceStates_1.length; _c++) {
                    ds = deviceStates_1[_c];
                    caps = (ds.capabilityStates || []).map(function (c) { return JSON.parse(c); });
                    for (_d = 0, caps_1 = caps; _d < caps_1.length; _d++) {
                        c = caps_1[_d];
                        if (c.namespace === "Alexa.TemperatureSensor")
                            temperature = c.value;
                        if (c.namespace === "Alexa.LightSensor")
                            illuminance = c.value;
                        if (c.namespace === "Alexa.MotionSensor")
                            motion = c.value === "DETECTED";
                        if (c.namespace === "Alexa.PowerController")
                            light.on = c.value === "ON";
                        if (c.namespace === "Alexa.BrightnessController")
                            light.brightness = c.value;
                    }
                }
                return [2 /*return*/, context.json({
                        temperature: temperature ? { fahrenheit: temperature.value } : null, // Simplification for brevity
                        illuminance: illuminance,
                        motion: { detected: motion },
                        lighting: light,
                        timestamp: new Date().toISOString(),
                    })];
            case 5:
                error_1 = _h.sent();
                return [2 /*return*/, context.json({ error: "Bedroom state failure", details: error_1.message }, 500)];
            case 6: return [2 /*return*/];
        }
    });
}); });
