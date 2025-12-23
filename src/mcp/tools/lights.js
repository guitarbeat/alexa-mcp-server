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
exports.listLights = listLights;
exports.setLightPower = setLightPower;
exports.setLightBrightness = setLightBrightness;
exports.setLightColor = setLightColor;
/**
 * Standard tool response handler for light operations.
 */
function handleLightOperation(apiBase, path, body) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("".concat(apiBase).concat(path), {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    })];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("Light control failed: ".concat(response.status));
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Lists all discoverable lights.
 */
function listLights(_args, context) {
    return __awaiter(this, void 0, void 0, function () {
        var apiBase, response, _a, lights, error_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    apiBase = (_b = context.env) === null || _b === void 0 ? void 0 : _b.API_BASE;
                    if (!apiBase)
                        return [2 /*return*/, { content: [{ type: "text", text: "Error: API_BASE not configured." }], isError: true }];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(apiBase, "/api/lights/list"), { method: "GET" })];
                case 2:
                    response = _c.sent();
                    if (!response.ok)
                        throw new Error("List lights failed: ".concat(response.status));
                    return [4 /*yield*/, response.json()];
                case 3:
                    _a = (_c.sent()).lights, lights = _a === void 0 ? [] : _a;
                    return [2 /*return*/, {
                            content: [{
                                    type: "text",
                                    text: lights.length > 0
                                        ? "Found ".concat(lights.length, " lights:\n") + lights.map(function (l) { return "- ".concat(l.name, " (ID: ").concat(l.id, ")"); }).join("\n")
                                        : "No lights discovered on this Alexa account.",
                                }],
                        }];
                case 4:
                    error_1 = _c.sent();
                    return [2 /*return*/, { content: [{ type: "text", text: "Error: ".concat(error_1.message) }], isError: true }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Power control (ON/OFF).
 */
function setLightPower(args, context) {
    return __awaiter(this, void 0, void 0, function () {
        var id, on, apiBase, result, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = args.id, on = args.on;
                    apiBase = (_a = context.env) === null || _a === void 0 ? void 0 : _a.API_BASE;
                    if (!apiBase)
                        return [2 /*return*/, { content: [{ type: "text", text: "Error: API_BASE not configured." }], isError: true }];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, handleLightOperation(apiBase, "/api/lights/".concat(id, "/power"), { on: on })];
                case 2:
                    result = _b.sent();
                    return [2 /*return*/, { content: [{ type: "text", text: "Light ".concat(on ? "ON" : "OFF", " command successful.") }] }];
                case 3:
                    error_2 = _b.sent();
                    return [2 /*return*/, { content: [{ type: "text", text: "Error: ".concat(error_2.message) }], isError: true }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Brightness control (0-100).
 */
function setLightBrightness(args, context) {
    return __awaiter(this, void 0, void 0, function () {
        var id, level, apiBase, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = args.id, level = args.level;
                    apiBase = (_a = context.env) === null || _a === void 0 ? void 0 : _a.API_BASE;
                    if (!apiBase)
                        return [2 /*return*/, { content: [{ type: "text", text: "Error: API_BASE not configured." }], isError: true }];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, handleLightOperation(apiBase, "/api/lights/".concat(id, "/brightness"), { level: level })];
                case 2:
                    _b.sent();
                    return [2 /*return*/, { content: [{ type: "text", text: "Brightness set to ".concat(level, "%.") }] }];
                case 3:
                    error_3 = _b.sent();
                    return [2 /*return*/, { content: [{ type: "text", text: "Error: ".concat(error_3.message) }], isError: true }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Color and Color Temperature control.
 */
function setLightColor(args, context) {
    return __awaiter(this, void 0, void 0, function () {
        var id, mode, value, apiBase, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = args.id, mode = args.mode, value = args.value;
                    apiBase = (_a = context.env) === null || _a === void 0 ? void 0 : _a.API_BASE;
                    if (!apiBase)
                        return [2 /*return*/, { content: [{ type: "text", text: "Error: API_BASE not configured." }], isError: true }];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, handleLightOperation(apiBase, "/api/lights/".concat(id, "/color"), { mode: mode, value: value })];
                case 2:
                    _b.sent();
                    return [2 /*return*/, { content: [{ type: "text", text: "Color set to ".concat(value, " (").concat(mode, ").") }] }];
                case 3:
                    error_4 = _b.sent();
                    return [2 /*return*/, { content: [{ type: "text", text: "Error: ".concat(error_4.message) }], isError: true }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
