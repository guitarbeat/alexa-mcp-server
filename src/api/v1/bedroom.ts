import { Hono } from 'hono';
import type { Env } from '@/types/env';
import { buildAlexaHeaders } from '@/utils/alexa';
import {
  getEchoDeviceEntityId,
  getLightApplianceId,
  getCustomerSmartHomeEndpoints,
} from '@/utils/alexa-dynamic';

export const bedroomApp = new Hono<{ Bindings: Env }>();

const PHOENIX_API = 'https://alexa.amazon.com/api/phoenix/state';

/**
 * Aggregates bedroom sensor and light state.
 */
bedroomApp.get('/', async (context) => {
  try {
    const stateRequests: any[] = [];
    const discoveredIds = new Set<string>();

    const addTarget = (id: string, type: 'ENTITY' | 'APPLIANCE') => {
      if (id && !discoveredIds.has(id)) {
        stateRequests.push({ entityId: id, entityType: type });
        discoveredIds.add(id);
      }
    };

    // Discovery
    const [echoId, lightId] = await Promise.all([
      getEchoDeviceEntityId(context.env).catch(() => null),
      getLightApplianceId(context.env).catch(() => null),
    ]);

    if (echoId) addTarget(echoId, 'ENTITY');
    if (lightId) addTarget(lightId, 'APPLIANCE');

    const endpoints = await getCustomerSmartHomeEndpoints(context.env).catch(() => []);
    for (const ep of endpoints) {
      const eid = ep.legacyIdentifiers?.chrsIdentifier?.entityId || ep.endpointId;
      if (eid) addTarget(eid, 'ENTITY');
      if (ep.legacyAppliance?.applianceId) addTarget(ep.legacyAppliance.applianceId, 'APPLIANCE');
    }

    if (stateRequests.length === 0)
      return context.json({ error: 'No control entities found' }, 404);

    // Fetch State
    const response = await fetch(PHOENIX_API, {
      method: 'POST',
      headers: buildAlexaHeaders(context.env, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ stateRequests }),
    });

    if (!response.ok) return context.json({ error: 'Alexa API unreachable' }, 503);

    const { deviceStates = [] } = (await response.json()) as any;

    let temperature = null;
    let illuminance = null;
    let motion = false;
    const light = { on: false, brightness: 0 };

    for (const ds of deviceStates) {
      const caps = (ds.capabilityStates || []).map((c: string) => JSON.parse(c));
      for (const c of caps) {
        if (c.namespace === 'Alexa.TemperatureSensor') temperature = c.value;
        if (c.namespace === 'Alexa.LightSensor') illuminance = c.value;
        if (c.namespace === 'Alexa.MotionSensor') motion = c.value === 'DETECTED';
        if (c.namespace === 'Alexa.PowerController') light.on = c.value === 'ON';
        if (c.namespace === 'Alexa.BrightnessController') light.brightness = c.value;
      }
    }

    return context.json({
      temperature: temperature ? { fahrenheit: (temperature as any).value } : null, // Simplification for brevity
      illuminance,
      motion: { detected: motion },
      lighting: light,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return context.json({ error: 'Bedroom state failure', details: (error as Error).message }, 500);
  }
});
