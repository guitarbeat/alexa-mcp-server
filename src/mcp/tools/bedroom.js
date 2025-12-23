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
exports.getBedroomState = getBedroomState;
function getBedroomState(_args, context) {
    return __awaiter(this, void 0, void 0, function () {
        var apiBase, response, state, motionStatus, lightStatus, summary, error_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    apiBase = (_a = context.env) === null || _a === void 0 ? void 0 : _a.API_BASE;
                    if (!apiBase) {
                        return [2 /*return*/, {
                                content: [{ type: "text", text: "Error: API_BASE not configured." }],
                                isError: true,
                            }];
                    }
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(apiBase, "/api/bedroom"), { method: "GET" })];
                case 2:
                    response = _e.sent();
                    if (!response.ok) {
                        return [2 /*return*/, {
                                content: [{ type: "text", text: "Bedroom state lookup failed: ".concat(response.status) }],
                                isError: true,
                            }];
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    state = (_e.sent());
                    motionStatus = ((_b = state.motion) === null || _b === void 0 ? void 0 : _b.detected) ? "Occupied" : "Empty";
                    lightStatus = ((_c = state.lighting) === null || _c === void 0 ? void 0 : _c.isOn) ? "ON (".concat(state.lighting.brightness, "%)") : "OFF";
                    summary = [
                        "Temperature: ".concat(((_d = state.temperature) === null || _d === void 0 ? void 0 : _d.fahrenheit) ? "".concat(Math.round(state.temperature.fahrenheit), "\u00B0F") : "N/A"),
                        "Illuminance: ".concat(state.illuminance ? "".concat(state.illuminance, " lux") : "N/A"),
                        "Motion: ".concat(motionStatus),
                        "Light: ".concat(lightStatus),
                        "Last Updated: ".concat(state.timestamp),
                    ].join("\n");
                    return [2 /*return*/, {
                            content: [{
                                    type: "text",
                                    text: summary,
                                }],
                        }];
                case 4:
                    error_1 = _e.sent();
                    return [2 /*return*/, {
                            content: [{ type: "text", text: "Network error fetching bedroom state: ".concat(error_1.message) }],
                            isError: true,
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
