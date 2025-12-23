import type { z } from "zod";
import {
	SetLightBrightnessSchema,
	SetLightColorSchema,
	SetLightPowerSchema,
} from "@/schemas/alexa";

/**
 * Standard tool response handler for light operations.
 */
async function handleLightOperation(apiBase: string, path: string, body: any) {
	const response = await fetch(`${apiBase}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	if (!response.ok) throw new Error(`Light control failed: ${response.status}`);
	return await response.json();
}

/**
 * Lists all discoverable lights.
 */
export async function listLights(_args: any, context: { env: any }) {
	const apiBase = context.env?.API_BASE;
	if (!apiBase) return { content: [{ type: "text" as const, text: "Error: API_BASE not configured." }], isError: true };

	try {
		const response = await fetch(`${apiBase}/api/lights/list`, { method: "GET" });
		if (!response.ok) throw new Error(`List lights failed: ${response.status}`);

		const { lights = [] } = (await response.json()) as any;
		return {
			content: [{
				type: "text" as const,
				text: lights.length > 0
					? `Found ${lights.length} lights:\n` + lights.map((l: any) => `- ${l.name} (ID: ${l.id})`).join("\n")
					: "No lights discovered on this Alexa account.",
			}],
		};
	} catch (error) {
		return { content: [{ type: "text" as const, text: `Error: ${(error as Error).message}` }], isError: true };
	}
}

/**
 * Power control (ON/OFF).
 */
export async function setLightPower(args: z.infer<typeof SetLightPowerSchema>, context: { env: any }) {
	const { id, on } = args;
	const apiBase = context.env?.API_BASE;
	if (!apiBase) return { content: [{ type: "text" as const, text: "Error: API_BASE not configured." }], isError: true };

	try {
		const result = await handleLightOperation(apiBase, `/api/lights/${id}/power`, { on });
		return { content: [{ type: "text" as const, text: `Light ${on ? "ON" : "OFF"} command successful.` }] };
	} catch (error) {
		return { content: [{ type: "text" as const, text: `Error: ${(error as Error).message}` }], isError: true };
	}
}

/**
 * Brightness control (0-100).
 */
export async function setLightBrightness(args: z.infer<typeof SetLightBrightnessSchema>, context: { env: any }) {
	const { id, level } = args;
	const apiBase = context.env?.API_BASE;
	if (!apiBase) return { content: [{ type: "text" as const, text: "Error: API_BASE not configured." }], isError: true };

	try {
		await handleLightOperation(apiBase, `/api/lights/${id}/brightness`, { level });
		return { content: [{ type: "text" as const, text: `Brightness set to ${level}%.` }] };
	} catch (error) {
		return { content: [{ type: "text" as const, text: `Error: ${(error as Error).message}` }], isError: true };
	}
}

/**
 * Color and Color Temperature control.
 */
export async function setLightColor(args: z.infer<typeof SetLightColorSchema>, context: { env: any }) {
	const { id, mode, value } = args;
	const apiBase = context.env?.API_BASE;
	if (!apiBase) return { content: [{ type: "text" as const, text: "Error: API_BASE not configured." }], isError: true };

	try {
		await handleLightOperation(apiBase, `/api/lights/${id}/color`, { mode, value });
		return { content: [{ type: "text" as const, text: `Color set to ${value} (${mode}).` }] };
	} catch (error) {
		return { content: [{ type: "text" as const, text: `Error: ${(error as Error).message}` }], isError: true };
	}
}
