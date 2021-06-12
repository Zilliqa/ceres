# Steps to create a release:
### 1. Clone Ceres repo and clear images directories:
```bash
git clone https://github.com/zilliqa/ceres
cd ceres
rm -rf ./extra/images && mkdir ./extra/images
rm -rf ./images && mkdir ./images
```

### 2. Create dev-explorer image:
```bash 
git clone https://github.com/zilliqa/dev-explorer ./images/devex
```

Add Custom networks
 ```bash
echo '{
    "networks": [
      {"http://localhost:5555" : "Local Isolated Server"},
      {"https://api.zilliqa.com" : "Mainnet"},
      {"https://dev-api.zilliqa.com" : "Testnet"},
      {"https://zilliqa-isolated-server.zilliqa.com" : "Isolated Server"}
    ]
  }' >> ./images/devex/public/networks.json
```

Create image
```bash
tar czf ./images/devex.tar.gz -C ./images/devex . 
cp ./images/devex.tar.gz ./extra/images/devex.tar.gz 
rm -rf ./images/devex
```

### 3. Create Scilla Server image
```bash 
git clone https://github.com/zilliqa/scilla-server ./images/scillaserver
```

Create image
```bash
tar czf ./images/scillaserver.tar.gz -C ./images/scillaserver . 
cp ./images/scillaserver.tar.gz ./extra/images/scillaserver.tar.gz 
rm -rf ./images/scillaserver
```

### 4. Isolated Server image
```bash 
git clone https://github.com/zilliqa/zilliqa-isolated-server ./images/zilliqa-isolated-server
```

Create image
```bash
tar czf ./images/zilliqa-isolated-server.tar.gz -C ./images/zilliqa-isolated-server . 
cp ./images/zilliqa-isolated-server.tar.gz ./extra/images/zilliqa-isolated-server.tar.gz 
rm -rf ./images/zilliqa-isolated-server
```

### 5. Isolated Server Faucet Image
```bash 
git clone https://github.com/zilliqa/zilliqa-isolated-server-faucet ./images/zilliqa-isolated-server-faucet
```
Create image
```bash
tar czf ./images/zilliqa-isolated-server-faucet.tar.gz -C ./images/zilliqa-isolated-server-faucet . 
cp ./images/zilliqa-isolated-server-faucet.tar.gz ./extra/images/zilliqa-isolated-server-faucet.tar.gz 
rm -rf ./images/zilliqa-isolated-server-faucet
```

### 6. Build Ceres App (Mac OS)
OS: MacOS xcode 12
NodeJS: 12.10.0
```bash
npm install
npm run electron:build
```

This will output into the dist_electron directory the following files:
1. /mac/Ceres.App - Application file
2. Ceres-version-mac.zip
3. Ceres-version.dmg


### 7. Build Ceres App (Linux)
OS: Ubuntu 18.04
NodeJS: 12.10.0
```bash
npm installN
npm run electron:build
```

This will output into the dist_electron directory the following files:
1. /Ceres-version.AppImage
2. Ceres_version_amd64.snap
3. linux-unpacked directory that should be a zip in Releases

### 8. Release on Github
In this step I manually tag and create a Release from master containing the artifacts from step 6 and 7.

### 9. Todo
lock services to release for each ceres release.

