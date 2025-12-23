import { Hono } from "hono";
import type { Env } from "@/types/env";
import { getAmazonMusicPlayback } from "@/utils/alexa";

export const musicApp = new Hono<{ Bindings: Env }>();

/**
 * GET /api/music - Gets current music playback status.
 */
musicApp.get("/", async (context) => {
	try {
		const state = await getAmazonMusicPlayback(context.env);

		if (!state) {
			return context.json({ isPlaying: false, message: "No music currently playing on Alexa." });
		}

		return context.json({
			isPlaying: state.isPlaying,
			track: state.trackName,
			artist: state.artist,
			album: state.album,
			provider: state.provider,
			progress: {
				position: state.mediaProgress,
				duration: state.mediaLength,
			},
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		return context.json({ error: "Music status failed", details: (error as Error).message }, 500);
	}
});
