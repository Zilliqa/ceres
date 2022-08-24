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
mkdir -p "images/devex"
cd "images/devex"
# Prevent storing of oauth token using this method instead of git cloning
git init
git pull https://github.com/zilliqa/dev-explorer master
cd "$ORIGIN_DIR"
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
mkdir -p "images/scillaserver"
cd "images/scillaserver"
# Prevent storing of oauth token using this method instead of git cloning
git init
git pull https://github.com/zilliqa/scilla-server config/move-to-v0.12.0rc00
cd "$ORIGIN_DIR"
tar czf ./extra/ceres-api/images/scillaserver.tar.gz -C ./images/scillaserver .
rm -rf ./images/scillaserver



echo "Creating Isolated Server Image"
mkdir -p "images/zilliqa-isolated-server"
cd "images/zilliqa-isolated-server"
# Prevent storing of oauth token using this method instead of git cloning
git init
git pull https://github.com/zilliqa/zilliqa-isolated-server config/move-to-v8.2.0rc0
cd "$ORIGIN_DIR"
tar czf ./extra/ceres-api/images/zilliqa-isolated-server.tar.gz -C ./images/zilliqa-isolated-server .
rm -rf ./images/zilliqa-isolated-server


echo "Creating Isolated Server Faucet Image"
mkdir -p "images/zilliqa-isolated-server-faucet"
cd "images/zilliqa-isolated-server-faucet"
# Prevent storing of oauth token using this method instead of git cloning
git init
git pull https://github.com/zilliqa/zilliqa-isolated-server-faucet master
cd "$ORIGIN_DIR"
tar czf ./extra/ceres-api/images/zilliqa-isolated-server-faucet.tar.gz -C ./images/zilliqa-isolated-server-faucet .
rm -rf ./images/zilliqa-isolated-server-faucet



echo "Build Ceres App"
npm install
npm run electron:build



echo "Prepare Packages"
if [ "$TRAVIS_OS_NAME" == "osx" ]; then
    tar -czvf "dist_electron/macos-unpacked.tar.gz" "dist_electron/mac"
    rm -rf "dist_electron/mac"
else
    tar -czvf "dist_electron/linux-unpacked.tar.gz" "dist_electron/linux-unpacked"
    rm -rf "dist_electron/linux-unpacked"
fi


ls -R "dist_electron"




echo "Build done!"
