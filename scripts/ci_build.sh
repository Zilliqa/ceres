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
git pull https://github.com/zilliqa/scilla-server master
cd "$ORIGIN_DIR"
tar czf ./extra/ceres-api/images/scillaserver.tar.gz -C ./images/scillaserver .
rm -rf ./images/scillaserver



echo "Creating Isolated Server Image"
mkdir -p "images/zilliqa-isolated-server"
cd "images/zilliqa-isolated-server"
# Prevent storing of oauth token using this method instead of git cloning
git init
git pull https://github.com/zilliqa/zilliqa-isolated-server master
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


if [ "$TRAVIS_OS_NAME" == "osx" ]; then
  echo "Setup MacOS Certificate and Keychain"
  KEY_CHAIN=build.keychain
  CERTIFICATE_P12=certificate.p12

  # Recreate the certificate from the secure environment variable
  echo $CERTIFICATE_OSX_P12 | base64 --decode > $CERTIFICATE_P12

  #create a keychain
  security create-keychain -p travis $KEY_CHAIN

  # Make the keychain the default so identities are found
  security default-keychain -s $KEY_CHAIN

  # Unlock the keychain
  security unlock-keychain -p travis $KEY_CHAIN
  security import $CERTIFICATE_P12 -k $KEY_CHAIN -P $CERTIFICATE_PASSWORD -T /usr/bin/codesign;
  security set-key-partition-list -S apple-tool:,apple: -s -k travis $KEY_CHAIN

  # remove certs
  rm -fr *.p12
fi


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
