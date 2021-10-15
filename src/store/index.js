import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    docker: {
      socketPath: "/var/run/docker.sock",
      running: false,
    },
    services: [
      {
        name: "Isolated Server",
        slug: "zilliqa-isolated-server",
        imageData: {
          shortName: "Isolated Server",
          badge: "Server",
          name: "Isolated Server Instance",
          image: "zilliqa-isolated-server",
          tarbal: "zilliqa-isolated-server.tar.gz",
          labels: {
            name: "Isolated Server Instance",
            ceres: "zilliqa-isolated-server",
            containerPort: "5555",
            hostPort: "5555",
          },
        },
        secondaryImages: [
          {
            shortName: "Isolated Server Faucet",
            badge: "Faucet",
            name: "Isolated Server Faucet",
            image: "zilliqa-isolated-server-faucet",
            tarbal: "zilliqa-isolated-server-faucet.tar.gz",
            labels: {
              name: "Isolated Server Faucet",
              ceres: "zilliqa-isolated-server-faucet",
              containerPort: "5556",
              hostPort: "5556",
            },
          },
        ],
      },
      {
        name: "Network Explorer",
        slug: "devex",
        imageData: {
          shortName: "Network Explorer",
          badge: "Server",
          name: "Local Network Explorer",
          image: "devex",
          tarbal: "devex.tar.gz",
          labels: {
            name: "Local Network Explorer",
            ceres: "devex",
            containerPort: "80",
            hostPort: "5557",
          },
        },
        secondaryImages: [],
      },
      {
        name: "Scilla",
        slug: "scillaserver",
        imageData: {
          shortName: "Scilla Server",
          badge: "Server",
          name: "Scilla Server",
          image: "scillaserver",
          tarbal: "scillaserver.tar.gz",
          labels: {
            name: "Scilla Server",
            ceres: "scillaserver",
            containerPort: "4000",
            hostPort: "4000",
          },
        },
        secondaryImages: [],
      },
    ],
  },
  mutations: {
    updateDockerStatus(state, payload) {
      state.docker.running = payload;
    },
    updateDockerSocketPath(state, payload) {
      console.log(payload)
      state.docker.socketPath = payload;
    }
  },
  actions: {},
  getters: {
    dockerStatus: state => state.docker.running,
    dockerSocketPath: state => state.docker.socketPath
  },
  modules: {},
});
