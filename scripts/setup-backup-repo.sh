#!/bin/bash
# Run this ONCE on the VPS to set up the GitHub backup repo
# Usage: bash setup-backup-repo.sh <github_token>
# Example: bash setup-backup-repo.sh ghp_xxxxxxxxxxxx

set -e

GITHUB_TOKEN="$1"
GITHUB_USER="jassi2019"
REPO_NAME="Taiyari-DB-Backups"
BACKUP_REPO_DIR="/opt/app/db-backups-repo"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GitHub token required."
  echo "Usage: bash setup-backup-repo.sh <github_token>"
  exit 1
fi

echo "Setting up backup repo at $BACKUP_REPO_DIR..."

# Clone or init backup repo
if [ -d "$BACKUP_REPO_DIR/.git" ]; then
  echo "Backup repo already exists."
else
  mkdir -p "$BACKUP_REPO_DIR"
  cd "$BACKUP_REPO_DIR"
  git init
  git remote add origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

  # Try to clone existing remote
  if git ls-remote origin main &>/dev/null; then
    git pull origin main
    echo "Cloned existing backup repo."
  else
    # Create initial commit
    echo "# Taiyari NEET Ki - Database Backups" > README.md
    echo "Automated daily PostgreSQL backups. Do not delete this repo." >> README.md
    git add README.md
    git commit -m "Initial setup: DB backup repository"
    git branch -M main
    git push -u origin main
    echo "Created new backup repo on GitHub."
  fi
fi

# Store token in git config for this repo (local only)
cd "$BACKUP_REPO_DIR"
git remote set-url origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Set up daily cron job at 2 AM
CRON_JOB="0 2 * * * /bin/bash /opt/app/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1"
( crontab -l 2>/dev/null | grep -v "backup-db.sh"; echo "$CRON_JOB" ) | crontab -

echo ""
echo "=== SETUP COMPLETE ==="
echo "Daily backup cron set: 2 AM every day"
echo "Backup logs: /var/log/db-backup.log"
echo "Local backups: /opt/app/backups/"
echo "GitHub backups: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "To run a manual backup now:"
echo "  bash /opt/app/scripts/backup-db.sh"
