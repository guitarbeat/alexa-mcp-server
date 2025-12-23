"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetDndStatusSchema = exports.AdjustVolumeSchema = exports.SetVolumeSchema = exports.AllDeviceVolumesSchema = exports.DeviceVolumeSchema = exports.BedroomStateSchema = exports.MusicStatusSchema = exports.WeatherSchema = exports.AlexaAnnounceSchema = exports.SetLightColorSchema = exports.SetLightBrightnessSchema = exports.SetLightPowerSchema = exports.LightStateSchema = exports.PhoenixDevicesSchema = exports.EndpointsDiscoverySchema = exports.SmartHomeFavoritesSchema = exports.AccountInfoSchema = exports.PhoenixStateResponseSchema = exports.SmartHomeDeviceSchema = exports.DeviceEntitySchema = void 0;
var zod_1 = require("zod");
// Device entity schema
exports.DeviceEntitySchema = zod_1.z.object({
    entityId: zod_1.z.string(),
    entityType: zod_1.z.string(),
    deviceName: zod_1.z.string().optional(),
    friendlyName: zod_1.z.string().optional(),
});
// Smart home device schema (from GraphQL favorites)
exports.SmartHomeDeviceSchema = zod_1.z.object({
    resource: zod_1.z.object({
        id: zod_1.z.string(),
        __typename: zod_1.z.string(),
    }),
    favoriteFriendlyName: zod_1.z.string(),
    displayInfo: zod_1.z
        .object({
        displayCategories: zod_1.z.object({
            primary: zod_1.z.object({
                isCustomerSpecified: zod_1.z.boolean(),
                isDiscovered: zod_1.z.boolean(),
                value: zod_1.z.string(),
                sources: zod_1.z.array(zod_1.z.string()),
                __typename: zod_1.z.string(),
            }),
            all: zod_1.z.array(zod_1.z.object({
                isCustomerSpecified: zod_1.z.boolean(),
                isDiscovered: zod_1.z.boolean(),
                value: zod_1.z.string(),
                sources: zod_1.z.array(zod_1.z.string()),
                __typename: zod_1.z.string(),
            })),
            __typename: zod_1.z.string(),
        }),
        __typename: zod_1.z.string(),
    })
        .nullable(),
    alternateIdentifiers: zod_1.z
        .object({
        legacyIdentifiers: zod_1.z.object({
            chrsIdentifier: zod_1.z.object({
                entityId: zod_1.z.string(),
                __typename: zod_1.z.string(),
            }),
            dmsIdentifier: zod_1.z.object({
                deviceSerialNumber: zod_1.z.object({
                    type: zod_1.z.string(),
                    value: zod_1.z.object({
                        text: zod_1.z.string(),
                        __typename: zod_1.z.string(),
                    }),
                    __typename: zod_1.z.string(),
                }),
                deviceType: zod_1.z.object({
                    type: zod_1.z.string(),
                    value: zod_1.z.object({
                        text: zod_1.z.string(),
                        __typename: zod_1.z.string(),
                    }),
                    __typename: zod_1.z.string(),
                }),
                __typename: zod_1.z.string(),
            }),
            __typename: zod_1.z.string(),
        }),
        __typename: zod_1.z.string(),
    })
        .nullable(),
    type: zod_1.z.string(),
    rank: zod_1.z.number(),
    active: zod_1.z.boolean(),
    variant: zod_1.z.string(),
    __typename: zod_1.z.string(),
});
// Phoenix state response schema
exports.PhoenixStateResponseSchema = zod_1.z.object({
    deviceStates: zod_1.z.array(zod_1.z.object({
        entity: zod_1.z.object({
            entityId: zod_1.z.string(),
            entityType: zod_1.z.string(),
        }),
        capabilityStates: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            namespace: zod_1.z.string(),
            value: zod_1.z.any(),
            timeOfSample: zod_1.z.string(),
            uncertaintyInMilliseconds: zod_1.z.number(),
        })),
    })),
});
// Account info schema (from alexa-comms-mobile-service)
exports.AccountInfoSchema = zod_1.z.array(zod_1.z.object({
    commsId: zod_1.z.string(),
    directedId: zod_1.z.string(), // This is the customerId we need
    phoneCountryCode: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    phoneticFirstName: zod_1.z.string().nullable().optional(),
    phoneticLastName: zod_1.z.string().nullable().optional(),
    commsProvisionStatus: zod_1.z.string(),
    isChild: zod_1.z.boolean(),
    personIdV2: zod_1.z.string().optional(),
    mapDirectedDefaultActorId: zod_1.z.string().nullable().optional(),
    phoneNumberMetadataForTheActor: zod_1.z.any().nullable().optional(),
    signedInUser: zod_1.z.boolean(),
    commsProvisioned: zod_1.z.boolean(),
    enrolledInAlexa: zod_1.z.boolean(),
    speakerProvisioned: zod_1.z.boolean(),
}));
// Smart home favorites schema (from GraphQL)
exports.SmartHomeFavoritesSchema = zod_1.z.object({
    data: zod_1.z.object({
        favorites: zod_1.z.object({
            favorites: zod_1.z.array(exports.SmartHomeDeviceSchema),
        }),
    }),
});
// Endpoints discovery schema
exports.EndpointsDiscoverySchema = zod_1.z.object({
    endpoints: zod_1.z.array(zod_1.z.object({
        endpointId: zod_1.z.string(),
        friendlyName: zod_1.z.string(),
        displayCategories: zod_1.z.array(zod_1.z.string()),
        capabilities: zod_1.z.array(zod_1.z.object({
            type: zod_1.z.string(),
            interface: zod_1.z.string(),
            version: zod_1.z.string(),
            properties: zod_1.z
                .object({
                supported: zod_1.z
                    .array(zod_1.z.object({
                    name: zod_1.z.string(),
                }))
                    .optional(),
                proactivelyReported: zod_1.z.boolean().optional(),
                retrievable: zod_1.z.boolean().optional(),
            })
                .optional(),
        })),
        manufacturerName: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    })),
});
// Phoenix devices schema
exports.PhoenixDevicesSchema = zod_1.z.object({
    devices: zod_1.z.array(zod_1.z.object({
        entityId: zod_1.z.string(),
        entityType: zod_1.z.string(),
        applianceTypes: zod_1.z.array(zod_1.z.string()).optional(),
        friendlyName: zod_1.z.string().optional(),
        manufacturerName: zod_1.z.string().optional(),
        modelName: zod_1.z.string().optional(),
        version: zod_1.z.string().optional(),
        capabilities: zod_1.z
            .array(zod_1.z.object({
            capabilityType: zod_1.z.string(),
            type: zod_1.z.string(),
            version: zod_1.z.string(),
        }))
            .optional(),
    })),
});
// Light control schemas
exports.LightStateSchema = zod_1.z.object({
    on: zod_1.z.boolean(),
    brightness: zod_1.z.number().min(0).max(100).optional(),
    color: zod_1.z
        .object({
        hue: zod_1.z.number().min(0).max(360).optional(),
        saturation: zod_1.z.number().min(0).max(1).optional(),
        brightness: zod_1.z.number().min(0).max(1).optional(),
    })
        .optional(),
    colorTemperatureInKelvin: zod_1.z.number().min(2200).max(6500).optional(),
});
exports.SetLightPowerSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .optional()
        .describe("Light ID (optional - if you have only one light, it will be auto-detected)"),
    on: zod_1.z.boolean().describe("Whether to turn the light on (true) or off (false)"),
    transitionMs: zod_1.z
        .number()
        .min(0)
        .max(10000)
        .optional()
        .describe("Transition time in milliseconds (0-10000)"),
});
exports.SetLightBrightnessSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .optional()
        .describe("Light ID (optional - if you have only one light, it will be auto-detected)"),
    level: zod_1.z.number().min(0).max(100).describe("Brightness level from 0-100%"),
    transitionMs: zod_1.z
        .number()
        .min(0)
        .max(10000)
        .optional()
        .describe("Transition time in milliseconds (0-10000)"),
});
exports.SetLightColorSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .optional()
        .describe("Light ID (optional - if you have only one light, it will be auto-detected)"),
    mode: zod_1.z
        .enum(["name", "tempK"])
        .describe("Color mode: 'name' for color names or 'tempK' for Kelvin temperature"),
    value: zod_1.z
        .union([
        zod_1.z
            .enum([
            // White colors
            "warm_white",
            "soft_white",
            "white",
            "daylight_white",
            "cool_white",
            // Actual colors
            "red",
            "crimson",
            "salmon",
            "orange",
            "gold",
            "yellow",
            "green",
            "turquoise",
            "cyan",
            "sky_blue",
            "blue",
            "purple",
            "magenta",
            "pink",
            "lavender",
        ])
            .describe("Color name"),
        zod_1.z.number().min(2200).max(6500).describe("Color temperature in Kelvin (2200-6500)"),
    ])
        .describe("Color value: either a color name or Kelvin temperature number"),
    transitionMs: zod_1.z
        .number()
        .min(0)
        .max(10000)
        .optional()
        .describe("Transition time in milliseconds (0-10000)"),
});
// Announcement schema
exports.AlexaAnnounceSchema = zod_1.z.object({
    name: zod_1.z.string().describe("Target device name or 'everywhere' for all devices"),
    message: zod_1.z.string().describe("The message to announce"),
});
// Weather schema
exports.WeatherSchema = zod_1.z.object({
    temperature: zod_1.z.number(),
    condition: zod_1.z.string(),
    humidity: zod_1.z.number().optional(),
    airQuality: zod_1.z
        .object({
        index: zod_1.z.number(),
        category: zod_1.z.string(),
    })
        .optional(),
});
// Music status schema
exports.MusicStatusSchema = zod_1.z.object({
    isPlaying: zod_1.z.boolean(),
    title: zod_1.z.string().optional(),
    artist: zod_1.z.string().optional(),
    album: zod_1.z.string().optional(),
    device: zod_1.z.string().optional(),
});
// Bedroom state schema
exports.BedroomStateSchema = zod_1.z.object({
    temperature: zod_1.z.number().optional(),
    illuminance: zod_1.z.number().optional(),
    lightOn: zod_1.z.boolean(),
    deviceStates: zod_1.z.array(zod_1.z.object({
        entityId: zod_1.z.string(),
        name: zod_1.z.string(),
        value: zod_1.z.any(),
        timestamp: zod_1.z.string(),
    })),
});
// Volume schemas
exports.DeviceVolumeSchema = zod_1.z.object({
    alertVolume: zod_1.z.number().nullable(),
    deviceType: zod_1.z.string(),
    dsn: zod_1.z.string(),
    error: zod_1.z.string().nullable(),
    speakerMuted: zod_1.z.boolean(),
    speakerVolume: zod_1.z.number(),
});
exports.AllDeviceVolumesSchema = zod_1.z.object({
    volumes: zod_1.z.array(exports.DeviceVolumeSchema),
});
exports.SetVolumeSchema = zod_1.z.object({
    deviceType: zod_1.z.string().optional().describe("Device type (optional - if you have only one device, it will be auto-detected)"),
    dsn: zod_1.z.string().optional().describe("Device serial number (optional - if you have only one device, it will be auto-detected)"),
    volume: zod_1.z.number().min(0).max(100).describe("Volume level from 0-100"),
});
exports.AdjustVolumeSchema = zod_1.z.object({
    deviceType: zod_1.z.string().optional().describe("Device type (optional - if you have only one device, it will be auto-detected)"),
    dsn: zod_1.z.string().optional().describe("Device serial number (optional - if you have only one device, it will be auto-detected)"),
    amount: zod_1.z.number().min(-100).max(100).describe("Volume adjustment amount (-100 to +100)"),
});
exports.SetDndStatusSchema = zod_1.z.object({
    deviceSerialNumber: zod_1.z.string().optional().describe("Device serial number"),
    deviceType: zod_1.z.string().optional().describe("Device type"),
    enabled: zod_1.z.boolean().describe("Enable or disable Do Not Disturb"),
});
