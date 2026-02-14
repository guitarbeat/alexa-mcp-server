import { Hono } from 'hono';
import type { Env } from '@/types/env';
import { buildAlexaHeaders } from '@/utils/alexa';

export const lightsApp = new Hono<{ Bindings: Env }>();

const NEXUS_API = 'https://alexa.amazon.com/api/nexus/v1/devices/execute-commands';

/**
 * Standard tool response handler for light operations.
 */
async function executeLightCommand(env: Env, body: any) {
  const response = await fetch(NEXUS_API, {
    method: 'POST',
    headers: buildAlexaHeaders(env, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Nexus API error: ${response.status}`);
  return response.json();
}

/**
 * GET /api/lights/list - Lists all available lights.
 */
lightsApp.get('/list', async (context) => {
  try {
    const response = await fetch('https://alexa.amazon.com/api/devices-v2/device?cached=true', {
      method: 'GET',
      headers: buildAlexaHeaders(context.env, { Accept: 'application/json' }),
    });

    if (!response.ok) throw new Error(`Alexa API error: ${response.status}`);

    const { devices = [] } = (await response.json()) as any;
    const lights = devices
      .filter(
        (d: any) =>
          d.deviceFamily === 'SMART_HOME' ||
          d.capabilities?.some((c: any) => c.interfaceName.includes('Light')),
      )
      .map((d: any) => ({
        id: d.serialNumber || d.id,
        name: d.accountName || d.displayName,
        capabilities: d.capabilities?.map((c: any) => c.interfaceName) || [],
      }));

    return context.json({ lights, count: lights.length });
  } catch (error) {
    return context.json({ error: 'List lights failed', details: (error as Error).message }, 500);
  }
});

/**
 * POST /api/lights/:id/power - Toggles light power.
 */
lightsApp.post('/:id/power', async (context) => {
  const id = context.req.param('id');
  const { on } = await context.req.json();

  try {
    await executeLightCommand(context.env, {
      commands: [
        {
          command: on ? 'turnOn' : 'turnOff',
          endpointId: id,
          payload: {},
        },
      ],
    });
    return context.json({ success: true, id, on });
  } catch (error) {
    return context.json({ error: 'Power toggle failed', details: (error as Error).message }, 500);
  }
});

/**
 * POST /api/lights/:id/brightness - Sets light brightness.
 */
lightsApp.post('/:id/brightness', async (context) => {
  const id = context.req.param('id');
  const { level } = await context.req.json();

  try {
    await executeLightCommand(context.env, {
      commands: [
        {
          command: 'setBrightness',
          endpointId: id,
          payload: { brightness: level },
        },
      ],
    });
    return context.json({ success: true, id, level });
  } catch (error) {
    return context.json({ error: 'Brightness set failed', details: (error as Error).message }, 500);
  }
});

/**
 * POST /api/lights/:id/color - Sets light color.
 */
lightsApp.post('/:id/color', async (context) => {
  const id = context.req.param('id');
  const { mode, value } = await context.req.json();

  try {
    const payload =
      mode === 'temperature' ? { colorTemperatureInKelvin: value } : { colorName: value };
    await executeLightCommand(context.env, {
      commands: [
        {
          command: mode === 'temperature' ? 'setColorTemperature' : 'setColor',
          endpointId: id,
          payload,
        },
      ],
    });
    return context.json({ success: true, id, mode, value });
  } catch (error) {
    return context.json({ error: 'Color set failed', details: (error as Error).message }, 500);
  }
});
