import type { z } from 'zod';
import { AlexaAnnounceSchema } from '@/schemas/alexa';

export async function announceAlexa(
  args: z.infer<typeof AlexaAnnounceSchema>,
  context: { env: any },
) {
  const { name, message } = args;
  const apiBase = context.env?.API_BASE;

  if (!apiBase) {
    return {
      content: [{ type: 'text' as const, text: 'Error: API_BASE not configured.' }],
      isError: true,
    };
  }

  try {
    const response = await fetch(`${apiBase}/api/announce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return {
        content: [
          { type: 'text' as const, text: `Announcement failed: ${response.status} - ${errorText}` },
        ],
        isError: true,
      };
    }

    const result = (await response.json()) as any;
    return {
      content: [
        {
          type: 'text' as const,
          text: `Announcement sent successfully.\nStatus: ${result.status}\nDelivered: ${result.deliveredAt || 'N/A'}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Network error during announcement: ${(error as Error).message}`,
        },
      ],
      isError: true,
    };
  }
}
