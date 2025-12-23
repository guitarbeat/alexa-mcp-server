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
exports.getAccountInfo = getAccountInfo;
exports.getAlexaEndpoints = getAlexaEndpoints;
exports.getAlexaDevices = getAlexaDevices;
exports.getPrimaryEchoDevice = getPrimaryEchoDevice;
exports.getPrimaryMediaDevice = getPrimaryMediaDevice;
exports.getSmartHomeFavorites = getSmartHomeFavorites;
exports.getSmartHomeEntities = getSmartHomeEntities;
exports.getPrimaryLight = getPrimaryLight;
exports.getAllDeviceEntityIds = getAllDeviceEntityIds;
exports.getCustomerSmartHomeEndpoints = getCustomerSmartHomeEndpoints;
exports.getEchoDeviceEntityId = getEchoDeviceEntityId;
exports.getLightApplianceId = getLightApplianceId;
exports.extractEntityId = extractEntityId;
exports.buildEndpointId = buildEndpointId;
var alexa_1 = require("@/schemas/alexa");
var alexa_2 = require("@/utils/alexa");
// Cache for dynamic values to avoid repeated API calls
var cache = new Map();
var CACHE_TTL = 5 * 60 * 1000; // 5 minutes
function getCached(key) {
    var cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.value;
    }
    return null;
}
function setCache(key, value) {
    cache.set(key, { value: value, timestamp: Date.now() });
}
// Fetch account information dynamically
function getAccountInfo(env) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, cached, response, data, validatedData, primaryAccount, accountInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = "account_info";
                    cached = getCached(cacheKey);
                    if (cached)
                        return [2 /*return*/, cached];
                    return [4 /*yield*/, fetch("https://alexa-comms-mobile-service.amazon.com/accounts", {
                            method: "GET",
                            headers: (0, alexa_2.buildAlexaHeaders)(env),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch account info: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    validatedData = alexa_1.AccountInfoSchema.parse(data);
                    primaryAccount = validatedData.find(function (account) { return account.signedInUser; }) || validatedData[0];
                    if (!primaryAccount) {
                        throw new Error("No account found in response");
                    }
                    accountInfo = {
                        customerId: primaryAccount.directedId,
                        profiles: [], // Not available in this simpler endpoint
                    };
                    setCache(cacheKey, accountInfo);
                    return [2 /*return*/, accountInfo];
            }
        });
    });
}
// Fetch all Alexa devices/endpoints
function getAlexaEndpoints(env) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, cached, response, data, validatedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = "alexa_endpoints";
                    cached = getCached(cacheKey);
                    if (cached)
                        return [2 /*return*/, cached];
                    return [4 /*yield*/, fetch("https://alexa.amazon.com/api/smarthome/v2/endpoints", {
                            method: "POST",
                            headers: (0, alexa_2.buildAlexaHeaders)(env, {
                                "Content-Type": "application/json; charset=utf-8",
                                "Cache-Control": "no-cache",
                            }),
                            body: JSON.stringify({ endpointContexts: ["GROUP"] }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch endpoints: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    validatedData = alexa_1.EndpointsDiscoverySchema.parse(data);
                    setCache(cacheKey, validatedData.endpoints);
                    return [2 /*return*/, validatedData.endpoints];
            }
        });
    });
}
// Fetch registered devices
function getAlexaDevices(env) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, cached, response, data, validatedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = "alexa_devices";
                    cached = getCached(cacheKey);
                    if (cached)
                        return [2 /*return*/, cached];
                    return [4 /*yield*/, fetch("https://alexa.amazon.com/api/devices-v2/device?cached=true", {
                            method: "GET",
                            headers: (0, alexa_2.buildAlexaHeaders)(env, {
                                Accept: "application/json; charset=utf-8",
                                "Cache-Control": "no-cache",
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch devices: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    validatedData = alexa_1.PhoenixDevicesSchema.parse(data);
                    setCache(cacheKey, validatedData.devices);
                    return [2 /*return*/, validatedData.devices];
            }
        });
    });
}
// Get primary Echo device for announcements
function getPrimaryEchoDevice(env) {
    return __awaiter(this, void 0, void 0, function () {
        var devices, echoDevices;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAlexaDevices(env)];
                case 1:
                    devices = _a.sent();
                    echoDevices = devices.filter(function (device) { return device.deviceFamily === "ECHO" && device.online; });
                    if (echoDevices.length === 0) {
                        throw new Error("No online Echo devices found");
                    }
                    // Return the first available Echo device
                    return [2 /*return*/, echoDevices[0]];
            }
        });
    });
}
// Get primary smart home device for media queries
function getPrimaryMediaDevice(env) {
    return __awaiter(this, void 0, void 0, function () {
        var devices, mediaDevices, onlineDevices;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAlexaDevices(env)];
                case 1:
                    devices = _a.sent();
                    mediaDevices = devices.filter(function (device) { var _a; return ((_a = device.capabilities) === null || _a === void 0 ? void 0 : _a.includes("AUDIO_PLAYER")) && device.online; });
                    if (mediaDevices.length === 0) {
                        onlineDevices = devices.filter(function (device) { return device.online; });
                        if (onlineDevices.length === 0) {
                            throw new Error("No online devices found");
                        }
                        return [2 /*return*/, onlineDevices[0]];
                    }
                    return [2 /*return*/, mediaDevices[0]];
            }
        });
    });
}
// Get favorites (main smart home devices) - more reliable than endpoints
function getSmartHomeFavorites(env) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, cached, query, response, data, validatedData, favorites;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cacheKey = "smart_home_favorites";
                    cached = getCached(cacheKey);
                    if (cached)
                        return [2 /*return*/, cached];
                    query = "\n    fragment FavoriteMetadata on Favorite {\n      resource {\n        id\n        __typename\n      }\n      favoriteFriendlyName\n      displayInfo {\n        displayCategories {\n          primary {\n            isCustomerSpecified\n            isDiscovered\n            value\n            sources\n            __typename\n          }\n          all {\n            isCustomerSpecified\n            isDiscovered\n            value\n            sources\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      alternateIdentifiers {\n        legacyIdentifiers {\n          chrsIdentifier {\n            entityId\n            __typename\n          }\n          dmsIdentifier {\n            deviceSerialNumber {\n              type\n              value {\n                text\n                __typename\n              }\n              __typename\n            }\n            deviceType {\n              type\n              value {\n                text\n                __typename\n              }\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      type\n      rank\n      active\n      variant\n      __typename\n    }\n\n    query ListFavoritesForHomeChannel($requestedTypes: [String!]) {\n      favorites(listFavoritesInput: {requestedTypes: $requestedTypes}) {\n        favorites {\n          ...FavoriteMetadata\n          __typename\n        }\n        __typename\n      }\n    }\n  ";
                    return [4 /*yield*/, fetch("https://alexa.amazon.com/nexus/v1/graphql", {
                            method: "POST",
                            headers: (0, alexa_2.buildAlexaHeaders)(env, {
                                "Content-Type": "application/json",
                                "X-Amzn-Marketplace-Id": "ATVPDKIKX0DER",
                                "X-Amzn-Client": "AlexaApp",
                                "X-Amzn-Os-Name": "android",
                            }),
                            body: JSON.stringify({
                                operationName: "ListFavoritesForHomeChannel",
                                variables: {
                                    requestedTypes: [
                                        "AEA",
                                        "ALEXA_LIST",
                                        "AWAY_LIGHTING",
                                        "DEVICE_SHORTCUT",
                                        "DTG",
                                        "ENDPOINT",
                                        "SHORTCUT",
                                        "STATIC_ENTERTAINMENT",
                                    ],
                                },
                                query: query,
                            }),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch favorites: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    validatedData = alexa_1.SmartHomeFavoritesSchema.parse(data);
                    favorites = validatedData.data.favorites.favorites;
                    setCache(cacheKey, favorites);
                    return [2 /*return*/, favorites];
            }
        });
    });
}
// Find smart home entities (lights, sensors, etc.) using favorites API
function getSmartHomeEntities(env) {
    return __awaiter(this, void 0, void 0, function () {
        var favorites, smartHomeDevices;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSmartHomeFavorites(env)];
                case 1:
                    favorites = _a.sent();
                    smartHomeDevices = favorites.filter(function (favorite) {
                        return favorite.active && favorite.type === "ENDPOINT";
                    });
                    return [2 /*return*/, smartHomeDevices];
            }
        });
    });
}
// Get the primary light entity dynamically (first available light)
function getPrimaryLight(env) {
    return __awaiter(this, void 0, void 0, function () {
        var smartHomeDevices, lightDevices;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSmartHomeEntities(env)];
                case 1:
                    smartHomeDevices = _a.sent();
                    lightDevices = smartHomeDevices.filter(function (device) {
                        var _a, _b, _c;
                        var primaryCategory = (_c = (_b = (_a = device.displayInfo) === null || _a === void 0 ? void 0 : _a.displayCategories) === null || _b === void 0 ? void 0 : _b.primary) === null || _c === void 0 ? void 0 : _c.value;
                        return primaryCategory === "LIGHT";
                    });
                    if (lightDevices.length === 0) {
                        throw new Error("No smart home light devices found");
                    }
                    // Return the first light device
                    return [2 /*return*/, lightDevices[0]];
            }
        });
    });
}
// Get all device entity IDs for state requests
function getAllDeviceEntityIds(env) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, endpoints, devices, entityIds;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([getAlexaEndpoints(env), getAlexaDevices(env)])];
                case 1:
                    _a = _b.sent(), endpoints = _a[0], devices = _a[1];
                    entityIds = [];
                    // Add Echo devices for temperature/illuminance sensors
                    devices.forEach(function (device) {
                        if (device.online) {
                            // Add bridge entities for Echo devices
                            entityIds.push({
                                entityId: "AlexaBridge_".concat(device.serialNumber, "@").concat(device.deviceType, "_").concat(device.serialNumber),
                                entityType: "APPLIANCE",
                            });
                        }
                    });
                    // Add smart home endpoints
                    endpoints.forEach(function (endpoint) {
                        var _a;
                        var entityId = ((_a = endpoint.identifier) === null || _a === void 0 ? void 0 : _a.entityId) || endpoint.serialNumber;
                        if (entityId) {
                            entityIds.push({
                                entityId: entityId,
                                entityType: "APPLIANCE",
                            });
                        }
                    });
                    return [2 /*return*/, entityIds];
            }
        });
    });
}
// Get customer smart home endpoints using GraphQL
function getCustomerSmartHomeEndpoints(env) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheKey, cached, query, response, data, endpoints;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    cacheKey = "customer_smart_home_endpoints";
                    cached = getCached(cacheKey);
                    if (cached)
                        return [2 /*return*/, cached];
                    query = "\n\t\tquery CustomerSmartHome {\n\t\t\tendpoints(\n\t\t\t\tendpointsQueryParams: { paginationParams: { disablePagination: true } }\n\t\t\t) {\n\t\t\t\titems {\n\t\t\t\t\tendpointId\n\t\t\t\t\tid\n\t\t\t\t\tfriendlyName\n\t\t\t\t\tdisplayCategories {\n\t\t\t\t\t\tall {\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t}\n\t\t\t\t\t\tprimary {\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tlegacyIdentifiers {\n\t\t\t\t\t\tchrsIdentifier {\n\t\t\t\t\t\t\tentityId\n\t\t\t\t\t\t}\n\t\t\t\t\t\tdmsIdentifier {\n\t\t\t\t\t\t\tdeviceType {\n\t\t\t\t\t\t\t\ttype\n\t\t\t\t\t\t\t\tvalue {\n\t\t\t\t\t\t\t\t\ttext\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tdeviceSerialNumber {\n\t\t\t\t\t\t\t\ttype\n\t\t\t\t\t\t\t\tvalue {\n\t\t\t\t\t\t\t\t\ttext\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tlegacyAppliance {\n\t\t\t\t\t\tapplianceId\n\t\t\t\t\t\tapplianceTypes\n\t\t\t\t\t\tfriendlyName\n\t\t\t\t\t\tentityId\n\t\t\t\t\t\tmergedApplianceIds\n\t\t\t\t\t\tcapabilities\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t";
                    return [4 /*yield*/, fetch("https://alexa.amazon.com/nexus/v1/graphql", {
                            method: "POST",
                            headers: (0, alexa_2.buildAlexaHeaders)(env, {
                                "Content-Type": "application/json",
                                "X-Amzn-Marketplace-Id": "ATVPDKIKX0DER",
                                "X-Amzn-Client": "AlexaApp",
                                "X-Amzn-Os-Name": "android",
                            }),
                            body: JSON.stringify({ query: query }),
                        })];
                case 1:
                    response = _c.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch customer smart home endpoints: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_c.sent());
                    endpoints = ((_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.endpoints) === null || _b === void 0 ? void 0 : _b.items) || [];
                    setCache(cacheKey, endpoints);
                    return [2 /*return*/, endpoints];
            }
        });
    });
}
// Get Echo device entity ID for sensors (temperature, illuminance)
function getEchoDeviceEntityId(env) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoints, echoDevice;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getCustomerSmartHomeEndpoints(env)];
                case 1:
                    endpoints = _c.sent();
                    echoDevice = endpoints.find(function (endpoint) {
                        var _a, _b;
                        var primaryCategory = (_b = (_a = endpoint.displayCategories) === null || _a === void 0 ? void 0 : _a.primary) === null || _b === void 0 ? void 0 : _b.value;
                        return primaryCategory === "ALEXA_VOICE_ENABLED";
                    });
                    if (!echoDevice) {
                        throw new Error("No Echo device found for sensors");
                    }
                    // For sensor data, we need the entity ID, not appliance ID
                    return [2 /*return*/, ((_b = (_a = echoDevice.legacyIdentifiers) === null || _a === void 0 ? void 0 : _a.chrsIdentifier) === null || _b === void 0 ? void 0 : _b.entityId) || echoDevice.entityId];
            }
        });
    });
}
// Get light appliance ID for state requests (different from entity ID)
function getLightApplianceId(env) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoints, lightDevice;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getCustomerSmartHomeEndpoints(env)];
                case 1:
                    endpoints = _b.sent();
                    lightDevice = endpoints.find(function (endpoint) {
                        var _a, _b;
                        var primaryCategory = (_b = (_a = endpoint.displayCategories) === null || _a === void 0 ? void 0 : _a.primary) === null || _b === void 0 ? void 0 : _b.value;
                        return primaryCategory === "LIGHT";
                    });
                    if (!lightDevice) {
                        throw new Error("No light device found");
                    }
                    // Return the appliance ID from legacyAppliance
                    return [2 /*return*/, (_a = lightDevice.legacyAppliance) === null || _a === void 0 ? void 0 : _a.applianceId];
            }
        });
    });
}
// Helper to extract entity ID from smart home device
function extractEntityId(device) {
    var _a, _b, _c, _d, _e, _f, _g;
    // For favorites API response, entity ID is in alternateIdentifiers
    if ((_c = (_b = (_a = device.alternateIdentifiers) === null || _a === void 0 ? void 0 : _a.legacyIdentifiers) === null || _b === void 0 ? void 0 : _b.chrsIdentifier) === null || _c === void 0 ? void 0 : _c.entityId) {
        return device.alternateIdentifiers.legacyIdentifiers.chrsIdentifier.entityId;
    }
    // For other API responses, check identifier
    if ((_d = device.identifier) === null || _d === void 0 ? void 0 : _d.entityId) {
        return device.identifier.entityId;
    }
    // Extract from resource.id if available (favorites format)
    if ((_f = (_e = device.resource) === null || _e === void 0 ? void 0 : _e.id) === null || _f === void 0 ? void 0 : _f.includes("endpoint.")) {
        return device.resource.id.replace("amzn1.alexa.endpoint.", "");
    }
    // Fallback to serial number
    return device.serialNumber || ((_g = device.resource) === null || _g === void 0 ? void 0 : _g.id);
}
// Helper to build endpoint ID from entity ID
function buildEndpointId(entityId) {
    if (entityId.startsWith("amzn1.alexa.endpoint.")) {
        return entityId;
    }
    return "amzn1.alexa.endpoint.".concat(entityId);
}
