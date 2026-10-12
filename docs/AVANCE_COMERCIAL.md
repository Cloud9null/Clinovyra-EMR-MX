# Clinovyra comercial · avance 2026-10-12

Repositorio único: `Cloud9null/Clinovyra-EMR-MX`. La landing Next.js vive en `landing/`; el nuevo portal web del expediente en `web/`; el cliente clínico anterior permanece en la raíz para migrar sus flujos. El portal web muestra el estado de preparación y su API clínica responde 503. No hay URL Vercel de Clinovyra verificada ni aplicación clínica operativa.

La organización Neon `CLINOVYRA` ya tiene el proyecto `lively-credit-41837058`, base `clinovyra_commercial`, las migraciones `0001`–`0003` en main, Neon Auth provisionado y bucket privado. Las tablas no tienen políticas RLS de acceso ni datos reales. La prueba de aislamiento relacional con dos consultorios sintéticos se realizó en una rama separada. Ver `neon/README.md` para identificadores y riesgos.

La landing actual presenta planes propuestos Lite MXN 400 y Premium MXN 600 sin contratar. La app web es el destino principal futuro; Windows, iOS y Android serán clientes opcionales. La estructura objetivo conserva una sola base de código en GitHub con dos despliegues Vercel, no dos repositorios.

## Lo que falta antes de pacientes reales

1. Configurar Neon Auth: SMTP, verificación de correo, alta controlada y orígenes de confianza. Integrar sesiones en el servidor y crear membresías al dar de alta cada consultorio.
2. Crear un rol Postgres para la API con permisos mínimos y políticas RLS comprobadas con dos médicos, asistente y usuario suspendido; exigir organización en cada consulta y escritura.
3. Migrar el expediente, notas, recetas y sincronización heredados a la API comercial. Definir cifrado, custodia de claves, firmas verificadas en servidor, auditoría, backups y restauración; probar la emisión de recetas desde una consulta y nota finalizada.
4. Integrar cobros y estados Lite/Premium por webhook confiable; fijar reglas de prueba. La estructura SQL no crea suscripciones reales.
5. Vincular dos proyectos Vercel Pro desde el mismo repositorio (`landing/` y `web/`), configurar sólo secretos de servidor para la app, conectar dominios y probar el flujo completo antes de publicarlo para pacientes.

Las vistas y paquetes nativos previos son previsualizaciones con datos sintéticos. No hay un release comercial firmado.
