#!/bin/bash
echo $(pwd)

echo "Creating Dev-Explorer Image"
#git clone https://github.com/zilliqa/dev-explorer ./images/devex
#echo '{
#   "networks": [
#     {"http://localhost:5555" : "Local Isolated Server"},
#     {"https://api.zilliqa.com" : "Mainnet"},
#     {"https://dev-api.zilliqa.com" : "Testnet"},
#     {"https://zilliqa-isolated-server.zilliqa.com" : "Isolated Server"}
#   ]
# }' >> ./images/devex/public/networks.json
#tar czf ./images/devex.tar.gz -C ./images/devex .
#cp ./images/devex.tar.gz ./extra/images/devex.tar.gz
#rm -rf ./images/devex



echo "Creating Scilla Server Image"
#git clone https://github.com/zilliqa/scilla-server ./images/scillaserver
#tar czf ./images/scillaserver.tar.gz -C ./images/scillaserver .
#cp ./images/scillaserver.tar.gz ./extra/images/scillaserver.tar.gz
#rm -rf ./images/scillaserver



echo "Creating Isolated Server Image"
#git clone https://github.com/zilliqa/zilliqa-isolated-server ./images/zilliqa-isolated-server
#tar czf ./images/zilliqa-isolated-server.tar.gz -C ./images/zilliqa-isolated-server .
#cp ./images/zilliqa-isolated-server.tar.gz ./extra/images/zilliqa-isolated-server.tar.gz
#rm -rf ./images/zilliqa-isolated-server



echo "Creating Isolated Server Faucet Image"
#git clone https://github.com/zilliqa/zilliqa-isolated-server-faucet ./images/zilliqa-isolated-server-faucet
#tar czf ./images/zilliqa-isolated-server-faucet.tar.gz -C ./images/zilliqa-isolated-server-faucet .
#cp ./images/zilliqa-isolated-server-faucet.tar.gz ./extra/images/zilliqa-isolated-server-faucet.tar.gz
#rm -rf ./images/zilliqa-isolated-server-faucet



echo "Build Ceres App"
#npm install
#npm run electron:build



echo "Build done!"
