import { ClinicalError, clinicalResponse, identity, membership, withClinical } from '../../../lib/clinical';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await identity();
    return Response.json(await withClinical(user, async client => {
      const member = await membership(client, user);
      if (member.role !== 'owner') throw new ClinicalError('Solo el propietario puede consultar invitaciones.');
      const { rows } = await client.query('SELECT email, role, status, created_at, accepted_at FROM clinovyra.account_invitations WHERE organization_id = $1 ORDER BY created_at DESC', [member.organization_id]);
      return { invitations: rows };
    }), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return clinicalResponse(error); }
}

export async function POST(request) {
  try {
    if (Number(request.headers.get('content-length') || 0) > 2048) throw new ClinicalError('Solicitud demasiado grande.', 413);
    const { email } = await request.json();
    const normalized = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || normalized.length > 320) throw new ClinicalError('Correo inválido.', 400);
    const user = await identity();
    return Response.json(await withClinical(user, async client => {
      const member = await membership(client, user);
      if (member.role !== 'owner') throw new ClinicalError('Solo el propietario puede invitar médicos.');
      const { rows } = await client.query("INSERT INTO clinovyra.account_invitations (organization_id, email, role, invited_by) VALUES ($1, $2, 'doctor', $3) ON CONFLICT (organization_id, email) DO NOTHING RETURNING id", [member.organization_id, normalized, user.id]);
      if (!rows[0]) throw new ClinicalError('Este correo ya tiene invitación.', 409);
      return { email: normalized, status: 'pending' };
    }), { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return clinicalResponse(error); }
}
