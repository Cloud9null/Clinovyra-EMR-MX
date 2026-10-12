import { ClinicalError, clinicalResponse, identity, membership, withClinical } from '../../../lib/clinical';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await identity();
    return Response.json(await withClinical(user, async client => {
      // A verified, invited email claims exactly one membership. No elevated
      // operation is performed merely because a caller supplied an email.
      let member;
      try { member = await membership(client, user); }
      catch (error) {
        if (!(error instanceof ClinicalError)) throw error;
        const invitations = await client.query("SELECT id, organization_id, role FROM clinovyra.account_invitations WHERE email = $1 AND status = 'pending' ORDER BY created_at LIMIT 1 FOR UPDATE", [user.email]);
        const invite = invitations.rows[0];
        if (!invite) throw error;
        await client.query("INSERT INTO clinovyra.memberships (organization_id, auth_user_id, role) VALUES ($1, $2, $3) ON CONFLICT (organization_id, auth_user_id) DO NOTHING", [invite.organization_id, user.id, invite.role]);
        await client.query("UPDATE clinovyra.account_invitations SET status = 'accepted', accepted_by = $1, accepted_at = now() WHERE id = $2 AND status = 'pending'", [user.id, invite.id]);
        member = await membership(client, user);
      }
      return { user: { id: user.id, email: user.email }, organizationId: member.organization_id, role: member.role };
    }), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return clinicalResponse(error); }
}
