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
- `VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1`
- `VITE_WS_BASE_URL=wss://your-backend.onrender.com/api/v1/ml/ws`
- `FASTAPI_ENV=production`
- `FASTAPI_SECRET_KEY=change-me`
- `BACKEND_CORS_ORIGINS=https://your-app.vercel.app`
- `BACKEND_CORS_ORIGIN_REGEX=^https://.*\.vercel\.app$`
- `NGINX_PORT=80`

Copy `.env.example` to `.env` and adjust values before deployment.

## Vercel + Render

Recommended free deployment split:

- Frontend: Vercel
- Backend: Render Web Service

Frontend project settings:

- Root Directory: `frontend/web`
- Framework Preset: `Vite`
- Build Command: `pnpm build`
- Output Directory: `dist`

Frontend environment variables:

- `VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1`
- `VITE_WS_BASE_URL=wss://your-backend.onrender.com/api/v1/ml/ws`

Backend project settings:

- Root Directory: `backend`
- Build Command: `pip install -r requirements/prod.txt`
- Start Command: `gunicorn --bind 0.0.0.0:$PORT -k uvicorn.workers.UvicornWorker app:app`
- Health Check Path: `/api/v1/health`

Backend environment variables:

- `FASTAPI_ENV=production`
- `FASTAPI_SECRET_KEY=<set in Render dashboard>`
- `BACKEND_CORS_ORIGINS=https://your-app.vercel.app`
- `BACKEND_CORS_ORIGIN_REGEX=^https://.*\.vercel\.app$`
