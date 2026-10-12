import './globals.css';

export const metadata = {
  title: 'Clinovyra | El espacio clínico que acompaña tu consulta',
  description: 'Expediente, notas y recetas en un mismo flujo. Conoce los planes Lite y Premium de Clinovyra, edición comercial para México.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
