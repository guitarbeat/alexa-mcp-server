export async function getAllSensorData(_args: any, context: { env: any }) {
  const apiBase = context.env?.API_BASE;
  if (!apiBase)
    return {
      content: [{ type: 'text' as const, text: 'Error: API_BASE not configured.' }],
      isError: true,
    };

  try {
    const response = await fetch(`${apiBase}/api/sensors`, { method: 'GET' });
    if (!response.ok) throw new Error(`List sensors failed: ${response.status}`);

    const { sensors = [] } = (await response.json()) as any;
    return {
      content: [
        {
          type: 'text' as const,
          text:
            sensors.length > 0
              ? `Discovered Sensors:\n${sensors
                  .map((s: any) => `- ${s.name} (ID: ${s.id}) [${s.capabilities.join(', ')}]`)
                  .join('\n')}`
              : 'No sensors found on this Alexa account.',
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
