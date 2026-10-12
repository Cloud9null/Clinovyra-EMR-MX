# Neon comercial de Clinovyra — 12 de octubre de 2026

La organización exclusiva `CLINOVYRA` (`org-wispy-wave-38784850`) contiene el proyecto nuevo `clinovyra-emr-mx-development` (`lively-credit-41837058`), base `clinovyra_commercial`, región `aws-us-east-2`, rama principal `br-morning-rice-b4rwprws`. Configuración inicial de cómputo: 0.25–1 CU y suspensión tras 300 segundos de inactividad. Es independiente del proyecto provisional `still-tooth-53394839` de `Medical_1` y no se copiaron pacientes, usuarios ni credenciales.

Las migraciones `0001`, `0002` y `0003` se aplicaron a la rama principal el 12 de octubre de 2026. Las ocho tablas `clinovyra` tienen RLS habilitada y forzada, sin políticas ni permisos públicos. La tabla de organizaciones estaba vacía al verificar. Se creó una rama `schema-validation-20261012` (`br-divine-star-b4rj2aab`) para probar con dos organizaciones y pacientes sintéticos: una receta válida pasó, y relaciones entre organizaciones o con hash de nota ajeno fueron rechazadas. Esos registros de prueba sólo están en dicha rama. No se debe usar la rama de prueba como fuente de datos de producción.

Neon Auth quedó **provisionado**, con tablas en `neon_auth`, sin cuentas de usuarios. El estado inicial informado por Neon permite registro y no exige verificar correo; el conector disponible no permite cambiar esas opciones. Su URL de servicio es `https://ep-billowing-resonance-b43vueq1.neonauth.c-6.us-east-2.aws.neon.tech/clinovyra_commercial/auth`, pero la aplicación pública no está conectada a ese servicio. Hay un bucket privado `clinical-documents-private`, vacío al crear. Neon Functions, AI Gateway y Data API no están conectados a la aplicación.

**Estado de seguridad:** no habilitar altas públicas ni atención real. Configurar SMTP, verificación obligatoria de correo, orígenes de confianza y política de invitación desde Neon Console antes de conectar el frontend. La protección clínica exige además sesiones verificadas en servidor, membresías por organización, rol Postgres de mínimo privilegio, políticas RLS probadas con dos cuentas, cifrado y recuperación de claves, auditoría, firma y controles de recetas. Las claves SQL y Auth sólo pertenecen al servidor.

El intento de desactivar temporalmente Neon Auth en main sin borrar datos fue rechazado por la revisión automática por ser un cambio persistente de seguridad contrario al objetivo de autenticación multiusuario sin autorización explícita para retirarla. Se dejó provisionado pero sin frontend, y no se intentó eludir esa decisión. Ajustar directamente la configuración de Auth es el siguiente paso antes de activar registro.

## Despliegue desde un solo repositorio

`Cloud9null/Clinovyra-EMR-MX` es la única fuente. Dos proyectos Vercel apuntarán al mismo `main`: Root Directory `landing` para la página pública y Root Directory `web` para la app. Neon es el backend; su Storage privado guardará documentos. El código heredado de raíz conserva contratos Supabase vacíos y no constituye una API comercial conectada.

Las tablas existentes son una base estructural; `encrypted_record`/`encrypted_note` son columnas reservadas para una implementación revisada del cifrado, no una prueba de que los datos ya estén cifrados. `api/commercial-access.js` contiene una regla pura, pero no realiza consultas, validación de sesión ni autorización efectiva.
