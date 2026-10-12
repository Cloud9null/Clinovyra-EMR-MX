const Icon = ({ name, size = 22 }) => {
  const paths = {
    heart: <><path d="M20.8 8.6c0 4.7-8.8 10.3-8.8 10.3S3.2 13.3 3.2 8.6a4.8 4.8 0 0 1 8.8-2.5 4.8 4.8 0 0 1 8.8 2.5Z"/></>,
    folder: <><path d="M3 7.5h6l2 2H21v9.3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5Z"/><path d="M3 10V5.2a2 2 0 0 1 2-2h4.5l2 2H18a2 2 0 0 1 2 2v2.3"/></>,
    note: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    rx: <><path d="M5 20V4h7a4 4 0 0 1 0 8H5m7-1 7 9M14 17l6-6"/></>,
    shield: <><path d="m12 2 8 3v6c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V5l8-3Z"/><path d="m9 12 2 2 4-4"/></>,
    spark: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 17l.5 1.5L21 19l-1.5.5L19 21l-.5-1.5L17 19l1.5-.5L19 17Z"/></>,
    audio: <><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8"/></>,
    arrow: <><path d="M4 12h15m-6-6 6 6-6 6"/></>,
    check: <><path d="m4 12 5 5L20 6"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const cards = [
  { no: '01', icon: 'folder', title: 'El contexto, primero', text: 'Identifica alergias y antecedentes documentados antes de entrar a la consulta.' },
  { no: '02', icon: 'note', title: 'Una nota a tu ritmo', text: 'Ordena la atención por secciones, guarda borradores y revisa antes de firmar.' },
  { no: '03', icon: 'rx', title: 'Recetas con contexto', text: 'Cada nueva receta requiere una consulta y una nota finalizada y firmada.' },
  { no: '04', icon: 'shield', title: 'Tu espacio de trabajo', text: 'Diseñado para separar las cuentas y expedientes de cada consultorio.' }
];

const lite = ['Pacientes y expedientes', 'Consultas y notas clínicas', 'Recetas ligadas a nota firmada', 'Catálogo CIE-10 local', 'Diseños de exportación de documentos'];
const premium = ['Todo lo incluido en Lite', 'Borradores de notas asistidos por IA', 'Transcripción asistida para revisión', 'Herramientas de revisión clínica'];

function Brand() {
  return <a href="#inicio" className="brand" aria-label="Clinovyra, volver al inicio"><img className="brand-symbol brand-image" src="/clinovyra.png" alt="" width="39" height="39"/><span>clino<span className="brand-accent">vyra</span><i>.</i></span></a>;
}

function Preview() {
  return <div className="preview-frame" aria-label="Vista conceptual de Clinovyra con datos sintéticos">
    <div className="preview-bar"><span className="preview-dots"><b/><b/><b/></span><span>clinovyra / tu espacio clínico</span><span className="preview-badge">VISTA CONCEPTUAL</span></div>
    <div className="preview-inner"><aside className="preview-side"><span className="side-logo">✳ <b>clinovyra</b></span><span className="side-caption">ESPACIO CLÍNICO</span><span className="side-active">▦ <b>Inicio</b></span><span>♙ <b>Pacientes</b></span><span>▤ <b>Consultas</b></span><span>℞ <b>Recetas</b></span><span className="side-footer">CV <b>Consultorio ejemplo</b></span></aside>
    <div className="preview-main"><div className="preview-crumb">LUNES, 12 DE OCTUBRE <span>✳ &nbsp; ESPACIO DE EJEMPLO</span></div><h3>Buen día, doctora.</h3><p>Tu jornada, con todo en su lugar.</p><div className="preview-stats"><div><small>PACIENTES</small><strong>24</strong><em>Datos de muestra</em></div><div><small>CONSULTAS</small><strong>08</strong><em>Datos de muestra</em></div><div><small>NOTAS</small><strong>12</strong><em>Datos de muestra</em></div></div><div className="preview-bottom"><div className="preview-list"><div className="preview-list-title">Continuar trabajando <span>Hoy ↗</span></div><div><span className="list-icon">01</span><span><b>Abre el expediente</b><small>Contexto antes de la consulta</small></span><span>↗</span></div><div><span className="list-icon">02</span><span><b>Documenta la atención</b><small>Guarda y firma la nota</small></span><span>↗</span></div><div><span className="list-icon">03</span><span><b>Emite la receta</b><small>Desde una nota finalizada</small></span><span>↗</span></div></div><div className="preview-message"><span>✳</span><p>Más tiempo para escuchar. Más claridad para documentar.</p><small>HECHO PARA LA CONSULTA</small></div></div></div></div>
    <div className="preview-floating"><span>✦</span><span>El cuidado empieza<br/>con un buen contexto.</span></div>
  </div>;
}

function Plan({ name, price, description, features, featured }) {
  return <article className={`plan ${featured ? 'plan-featured' : ''}`}>
    {featured && <div className="plan-ribbon">MÁS POSIBILIDADES PARA TU PRÁCTICA</div>}
    <div className="plan-top"><div><span className="plan-name">{name}</span><p>{description}</p></div><span className="plan-ornament" aria-hidden="true">{featured ? '✳' : '✧'}</span></div>
    <div className="plan-price"><strong>${price}</strong><span>MXN / mes</span></div>
    <p className="plan-price-caption">Precio propuesto · todavía sin contratación</p>
    <a className={`plan-button ${featured ? 'plan-button-featured' : ''}`} href="#demo">Conocer el estado del acceso <Icon name="arrow" size={18}/></a>
    <div className="plan-divider"/><p className="plan-includes">{featured ? 'Incluye además' : 'Pensado para la consulta'}</p>
    <ul>{features.map(feature => <li key={feature}><Icon name="check" size={17}/>{feature}</li>)}</ul>
    {featured && <p className="plan-caution">La IA propone borradores. El médico revisa, corrige y decide qué incorporar o firmar.</p>}
  </article>;
}

export default function Home() {
  return <><a className="skip-link" href="#contenido">Ir al contenido</a><header className="header"><div className="container header-inner"><Brand/><nav aria-label="Navegación principal"><a href="#plataforma">Plataforma</a><a href="#planes">Planes</a><a href="#preguntas">Preguntas</a></nav><a className="header-cta" href="#demo">Conoce el demo <Icon name="arrow" size={17}/></a></div></header>
    <main id="contenido"><section className="hero container" id="inicio"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"/>UN ESPACIO CLÍNICO MÁS CLARO</div><h1>Tu consulta,<br/><span>en su mejor</span><br/>versión<span className="hero-period">.</span></h1><p>Pacientes, expedientes, notas y recetas en una experiencia que respeta el ritmo de tu práctica.</p><div className="hero-actions"><a className="button-primary" href="#planes">Explorar los planes <Icon name="arrow" size={19}/></a><a className="button-text" href="#plataforma">Descubre Clinovyra <span>↘</span></a></div><div className="hero-foot"><span className="foot-icon">✳</span><span>Edición comercial en desarrollo. El demo y las suscripciones aún no están habilitados para pacientes reales.</span></div></div><Preview/></section>
      <div className="rail" aria-label="Áreas de Clinovyra"><div>EXPEDIENTE CLÍNICO <span>✳</span> NOTAS MÉDICAS <span>✳</span> RECETAS <span>✳</span> FLUJO DE CONSULTA <span>✳</span> CONTEXTO PARA DECIDIR</div></div>
      <section className="section container" id="plataforma"><div className="section-heading"><div><span className="kicker">01 / UNA FORMA DE TRABAJAR</span><h2>Menos vueltas.<br/><em>Más consulta.</em></h2></div><p>Desde el primer encuentro hasta el seguimiento, la información aparece cuando la necesitas. Cada función se está preparando para cuentas independientes de médicos y consultorios.</p></div><div className="feature-grid">{cards.map(card => <article key={card.no} className="feature-card"><div className="feature-card-top"><span>{card.no} / 04</span><span className="feature-icon"><Icon name={card.icon} size={25}/></span></div><h3>{card.title}</h3><p>{card.text}</p><span className="feature-bottom"/></article>)}</div></section>
      <section className="quote-wrap"><div className="container quote-inner"><div className="quote-art" aria-hidden="true"><span className="art-ring ring-one"/><span className="art-ring ring-two"/><span className="art-symbol">✳</span><span className="art-tag">EL DETALLE IMPORTA</span></div><div className="quote-copy"><span className="kicker">02 / DISEÑADO PARA ACOMPAÑAR</span><h2>Más atención en las personas. <em>Menos ruido en la pantalla.</em></h2><p>La tecnología debería dejarte escuchar, observar y decidir. Por eso Clinovyra presenta primero lo documentado y mantiene el borrador asistido por IA separado de la nota clínica ordinaria.</p><div className="quote-pills"><span><Icon name="heart" size={16}/> Contexto clínico</span><span><Icon name="spark" size={16}/> IA bajo revisión médica</span></div></div></div></section>
      <section className="section pricing container" id="planes"><div className="pricing-head"><span className="kicker">03 / PLANES PROPUESTOS</span><h2>Elige tu forma<br/><em>de trabajar.</em></h2><p>Una base clara para tu consulta. Cuando lancemos el acceso comercial, comunicaremos condiciones, límites de uso y contratación antes de activar pagos.</p></div><div className="plans"><Plan name="Lite" price="400" description="Lo esencial, cuidadosamente organizado." features={lite}/><Plan name="Premium" price="600" description="Más herramientas para una práctica más ágil." features={premium} featured/></div><p className="pricing-note">Los precios son los propuestos por Clinovyra. Transcripción y generación de borradores con IA están en desarrollo; costos, límites y consentimiento se detallarán antes de contratar.</p></section>
      <section className="section faq container" id="preguntas"><div><span className="kicker">04 / ANTES DE COMENZAR</span><h2>Preguntas<br/><em>importantes.</em></h2><p>La confianza empieza con respuestas claras.</p></div><div className="faq-list"><details><summary>¿Puedo probar Clinovyra ahora?<span>+</span></summary><p>El acceso público todavía no está abierto. Estamos preparando una prueba temporal con datos de ejemplo y validando el aislamiento entre consultorios antes de admitir información clínica real.</p></details><details><summary>¿La IA escribe y firma notas por mí?<span>+</span></summary><p>No. En Premium propondrá un borrador diferenciado de la nota ordinaria. El médico deberá revisar los hechos, corregir lo necesario y decidir qué incorporar antes de firmar.</p></details><details><summary>¿Lite permite emitir recetas sin consulta?<span>+</span></summary><p>No. Toda receta nueva exige una consulta vinculada a una nota finalizada y firmada, con comprobación en el servidor cuando el acceso comercial esté disponible.</p></details><details><summary>¿Habrá acceso web y aplicaciones?<span>+</span></summary><p>La propuesta contempla web y aplicaciones para Windows, Android e iOS. La sincronización segura y la distribución de las aplicaciones siguen en pruebas.</p></details></div></section>
      <section className="final-cta container" id="demo"><div className="final-spark">✳</div><span className="kicker">CLINOVYRA / MÉXICO</span><h2>Un mejor espacio<br/>para cada consulta.</h2><p>La prueba con tiempo limitado y el registro de cuentas estarán disponibles después de completar las verificaciones de seguridad y los flujos clínicos.</p><a href="#inicio" className="button-primary button-light">Volver al inicio <Icon name="arrow" size={19}/></a><div className="final-lines" aria-hidden="true"/></section></main>
    <footer className="footer container"><Brand/><span>En desarrollo · Sin registro de pacientes reales</span><span>© {new Date().getUTCFullYear()} Clinovyra</span></footer></>;
}
