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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSmartHomeDevices = listSmartHomeDevices;
var alexa_dynamic_1 = require("@/utils/alexa-dynamic");
/**
 * Lists all smart home devices and their capabilities.
 */
function listSmartHomeDevices(_args, context) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoints, devices, summary, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!((_a = context.env) === null || _a === void 0 ? void 0 : _a.UBID_MAIN) || !((_b = context.env) === null || _b === void 0 ? void 0 : _b.AT_MAIN)) {
                        return [2 /*return*/, {
                                content: [{ type: "text", text: "Error: Missing Amazon authentication cookies." }],
                                isError: true,
                            }];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, alexa_dynamic_1.getCustomerSmartHomeEndpoints)(context.env)];
                case 2:
                    endpoints = _c.sent();
                    devices = endpoints.map(function (endpoint) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        return ({
                            name: endpoint.friendlyName,
                            category: ((_b = (_a = endpoint.displayCategories) === null || _a === void 0 ? void 0 : _a.primary) === null || _b === void 0 ? void 0 : _b.value) || "UNKNOWN",
                            description: (_c = endpoint.legacyAppliance) === null || _c === void 0 ? void 0 : _c.friendlyDescription,
                            isOnline: ((_e = (_d = endpoint.legacyAppliance) === null || _d === void 0 ? void 0 : _d.applianceNetworkState) === null || _e === void 0 ? void 0 : _e.reachability) === "REACHABLE",
                            capabilities: ((_g = (_f = endpoint.legacyAppliance) === null || _f === void 0 ? void 0 : _f.capabilities) === null || _g === void 0 ? void 0 : _g.map(function (cap) { return cap.interfaceName; })) || [],
                        });
                    });
                    summary = __spreadArray([
                        "Total Devices: ".concat(devices.length),
                        "Online: ".concat(devices.filter(function (d) { return d.isOnline; }).length),
                        ""
                    ], devices.map(function (d) { return "- ".concat(d.name, " (").concat(d.category, "): ").concat(d.isOnline ? "Online" : "Offline"); }), true).join("\n");
                    return [2 /*return*/, {
                            content: [{ type: "text", text: summary }],
                        }];
                case 3:
                    error_1 = _c.sent();
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Discovery failed: ".concat(error_1.message) }],
                            isError: true,
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
