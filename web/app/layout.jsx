import './styles.css';

export const metadata = {
  title: 'Clinovyra | Espacio clínico',
  description: 'Acceso web al expediente clínico electrónico Clinovyra.',
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
