'use client';
import { useState } from 'react';
import { createAuthClient } from '@neondatabase/auth/next';
import './sign-in.css';
const auth = createAuthClient();

export default function SignIn() {
  const [mode, setMode] = useState('sign-in');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setMessage('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim().toLowerCase();
    const password = String(form.get('password') || '');
    try {
      if (mode === 'verify') {
        const result = await auth.emailOtp.verifyEmail({ email, otp: String(form.get('code') || '').trim() });
        if (result.error) throw result.error;
        setMessage('Correo verificado. Inicia sesión.'); setMode('sign-in'); return;
      }
      if (mode === 'register') {
        const result = await auth.signUp.email({ email, password, name: String(form.get('name') || '').trim() });
        if (result.error) throw result.error;
        setMessage('Cuenta creada. Revisa tu correo para verificarla antes de usar el expediente.'); setMode('verify'); return;
      }
      const result = await auth.signIn.email({ email, password });
      if (result.error) throw result.error;
      const access = await fetch('/api/me', { cache: 'no-store' });
      if (!access.ok) { const data = await access.json(); throw new Error(data.error || 'Cuenta sin invitación activa.'); }
      location.assign('/workspace/index.html');
    } catch (error) { setMessage(error.message || 'No se pudo completar el acceso.'); }
    finally { setBusy(false); }
  }
  async function sendCode(event) {
    const email = event.currentTarget.form?.elements?.email?.value?.trim();
    if (!email) return setMessage('Escribe primero tu correo.');
    const result = await auth.emailOtp.sendVerificationOtp({ email, type: 'email-verification' });
    setMessage(result.error?.message || 'Código enviado al correo.');
  }
  return <main className="auth-page"><section className="auth-card">
    <div className="auth-brand"><img className="auth-mark auth-logo" src="/workspace/icons/clinovyra.png" alt="" width="35" height="35"/> clinovyra<span>.</span></div>
    <p className="auth-eyebrow">EXPEDIENTE CLÍNICO · MÉXICO</p>
    <h1>{mode === 'sign-in' ? 'Bienvenido a tu espacio clínico.' : mode === 'register' ? 'Crea tu cuenta médica.' : 'Verifica tu correo.'}</h1>
    <p className="auth-lead">Cada médico entra con su propia cuenta y accede únicamente a su bóveda de pacientes.</p>
    <form onSubmit={submit}>
      {mode === 'register' && <label>Nombre<input name="name" required autoComplete="name" /></label>}
      <label>Correo electrónico<input type="email" name="email" required autoComplete="email" /></label>
      {mode === 'verify' ? <label>Código de verificación<input name="code" inputMode="numeric" required /><button className="auth-text" type="button" onClick={sendCode}>Enviar código</button></label>
        : <label>Contraseña<input type="password" name="password" minLength={8} required autoComplete={mode === 'register' ? 'new-password' : 'current-password'} /></label>}
      <button className="auth-submit" disabled={busy}>{busy ? 'Un momento…' : mode === 'sign-in' ? 'Entrar' : mode === 'register' ? 'Crear cuenta' : 'Verificar'}</button>
      <p role="status" className="auth-message">{message}</p>
    </form>
    <div className="auth-actions"><button onClick={() => { setMessage(''); setMode(mode === 'sign-in' ? 'register' : 'sign-in'); }}>{mode === 'sign-in' ? 'Tengo una invitación · crear cuenta' : 'Ya tengo una cuenta'}</button></div>
    <small>Acceso de desarrollo. Usa solo datos ficticios hasta completar las pruebas clínicas y de seguridad.</small>
  </section></main>;
}
