import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Env } from "@/types/env";

import { announceAlexa } from "@/mcp/tools/announcements";
import { getBedroomState } from "@/mcp/tools/bedroom";
import { listLights, setLightBrightness, setLightColor, setLightPower } from "@/mcp/tools/lights";
import { getMusicStatus } from "@/mcp/tools/music";
import { adjustVolume, getAllDeviceVolumes, setVolume } from "@/mcp/tools/volume";
import { getAllSensorData } from "@/mcp/tools/sensors";
import { listSmartHomeDevices } from "@/mcp/tools/devices";
import { getDndStatus, setDndStatus } from "@/mcp/tools/dnd";

import {
	AlexaAnnounceSchema,
	SetLightBrightnessSchema,
	SetLightColorSchema,
	SetLightPowerSchema,
	SetVolumeSchema,
	AdjustVolumeSchema,
	SetDndStatusSchema
} from "@/schemas/alexa";

/**
 * Alexa Home Automation MCP Server Logic
 * Uses the official @modelcontextprotocol/sdk.
 */
export class HomeIOMCP {
	private server: McpServer;
	private env: Env;

	constructor() {
		// Capture process.env for use in tool handlers
		this.env = {
			UBID_MAIN: process.env.UBID_MAIN || "",
			AT_MAIN: process.env.AT_MAIN || "",
			API_BASE: process.env.API_BASE || "",
		};

		this.server = new McpServer({
			name: "Alexa Home Automation",
			version: "1.2.1",
		});
		this.registerTools();
	}

	private registerTools() {
		const env = this.env;

		// Announcements
		this.server.tool(
			"alexa_announce",
			"Send voice announcements to Alexa devices",
			AlexaAnnounceSchema.shape,
			(args) => announceAlexa(args, { env }),
		);

		// State Monitoring
		this.server.tool(
			"get_bedroom_state",
			"Get bedroom sensors (temp, light, motion) and lighting status",
			{},
			(args) => getBedroomState(args, { env }),
		);

		this.server.tool(
			"get_music_status",
			"Get current track and playback info from Alexa",
			{},
			(args) => getMusicStatus(args, { env }),
		);

		this.server.tool(
			"get_all_sensor_data",
			"List all available sensors and their basic capabilities",
			{},
			(args) => getAllSensorData(args, { env }),
		);

		// Device Control
		this.server.tool("list_lights", "List discovered lights and their IDs", {}, (args) => listLights(args, { env }));
		this.server.tool("set_light_power", "Turn light ON or OFF", SetLightPowerSchema.shape, (args) => setLightPower(args, { env }));
		this.server.tool("set_light_brightness", "Set light brightness (0-100)", SetLightBrightnessSchema.shape, (args) => setLightBrightness(args, { env }));
		this.server.tool("set_light_color", "Set light color or temperature", SetLightColorSchema.shape, (args) => setLightColor(args, { env }));

		this.server.tool("get_device_volumes", "Show volume level for all devices", {}, (args) => getAllDeviceVolumes(args, { env }));
		this.server.tool("set_device_volume", "Set absolute volume level (0-100)", SetVolumeSchema.shape, (args) => setVolume(args, { env }));
		this.server.tool("adjust_device_volume", "Adjust volume relatively (-100 to 100)", AdjustVolumeSchema.shape, (args) => adjustVolume(args, { env }));

		this.server.tool("get_dnd_status", "Get Do Not Disturb status", {}, (args) => getDndStatus(args, { env }));
		this.server.tool("set_dnd_status", "Set Do Not Disturb status", SetDndStatusSchema.shape, (args) => setDndStatus(args, { env }));

		// Discovery
		this.server.tool(
			"list_smarthome_devices",
			"Discover all devices and capabilities on the account",
			{},
			(args) => listSmartHomeDevices(args, { env }),
		);
	}

	/**
	 * Returns the underlying McpServer instance.
	 */
	getMcpServer(): McpServer {
		return this.server;
	}
}

export const alexaMcp = new HomeIOMCP();
