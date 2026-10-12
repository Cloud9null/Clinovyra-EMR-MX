const modules = [
  { number: '01', title: 'Pacientes', detail: 'Expedientes por consultorio y médico', icon: '◇' },
  { number: '02', title: 'Consultas', detail: 'Encuentros y antecedentes en contexto', icon: '◫' },
  { number: '03', title: 'Notas clínicas', detail: 'Borradores, revisión y firma', icon: '▤' },
  { number: '04', title: 'Recetas', detail: 'Ligadas a consulta y nota firmada', icon: '℞' }
];

export default function Home() {
  return <div className="app-shell">
    <aside className="sidebar" aria-label="Navegación de Clinovyra">
      <div className="brand"><span className="brand-mark">✳</span><span>clino<b>vyra</b><i>.</i></span></div>
      <span className="side-label">ESPACIO CLÍNICO</span>
      <div className="side-current">▦ <span>Inicio</span></div>
      <div className="side-label side-label-bottom">ACCESO EN PREPARACIÓN</div>
      <div className="side-note">Las cuentas y los expedientes se habilitarán después de validar el acceso y la separación de datos.</div>
    </aside>
    <main className="main">
      <header className="topline"><span>CLINOVYRA / MÉXICO</span><span className="status"><span className="status-dot"/> DESARROLLO SEGURO</span></header>
      <div className="content">
        <div className="eyebrow">✳ &nbsp; TU ESPACIO DE TRABAJO</div>
        <h1>El cuidado empieza<br/><em>con un buen contexto.</em></h1>
        <p className="intro">El expediente clínico de Clinovyra tendrá su acceso principal aquí, desde cualquier navegador. Cada consultorio verá únicamente sus propios pacientes, consultas, notas y recetas.</p>
        <section className="notice" aria-labelledby="notice-title"><div className="notice-symbol">✳</div><div><h2 id="notice-title">Acceso clínico todavía no disponible</h2><p>Estamos terminando la verificación de identidad, permisos, cifrado y pruebas entre cuentas. Esta página no recibe información de pacientes ni permite crear usuarios todavía.</p></div></section>
        <div className="section-title"><span>FLUJO CLÍNICO</span><span>01—04</span></div>
        <div className="grid">{modules.map(({ number, title, detail, icon }) => <article key={number} className="module"><div className="module-top"><span>{number} / 04</span><span className="module-icon">{icon}</span></div><h2>{title}</h2><p>{detail}</p><div className="module-foot">Próximamente <span>↗</span></div></article>)}</div>
      </div>
      <footer>Clinovyra · Vista de desarrollo · Sin datos clínicos reales</footer>
    </main>
  </div>;
}
