# CRUD Productos API

Este proyecto es una API en NestJS para manejar productos. 

## Tecnologías que usa
- NestJS para la lógica del servidor
- TypeORM para hablar con PostgreSQL
- PostgreSQL como base de datos
- Docker para empacar y correr la app sin instalar dependencias manuales

## Cómo correrlo en mi máquina
1. Tener Node 18+, npm y una base PostgreSQL. Yo lo arranco con Docker usando:
   ```bash
   docker run --name productos-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=products -p 5432:5432 -d postgres:16
   ```
2. Copiar el archivo `.env.example` a `.env` y ajustar datos si hace falta.
3. Instalar dependencias: `npm install`
4. Levantar Nest en modo desarrollo: `npm run start:dev`
5. Los endpoints quedan disponibles en `http://localhost:3000/products`

## Correrlo con Docker
1. Asegurar que la base está disponible desde el contenedor. En Windows uso `host.docker.internal` para apuntar a Postgres local, por eso dejo el archivo `.env.docker` listo.
2. Construir la imagen: `docker build -t productos-api .`
3. Ejecutar la imagen: `docker run --rm -d --env-file .env.docker -p 5000:3000 productos-api`
4. Probar la API en `http://localhost:5000/products`

## Estructura rápida
- `src/app.module.ts` carga la configuración y conecta TypeORM usando variables de entorno.
- `src/products` contiene el módulo, controlador, servicio y la entidad `Product`.
- `src/main.ts` aplica un `ValidationPipe` global y agrega un pequeño polyfill para `crypto` porque la librería `pg` lo necesita cuando estamos dentro de Docker.

## Pruebas
- Corre `npm test` para validar el servicio de productos. Dejo un test sencillo que asegura que `create` usa bien el repositorio mockeado.

## Decisiones principales
- `synchronize` está en `true` solo para desarrollo; lo puse como variable (`DB_SYNCHRONIZE`) para poder apagarlo en producción.
- Guardo `.env`, `.env.docker` y `.env.example` para no perder las configuraciones básicas.
- El Dockerfile es multi-stage: primero construye con todas las dependencias y luego la imagen final solo trae lo necesario para correr.

## Próximos pasos que consideré
- Agregar más pruebas unitarias y una colección de Postman.
- Cambiar `synchronize` a `false` y manejar migraciones reales.
- Añadir Swagger para documentar los endpoints.