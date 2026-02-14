import { Hono } from 'hono';
import type { Env } from '@/types/env';
import { buildAlexaHeaders } from '@/utils/alexa';

export const sensorsApp = new Hono<{ Bindings: Env }>();

const DEVICES_API = 'https://alexa.amazon.com/api/devices-v2/device?cached=true';
const PHOENIX_API = 'https://alexa.amazon.com/api/phoenix/state';

/**
 * Lists all Alexa devices that support sensor capabilities.
 */
sensorsApp.get('/', async (context) => {
  try {
    const response = await fetch(DEVICES_API, {
      method: 'GET',
      headers: buildAlexaHeaders(context.env, { Accept: 'application/json; charset=utf-8' }),
    });

    if (!response.ok) throw new Error(`Alexa API error: ${response.status}`);

    const { devices = [] } = (await response.json()) as any;
    const sensors = devices
      .filter(
        (d: any) =>
          d.deviceFamily === 'ECHO' ||
          d.deviceType?.includes('ECHO') ||
          d.accountName?.toLowerCase().includes('echo'),
      )
      .map((d: any) => ({
        id: `AlexaBridge_${d.serialNumber}@${d.deviceType}_${d.serialNumber}`,
        name: d.accountName || d.deviceName || 'Alexa Device',
        type: d.deviceType,
        isOnline: d.online !== false,
        capabilities: ['temperature', 'illuminance', 'motion'],
      }));

    return context.json({ sensors, count: sensors.length });
  } catch (error) {
    return context.json(
      { error: 'Sensor discovery failed', details: (error as Error).message },
      500,
    );
  }
});

/**
 * Retrieves sensor data for a specific entity.
 */
sensorsApp.get('/:entityId', async (context) => {
  const entityId = context.req.param('entityId');
  try {
    const response = await fetch(PHOENIX_API, {
      method: 'POST',
      headers: buildAlexaHeaders(context.env, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        stateRequests: [
          {
            entityId,
            entityType: 'APPLIANCE',
            properties: [
              { namespace: 'Alexa.TemperatureSensor', name: 'temperature' },
              { namespace: 'Alexa.LightSensor', name: 'illuminance' },
              { namespace: 'Alexa.MotionSensor', name: 'detectionState' },
            ],
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Alexa API error: ${response.status}`);

    const { deviceStates = [] } = (await response.json()) as any;
    if (deviceStates.length === 0) return context.json({ error: 'Entity not found' }, 404);

    const state = deviceStates[0];
    const data: any = {};
    const caps = (state.capabilityStates || []).map((c: string) => JSON.parse(c));

    for (const c of caps) {
      if (c.namespace.includes('Temperature')) data.temperature = c.value;
      if (c.namespace.includes('LightSensor')) data.illuminance = c.value;
      if (c.namespace.includes('MotionSensor')) data.motion = c.value === 'DETECTED';
    }

    return context.json({ id: entityId, data, timestamp: new Date().toISOString() });
  } catch (error) {
    return context.json({ error: 'Sensor lookup failed', details: (error as Error).message }, 500);
  }
});
