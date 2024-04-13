# URL Shortener Service

Este proyecto consiste en un servicio de acortamiento de URLs implementado con un frontend en React y un backend en Express. Utiliza Redis como almacenamiento de datos para las URLs cortas y largas.

## Tecnologías Utilizadas

- **Frontend**: React
- **Backend**: Node.js con Express
- **Base de Datos**: Redis

## Variables de Entorno

A continuación se detallan las variables requeridas para el frontend y el backend.

### Backend

Definir las siguientes variables de entorno en el sistema o en un archivo `.env` dentro de la carpeta `backend`:

- `BASE_URL`: URL base utilizada por el backend, por ejemplo, `http://localhost:3010`.
- `PORT`: Puerto en el que se ejecuta el servidor backend, por ejemplo, `3010`.

### Frontend

Para el frontend, definir esta variable de entorno en tu sistema o en un archivo `.env` dentro de la carpeta `frontend`:

- `REACT_APP_API_URL`: URL base del backend para las peticiones del frontend, por ejemplo, `http://localhost:3010`.

Para ejecutar este proyecto, necesitarás tener instalado:
- Node.js
- npm o yarn
- Redis
