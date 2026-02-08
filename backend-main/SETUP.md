# Backend Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- Docker Desktop (for PostgreSQL database)
- Git

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

**Important:** Update the `.env` file with your actual credentials:
- Database credentials (default values work for local development)
- JWT_SECRET (change to a secure random string)
- Razorpay keys (if you want payment features)
- SMTP credentials (if you want email features)

### 3. Start PostgreSQL Database

Using Docker Compose:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will start a PostgreSQL database on port 5432 with:
- Username: `postgres`
- Password: `postgres123`
- Database: `education_app`

**Check if database is running:**

```bash
docker ps
```

You should see `education-app-db` container running.

### 4. Start the Backend Server

```bash
npm start
```

The server will start on port 8000 and will be accessible at:
- Local: `http://localhost:8000`
- Network: `http://192.168.1.4:8000` (accessible from mobile devices on same WiFi)

### 5. Verify Setup

Open your browser and visit:
- `http://localhost:8000` - Should show "OK"
- `http://localhost:8000/api-docs` - Swagger API documentation

## Database Management

### Stop Database

```bash
docker-compose -f docker-compose.dev.yml down
```

### Stop and Remove Data

```bash
docker-compose -f docker-compose.dev.yml down -v
```

### View Database Logs

```bash
docker logs education-app-db
```

### Connect to Database

Using psql:

```bash
docker exec -it education-app-db psql -U postgres -d education_app
```

## Troubleshooting

### Database Connection Error

If you see `ECONNREFUSED ::1:5432` or `ECONNREFUSED 127.0.0.1:5432`:

1. Make sure Docker Desktop is running
2. Start the database: `docker-compose -f docker-compose.dev.yml up -d`
3. Wait 10 seconds for database to initialize
4. Restart the backend: `npm start`

### Port Already in Use

If port 8000 or 5432 is already in use:

**For port 8000 (Backend):**
- Find and kill the process using port 8000
- Or change the port in `index.js`

**For port 5432 (PostgreSQL):**
- Stop any existing PostgreSQL instances
- Or change the port in `docker-compose.dev.yml`

### Razorpay Error

If you see Razorpay initialization errors but don't need payment features:
- The backend will still start successfully
- Payment endpoints will return errors if called
- To enable payments, add real Razorpay keys to `.env`

## Environment Variables Reference

### Required

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USER` - Database username (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres123)
- `DB_NAME` - Database name (default: education_app)
- `JWT_SECRET` - Secret key for JWT tokens

### Optional

- `RAZORPAY_KEY_ID` - Razorpay API key (for payments)
- `RAZORPAY_KEY_SECRET` - Razorpay secret key (for payments)
- `SMTP_*` - Email configuration (for sending emails)
- `CANVA_*` - Canva integration (for design features)

## Production Deployment

For production deployment:

1. Use strong passwords and secrets
2. Use environment-specific `.env` files
3. Enable SSL/TLS
4. Use managed PostgreSQL service (AWS RDS, etc.)
5. Set `NODE_ENV=production`

## Support

For issues or questions, check:
- API Documentation: `http://localhost:8000/api-docs`
- Database logs: `docker logs education-app-db`
- Backend logs: Check console output
