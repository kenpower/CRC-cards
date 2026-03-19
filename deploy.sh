#!/bin/bash

# Deployment script
# Usage: ./deploy.sh <config> [host] [remote_user] [install_folder] [appname]

# if needed generate key pair: ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
# add the .pub to /home/deployer/.ssh/authorized_keys

set -e  # Exit on any error

# Show help if requested
if [ "$1" == "-h" ] || [ "$1" == "--help" ] || [ -z "$1" ]; then
    echo "Usage: $0 <config> [host] [remote_user] [install_folder] [appname]"
    echo ""
    echo "Required:"
    echo "  config:         Environment config (e.g., prod, dev, staging)"
    echo "                  Loads <config>.config file"
    echo ""
    echo "Optional overrides (from config file):"
    echo "  host:           Remote server hostname/IP"
    echo "  remote_user:    SSH username"
    echo "  install_folder: Base installation directory"
    echo "  appname:        Application name"
    echo ""
    echo "Examples:"
    echo "  $0 prod                                    # Use prod.config"
    echo "  $0 dev                                     # Use dev.config"
    echo "  $0 prod compucore2.setu.ie                 # Override host"
    echo "  $0 prod compucore2.setu.ie ken             # Override host and user"
    echo "  $0 prod compucore3.setu.ie ken /opt myapp  # Override all"
    exit 0
fi

# Mandatory: config parameter
CONFIG_ENV=$1
CONFIG_FILE="${CONFIG_ENV}.config"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Config file '$CONFIG_FILE' not found!"
    echo "Please create ${CONFIG_ENV}.config with your deployment settings."
    echo ""
    echo "Example: cp prod.config.example ${CONFIG_ENV}.config"
    exit 1
fi

# Load configuration
echo "Loading configuration from $CONFIG_FILE..."
source "$CONFIG_FILE"

# Optional parameters (override config file values)
HOST=${2:-$DEFAULT_HOST}
REMOTE_USER=${3:-$DEFAULT_REMOTE_USER}
INSTALL_FOLDER=${4:-$DEFAULT_INSTALL_FOLDER}
APPNAME=${5:-$DEFAULT_APPNAME}

# Derived variables
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="/tmp/${APPNAME}_${TIMESTAMP}.tar.gz"
REMOTE_PATH="${INSTALL_FOLDER}/${APPNAME}"

echo "============================================"
echo "Deployment Configuration"
echo "============================================"
echo "Environment: ${CONFIG_ENV}"
echo "Config File: ${CONFIG_FILE}"
echo "Host: ${HOST}"
echo "Remote User: ${REMOTE_USER}"
echo "Install Folder: ${INSTALL_FOLDER}"
echo "App Name: ${APPNAME}"
echo "Archive: ${ARCHIVE_NAME}"
echo "Remote Path: ${REMOTE_PATH}"
echo "============================================"
echo ""

# Git safety checks
echo "Running git safety checks..."
GIT_WARNINGS=0

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "WARNING: You are deploying from branch '${CURRENT_BRANCH}', not main/master."
    GIT_WARNINGS=$((GIT_WARNINGS + 1))
else
    echo "  Branch: ${CURRENT_BRANCH} (OK)"
fi

# Check for uncommitted changes (staged or unstaged)
UNCOMMITTED=$(git status --porcelain | grep -v "^??" || true)
if [ -n "$UNCOMMITTED" ]; then
    echo "WARNING: You have uncommitted changes:"
    git status --short | grep -v "^??"
    GIT_WARNINGS=$((GIT_WARNINGS + 1))
else
    echo "  Uncommitted changes: none (OK)"
fi

# Check for untracked files
UNTRACKED=$(git ls-files --others --exclude-standard)
if [ -n "$UNTRACKED" ]; then
    echo "WARNING: You have untracked files (not in git, may be bundled into archive):"
    echo "$UNTRACKED" | sed 's/^/    /'
    GIT_WARNINGS=$((GIT_WARNINGS + 1))
else
    echo "  Untracked files: none (OK)"
fi

# Check for unpushed commits
UNPUSHED=$(git log @{u}.. --oneline 2>/dev/null || true)
if [ -n "$UNPUSHED" ]; then
    echo "WARNING: You have unpushed commits (remote is behind):"
    echo "$UNPUSHED" | sed 's/^/    /'
    GIT_WARNINGS=$((GIT_WARNINGS + 1))
else
    echo "  Unpushed commits: none (OK)"
fi

if [ "$GIT_WARNINGS" -gt 0 ]; then
    echo ""
    echo "Found ${GIT_WARNINGS} warning(s). Review above before proceeding."
else
    echo "  All git checks passed."
fi
echo ""

# Confirmation prompt
read -p "Proceed with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi
echo ""

# Step 1: Run npm install and build
echo "[1/7] Running npm install..."
cd web
npm install

echo "[2/7] Building application..."
npm run build

cd ..

# Step 2: Compress the folder
echo "[3/7] Compressing folder (listing files as added)..."
COPYFILE_DISABLE=1 tar -cvzf "${ARCHIVE_NAME}" \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.venv \
    --exclude=venv \
    --exclude=tokens/.env.local \
    --exclude=Docker/MySQL/data \
    --exclude=user_uploads \
    --exclude=screenshots \
    --exclude=test-results \
    --exclude=temp \
    --exclude=Skills \
    --exclude=web/static/*.csv \
    .

echo "Created archive: ${ARCHIVE_NAME}"

# Step 3: Copy to remote folder
echo "[4/7] Copying archive to remote server..."
ssh "${REMOTE_USER}@${HOST}" "mkdir -p ${REMOTE_PATH}"
scp "${ARCHIVE_NAME}" "${REMOTE_USER}@${HOST}:${REMOTE_PATH}/"

# Extract and setup on remote
echo "[4/7b] Extracting archive on remote server..."
ARCHIVE_FILENAME=$(basename "${ARCHIVE_NAME}")
ssh "${REMOTE_USER}@${HOST}" "set -e && \
    cd ${REMOTE_PATH} && \
    sudo chown -R ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_PATH} && \
    sudo tar -xzf ${ARCHIVE_FILENAME} --strip-components=0 --overwrite --no-same-owner && \
    sudo rm ${ARCHIVE_FILENAME} && \
    sudo chown -R ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_PATH} && \
    echo 'Archive extracted to ${REMOTE_PATH}'"

# Step 4: Backup database
echo "[4/7c] Backing up database..."
ssh "${REMOTE_USER}@${HOST}" bash << 'EOF'
    set -e
    cd "${REMOTE_PATH}"
    mkdir -p backups
    BACKUP_FILE="backups/db_backup_${TIMESTAMP}.sql"
    docker exec $(docker compose -f "${DOCKER_FILE}" ps -q mysql) \
        mysqldump -u root -p"${MYSQL_ROOT_PASSWORD}" "${MYSQL_DATABASE:-WritingAnalytics}" \
        > "${BACKUP_FILE}" 2>/dev/null && \
    echo "Database backed up to ${BACKUP_FILE}" || \
    echo "Warning: Database backup failed"
EOF

# Step 5: Run docker compose up on remote
echo "[5/7] Running docker compose up on remote server..."
ssh "${REMOTE_USER}@${HOST}" "set -e && \
    cd ${REMOTE_PATH} && \
    docker compose -f ${DOCKER_FILE} down || true && \
    docker compose -f ${DOCKER_FILE} up --build -d && \
    echo 'Docker containers started'"

# Step 6: Copy nginx.conf to /etc/nginx/sites-enabled/
echo "[6/7] Copying nginx configuration..."
ssh "${REMOTE_USER}@${HOST}" "set -e && \
    if [ -f '${REMOTE_PATH}/nginx.conf' ]; then \
        sudo cp ${REMOTE_PATH}/nginx.conf /etc/nginx/sites-enabled/${APPNAME}.conf && \
        echo 'Nginx config copied to /etc/nginx/sites-enabled/${APPNAME}.conf'; \
    else \
        echo 'Warning: nginx.conf not found in ${REMOTE_PATH}' && \
        exit 1; \
    fi"

# Step 7: Reload nginx
echo "[7/7] Reloading nginx..."
ssh "${REMOTE_USER}@${HOST}" "sudo nginx -t && sudo systemctl reload nginx"

# Cleanup local archive
echo "Cleaning up local archive..."
rm "${ARCHIVE_NAME}"

echo ""
echo "============================================"
echo "Deployment completed successfully!"
echo "============================================"
echo "Application deployed to: ${REMOTE_USER}@${HOST}:${REMOTE_PATH}"
echo "Nginx config: /etc/nginx/sites-enabled/${APPNAME}.conf"
echo ""
