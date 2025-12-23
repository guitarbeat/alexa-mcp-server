export async function getMusicStatus(_args: any, context: { env: any }) {
	const apiBase = context.env?.API_BASE;

	if (!apiBase) {
		return {
			content: [{ type: "text" as const, text: "Error: API_BASE not configured." }],
			isError: true,
		};
	}

	try {
		const response = await fetch(`${apiBase}/api/music`, { method: "GET" });

		if (!response.ok) {
			return {
				content: [{ type: "text" as const, text: `Music status lookup failed: ${response.status}` }],
				isError: true,
			};
		}

		const state = (await response.json()) as any;

		if (!state.isPlaying) {
			return { content: [{ type: "text" as const, text: "Currently nothing is playing on Alexa." }] };
		}

		const progressPercent = (state.progress?.position && state.progress?.duration)
			? Math.round((state.progress.position / state.progress.duration) * 100)
			: null;

		const detail = [
			`Track: ${state.track || "Unknown"}`,
			`Artist: ${state.artist || "Unknown"}`,
			`Album: ${state.album || "Unknown"}`,
			`Provider: ${state.provider || "Unknown"}`,
			progressPercent !== null ? `Progress: ${progressPercent}%` : "",
		].filter(Boolean).join("\n");

		return {
			content: [{
				type: "text" as const,
				text: `Alexa is currently playing:\n\n${detail}`,
			}],
		};
	} catch (error) {
		return {
			content: [{ type: "text" as const, text: `Network error fetching music status: ${(error as Error).message}` }],
			isError: true,
		};
	}
}
