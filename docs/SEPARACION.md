# Estado de separación comercial

## Fuente y alcance

Snapshot del commit `587e616e798cea4ad3a4a63a0545cd35a247b697` de `feat/clinovyra-native-emr`. Se copiaron las fuentes de interfaz, EMR, recetas, firma/QR, bóveda local cifrada, sincronización, endpoint de borrador clínico, pruebas y recursos visuales. La primera copia conservó el comportamiento personal. Después se eliminó el módulo de recetas manuales y se bloqueó la impresión electrónica hasta contar con confirmación comercial en servidor; la política comercial exige consulta y nota finalizada y firmada; la emisión sigue cerrada en el servidor.

Se omitieron instrucciones históricas y notas de despliegue personales, workflows de instalables y migraciones incrementales acopladas a tablas preexistentes. No se copió el historial Git ni archivos ignorados o datos de ninguna base. El origen personal está en pruebas físicas de iPhone; Face ID e impresión iOS quedan sin verificar.

## Cambios para el aislamiento

- Supabase del cliente queda vacío; el endpoint servidor no tiene fallback al proyecto personal y falla cerrado.
- Origen web nativo de verificación y API vacío hasta crear el deployment comercial.
- CSP web y Electron limitada a conexiones propias mientras se aprovisiona el backend.
- Sin universidad ni domicilio de médico precargados; campos de perfil vacíos.
- Almacenamiento IndexedDB, sesión local, servicio biométrico y caché con nombres nuevos; Windows tiene perfil de aplicación separado y host local distinto.
- Capacitor y Electron usan el identificador temporal de vista previa `mx.clinovyra.emr.preview`. CI genera artefactos de prueba sin firma de distribución.
- Un informe anterior registró `clinovyra-emr-mx` (`prj_hVfrkhpoiGmQHTvi2xmxHcF1OgSK`) sin Git ni deployment. La cuenta Vercel personal conectada ahora no lo encuentra en el equipo consultado; no se atribuye una URL a Clinovyra. No se modificó la producción personal.

## Etapa actual: Neon, landing y app web

- El proyecto `still-tooth-53394839` de `Medical_1` fue provisional. El proyecto definitivo de desarrollo `lively-credit-41837058` está en `CLINOVYRA`: ocho tablas vacías en main, RLS forzada, cero políticas ni grants públicos, migraciones `0001`–`0003`, bucket privado y Neon Auth provisionado. Auth permite por defecto registro sin correo verificado; no hay frontend conectado. Ver `neon/README.md`.
- La app aún usa contratos Supabase para Auth, sincronización, documentos, recuperación y API; el cliente sigue sin credenciales y falla cerrado. Migrar a Neon requiere rehacer esos contratos y verificar aislamiento real.
- Se retiraron interfaz, PDF, folios manuales, estilos, precaché y pruebas del talonario. El formato de respaldos se distingue de la edición personal; el formato anterior se rechaza. La impresión de recetas electrónicas requiere red, backend configurado, acceso validado y confirmación comercial, que todavía no se emite.
- `landing/` contiene la landing Next.js informativa y `web/` contiene el nuevo portal web en preparación, ambos del mismo repositorio. `marketing/` es una versión conceptual anterior. Ninguno recibe datos clínicos reales.

## Bloqueos antes de cuentas o atención clínica

1. Neon fue elegido como backend. Falta migrar el cliente y revisar los datos clínicos, costos y operación antes de admitir usuarios.
2. Definir propietarios, organizaciones, membresías, roles y sus límites. Auditar toda función `SECURITY DEFINER`, grants, RLS, referencias compuestas por tenant, Storage, autenticación y revocación de sesiones. La allowlist personal de un solo propietario no permite altas SaaS. Probar cruces entre dos usuarios/organizaciones sintéticos.
3. Revisar el alcance de cifrado: la bóveda local y algunos objetos son cifrados, mientras el JSON clínico sincronizado, perfil y metadatos requieren una evaluación de protección y acceso en el servidor. Revisar auditoría, inmutabilidad de notas y folios con transacciones e índices únicos por ámbito.
4. Resolver el QR público que puede contener datos del paciente en un paquete autocontenido, la revocación/expiración y minimización de la vista de verificación.
5. Conectar Neon comercial mediante API autenticada, variables privadas y CSP exacta, y probar el proyecto Vercel comercial con variables propias. Comprobar tráfico end to end con datos sintéticos y cero peticiones al entorno personal.
6. Completar las políticas comerciales, IDs permanentes Android/iOS/Windows y certificados exclusivos, probar Face ID/impresión en hardware real, y solo después producir instalables.

El código de esta etapa es una base aislada en repositorio; no es un SaaS operativo ni apto para pacientes.
