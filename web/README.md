# Clinovyra web

Proyecto Next.js de la aplicación web principal. En Vercel, elegir este mismo repositorio de GitHub con **Root Directory `web`**; el proyecto de la landing utiliza `landing`. El dominio previsto es `app.clinovyra.com` cuando el dominio y DNS estén configurados; antes Vercel asignará un `*.vercel.app` al crear y desplegar el proyecto.

La pantalla actual es una vista de desarrollo. No habilita registro, sesión, expediente ni datos reales. La ruta `/api/clinical` responde 503 y no consulta Neon. No declarar una conexión Postgres ni secretos de Auth con prefijo `NEXT_PUBLIC_`.

Antes de abrir la aplicación: configurar correo y verificación de Neon Auth, origen de confianza, conexión Postgres exclusiva de servidor, rol de mínimo privilegio, membresías y RLS con pruebas cruzadas; después migrar los flujos clínicos y probar cifrado, firma y auditoría. El bucket privado `clinical-documents-private` no se expone al navegador.
