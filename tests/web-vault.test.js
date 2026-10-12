const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');

const source = readFileSync(require('node:path').join(__dirname, '../web/scripts/clinical-web.js'), 'utf8');

test('the web vault sends encrypted snapshots sequentially and refuses stale versions', async () => {
  const sent = [];
  const window = {};
  const context = { window, location: { replace() {} }, structuredClone, document: {}, fetch: async (url, options) => {
    if (url === '/api/me') return { ok: true, json: async () => ({ user: { id: 'test-one', email: 'test@example.com' }, role: 'doctor' }) };
    if (url === '/api/vault' && !options?.method) return { ok: true, json: async () => ({ vault: null }) };
    if (url === '/api/vault' && options?.method === 'PUT') {
      const body = JSON.parse(options.body); sent.push(body);
      if (body.version !== sent.length - 1) return { ok: false, status: 409, json: async () => ({ error: 'Conflicto' }) };
      return { ok: true, json: async () => ({ version: sent.length }) };
    }
    throw new Error(`Unexpected route ${url}`);
  } };
  runInNewContext(source, context);
  await window.ClinovyraWeb.init();
  await window.ClinovyraWeb.put('meta', { id: 'setup', wrappedVaultKey: { data: 'encrypted' } });
  await window.ClinovyraWeb.put('vault', { id: 'payload', iv: 'iv', data: 'first-ciphertext' });
  const first = window.ClinovyraWeb.put('vault', { id: 'payload', iv: 'iv', data: 'second-ciphertext' });
  const second = window.ClinovyraWeb.put('vault', { id: 'payload', iv: 'iv', data: 'third-ciphertext' });
  await Promise.all([first, second]);
  assert.deepEqual(sent.map(item => item.version), [0, 1, 2]);
  assert.deepEqual(sent.map(item => item.payload.data), ['first-ciphertext', 'second-ciphertext', 'third-ciphertext']);
  assert.equal(sent.every(item => !('patients' in item)), true);
});
