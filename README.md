# Bodeum

Bodeum is a personality-analysis prototype with a React frontend and a FastAPI backend.

## Structure

- `frontend/web`: Vite + React application
- `backend`: FastAPI service
- `docs`: architecture and deployment notes
- `infrastructure/docker`: Dockerfiles, compose files, and nginx config

## Local Run

### Docker

Run from the repository root.

Development:

```bash
docker compose -f infrastructure/docker/compose.dev.yml up --build
```

Frontend is exposed at `http://localhost:3001` by default in Docker development mode.

Production-like local run:

```bash
docker compose -f infrastructure/docker/compose.yml up --build
```

### Frontend

```bash
corepack pnpm --dir frontend/web install
corepack pnpm --dir frontend/web dev
```

### Backend

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r backend/requirements/dev.txt
python backend/run.py
```

## Notes

- `.env` files are intentionally ignored and must not be committed.
- The current admin screen and reports still use demo data.
