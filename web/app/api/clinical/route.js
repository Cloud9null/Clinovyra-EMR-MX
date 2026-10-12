// The clinical API remains closed until identity, tenant authorization and encryption are wired.
export function GET() {
  return Response.json({ error: 'Acceso clínico en preparación' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
}

export const POST = GET;
