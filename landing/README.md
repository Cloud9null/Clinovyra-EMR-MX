# Clinovyra · landing comercial

Next.js estático e independiente del EMR (`landing/`). No contiene formularios, credenciales, API clínica ni datos de pacientes. `output: 'export'` genera `out/`, que puede alojarse en un proyecto Vercel separado con Root Directory `landing` o en cualquier alojamiento de archivos estáticos. La página y los planes son una propuesta de preventa: no hay registro, cobro ni demo pública todavía. `robots: noindex` hasta validar el lanzamiento.

```
cd landing
npm ci
npm run build
```

Para publicar en Vercel se requiere una cuenta apta para uso comercial. Configurar el proyecto sólo con este directorio y mantener el EMR y la API bajo un proyecto y dominio separados. No dirigir la landing al backend personal ni usar cadenas Postgres en variables públicas.
