import type { z } from 'zod';
import { SetVolumeSchema, AdjustVolumeSchema } from '@/schemas/alexa';

/**
 * Lists current volume levels for all devices.
 */
export async function getAllDeviceVolumes(_args: any, context: { env: any }) {
  const apiBase = context.env?.API_BASE;
  if (!apiBase)
    return {
      content: [{ type: 'text' as const, text: 'Error: API_BASE not configured.' }],
      isError: true,
    };

  try {
    const response = await fetch(`${apiBase}/api/volume`, { method: 'GET' });
    if (!response.ok) throw new Error(`Get volumes failed: ${response.status}`);

    const { volumes = [] } = (await response.json()) as any;
    return {
      content: [
        {
          type: 'text' as const,
          text:
            volumes.length > 0
              ? `Current Volume Levels:\n${volumes
                  .map((v: any) => `- ${v.deviceName || 'Device'}: ${v.speakerVolume}%`)
                  .join('\n')}`
              : 'No devices with volume control found.',
        },
      ],
    };
  } catch (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${(error as Error).message}` }],
      isError: true,
    };
  }
}

/**
 * Sets an absolute volume (0-100).
 */
export async function setVolume(args: z.infer<typeof SetVolumeSchema>, context: { env: any }) {
  const apiBase = context.env?.API_BASE;
  if (!apiBase)
    return {
      content: [{ type: 'text' as const, text: 'Error: API_BASE not configured.' }],
      isError: true,
    };

  try {
    const response = await fetch(`${apiBase}/api/volume/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });

    if (!response.ok) throw new Error(`Set volume failed: ${response.status}`);
    return { content: [{ type: 'text' as const, text: `Volume set to ${args.volume}%.` }] };
  } catch (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${(error as Error).message}` }],
      isError: true,
    };
  }
}

/**
 * Adjusts volume by a relative amount (-100 to +100).
 */
export async function adjustVolume(
  args: z.infer<typeof AdjustVolumeSchema>,
  context: { env: any },
) {
  const apiBase = context.env?.API_BASE;
  if (!apiBase)
    return {
      content: [{ type: 'text' as const, text: 'Error: API_BASE not configured.' }],
      isError: true,
    };

  try {
    const response = await fetch(`${apiBase}/api/volume/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });

    if (!response.ok) throw new Error(`Adjust volume failed: ${response.status}`);
    return { content: [{ type: 'text' as const, text: `Volume adjusted by ${args.amount}%.` }] };
  } catch (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${(error as Error).message}` }],
      isError: true,
    };
  }
}
