#!/bin/bash

# deploy reciperobot.net backend application

LOCAL_APP_DIR="/home/hibou/dev/reciperobot/reciperobot"
REMOTE_APP_DIR="/opt/reciperobot"
USER_SSH="root"
HOST="ssh.reciperobot.net"
USER_APP="reciperobot"

echo "Deploying Recipe Robot backend..."

# sync app source via rsync
rsync -avz --delete --exclude 'venv' --exclude '.env' $LOCAL_APP_DIR/ $USER_SSH@$HOST:$REMOTE_APP_DIR

# ensure remote working directory permissions are correct
ssh $USER_SSH@$HOST "sudo chown -R $USER_APP:$USER_APP $REMOTE_APP_DIR"

echo "-> backend deployed."
