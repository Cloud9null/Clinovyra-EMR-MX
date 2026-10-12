# Clinovyra comercial · avance 2026-10-12

Repositorio independiente: Cloud9null/Clinovyra-EMR-MX. Referencia inicial personal aprobada: `587e616e798cea4ad3a4a63a0545cd35a247b697`. Medivorix se revisó de solo lectura en `0dbcf2e4f30954683b91bc29d4509f0d5c4e54ef`; se adaptaron funciones concretas, sin datos, credenciales ni infraestructura personales.

## Incorporado

- Sin entrada de receta directa, plantilla manual ni asociación retrospectiva de una receta nueva. La política del cliente exige consulta y nota finalizada firmada. La API comercial responde 503; no hay emisión ni impresión de recetas nuevas hasta tener Auth, verificación criptográfica y registro transaccional en Neon.
- Notas por secciones, autoguardado y botones dentro del flujo, firma ECDSA verificable localmente, addenda, PDF de nota y resumen de expediente. Campos clínicos vacíos se omiten; el borrador vacío no se firma. El médico revisa contenido asistido por IA, separado de nota ordinaria; la IA externa está cerrada.
- Catálogo local mexicano de 10,067 entradas, búsqueda de texto/código y selección accesible; ver `CIE10_COMERCIAL.md` para procedencia, límites de cobertura y derechos pendientes.
- Perfil principal con alergias/antecedentes documentados, filtros de actividad, alta con alergias y antecedentes conservando registros existentes, búsqueda por nombre o nacimiento. Seis diseños de impresión congelados dentro del documento firmado e independientes del tema de pantalla. No se ha emitido ninguna receta comercial real.
- Neon proyecto `clinovyra-emr-mx-development`, base `clinovyra_commercial`, branch principal `br-green-paper-b53clqk5`. Migración 0002 preparada y probada en branch temporal `br-dawn-sound-b507p7mb`: un caso sintético válido, rechazos de hash ajeno, borrador y cruce de organización. **No aplicada aún a la rama principal**.
- Builds de **vista previa con datos sintéticos solamente**, ID temporal `mx.clinovyra.emr.preview`: Android debug APK, Windows portable sin firma, iOS simulador sin firma. Flujo nativo en `.github/workflows/native-preview.yml`. Ninguno representa release comercial ni prueba biometría o impresión en iPhone físico.

## Pendiente para cuentas y datos reales

Neon Auth aún deshabilitado; API de emisión responde 503, RLS conserva cero políticas/grants públicos. Falta identidad de usuario/organización, roles, acceso multi-doctor, firma verificada por servidor, sincronización cifrada, auditoría inmutable y folio transaccional, Storage, suscripción, soporte de anulación transaccional, recuperación, dominios y variables exclusivos de Vercel. Los antiguos contratos de Supabase del cliente están vacíos y no funcionan. Los PDF y QR de recetas deben probarse tras implementar la emisión segura. Validar licencia de origen OPS/OMS del índice antes de exponerlo en un servicio comercial. Identificadores y certificados finales deben definirse antes de distribuir APK/IPA/EXE firmados.

## Pruebas

`npm test` y `node scripts/check-isolation.mjs` pasaron con datos sintéticos. `npm run test:e2e` no pudo arrancar Chromium local porque el distribuidor entregó una descarga truncada; CI instala el navegador y debe reportar el resultado. Las pruebas de dispositivo físico (Face ID, impresión iPhone, teclado y rendimiento) siguen pendientes.
