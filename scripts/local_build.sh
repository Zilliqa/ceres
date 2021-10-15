#!/bin/bash
echo $(pwd)

echo "Pre-build setup"
ORIGIN_DIR=$(pwd)
echo "$ORIGIN_DIR"

echo "Build Ceres API"
git clone https://github.com/micovi/ceres-api extra/ceres-api
cd extra/ceres-api
mkdir images
npm install

cd "$ORIGIN_DIR"

echo "Creating Dev-Explorer Image"
git clone https://github.com/zilliqa/dev-explorer images/devex

echo '{
   "networks": [
     {"http://localhost:5555" : "Local Isolated Server"},
     {"https://api.zilliqa.com" : "Mainnet"},
     {"https://dev-api.zilliqa.com" : "Testnet"},
     {"https://zilliqa-isolated-server.zilliqa.com" : "Isolated Server"}
   ]
 }' >> ./images/devex/public/networks.json

tar czf ./extra/ceres-api/images/devex.tar.gz -C ./images/devex .
rm -rf ./images/devex

echo "Creating Scilla Server Image"

git clone https://github.com/zilliqa/scilla-server images/scillaserver

tar czf ./extra/ceres-api/images/scillaserver.tar.gz -C ./images/scillaserver .
rm -rf ./images/scillaserver

echo "Creating Isolated Server Image"
git clone https://github.com/zilliqa/zilliqa-isolated-server images/zilliqa-isolated-server

tar czf ./extra/ceres-api/images/zilliqa-isolated-server.tar.gz -C ./images/zilliqa-isolated-server .
rm -rf ./images/zilliqa-isolated-server

echo "Creating Isolated Server Faucet Image"
git clone https://github.com/zilliqa/zilliqa-isolated-server-faucet images/zilliqa-isolated-server-faucet

tar czf ./extra/ceres-api/images/zilliqa-isolated-server-faucet.tar.gz -C ./images/zilliqa-isolated-server-faucet .
rm -rf ./images/zilliqa-isolated-server-faucet

echo "Build Ceres App"
cd $ORIGIN_DIR
npm install
npm run electron:build

echo "Build done!"