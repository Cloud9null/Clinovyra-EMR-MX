# Clinovyra web

Proyecto Next.js de la aplicación web principal. En Vercel, elegir este mismo repositorio de GitHub con **Root Directory `web`**; el proyecto de la landing utiliza `landing`. El dominio previsto es `app.clinovyra.com` cuando el dominio y DNS estén configurados; antes Vercel asignará un `*.vercel.app` al crear y desplegar el proyecto.

La ruta `/` redirige a `/clinical/index.html`. En cada compilación se copia la interfaz compartida del cliente raíz, con la marca y el flujo visual de las aplicaciones nativas. `web/public/clinical` es generado e ignorado por Git. La vista crea un paciente ficticio y guarda los cambios solo en memoria; se borran al recargar. No usar datos reales. No habilita registro, sesión comercial, recetas ni expedientes persistentes. La ruta `/api/clinical` responde 503 y no consulta Neon. No declarar una conexión Postgres ni secretos de Auth con prefijo `NEXT_PUBLIC_`.

Antes de abrir la aplicación: configurar correo y verificación de Neon Auth, origen de confianza, conexión Postgres exclusiva de servidor, rol de mínimo privilegio, membresías y RLS con pruebas cruzadas; después migrar los flujos clínicos y probar cifrado, firma y auditoría. El bucket privado `clinical-documents-private` no se expone al navegador.
# Desarrollo de cuentas clínicas

La versión web comparte `index.html`, `app.js`, `emr.js`, estilos e imágenes con la app nativa. `prebuild` genera dos entradas: `/clinical/` mantiene el demo sintético actual y `/workspace/` usa Neon Auth, Postgres y el bucket privado. El punto de entrada `/` seguirá en demo hasta configurar `CLINOVYRA_LIVE_AUTH_ENABLED=true` en Vercel.

El acceso web usa `@neondatabase/auth` con el proxy `/api/auth/*`. La API exige una sesión cuyo correo esté verificado. Una invitación pendiente asigna una membresía en la primera llamada a `/api/me`; el correo de propietario preparado en la migración es `Freematrix7@proton.me`. No se crea una contraseña ni una cuenta Auth con la migración. Cada alias debe registrarse y verificarse de manera independiente; el propietario puede invitarlos desde `/account`.

La API escribe solo con el rol `clinovyra_app`, nunca con el propietario de la base. Cada transacción establece `app.user_id` y `app.user_email` después de comprobar Neon Auth. `encrypted_vaults` guarda una bóveda cifrada por usuario con control de versión; `encrypted_documents` guarda referencia y hash a objetos cifrados del bucket privado. Los pacientes y notas de la web viven dentro de esa bóveda, no en las tablas antiguas `patients` y `clinical_notes`, a las que el rol web no tiene acceso. El propietario tiene todas las funciones de su propia bóveda y las invitaciones, pero no puede abrir expedientes de otros médicos.

La web requiere conexión para guardar. Un conflicto entre pestañas devuelve 409 y pide recargar. No hay recuperación automática de la llave si se olvida el PIN: antes de abrir a médicos reales se necesita diseñar y probar la recuperación cifrada, los respaldos, auditoría, retención y el flujo de recetas con validación transaccional. El demo y el espacio web en desarrollo deben usar exclusivamente datos sintéticos.

## Puesta en marcha pendiente

1. Revisar y aplicar `neon/migrations/0004_identity_vaults_documents.sql` al branch principal. Ya se preparó en un branch temporal, pero falta autorización para aplicarlo.
2. En Neon Console, activar verificación obligatoria de correo y configurar SMTP propio para producción. Actualmente Neon Auth permite altas sin verificación; la API clínica deniega esas sesiones.
3. Registrar el correo del propietario con su propia contraseña, verificarlo y reclamar la invitación desde `/api/me`.
4. Crear tres invitaciones de alias en `/account`, verificar las cuentas y probar creación, guardado, recarga, adjuntos y accesos cruzados con datos sintéticos.
5. Ejecutar la prueba de escritorio en Chromium, más pruebas de autorización/aislamiento contra la base y el bucket, antes de activar `CLINOVYRA_LIVE_AUTH_ENABLED` y admitir datos reales.
