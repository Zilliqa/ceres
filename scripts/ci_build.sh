#!/bin/bash
echo $(pwd)



echo "Pre-build setup"
ORIGIN_DIR=$(pwd)
echo "$ORIGIN_DIR"



echo "Creating Dev-Explorer Image"
mkdir -p "images/devex"
cd "images/devex"
# Prevent storing of oauth token using this method instead of git cloning
git init
git pull https://$GITHUB_OAUTH_TOKEN@github.com/zilliqa/dev-explorer master
cd "$ORIGIN_DIR"
echo '{
   "networks": [
     {"http://localhost:5555" : "Local Isolated Server"},
     {"https://api.zilliqa.com" : "Mainnet"},
     {"https://dev-api.zilliqa.com" : "Testnet"},
     {"https://zilliqa-isolated-server.zilliqa.com" : "Isolated Server"}
   ]
 }' >> ./images/devex/public/networks.json
tar czf ./images/devex.tar.gz -C ./images/devex .
cp ./images/devex.tar.gz ./extra/images/devex.tar.gz
rm -rf ./images/devex



echo "Creating Scilla Server Image"
mkdir -p "images/scillaserver"
cd "images/scillaserver"
# Prevent storing of oauth token using this method instead of git cloning
git init
git pull https://$GITHUB_OAUTH_TOKEN@github.com/zilliqa/scilla-server master
cd "$ORIGIN_DIR"
tar czf ./images/scillaserver.tar.gz -C ./images/scillaserver .
cp ./images/scillaserver.tar.gz ./extra/images/scillaserver.tar.gz
rm -rf ./images/scillaserver



echo "Creating Isolated Server Image"
mkdir -p "images/zilliqa-isolated-server"
cd "images/zilliqa-isolated-server"
# Prevent storing of oauth token using this method instead of git cloning
git init
git pull https://$GITHUB_OAUTH_TOKEN@github.com/zilliqa/zilliqa-isolated-server master
cd "$ORIGIN_DIR"
tar czf ./images/zilliqa-isolated-server.tar.gz -C ./images/zilliqa-isolated-server .
cp ./images/zilliqa-isolated-server.tar.gz ./extra/images/zilliqa-isolated-server.tar.gz
rm -rf ./images/zilliqa-isolated-server



echo "Creating Isolated Server Faucet Image"
mkdir -p "images/zilliqa-isolated-server-faucet"
cd "images/zilliqa-isolated-server-faucet"
# Prevent storing of oauth token using this method instead of git cloning
git init
git pull https://$GITHUB_OAUTH_TOKEN@github.com/zilliqa/zilliqa-isolated-server-faucet master
cd "$ORIGIN_DIR"
tar czf ./images/zilliqa-isolated-server-faucet.tar.gz -C ./images/zilliqa-isolated-server-faucet .
cp ./images/zilliqa-isolated-server-faucet.tar.gz ./extra/images/zilliqa-isolated-server-faucet.tar.gz
rm -rf ./images/zilliqa-isolated-server-faucet



echo "Build Ceres App"
npm install
npm run electron:build



echo "Prepare Packages"
if [ "$TRAVIS_OS_NAME" == "osx" ]; then
    tar -czvf "dist_electron/Ceres.tar.gz" "dist_electron/mac"
    rm -rf "dist_electron/mac"
else
    tar -czvf "dist_electron/linux-unpacked.tar.gz" "dist_electron/linux-unpacked"
    rm -rf "dist_electron/linux-unpacked"
fi


ls -R "dist_electron"




echo "Build done!"
