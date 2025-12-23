import { z } from "zod";

export const SetDndStatusSchema = z.object({
	deviceSerialNumber: z.string().optional().describe("Device serial number"),
	deviceType: z.string().optional().describe("Device type"),
	enabled: z.boolean().describe("Enable or disable Do Not Disturb"),
});

/**
 * Gets "Do Not Disturb" status for all devices.
 */
export async function getDndStatus(_args: any, context: { env: any }) {
	const apiBase = context.env?.API_BASE;
	if (!apiBase) return { content: [{ type: "text" as const, text: "Error: API_BASE not configured." }], isError: true };

	try {
		const response = await fetch(`${apiBase}/api/dnd`, { method: "GET" });
		if (!response.ok) throw new Error(`DND status failed: ${response.status}`);

		const { devices = [] } = (await response.json()) as any;
		return {
			content: [{
				type: "text" as const,
				text: "Do Not Disturb Status:\n" + devices.map((d: any) => `- ${d.type} (${d.serial}): ${d.isDndEnabled ? "ENABLED" : "disabled"}`).join("\n"),
			}],
		};
	} catch (error) {
		return { content: [{ type: "text" as const, text: `Error: ${(error as Error).message}` }], isError: true };
	}
}

/**
 * Sets "Do Not Disturb" status for a device.
 */
export async function setDndStatus(args: z.infer<typeof SetDndStatusSchema>, context: { env: any }) {
	const apiBase = context.env?.API_BASE;
	if (!apiBase) return { content: [{ type: "text" as const, text: "Error: API_BASE not configured." }], isError: true };

	try {
		const response = await fetch(`${apiBase}/api/dnd`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(args),
		});

		if (!response.ok) throw new Error(`DND update failed: ${response.status}`);
		return { content: [{ type: "text" as const, text: `DND status updated successfully.` }] };
	} catch (error) {
		return { content: [{ type: "text" as const, text: `Error: ${(error as Error).message}` }], isError: true };
	}
}