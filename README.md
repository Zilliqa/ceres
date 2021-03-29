# Ceres
Ceres is a graphical user interface that runs different Zilliqa development tools under Docker containers without the need of user knowing how to use docker or run it's commands.
You can focus on Scilla development while Ceres manages Zilliqa Tools for you.

## System Requirements

### MacOS / Linux
- **NodeJS** v12 or newer
- **Docker** - Zilliqa Services are based on docker containers and Ceres acts like a graphical interface on top of Docker.
- Free ports on your system: 5555, 5556 for Isolated Server, 5557 for Network Explorer, 4000 for Scilla Server

### WINDOWS
- **NodeJS** v12 or newer
- **WSL 2.0**
- **Docker**
- Free ports on your system: 5555, 5556 for Isolated Server, 5557 for Network Explorer, 4000 for Scilla Server

## Installation
Ceres Binaries can be found under Releases tab.

## Available Services
### Isolated Server (Local Zilliqa Network)
Zilliqa Isolated Server is a test server for dApp developers to quickly test their applications.
Transactions are validated immediately, hence improving the productivity for dApp developers.

Isolated Server runs 2 containers that are tied togheter:
1. Server Container (http://localhost:5555) which is the local Zilliqa Network. It starts with 10 genesis accounts which you can use. Read more about Isolated Server here.
2. Faucet Container (http://localhost:5556) is a faucet for the server which you can query to get $ZILs on any account. Read more on faucet usage here.

### Scilla Server
A scilla-server provides the functionality of scilla-runner and scilla-checker as a JSON-RPC server. The scilla-server process accepts contract execution requests and executes the contract, providing a JSON output within the server process itself.
More details about Scilla Server can be found here.

Scilla Server runs on port 4000. You can call it's API on http://localhost:4000

### Network Explorer
This is a developer-focused lightweight explorer to connect to the Zilliqa's networks and local testnets.

As an explorer, Devex is unable to interact with the blockchain other than pulling and displaying data. If you wish to interact with the blockchain (i.e. create contracts, create transactions and so on..), do check out our feature-filled Scilla IDE (https://ide.zilliqa.com/#/)

Network Exporer runs on port 5557. You can access it from any browser on http://localhost:5557

### Configuration
In order for transactions to clear you will need to change your CHAIN_ID to the Ceres network id: `222`

## DEBUG
By default, Ceres Logs are written:
- on Linux: ~/.config/Ceres/logs/main.log
- on macOS: ~/Library/Logs/Ceres/main.log
- on Windows: %USERPROFILE%\AppData\Roaming\Ceres\logs\main.log

## Development commands
Open the application with Dev-Tools enabled.
```bash
npm run electron:serve
```

Compiles and minifies for production
```bash
npm run electron:build
```

Run your tests
```bash
npm run test
```

Lints and fixes files
```bash
npm run lint
```
