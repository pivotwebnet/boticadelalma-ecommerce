# Contexto del Proyecto - Botica del Alma

Este documento resume los cambios realizados recientemente en el backend y los requisitos para poner en marcha el proyecto.

## Cambios en el Backend (.NET 10)

1. **Migración a PostgreSQL**: Se ha configurado el backend para utilizar **PostgreSQL** como base de datos principal.
2. **Configuración de Conexión**: La cadena de conexión está configurada en `backend/appsettings.json` apuntando a `localhost:5432` con la base de datos `boticadelalma`.
3. **Migraciones Automáticas**: Al iniciar el backend en modo `Development`, el sistema aplica automáticamente las migraciones pendientes y ejecuta un **Seed** (carga de datos inicial) si la base de datos está vacía.
4. **CORS**: Se ha habilitado una política de CORS para permitir peticiones desde el frontend (`http://localhost:3000`).
5. **Autenticación Admin**: Se han implementado las bases para la gestión de administración, incluyendo middleware y rutas de API para setup y login.

## Requisitos para el Equipo

Para que el backend funcione localmente, cada integrante debe:

1. **Instalar .NET 10 SDK**.
2. **Instalar PostgreSQL**:
   - Crear una base de datos llamada `boticadelalma`.
   - Asegurarse de que el usuario `postgres` tenga la contraseña `200427` (o actualizarla en `appsettings.json`).
3. **Correr el Backend**:
   - Se puede usar el comando `npm run backend` desde la raíz del proyecto (requiere tener `dotnet` instalado).
   - O manualmente: `cd backend && dotnet run --launch-profile http`.

## Otros Cambios
- Se eliminó la integración previa con Prisma/SQLite para centralizar la lógica en la API de .NET.
- Se agregaron hooks (`useApiData`) para facilitar el consumo de la API desde el frontend.
