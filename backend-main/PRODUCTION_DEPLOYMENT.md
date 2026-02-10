# Production Deployment (Docker Compose)

Your production API (`https://api.taiyarineetki.com`) is running via Docker Compose using this image:

- `kartarenterprises/apps:tyari-neet-ki-backend-release1` (see `backend-main/docker-compose.yml`)

If the app shows `Cannot POST /api/v1/subscriptions/iap/apple`, it means production is still on an older backend image that does not include the Apple IAP endpoint.

## Option A: Deploy By Rebuilding And Pushing The Docker Image

Prerequisites:
- Docker installed on the machine doing the build (your server or a CI runner).
- Push access to the Docker Hub repo `kartarenterprises/apps`.

Build and push (from the repo root):

```bash
cd backend-main
docker build -t kartarenterprises/apps:tyari-neet-ki-backend-release1 .
docker push kartarenterprises/apps:tyari-neet-ki-backend-release1
```

Then, on the server where Docker Compose runs:

```bash
cd /path/to/backend-main
docker compose pull api
docker compose up -d --force-recreate api
docker compose logs -n 200 -f api
```

Quick verification (should return `401` without token, not `404`):

```bash
curl -i -X POST https://api.taiyarineetki.com/api/v1/subscriptions/iap/apple
```

## Option B: Deploy Using GitHub Actions (Recommended)

This repo contains a workflow that can build and push the backend image on every push to `main`:

- `.github/workflows/backend-dockerhub.yml`

Steps:
1. In GitHub repo settings, add secrets:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
2. Push to `main` (or run the workflow manually from the Actions tab).
3. On the server, run:

```bash
cd /path/to/backend-main
docker compose pull api
docker compose up -d --force-recreate api
```

## Required Environment Variables (Server)

In production, ensure `backend-main/.env` contains:
- `JWT_SECRET`
- DB settings (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)

Apple IAP verification:
- `APPLE_SHARED_SECRET` (only required for auto-renewable subscriptions)
- `APPLE_BUNDLE_ID` (recommended)

