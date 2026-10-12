(function () {
  'use strict';
  const records = { meta: new Map(), vault: new Map() };
  let version = 0;
  let saveChain = Promise.resolve();
  let account = null;

  async function request(url, options) {
    const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...options });
    const value = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        if (response.status === 401) location.replace('/sign-in');
      }
      throw new Error(value.error || `Error de servidor ${response.status}`);
    }
    return value;
  }

  async function init() {
    account = await request('/api/me');
    const { vault } = await request('/api/vault');
    if (vault) {
      version = Number(vault.version);
      records.meta.set('setup', vault.meta);
      records.vault.set('payload', vault.payload);
    }
    return account;
  }

  function put(store, object) {
    records[store].set(object.id, object);
    if (!records.meta.get('setup') || !records.vault.get('payload')) return Promise.resolve();
    // Serialize writes and send a snapshot. A conflict across tabs never silently overwrites records.
    const meta = structuredClone(records.meta.get('setup'));
    const payload = structuredClone(records.vault.get('payload'));
    const pending = saveChain.then(async () => {
      const result = await request('/api/vault', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ meta, payload, version }) });
      version = result.version;
    });
    saveChain = pending;
    return pending;
  }

  async function replace(meta, payload) { records.meta.set('setup', meta); records.vault.set('payload', payload); return put('vault', payload); }

  async function upload(id, envelope, mimeType) {
    return request(`/api/documents/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ envelope, mimeType }) });
  }
  async function download(id) { return request(`/api/documents/${encodeURIComponent(id)}`); }

  async function checkSession() { await request('/api/me'); }

  function decorate() {
    document.querySelector('.hero-private').innerHTML = '<span aria-hidden="true">◈</span> Bóveda cifrada, guardada por cuenta en Neon';
    const metrics = document.querySelectorAll('.metric-card small');
    if (metrics[0]) metrics[0].textContent = 'Solo en esta cuenta';
    const note = document.querySelector('.cloud-local-note');
    if (note) note.innerHTML = '<strong>Guardado cifrado en Neon.</strong> Tus datos se cifran en este navegador antes de enviarse. Necesitas conexión para guardar cambios.';
    const notice = document.createElement('div');
    notice.id = 'webAccountNotice'; notice.className = 'soft-callout';
    notice.innerHTML = '<strong>Cuenta médica en línea</strong> · <a href="/account">Administrar cuenta e invitaciones</a><p>Entorno de desarrollo. Usa solo datos ficticios hasta completar la validación.</p>';
    document.querySelector('#mainView .content')?.prepend(notice);
  }

  window.ClinovyraWebApp = true;
  window.ClinovyraWeb = { init, get: (store, id) => Promise.resolve(records[store].get(id) || null), put, replace, upload, download, decorate, checkSession, account: () => account };
})();
