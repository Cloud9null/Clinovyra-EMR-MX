# Clinovyra EMR MX · base comercial en preparación

Snapshot independiente del código de Clinovyra 3.6.1-rc.1. **No está autorizado para pacientes ni cuentas comerciales.** Conserva la interfaz, temas, navegación, EMR, recetas y comportamiento actual. La función preliminar `product-policy.js` permanece desactivada mediante `edition='baseline'`; sus reglas SaaS no son decisiones de producto aprobadas.

Origen: `Cloud9null/Rx-Offline-medical-prescription`, rama `feat/clinovyra-native-emr`, commit `587e616e798cea4ad3a4a63a0545cd35a247b697`. El historial de este repositorio comienza de cero; no existe remoto, fork, mirror ni sincronización automática hacia el proyecto personal.

## Estado de seguridad

La configuración Supabase del cliente está vacía. La función clínica responde 503 sin variables propias del proyecto comercial. Las apps nativas rechazan URL de verificación/API mientras no haya origen comercial. La política CSP bloquea conexiones externas por ahora. No se han copiado usuarios ni datos clínicos. El proyecto web comercial aún no debe desplegarse para uso clínico.

Los IDs nativos son marcadores distintos a la edición personal, **no IDs de distribución definitivos**. No hay CI de APK, IPA ni EXE. El repositorio público expone el código fuente, de modo que nunca se deben subir respaldos, configuraciones locales, llaves, certificados ni datos reales.

## Verificación local

`npm ci && npm test && node scripts/check-isolation.mjs`

El escaneo de aislamiento se ejecuta en CI. Las pruebas web no comprueban Face ID ni impresión física en iPhone.

Consulta [estado de separación](docs/SEPARACION.md) y [pendientes de infraestructura](supabase/README.md).
