'use client';
import { useEffect, useState } from 'react';
import { createAuthClient } from '@neondatabase/auth/next';
import '../sign-in/sign-in.css';
const auth = createAuthClient();

export default function Account() {
  const [me, setMe] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [message, setMessage] = useState('Cargando cuenta…');
  async function load() {
    const response = await fetch('/api/me', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) { setMessage(data.error || 'Acceso denegado.'); return; }
    setMe(data); setMessage('');
    if (data.role === 'owner') {
      const result = await fetch('/api/invitations', { cache: 'no-store' });
      if (result.ok) setInvitations((await result.json()).invitations);
    }
  }
  useEffect(() => { load().catch(() => setMessage('No se pudo consultar tu cuenta.')); }, []);
  async function invite(event) {
    event.preventDefault(); setMessage('Creando invitación…');
    const email = new FormData(event.currentTarget).get('email');
    const response = await fetch('/api/invitations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await response.json();
    setMessage(response.ok ? `Invitación registrada para ${data.email}. Pídele que cree su cuenta con ese correo.` : data.error);
    if (response.ok) { event.currentTarget.reset(); await load(); }
  }
  async function signOut() { await auth.signOut(); location.assign('/sign-in'); }
  return <main className="auth-page"><section className="auth-card">
    <div className="auth-brand"><img className="auth-mark auth-logo" src="/workspace/icons/clinovyra.png" alt="" width="35" height="35"/> clinovyra<span>.</span></div>
    <p className="auth-eyebrow">CUENTA CLÍNICA</p><h1>{me?.role === 'owner' ? 'Panel del propietario.' : 'Tu cuenta médica.'}</h1>
    <p className="auth-lead">{me ? `${me.user.email} · ${me.role === 'owner' ? 'Propietario' : 'Médico'}` : message}</p>
    {me?.role === 'owner' && <><h2>Invitar médicos de prueba</h2><form onSubmit={invite}><label>Correo del médico<input name="email" type="email" required /></label><button className="auth-submit">Registrar invitación</button></form>
      <ul>{invitations.map(item => <li key={item.email}>{item.email} · {item.status === 'accepted' ? 'cuenta activa' : 'pendiente'}</li>)}</ul></>}
    <p role="status" className="auth-message">{me && message}</p>
    <div className="auth-actions"><a href="/workspace/index.html">Abrir expediente</a> · <button onClick={signOut}>Cerrar sesión</button></div>
    <small>La cuenta propietaria puede invitar médicos y usar su bóveda propia. Las bóvedas de otros médicos permanecen separadas.</small>
  </section></main>;
}
