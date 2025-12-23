"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ALEXA_ENDPOINT = void 0;
exports.getAccountId = getAccountId;
exports.buildAlexaHeaders = buildAlexaHeaders;
exports.isAnyLightOn = isAnyLightOn;
exports.getAmazonMusicPlayback = getAmazonMusicPlayback;
var alexa_dynamic_1 = require("@/utils/alexa-dynamic");
exports.ALEXA_ENDPOINT = "https://alexa.amazon.com/api/phoenix/state";
// Dynamic account ID helper
function getAccountId(env) {
    return __awaiter(this, void 0, void 0, function () {
        var accountInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, alexa_dynamic_1.getAccountInfo)(env)];
                case 1:
                    accountInfo = _a.sent();
                    return [2 /*return*/, accountInfo.customerId];
            }
        });
    });
}
// Shared User-Agent and header helpers
var USER_AGENT = "PitanguiBridge/2.2.629941.0-[PLATFORM=Android][MANUFACTURER=samsung][RELEASE=12][BRAND=Redmi][SDK=31][MODEL=SM-S928B]";
function buildAlexaHeaders(env, additional) {
    if (additional === void 0) { additional = {}; }
    // Build cookie string from individual components
    var cookieString = "csrf=1; ubid-main=".concat(env.UBID_MAIN, "; at-main=").concat(env.AT_MAIN);
    var headers = __assign({ Cookie: cookieString, Csrf: "1", Accept: "application/json; charset=utf-8", "Accept-Language": "en-US", "User-Agent": USER_AGENT }, additional);
    return headers;
}
// Note: State request body is now dynamically generated in bedroom handler
// Helper to check if any light is currently ON via Alexa Phoenix state
function isAnyLightOn(env) {
    return __awaiter(this, void 0, void 0, function () {
        var UBID_MAIN, AT_MAIN, _a, getPrimaryLight, extractEntityId, primaryLight, entityId, body, res, data, powerCap, error_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    UBID_MAIN = env.UBID_MAIN, AT_MAIN = env.AT_MAIN;
                    if (!UBID_MAIN || !AT_MAIN)
                        return [2 /*return*/, null];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("./alexa-dynamic"); })];
                case 2:
                    _a = _d.sent(), getPrimaryLight = _a.getPrimaryLight, extractEntityId = _a.extractEntityId;
                    return [4 /*yield*/, getPrimaryLight(env)];
                case 3:
                    primaryLight = _d.sent();
                    entityId = extractEntityId(primaryLight);
                    body = JSON.stringify({
                        stateRequests: [
                            {
                                entityId: entityId,
                                entityType: "APPLIANCE",
                                properties: [{ namespace: "Alexa.PowerController", name: "powerState" }],
                            },
                        ],
                    });
                    return [4 /*yield*/, fetch(exports.ALEXA_ENDPOINT, {
                            method: "POST",
                            headers: buildAlexaHeaders(env, { "Content-Type": "application/json; charset=utf-8" }),
                            body: body,
                        })];
                case 4:
                    res = _d.sent();
                    if (!res.ok)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, res.json()];
                case 5:
                    data = (_d.sent());
                    powerCap = (_c = (_b = data.deviceStates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.capabilityStates.flatMap(function (raw) {
                        try {
                            return [JSON.parse(raw)];
                        }
                        catch (_a) {
                            return [];
                        }
                    }).find(function (cap) { return cap.namespace === "Alexa.PowerController" && cap.name === "powerState"; });
                    return [2 /*return*/, powerCap ? powerCap.value === "ON" : null];
                case 6:
                    error_1 = _d.sent();
                    console.warn("Failed to check light state:", error_1);
                    return [2 /*return*/, null];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Helper to get now-playing info from Amazon Music via Alexa NP endpoint
function getAmazonMusicPlayback(env) {
    return __awaiter(this, void 0, void 0, function () {
        var UBID_MAIN, AT_MAIN, deviceSerial, deviceType, endpoints, echoDevice, error_2, npUrl, res, data, session, _a, infoText, mainArt, state, progress, providerName, provider, isPlaying;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    UBID_MAIN = env.UBID_MAIN, AT_MAIN = env.AT_MAIN;
                    if (!UBID_MAIN || !AT_MAIN)
                        return [2 /*return*/, null];
                    _v.label = 1;
                case 1:
                    _v.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, alexa_dynamic_1.getCustomerSmartHomeEndpoints)(env)];
                case 2:
                    endpoints = _v.sent();
                    echoDevice = endpoints.find(function (endpoint) {
                        var _a, _b;
                        var primaryCategory = (_b = (_a = endpoint.displayCategories) === null || _a === void 0 ? void 0 : _a.primary) === null || _b === void 0 ? void 0 : _b.value;
                        return primaryCategory === "ALEXA_VOICE_ENABLED";
                    });
                    if (!echoDevice) {
                        console.warn("No Echo device found for music queries");
                        return [2 /*return*/, null];
                    }
                    // Extract serial number and device type from DMS identifier
                    deviceSerial = (_e = (_d = (_c = (_b = echoDevice.legacyIdentifiers) === null || _b === void 0 ? void 0 : _b.dmsIdentifier) === null || _c === void 0 ? void 0 : _c.deviceSerialNumber) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.text;
                    deviceType = (_j = (_h = (_g = (_f = echoDevice.legacyIdentifiers) === null || _f === void 0 ? void 0 : _f.dmsIdentifier) === null || _g === void 0 ? void 0 : _g.deviceType) === null || _h === void 0 ? void 0 : _h.value) === null || _j === void 0 ? void 0 : _j.text;
                    if (!deviceSerial || !deviceType) {
                        console.warn("Missing serial number or device type for Echo device");
                        return [2 /*return*/, null];
                    }
                    console.log("Music: Using Echo device:", {
                        serialNumber: deviceSerial,
                        deviceType: deviceType,
                        friendlyName: echoDevice.friendlyName
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _v.sent();
                    console.warn("Failed to get Echo device from GraphQL:", error_2);
                    return [2 /*return*/, null];
                case 4:
                    npUrl = "https://alexa.amazon.com/api/np/list-media-sessions?deviceSerialNumber=".concat(deviceSerial, "&deviceType=").concat(deviceType);
                    console.log("Music: Fetching from URL:", npUrl);
                    return [4 /*yield*/, fetch(npUrl, {
                            headers: buildAlexaHeaders(env),
                        })];
                case 5:
                    res = _v.sent();
                    if (!res.ok)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, res.json()];
                case 6:
                    data = (_v.sent());
                    session = (_k = data.mediaSessionList) === null || _k === void 0 ? void 0 : _k[0];
                    if (!(session === null || session === void 0 ? void 0 : session.nowPlayingData))
                        return [2 /*return*/, null];
                    _a = session.nowPlayingData, infoText = _a.infoText, mainArt = _a.mainArt;
                    state = (_l = session.playerState) !== null && _l !== void 0 ? _l : (_m = session.nowPlayingData) === null || _m === void 0 ? void 0 : _m.playerState;
                    progress = (_o = session.nowPlayingData) === null || _o === void 0 ? void 0 : _o.progress;
                    providerName = ((_r = (_q = (_p = session.nowPlayingData) === null || _p === void 0 ? void 0 : _p.provider) === null || _q === void 0 ? void 0 : _q.providerName) !== null && _r !== void 0 ? _r : "");
                    provider = providerName.toLowerCase().includes("spotify")
                        ? "spotify"
                        : "amazon";
                    isPlaying = state === "PLAYING";
                    return [2 /*return*/, {
                            provider: provider,
                            isPlaying: isPlaying,
                            trackName: (_s = infoText === null || infoText === void 0 ? void 0 : infoText.title) !== null && _s !== void 0 ? _s : "",
                            artist: (_t = infoText === null || infoText === void 0 ? void 0 : infoText.subText1) !== null && _t !== void 0 ? _t : "",
                            album: (_u = infoText === null || infoText === void 0 ? void 0 : infoText.subText2) !== null && _u !== void 0 ? _u : "",
                            coverUrl: (mainArt === null || mainArt === void 0 ? void 0 : mainArt.mediumUrl) ||
                                (mainArt === null || mainArt === void 0 ? void 0 : mainArt.largeUrl) ||
                                (mainArt === null || mainArt === void 0 ? void 0 : mainArt.smallUrl) ||
                                (mainArt === null || mainArt === void 0 ? void 0 : mainArt.tinyUrl) ||
                                (mainArt === null || mainArt === void 0 ? void 0 : mainArt.fullUrl) ||
                                "",
                            mediaLength: progress === null || progress === void 0 ? void 0 : progress.mediaLength,
                            mediaProgress: progress === null || progress === void 0 ? void 0 : progress.mediaProgress,
                        }];
            }
        });
    });
}
