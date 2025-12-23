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
exports.SetDndStatusSchema = void 0;
exports.getDndStatus = getDndStatus;
exports.setDndStatus = setDndStatus;
var zod_1 = require("zod");
exports.SetDndStatusSchema = zod_1.z.object({
    deviceSerialNumber: zod_1.z.string().optional().describe("Device serial number"),
    deviceType: zod_1.z.string().optional().describe("Device type"),
    enabled: zod_1.z.boolean().describe("Enable or disable Do Not Disturb"),
});
/**
 * Gets "Do Not Disturb" status for all devices.
 */
function getDndStatus(_args, context) {
    return __awaiter(this, void 0, void 0, function () {
        var apiBase, response, _a, devices, error_1;
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
                    return [4 /*yield*/, fetch("".concat(apiBase, "/api/dnd"), { method: "GET" })];
                case 2:
                    response = _c.sent();
                    if (!response.ok)
                        throw new Error("DND status failed: ".concat(response.status));
                    return [4 /*yield*/, response.json()];
                case 3:
                    _a = (_c.sent()).devices, devices = _a === void 0 ? [] : _a;
                    return [2 /*return*/, {
                            content: [{
                                    type: "text",
                                    text: "Do Not Disturb Status:\n" + devices.map(function (d) { return "- ".concat(d.type, " (").concat(d.serial, "): ").concat(d.isDndEnabled ? "ENABLED" : "disabled"); }).join("\n"),
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
 * Sets "Do Not Disturb" status for a device.
 */
function setDndStatus(args, context) {
    return __awaiter(this, void 0, void 0, function () {
        var apiBase, response, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    apiBase = (_a = context.env) === null || _a === void 0 ? void 0 : _a.API_BASE;
                    if (!apiBase)
                        return [2 /*return*/, { content: [{ type: "text", text: "Error: API_BASE not configured." }], isError: true }];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(apiBase, "/api/dnd"), {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(args),
                        })];
                case 2:
                    response = _b.sent();
                    if (!response.ok)
                        throw new Error("DND update failed: ".concat(response.status));
                    return [2 /*return*/, { content: [{ type: "text", text: "DND status updated successfully." }] }];
                case 3:
                    error_2 = _b.sent();
                    return [2 /*return*/, { content: [{ type: "text", text: "Error: ".concat(error_2.message) }], isError: true }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
