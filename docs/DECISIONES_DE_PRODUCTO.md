# Clinovyra comercial · decisiones y estado

12 de octubre de 2026. Repositorio nuevo `Cloud9null/Clinovyra-EMR-MX`, sin sincronización con el personal. `Medical_1` aloja un proyecto de desarrollo provisional aislado por proyecto, pero comparte el panel administrativo. La organización definitiva se llamará **Clinovyra**.

## Modelo recomendado

- Un proyecto Neon para el servicio comercial, con ramas de desarrollo y producción. Dentro de la base, cada consultorio tiene `organization_id`; usuarios, membresías y roles determinan qué expedientes puede ver un médico. Las claves compuestas de organización evitan referencias cruzadas. La aplicación necesita verificar sesiones y membresías en servidor y probar RLS con dos consultorios diferentes.
- Cada médico sin consultorio compartido puede tener una organización lógica propia. Una base física por médico sólo se consideraría ante requisitos contractuales particulares; implicaría aprovisionar, migrar y respaldar miles de bases. Nadie que se registre obtiene por ello acceso al panel de Neon ni a las credenciales Postgres. El acceso administrativo depende de miembros y claves de la organización Neon; revisar permisos y activar MFA.
- Web responsiva para altas, sesiones, soporte y trabajo desde un navegador, más clientes Windows/Android/iOS que consuman la misma API. La landing y el EMR usan proyectos Vercel separados. Neon aloja datos y Auth, no sustituye el frontend. Los clientes nativos nunca reciben `DATABASE_URL`.
- Demo con datos sintéticos sin cuenta para conocer la interfaz; una prueba temporal vinculada a una identidad/consultorio para evaluar el servicio real, con reloj y plan validados en servidor. No hay duración fijada aún. El acceso caduca sin cambiar la integridad ni borrar automáticamente los datos; reglas de retención y baja requieren decisión y validación.
- Lite MXN 400/mes: expediente, notas ordinarias y recetas asociadas a nota firmada. Premium MXN 600/mes: Lite más borradores de nota por IA y transcripción para revisión. No se inventan cuotas diarias ni se activan compras: faltan límites de uso, consentimiento, proveedor de pago y webhooks.

## Estado verificable

La landing Next.js es informativa, sin registro ni pagos. El código de la aplicación nativa sigue siendo una vista de datos sintéticos, con bypass de acceso **sólo para la vista previa**. Las APIs de receta y de IA responden 503; no puede afirmarse que exista un SaaS funcional. La estructura SQL no tiene grants ni políticas para cuentas públicas. No cargar datos clínicos reales en estos builds. La migración del proyecto provisional a Clinovyra se efectuará como esquema limpio una vez exista `org_id` de la nueva organización.

Las firmas, folios transaccionales, sincronización cifrada, auditoría inmutable, anulación, suscripción y verificación en iPhone físico siguen pendientes. Las pruebas de simulador no validan Face ID ni impresión física en iOS.
