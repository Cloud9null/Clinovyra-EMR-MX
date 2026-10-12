import { ClinicalError, clinicalResponse, identity, membership, withClinical } from '../../../lib/clinical';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function envelope(value, kind) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.id !== kind || typeof value.data !== 'string' && kind === 'payload') throw new ClinicalError('Bóveda cifrada inválida.', 400);
  if (kind === 'payload' && (typeof value.iv !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(value.data))) throw new ClinicalError('Cifrado inválido.', 400);
}

export async function GET() {
  try {
    const user = await identity();
    return Response.json(await withClinical(user, async client => {
      const member = await membership(client, user);
      const { rows } = await client.query('SELECT meta, payload, version FROM clinovyra.encrypted_vaults WHERE organization_id = $1 AND auth_user_id = $2', [member.organization_id, user.id]);
      return { vault: rows[0] || null };
    }), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return clinicalResponse(error); }
}

export async function PUT(request) {
  try {
    if (Number(request.headers.get('content-length') || 0) > 9_000_000) throw new ClinicalError('La bóveda supera el límite.', 413);
    const body = await request.json();
    envelope(body.meta, 'setup'); envelope(body.payload, 'payload');
    if (JSON.stringify(body).length > 9_000_000 || !Number.isSafeInteger(body.version) || body.version < 0) throw new ClinicalError('Versión o tamaño inválidos.', 400);
    const user = await identity();
    return Response.json(await withClinical(user, async client => {
      const member = await membership(client, user);
      const sql = body.version === 0
        ? `INSERT INTO clinovyra.encrypted_vaults (organization_id, auth_user_id, meta, payload)
           VALUES ($1, $2, $3, $4) ON CONFLICT (auth_user_id) DO NOTHING RETURNING version`
        : `UPDATE clinovyra.encrypted_vaults SET meta = $3, payload = $4, version = version + 1,
           updated_at = now() WHERE organization_id = $1 AND auth_user_id = $2 AND version = $5 RETURNING version`;
      const { rows } = await client.query(sql, [member.organization_id, user.id, body.meta, body.payload, ...(body.version ? [body.version] : [])]);
      if (!rows[0]) throw new ClinicalError('La bóveda cambió en otra pestaña. Recarga antes de guardar.', 409);
      return { version: Number(rows[0].version) };
    }), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return clinicalResponse(error); }
}
