# Database Setup Guide

You have **two options** to set up the PostgreSQL database:

---

## Option 1: Using Docker (Recommended)

### Prerequisites
- Docker Desktop must be installed

### Install Docker Desktop

1. Download Docker Desktop for Windows:
   - Visit: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"
   - Run the installer

2. After installation:
   - Restart your computer
   - Open Docker Desktop
   - Wait for it to start (you'll see a whale icon in system tray)

### Start Database with Docker

```bash
cd "C:/Users/HP/OneDrive/Desktop/App Education/mobile-app-main/backend-main"

# Use the newer Docker Compose command (without hyphen)
docker compose -f docker-compose.dev.yml up -d
```

### Verify Database is Running

```bash
docker ps
```

You should see `education-app-db` container running.

### Stop Database

```bash
docker compose -f docker-compose.dev.yml down
```

---

## Option 2: Install PostgreSQL Locally (Alternative)

If you don't want to use Docker, install PostgreSQL directly on Windows.

### Step 1: Download PostgreSQL

1. Visit: https://www.postgresql.org/download/windows/
2. Download the installer (PostgreSQL 15 or higher)
3. Run the installer

### Step 2: Installation Settings

During installation, use these settings:
- **Port:** 5432 (default)
- **Password:** `postgres123` (or choose your own)
- **Locale:** Default

### Step 3: Create Database

After installation, open **pgAdmin** (installed with PostgreSQL):

1. Connect to PostgreSQL server
2. Right-click on "Databases"
3. Create → Database
4. Name: `education_app`
5. Click "Save"

### Step 4: Update Backend .env

If you used a different password, update `backend-main/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here  # Change if different
DB_NAME=education_app
```

---

## Verify Database Connection

After setting up the database (either option), test the connection:

### Start Backend Server

```bash
cd "C:/Users/HP/OneDrive/Desktop/App Education/mobile-app-main/backend-main"
npm start
```

**Success Output:**
```
✅ Razorpay initialized successfully (or warning if keys not added)
Server is running on port 8000 and accessible from network
Local: http://localhost:8000
Network: http://192.168.1.4:8000
```

**If you see database connection errors:**
- Check that PostgreSQL is running
- Verify credentials in `.env` file
- Check port 5432 is not blocked by firewall

---

## Troubleshooting

### Docker Issues

**"docker: command not found"**
- Docker Desktop is not installed
- Or Docker Desktop is not running
- Or Docker is not in system PATH

**Solution:**
1. Install Docker Desktop
2. Restart computer
3. Open Docker Desktop and wait for it to start
4. Try the command again

### PostgreSQL Issues

**"Connection refused"**
- PostgreSQL service is not running
- Check Windows Services → PostgreSQL should be running
- Or start it manually from pgAdmin

**"Authentication failed"**
- Wrong password in `.env` file
- Update `DB_PASSWORD` in `.env` to match your PostgreSQL password

**"Database does not exist"**
- Create the database using pgAdmin
- Or the backend will create it automatically on first run

---

## Which Option Should I Choose?

### Use Docker if:
✅ You want easy setup/teardown
✅ You don't want PostgreSQL permanently installed
✅ You're comfortable with Docker

### Use Local PostgreSQL if:
✅ You don't want to install Docker
✅ You want a permanent database
✅ You prefer GUI tools (pgAdmin)

---

## Next Steps

After database is running:

1. ✅ Configure `backend-main/.env` with database credentials
2. ✅ Configure `backend-main/.env` with JWT_SECRET
3. ✅ Configure `backend-main/.env` with Razorpay keys (optional)
4. ✅ Start backend server: `npm start`
5. ✅ Test backend: Open `http://192.168.1.4:8000` in browser
6. ✅ Configure mobile app `.env`
7. ✅ Start Expo: `npx expo start --clear`
8. ✅ Test login on iPhone

---

## Quick Reference

### Docker Commands

```bash
# Start database
docker compose -f docker-compose.dev.yml up -d

# Stop database
docker compose -f docker-compose.dev.yml down

# View logs
docker compose -f docker-compose.dev.yml logs

# Remove database and data
docker compose -f docker-compose.dev.yml down -v
```

### PostgreSQL Commands (if installed locally)

```bash
# Connect to database (in Command Prompt)
psql -U postgres -d education_app

# List databases
\l

# List tables
\dt

# Exit
\q
