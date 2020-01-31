DEPLOY_DIR=$(pwd)
cd $DEPLOY_DIR/..
docker build -t enet/unicorn-runner .
