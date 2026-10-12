import { createHash } from 'node:crypto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { ClinicalError, clinicalResponse, identity, membership, withClinical } from '../../../../lib/clinical';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const bucket = 'clinical-documents-private';
const s3 = new S3Client({ endpoint: process.env.AWS_ENDPOINT_URL_S3, region: process.env.AWS_REGION, forcePathStyle: true, requestChecksumCalculation: 'WHEN_REQUIRED' });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!uuid.test(id)) throw new ClinicalError('Identificador inválido.', 400);
    if (Number(request.headers.get('content-length') || 0) > 6_000_000) throw new ClinicalError('Adjunto demasiado grande.', 413);
    const { envelope, mimeType } = await request.json();
    const data = JSON.stringify(envelope);
    if (data.length > 6_000_000 || envelope?.format !== 'rx-e2ee-document-v1' || !['application/pdf', 'image/png', 'image/jpeg'].includes(mimeType) || !/^[A-Za-z0-9+/=]+$/.test(envelope?.cipher?.data || '')) throw new ClinicalError('Adjunto cifrado inválido.', 400);
    const user = await identity();
    const member = await withClinical(user, async client => membership(client, user));
    const key = `${member.organization_id}/${user.id}/${id}.json`;
    const digest = createHash('sha256').update(data).digest('hex');
    const buffer = Buffer.from(data, 'utf8');
    // Immutable id: the server never overwrites an existing document.
    const existing = await withClinical(user, async client => client.query('SELECT ciphertext_sha256 FROM clinovyra.encrypted_documents WHERE id = $1 AND organization_id = $2 AND auth_user_id = $3', [id, member.organization_id, user.id]));
    if (existing.rows[0]) {
      if (existing.rows[0].ciphertext_sha256 !== digest) throw new ClinicalError('El documento ya existe con otro contenido.', 409);
      return Response.json({ id, stored: true });
    }
    try { await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: 'application/json', IfNoneMatch: '*' })); }
    catch (error) {
      if (error.$metadata?.httpStatusCode !== 412) throw error;
      const prior = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const priorBytes = Buffer.from(await prior.Body.transformToByteArray());
      if (createHash('sha256').update(priorBytes).digest('hex') !== digest) throw new ClinicalError('El documento ya existe con otro contenido.', 409);
    }
    await withClinical(user, async client => {
      const current = await membership(client, user);
      if (current.organization_id !== member.organization_id) throw new ClinicalError('La cuenta cambió durante la carga.', 409);
      await client.query('INSERT INTO clinovyra.encrypted_documents (id, organization_id, auth_user_id, object_key, mime_type, byte_size, ciphertext_sha256) VALUES ($1, $2, $3, $4, $5, $6, $7)', [id, member.organization_id, user.id, key, mimeType, buffer.length, digest]);
    });
    return Response.json({ id, stored: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return clinicalResponse(error); }
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    if (!uuid.test(id)) throw new ClinicalError('Identificador inválido.', 400);
    const user = await identity();
    const row = await withClinical(user, async client => {
      const member = await membership(client, user);
      const { rows } = await client.query('SELECT object_key, ciphertext_sha256 FROM clinovyra.encrypted_documents WHERE id = $1 AND organization_id = $2 AND auth_user_id = $3', [id, member.organization_id, user.id]);
      if (!rows[0]) throw new ClinicalError('Documento no encontrado.', 404);
      return rows[0];
    });
    const object = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: row.object_key }));
    const data = Buffer.from(await object.Body.transformToByteArray());
    if (createHash('sha256').update(data).digest('hex') !== row.ciphertext_sha256) throw new ClinicalError('El documento no pasó la prueba de integridad.', 500);
    return new Response(data, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, private' } });
  } catch (error) { return clinicalResponse(error); }
}
