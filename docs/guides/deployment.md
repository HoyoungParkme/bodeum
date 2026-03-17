# Deployment

## Containers

- `backend`: FastAPI application served by `gunicorn` with `uvicorn` workers
- `nginx`: serves the built frontend and proxies `/api/*` to `backend`
- `frontend` (dev only): Vite development server with proxy to `backend`

## Development

Run the development stack:

Run from the repository root.

```bash
docker compose -f infrastructure/docker/compose.dev.yml up --build
```

Endpoints:

- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:8000/api/v1`

## Production-like local run

Run the deployment stack:

```bash
docker compose -f infrastructure/docker/compose.yml up --build -d
```

Endpoints:

- App entrypoint: `http://localhost`
- Health check: `http://localhost/api/v1/health`

## Environment variables

Core variables:

- `BASE_PATH=/`
- `VITE_API_BASE_URL=/api/v1`
- `FASTAPI_ENV=production`
- `FASTAPI_PORT=8000`
- `FASTAPI_SECRET_KEY=change-me`
- `NGINX_PORT=80`

Copy `.env.example` to `.env` and adjust values before deployment.
