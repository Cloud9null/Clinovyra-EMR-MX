# Clinovyra comercial · decisiones y estado

12 de octubre de 2026. Repositorio nuevo `Cloud9null/Clinovyra-EMR-MX`, sin sincronización con el personal. La organización exclusiva `CLINOVYRA` ya aloja el proyecto nuevo `lively-credit-41837058`. El proyecto provisional en `Medical_1` sigue separado y no se han copiado sus datos.

## Modelo recomendado

- Un proyecto Neon para el servicio comercial, con ramas de desarrollo y producción. Dentro de la base, cada consultorio tiene `organization_id`; usuarios, membresías y roles determinan qué expedientes puede ver un médico. Las claves compuestas de organización evitan referencias cruzadas. La aplicación necesita verificar sesiones y membresías en servidor y probar RLS con dos consultorios diferentes.
- Cada médico sin consultorio compartido puede tener una organización lógica propia. Una base física por médico sólo se consideraría ante requisitos contractuales particulares; implicaría aprovisionar, migrar y respaldar miles de bases. Nadie que se registre obtiene por ello acceso al panel de Neon ni a las credenciales Postgres. El acceso administrativo depende de miembros y claves de la organización Neon; revisar permisos y activar MFA.
- La web responsiva es la aplicación clínica principal en `web/`; los clientes Windows/Android/iOS serán opcionales y consumirán la misma API cuando esté lista. `landing/` y `web/` comparten un repositorio, con proyectos Vercel separados. Neon aloja datos y Auth, no sustituye el frontend. Los clientes nunca reciben `DATABASE_URL`.
- Demo con datos sintéticos sin cuenta para conocer la interfaz; una prueba temporal vinculada a una identidad/consultorio para evaluar el servicio real, con reloj y plan validados en servidor. No hay duración fijada aún. El acceso caduca sin cambiar la integridad ni borrar automáticamente los datos; reglas de retención y baja requieren decisión y validación.
- Lite MXN 400/mes: expediente, notas ordinarias y recetas asociadas a nota firmada. Premium MXN 600/mes: Lite más borradores de nota por IA y transcripción para revisión. No se inventan cuotas diarias ni se activan compras: faltan límites de uso, consentimiento, proveedor de pago y webhooks.

## Estado verificable

La landing Next.js es informativa, sin registro ni pagos. `web/` es una pantalla de preparación con API clínica cerrada (503). El código de los clientes nativos sigue siendo una vista de datos sintéticos, con bypass de acceso **sólo para la vista previa**. Las APIs de receta y de IA responden 503; no existe aún un SaaS clínico funcional. Las migraciones `0001`–`0003` se aplicaron en la nueva organización, sin grants ni políticas para cuentas públicas. No cargar datos clínicos reales en estos builds.

Las firmas, folios transaccionales, sincronización cifrada, auditoría inmutable, anulación, suscripción y verificación en iPhone físico siguen pendientes. Las pruebas de simulador no validan Face ID ni impresión física en iOS.
