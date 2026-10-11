# Supabase comercial: aprovisionamiento pendiente

No hay migraciones aplicables aún. Los archivos SQL incrementales del proyecto personal estaban acoplados a tablas y RPC anteriores que no constan como migración completa en el commit fuente. Se retiraron para impedir ejecuciones incompletas o el alta automática de una cuenta personal como propietario.

Tras elegir organización, crear un proyecto independiente y obtener únicamente el DDL de esquema, RLS, funciones, triggers y Storage (sin filas de `auth.users` ni datos clínicos). Reconstruir una migración inicial revisada y pruebas con usuarios sintéticos en el proyecto comercial. Mantener la URL/clave del cliente y las variables `RX_SUPABASE_URL`/`RX_SUPABASE_PUBLISHABLE_KEY` del servidor sin configurar hasta completar esa revisión.
