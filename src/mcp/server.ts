import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";
import type { Env } from "@/types/env";

import { announceAlexa } from "@/mcp/tools/announcements";
import { getBedroomState } from "@/mcp/tools/bedroom";
import { listLights, setLightBrightness, setLightColor, setLightPower } from "@/mcp/tools/lights";
import { getMusicStatus } from "@/mcp/tools/music";
import { adjustVolume, getAllDeviceVolumes, setVolume } from "@/mcp/tools/volume";
import { getAllSensorData } from "@/mcp/tools/sensors";
import { listSmartHomeDevices } from "@/mcp/tools/devices";
import { getDndStatus, setDndStatus, SetDndStatusSchema } from "@/mcp/tools/dnd";

import {
	AlexaAnnounceSchema,
	SetLightBrightnessSchema,
	SetLightColorSchema,
	SetLightPowerSchema,
	SetVolumeSchema,
	AdjustVolumeSchema
} from "@/schemas/alexa";

/**
 * Alexa Home Automation MCP Server
 * Provides tools for voice announcements, music playback, and device control.
 */
export class HomeIOMCP extends McpAgent<Env> {
	server = new McpServer({
		name: "Alexa Home Automation",
		version: "1.1.0",
	});

	async init() {
		this.registerAnnouncementTools();
		this.registerStateMonitoringTools();
		this.registerDeviceControlTools();
		this.registerSystemTools();
	}

	private registerAnnouncementTools() {
		this.server.tool(
			"alexa_announce",
			"Send voice announcements to Alexa devices",
			AlexaAnnounceSchema.shape,
			(args, ctx) => announceAlexa(args, { ...ctx, env: this.env }),
		);
	}

	private registerStateMonitoringTools() {
		this.server.tool(
			"get_bedroom_state",
			"Get bedroom sensors (temp, light, motion) and lighting status",
			{},
			(args, ctx) => getBedroomState(args, { ...ctx, env: this.env }),
		);

		this.server.tool(
			"get_music_status",
			"Get current track and playback info from Alexa",
			{},
			(args, ctx) => getMusicStatus(args, { ...ctx, env: this.env }),
		);

		this.server.tool(
			"get_all_sensor_data",
			"List all available sensors and their basic capabilities",
			{},
			(args, ctx) => getAllSensorData(args, { ...ctx, env: this.env }),
		);
	}

	private registerDeviceControlTools() {
		// Lights
		this.server.tool("list_lights", "List discovered lights and their IDs", {}, (args, ctx) => listLights(args, { ...ctx, env: this.env }));
		this.server.tool("set_light_power", "Turn light ON or OFF", SetLightPowerSchema.shape, (args, ctx) => setLightPower(args, { ...ctx, env: this.env }));
		this.server.tool("set_light_brightness", "Set light brightness (0-100)", SetLightBrightnessSchema.shape, (args, ctx) => setLightBrightness(args, { ...ctx, env: this.env }));
		this.server.tool("set_light_color", "Set light color or temperature", SetLightColorSchema.shape, (args, ctx) => setLightColor(args, { ...ctx, env: this.env }));

		// Volume
		this.server.tool("get_device_volumes", "Show volume level for all devices", {}, (args, ctx) => getAllDeviceVolumes(args, { ...ctx, env: this.env }));
		this.server.tool("set_device_volume", "Set absolute volume level (0-100)", SetVolumeSchema.shape, (args, ctx) => setVolume(args, { ...ctx, env: this.env }));
		this.server.tool("adjust_device_volume", "Adjust volume relatively (-100 to 100)", AdjustVolumeSchema.shape, (args, ctx) => adjustVolume(args, { ...ctx, env: this.env }));

		// DND
		this.server.tool("get_dnd_status", "Get Do Not Disturb status", {}, (args, ctx) => getDndStatus(args, { ...ctx, env: this.env }));
		this.server.tool("set_dnd_status", "Set Do Not Disturb status", SetDndStatusSchema.shape, (args, ctx) => setDndStatus(args, { ...ctx, env: this.env }));
	}

	private registerSystemTools() {
		this.server.tool(
			"list_smarthome_devices",
			"Discover all devices and capabilities on the account",
			{},
			(args, ctx) => listSmartHomeDevices(args, { ...ctx, env: this.env }),
		);
	}
}
