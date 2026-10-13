# Clinovyra — camino verificable al lanzamiento comercial

Estado al 13 de octubre de 2026. Repositorio único `Cloud9null/Clinovyra-EMR-MX`; proyectos Vercel `clinovyra-emr-mx` (`web/`) y `clinovyra-emr-mx-landing` (`landing/`); base Neon `clinovyra_commercial` en la organización CLINOVYRA. Las dos interfaces tienen marca Clinovyra. El acceso principal web todavía abre un demo sintético.

## Entregado y verificado

- Landing con la marca y planes propuestos Lite $400 MXN y Premium $600 MXN. No tiene checkout ni altas de pago; lo dice expresamente.
- Neon Auth provisionado; rutas de registro, inicio y verificación; invitación pendiente para `Freematrix7@proton.me`; API que exige sesión con correo verificado. Esa cuenta Auth todavía no existe.
- Migración 0004 aplicada en `main`: invitaciones, membresías, bóvedas cifradas por identidad y metadatos de adjuntos, con RLS forzada.
- Flujo web de bóveda cifrada y adjuntos en bucket privado preparado. Las pruebas automatizadas de lógica local pasan. No se ha probado de extremo a extremo con cuentas Auth y Storage reales.
- Se descubrió que el rol `clinovyra_app` creado por API hereda `neon_superuser` y `BYPASSRLS`. La API desplegada rechaza ese rol y responde 503; `CLINOVYRA_LIVE_AUTH_ENABLED` permanece desactivado.
- Migración 0005 preparada y ensayada en rama temporal: `clinovyra_runtime` carece de BYPASSRLS, no lee tablas clínicas antiguas; las invitaciones y el acceso aislado de dos cuentas sintéticas pasaron. Todavía no está aplicada en `main`.

## Etapa 1 — habilitar prueba cerrada solo con datos ficticios

1. Aplicar 0005 a `main`; dar LOGIN y una contraseña aleatoria al nuevo rol; actualizar `DATABASE_URL` de producción y preview en Vercel; redeploy. Invalidar o retirar el rol privilegiado anterior. Comprobar en la conexión real `current_user`, `rolbypassrls=false` y privilegios sobre tablas antiguas denegados.
2. Configurar Neon Auth con SMTP de producción, registro controlado, verificación obligatoria de correo y orígenes autorizados. Hoy el proyecto permite alta sin verificación y SMTP compartido; el rechazo en API es una defensa adicional.
3. Crear y verificar la cuenta Auth de propietario con `Freematrix7@proton.me`, reclamar su invitación. Crear tres invitaciones para alias y verificar las tres cuentas. No reutilizar la identidad de otra aplicación.
4. Probar navegador de escritorio y móvil: registro, sesión, cierre, recuperación, creación/edición/recarga de pacientes, consultas, notas y adjuntos; dos sesiones separadas, lectura/escritura cruzada denegada por API, RLS y Storage. Medir errores y guardar evidencia. Mantener datos exclusivamente sintéticos.

## Etapa 2 — aptitud para datos clínicos reales

1. Separar claramente demo público sintético, pruebas privadas y producción. Evitar una cuenta compartida y que cualquier registro abierto obtenga una organización clínica.
2. Diseñar recuperación de clave del cifrado con pérdida de PIN, respaldos restaurables, retención y exportación por médico; el modelo actual no puede recuperar una bóveda cuando se olvida el PIN.
3. Auditoría de accesos y cambios, consentimiento/aviso de privacidad, control de acceso, incidentes, firma y validación transaccional de nota/receta, y revisión normativa mexicana del expediente por asesor competente. No prometer firma/receta comercial hasta que el servidor imponga el flujo.
4. Revisar límites de archivos, fallos parciales entre Storage y base, malware de adjuntos, rate limiting, monitoreo, recuperación ante desastre y pruebas de restauración.
5. Solo entonces habilitar `CLINOVYRA_LIVE_AUTH_ENABLED=true` y aceptar expedientes reales gradualmente.

## Etapa 3 — suscripciones y landing de cobro

1. Aprobar precio final, impuestos, moneda, periodos, condiciones de prueba, cancelación, facturación y disponibilidad de Premium. Los $400/$600 MXN actuales son propuestas y las funciones de IA aún no están listas.
2. Crear cuenta propia del procesador de pagos y productos/precios; integrar Checkout/portal y webhooks firmados. Persistir `provider_customer_id`, `provider_subscription_id`, estado y periodos en `subscription_accounts`; idempotencia y conciliación. Nunca aceptar un estado `active` enviado por el cliente ni confiar solo en la redirección de éxito.
3. Autorizar en API el plan y la fecha vigentes: trial acotado, activo, vencido, impago, cancelado. El acceso a exportación de datos propios debe tener una política explícita al terminar la suscripción.
4. Convertir CTA de landing en alta/checkout y publicar condiciones reales. Ejecutar sandbox de pagos con éxito, rechazo, renovación, reintento, cancelación, webhook repetido y devolución; luego realizar un pago real de bajo importe y conciliar el extracto antes de marketing.

## Dominio y aplicaciones

Registrar `clinovyra.com` a nombre del propietario, con 2FA, renovación automática y privacidad WHOIS. Apuntar `clinovyra.com`/`www` a la landing y `app.clinovyra.com` al proyecto web, verificar TLS y redirecciones, actualizar orígenes de Auth, cookies, callbacks de pagos, enlaces de correos y analítica. El dominio aún no está comprado ni configurado.

La web sigue siendo la fuente funcional principal. Windows y Android pueden reutilizar la interfaz y la API después de estabilizar seguridad, sincronización, actualización/distribución y pruebas en cada plataforma. El empaquetado no sustituye las pruebas del servicio web.

## Criterio para decir «listo para vender»

Dos cuentas médicas aisladas pasan pruebas automáticas y manuales; datos cifrados y recuperables; flujo clínico y firma validados; cobro real y webhooks conciliados; términos/privacidad publicados; dominio y correo propios configurados; plan comercial de Vercel; monitoreo, respaldos y restauración comprobados. Ningún punto se considera aprobado por la mera compilación o por mostrar una pantalla.
