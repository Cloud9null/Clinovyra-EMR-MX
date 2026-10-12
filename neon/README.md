# Neon comercial de desarrollo

Proyecto nuevo: `clinovyra-emr-mx-development` (`still-tooth-53394839`), base `clinovyra_commercial`, organización actual `Medical_1`. Fue creado el 11 de octubre de 2026 en la cuenta Neon conectada. No comparte base, Auth, Storage ni credenciales con los otros proyectos de esa organización. Comparte la administración de la organización: si se desea separar también propietarios, facturación y permisos administrativos, habrá que trasladar/provisionar un proyecto en una organización comercial exclusiva.

Se aplicó `migrations/0001_commercial_foundation.sql` al proyecto de desarrollo. Ocho tablas tienen RLS `ENABLE` y `FORCE`, cero políticas y ningún permiso público: el acceso está cerrado. Se crearon únicamente tablas, claves, índices y restricciones; no se copiaron usuarios, datos personales ni datos clínicos. El bucket `clinical-documents-development` está vacío y es privado.

Se inspeccionó Neon Auth (Better Auth), pero su configuración inicial permitía registro por correo sin verificación. Se desactivó la integración sin borrar sus datos antes de admitir cuentas; se configurará junto con la API y controles de acceso. El frontend no tiene conexión a Neon. Nunca se debe poner una cadena de conexión Postgres en `index.html`, `supabase-config.js` o variables `VITE_` públicas.

## Siguiente integración

1. Integrar Neon Auth y validar tokens en una API comercial confiable. Emitir sesiones, altas y bajas, y mapear cada usuario a membresías de organización.
2. Implementar autorización en servidor y permisos RLS de mínimo privilegio. Probar con dos médicos en dos organizaciones sintéticas, un asistente sin permisos de firma y un usuario suspendido. Validar también cada paciente/consulta/nota/receta por claves compuestas de organización.
3. Migrar cliente `cloud.js`, `emr.js`, `api/clinical-note.js` y recuperación de bóveda desde contratos Supabase a contratos propios para Neon. Definir cifrado, documentos en Storage, colas offline, sincronización, auditoría inmutable, folios transaccionales y revocación. No basta cambiar la URL de base de datos.
4. Probar restauración y respaldos fuera del proveedor. La ventana instantánea de restauración gratuita es corta; acordar retención antes de datos reales. Configurar el proyecto comercial Vercel y sus variables exclusivamente después de revisar API y Auth.
5. Registrar proveedor de cobro, verificar webhooks en servidor y vincular el estado de suscripción a la organización. Neon no cobra ni limita el número de suscripciones de Clinovyra por sí solo.

**Solo desarrollo con datos sintéticos.** Este esquema inicial no autoriza altas ni atención clínica.

## Organización exclusiva Clinovyra

La conexión actual sólo permite listar organizaciones y crear proyectos; no ofrece crear una organización ni trasladar proyectos. La cuenta conectada muestra únicamente `Medical_1`. Tras crear en Neon Console la organización **Clinovyra**, usar su `org_id` para crear `clinovyra-emr-mx-development` dentro de ella. Aplicar en orden las migraciones `0001`, `0002`, `0003` a un proyecto nuevo y vacío. Verificar en la nueva organización con datos sintéticos y después retirar el proyecto de desarrollo anterior siguiendo una revisión explícita. No se migrarán usuarios, pacientes, notas, recetas, almacenamiento ni claves del proyecto personal ni del proyecto provisional. La migración 0002 preparada en la rama temporal del proyecto provisional sigue sin aplicarse a main.

`0003_trial_and_plans.sql` sólo crea la estructura de planes Lite/Premium y fechas de prueba. No habilita altas, pagos ni IA. La duración del demo, elegibilidad de una sola prueba, pagos y webhooks requieren servicio confiable e instrucciones de producto. `api/commercial-access.js` especifica decisiones de autorización para futuras rutas; no sustituye Auth ni políticas RLS reales.
