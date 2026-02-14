import { getCustomerSmartHomeEndpoints } from '@/utils/alexa-dynamic';

/**
 * Lists all smart home devices and their capabilities.
 */
export async function listSmartHomeDevices(_args: any, context: { env: any }) {
  if (!context.env?.UBID_MAIN || !context.env?.AT_MAIN) {
    return {
      content: [{ type: 'text' as const, text: 'Error: Missing Amazon authentication cookies.' }],
      isError: true,
    };
  }

  try {
    const endpoints = await getCustomerSmartHomeEndpoints(context.env);

    const devices = endpoints.map((endpoint: any) => ({
      name: endpoint.friendlyName,
      category: endpoint.displayCategories?.primary?.value || 'UNKNOWN',
      description: endpoint.legacyAppliance?.friendlyDescription,
      isOnline: endpoint.legacyAppliance?.applianceNetworkState?.reachability === 'REACHABLE',
      capabilities:
        endpoint.legacyAppliance?.capabilities?.map((cap: any) => cap.interfaceName) || [],
    }));

    const summary = [
      `Total Devices: ${devices.length}`,
      `Online: ${devices.filter((d: any) => d.isOnline).length}`,
      '',
      ...devices.map(
        (d: any) => `- ${d.name} (${d.category}): ${d.isOnline ? 'Online' : 'Offline'}`,
      ),
    ].join('\n');

    return {
      content: [{ type: 'text' as const, text: summary }],
    };
  } catch (error) {
    return {
      content: [{ type: 'text' as const, text: `Discovery failed: ${(error as Error).message}` }],
      isError: true,
    };
  }
}
