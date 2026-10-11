# Estado de separación comercial

## Fuente y alcance

Snapshot del commit `587e616e798cea4ad3a4a63a0545cd35a247b697` de `feat/clinovyra-native-emr`. Se copiaron las fuentes de interfaz, EMR, recetas, firma/QR, bóveda local cifrada, sincronización, endpoint de borrador clínico, pruebas y recursos visuales. Se conservó el comportamiento de la edición personal como línea base sin activar las reglas preliminares SaaS.

Se omitieron instrucciones históricas y notas de despliegue personales, workflows de instalables y migraciones incrementales acopladas a tablas preexistentes. No se copió el historial Git ni archivos ignorados o datos de ninguna base. El origen personal está en pruebas físicas de iPhone; Face ID e impresión iOS quedan sin verificar.

## Cambios para el aislamiento

- Supabase del cliente queda vacío; el endpoint servidor no tiene fallback al proyecto personal y falla cerrado.
- Origen web nativo de verificación y API vacío hasta crear el deployment comercial.
- CSP web y Electron limitada a conexiones propias mientras se aprovisiona el backend.
- Sin universidad ni domicilio de médico precargados; campos de perfil vacíos.
- Almacenamiento IndexedDB, sesión local, servicio biométrico y caché con nombres nuevos; Windows tiene perfil de aplicación separado y host local distinto.
- Capacitor y Electron tienen identificadores provisionales distintos. CI solo ejecuta pruebas; no distribuye instalables.
- Se creó el proyecto Vercel independiente `clinovyra-emr-mx` (`prj_hVfrkhpoiGmQHTvi2xmxHcF1OgSK`) sin conexión Git ni deployment. No se modificó la producción personal.

## Bloqueos antes de cuentas o atención clínica

1. Crear proyecto Supabase comercial en la organización elegida y extraer **solo esquema** del proyecto personal por vía de solo lectura. Reconstruir migración inicial limpia: las migraciones heredadas no crean las tablas base ni funciones legacy y una de ellas autoriza automáticamente al único usuario existente. Nunca aplicar estas migraciones de forma aislada o copiar filas.
2. Definir propietarios, organizaciones, membresías, roles y sus límites. Auditar toda función `SECURITY DEFINER`, grants, RLS, referencias compuestas por tenant, Storage, autenticación y revocación de sesiones. La allowlist personal de un solo propietario no permite altas SaaS. Probar cruces entre dos usuarios/organizaciones sintéticos.
3. Revisar el alcance de cifrado: la bóveda local y algunos objetos son cifrados, mientras el JSON clínico sincronizado, perfil y metadatos requieren una evaluación de protección y acceso en el servidor. Revisar auditoría, inmutabilidad de notas y folios con transacciones e índices únicos por ámbito.
4. Resolver el QR público que puede contener datos del paciente en un paquete autocontenido, la revocación/expiración y minimización de la vista de verificación.
5. Conectar Supabase comercial, claves publicables y CSP exacta, y crear/probar proyecto Vercel comercial con variables propias. Comprobar tráfico end to end con datos sintéticos y cero peticiones al entorno personal.
6. Definir políticas comerciales, IDs permanentes Android/iOS/Windows y certificados exclusivos, probar Face ID/impresión en hardware real, y solo después producir instalables.

El código de esta etapa es una base aislada en repositorio; no es un SaaS operativo ni apto para pacientes.
