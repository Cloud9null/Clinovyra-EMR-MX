# Clinovyra EMR MX · edición comercial en desarrollo

Repositorio independiente de Clinovyra. Snapshot inicial del commit personal aprobado `587e616e798cea4ad3a4a63a0545cd35a247b697`, con historial Git nuevo. Medivorix se consultó como referencia técnica y visual; las mejoras se adaptan a **Clinovyra**. Este código y los builds de vista previa son **solo para datos sintéticos** y no admiten cuentas comerciales ni atención de pacientes.

La receta directa y la plantilla manual no forman parte de la edición comercial. Una receta nueva requiere consulta y nota finalizada y firmada; la API de emisión y anulación está cerrada (503) hasta integrar identidad, permisos y transacción de Neon. Ningún servidor personal recibe solicitudes de esta copia. El cliente conserva contratos antiguos de Supabase sin URL ni llave y sin sincronización operativa.

- Neon desarrollo: `clinovyra-emr-mx-development`, base `clinovyra_commercial`. La migración `0002` se probó con datos sintéticos en una rama temporal y todavía no se ha aplicado a la rama principal.
- CI comercial: pruebas en `.github/workflows/ci.yml`; builds de vista previa Android, Windows e iOS simulador en `.github/workflows/native-preview.yml`. El ID temporal `mx.clinovyra.emr.preview` y los paquetes de prueba no son identidades ni firmas finales.
- Verificación local: `npm ci && npm test && node scripts/check-isolation.mjs`. E2E: `npm run test:e2e` con Chromium de Playwright instalado.

Consulta [avance, límites y pruebas](docs/AVANCE_COMERCIAL.md), [catálogo CIE-10](docs/CIE10_COMERCIAL.md), [aislamiento](docs/SEPARACION.md) y [Neon](neon/README.md).
