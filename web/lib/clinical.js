import 'server-only';
import pg from 'pg';
import { attachDatabasePool } from '@vercel/functions';
import { auth } from './auth';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 4, idleTimeoutMillis: 15000 });
if (process.env.VERCEL) attachDatabasePool(pool);

export class ClinicalError extends Error {
  constructor(message, status = 403) { super(message); this.status = status; }
}

export async function identity() {
  const { data, error } = await auth.getSession();
  if (error || !data?.user?.id) throw new ClinicalError('Inicia sesión para continuar.', 401);
  if (data.user.emailVerified !== true) throw new ClinicalError('Verifica tu correo antes de entrar al expediente.', 403);
  return { id: String(data.user.id), email: String(data.user.email).trim().toLowerCase() };
}

// Every query runs as the least-privileged DB role with transaction-local identity.
// Never pass a user ID or organization ID from a client payload to set these values.
export async function withClinical(user, callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Neon API-created roles can inherit neon_superuser/BYPASSRLS. Refuse to
    // handle any clinical request unless this is the SQL-created runtime role.
    const { rows: [databaseRole] } = await client.query(
      "SELECT current_user AS name, rolbypassrls AS bypasses_rls, rolsuper AS superuser FROM pg_roles WHERE rolname = current_user"
    );
    if (databaseRole?.name !== 'clinovyra_runtime' || databaseRole.bypasses_rls || databaseRole.superuser) {
      throw new ClinicalError('Acceso clínico deshabilitado mientras se valida el aislamiento de datos.', 503);
    }
    await client.query("SELECT set_config('app.user_id', $1, true), set_config('app.user_email', $2, true)", [user.id, user.email]);
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}

export async function membership(client, user) {
  const { rows } = await client.query("SELECT organization_id, role FROM clinovyra.memberships WHERE auth_user_id = $1 AND status = 'active' ORDER BY created_at LIMIT 1", [user.id]);
  if (!rows[0]) throw new ClinicalError('Tu cuenta todavía no tiene una invitación clínica activa.');
  return rows[0];
}

export function clinicalResponse(error) {
  if (!(error instanceof ClinicalError)) console.error('Clinovyra clinical API:', error);
  return Response.json({ error: error instanceof ClinicalError ? error.message : 'No se pudo completar la operación.' }, { status: error instanceof ClinicalError ? error.status : 500, headers: { 'Cache-Control': 'no-store' } });
}
