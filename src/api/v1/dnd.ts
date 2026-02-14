import { Hono } from 'hono';
import type { Env } from '@/types/env';
import { buildAlexaHeaders } from '@/utils/alexa';

export const dndApp = new Hono<{ Bindings: Env }>();

const DND_LIST_API = 'https://alexa.amazon.com/api/dnd/device-status-list';
const DND_STATUS_API = 'https://alexa.amazon.com/api/dnd/status';

/**
 * Lists "Do Not Disturb" status for all devices.
 */
dndApp.get('/', async (context) => {
  try {
    const response = await fetch(DND_LIST_API, {
      method: 'GET',
      headers: buildAlexaHeaders(context.env, { Accept: 'application/json' }),
    });

    if (!response.ok) throw new Error(`Alexa API error: ${response.status}`);

    const { doNotDisturbDeviceStatusList = [] } = (await response.json()) as any;
    const devices = doNotDisturbDeviceStatusList.map((d: any) => ({
      serial: d.deviceSerialNumber,
      type: d.deviceType,
      isDndEnabled: d.enabled,
    }));

    return context.json({ devices, count: devices.length });
  } catch (error) {
    return context.json({ error: 'List DND failed', details: (error as Error).message }, 500);
  }
});

/**
 * Updates "Do Not Disturb" status for a device.
 */
dndApp.put('/', async (context) => {
  try {
    const { deviceSerialNumber, deviceType, enabled } = await context.req.json();
    const response = await fetch(DND_STATUS_API, {
      method: 'PUT',
      headers: buildAlexaHeaders(context.env, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ deviceSerialNumber, deviceType, enabled }),
    });

    if (!response.ok) throw new Error(`Alexa API error: ${response.status}`);
    return context.json({ success: true, enabled });
  } catch (error) {
    return context.json({ error: 'Update DND failed', details: (error as Error).message }, 500);
  }
});
