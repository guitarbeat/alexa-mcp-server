import { Hono } from 'hono';
import type { Env } from '@/types/env';
import { buildAlexaHeaders } from '@/utils/alexa';

export const announceApp = new Hono<{ Bindings: Env }>();

const ANNOUNCE_API = 'https://alexa.amazon.com/api/v2/communications/announcements';

/**
 * Sends a voice announcement to specific or all Alexa devices.
 */
announceApp.post('/', async (context) => {
  const { name, message } = await context.req.json();

  if (!message) {
    return context.json({ error: 'Message is required' }, 400);
  }

  try {
    const response = await fetch(ANNOUNCE_API, {
      method: 'POST',
      headers: buildAlexaHeaders(context.env, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        behaviorId: 'PRE_BUILT:ANNOUNCE',
        sequenceJson: JSON.stringify({
          '@type': 'com.amazon.alexa.behaviors.model.Sequence',
          startNode: {
            '@type': 'com.amazon.alexa.behaviors.model.OpaqueLayoutNode',
            type: 'announce',
            parameters: {
              displayTitle: 'Announcement',
              displayText: message,
              ssml: `<speak>${message}</speak>`,
            },
            targetDevice: name ? { dsn: name } : undefined,
          },
        }),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return context.json({ error: 'Alexa API Error', details: errorText }, 500);
    }

    const result = (await response.json()) as any;
    return context.json({
      success: true,
      status: result.status,
      deliveredAt: new Date().toISOString(),
    });
  } catch (error) {
    return context.json({ error: 'Internal Server Error', details: (error as Error).message }, 500);
  }
});
