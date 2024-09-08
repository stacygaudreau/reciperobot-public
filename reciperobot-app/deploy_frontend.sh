#!/bin/bash

# deploy reciperobot.net frontend next.js application

LOCAL_APP_DIR="/home/hibou/dev/reciperobot/reciperobot-app"
REMOTE_APP_DIR="/opt/reciperobot-app"
USER_SSH="root"
HOST="ssh.reciperobot.net"
USER_APP="reciperobot"

echo "Deploying Recipe Robot frontend..."

# sync app source via rsync
rsync -avz --delete --exclude 'node_modules' --exclude '.next' $LOCAL_APP_DIR/ $USER_SSH@$HOST:$REMOTE_APP_DIR

# install dependencies and build next.js app
ssh $USER_SSH@$HOST "sudo -u $USER_SSH -H sh -c 'cd $REMOTE_APP_DIR && npm install && npx next build'"

# ensure remote working directory permissions are correct
ssh $USER_SSH@$HOST "sudo chown -R $USER_APP:$USER_APP $REMOTE_APP_DIR"
# ssh $USER_SSH@$HOST "sudo chmod -R 755 $USER_APP:$USER_APP $REMOTE_APP_DIR"

echo "-> frontend deployed!"
