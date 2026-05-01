#!/bin/bash
# Daily PostgreSQL backup script
# Dumps the database and pushes to GitHub backup repo
# Run from /opt/app on the VPS

set -e

BACKUP_DIR="/opt/app/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="backup_${DATE}.sql"
CONTAINER_NAME="app_postgres_1"
DB_NAME="education_app"
DB_USER="postgres"

# GitHub backup repo (set this to your backup repo URL)
BACKUP_REPO_DIR="/opt/app/db-backups-repo"
BACKUP_REPO_URL="https://github.com/jassi2019/Taiyari-DB-Backups.git"

echo "[$(date)] Starting PostgreSQL backup..."

# Create backup dir if not exists
mkdir -p "$BACKUP_DIR"

# Dump the database from the running container
docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/$BACKUP_FILE"

echo "[$(date)] Backup created: $BACKUP_DIR/$BACKUP_FILE"

# Keep only last 7 daily backups locally
ls -t "$BACKUP_DIR"/backup_*.sql 2>/dev/null | tail -n +8 | xargs -r rm --

# Push to GitHub backup repo
if [ -d "$BACKUP_REPO_DIR/.git" ]; then
  cd "$BACKUP_REPO_DIR"
  git pull --rebase origin main 2>/dev/null || true

  # Copy backup to repo
  cp "$BACKUP_DIR/$BACKUP_FILE" "$BACKUP_REPO_DIR/$BACKUP_FILE"

  # Remove old backups from repo (keep last 30)
  ls -t "$BACKUP_REPO_DIR"/backup_*.sql 2>/dev/null | tail -n +31 | xargs -r rm --

  git add -A
  git commit -m "DB backup: $DATE" || echo "Nothing new to commit"
  git push origin main
  echo "[$(date)] Backup pushed to GitHub."
else
  echo "[$(date)] Backup repo not found. Run setup-backup-repo.sh first."
fi

echo "[$(date)] Backup complete."
