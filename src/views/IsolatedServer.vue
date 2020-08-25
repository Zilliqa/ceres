<template>
  <div class="isolated-server">
    <div class="details container">
      <h2 class="subtitle has-text-white has-text-weight-bold">Isolated Server</h2>
      <div class="metadata" v-if="container">
        <div class="state">
          <span
            class="tag mr-2"
            :class="{'is-success': container.State === 'running', 'is-danger': container.State !== 'running'}"
          >{{container.State}} - {{container.Status}}</span>
          <span
            class="tag mr-2"
            v-if="container.Ports[0]"
          >http://localhost:{{container.Ports[0].PublicPort}}</span>
          <span class="tag">{{ container.Id }}</span>
        </div>
      </div>
      <p class="description mt-4">
        Zilliqa Isolated Server is a test server for dApp developers to quickly test their applications.
        <br />Transactions are validated immediately, hence improving the productivity for dApp developers.
      </p>
    </div>
    <div class="container mt-4" v-if="container">
      <div class="actions" v-if="!loading">
        <b-button
          type="btn is-success"
          @click="handleStartContainer"
          v-if="container.State !== 'running'"
        >Start Service</b-button>
        <b-button type="btn is-danger" @click="handleStopContainer" v-else>Stop Service</b-button>
      </div>
      <div class="loading" v-else>{{loading}}</div>
    </div>
    <div class="container mt-5" v-if="container && container.State === 'running'">
      <div class="tabs">
        <ul>
          <li :class="{'is-active': tab === 'logs'}" @click="tab = 'logs'">
            <a>Container Logs</a>
          </li>
          <li :class="{'is-active': tab === 'accounts'}" @click="tab = 'accounts'">
            <a>Accounts (boot.json)</a>
          </li>
          <li :class="{'is-active': tab === 'request'}" @click="tab = 'request'">
            <a>API Request</a>
          </li>
        </ul>
      </div>
      <div class="tabs-content">
        <div class="tab-logs" v-if="tab === 'logs'">
          <div class="log-message" v-for="(log,index) in logs" :key="index">{{log}}</div>
        </div>
        <div class="tab-accounts" v-if="tab === 'accounts'">
          <pre style="background-color: #111; color: #eee;">
          {
            "d90f2e538ce0df89c8273cad3b63ec44a3c4ed82": {
              "privateKey": "e53d1c3edaffc7a7bab5418eb836cf75819a82872b4a1a0f1c7fcf5c3e020b89",
              "amount": "90000000000000000000000",
              "nonce": 0
            },
            "381f4008505e940ad7681ec3468a719060caf796": {
              "privateKey": "d96e9eb5b782a80ea153c937fa83e5948485fbfc8b7e7c069d7b914dbc350aba",
              "amount": "90000000000000000000000",
              "nonce": 0
            },
            "b028055ea3bc78d759d10663da40d171dec992aa": {
              "privateKey": "e7f59a4beb997a02a13e0d5e025b39a6f0adc64d37bb1e6a849a4863b4680411",
              "amount": "90000000000000000000000",
              "nonce": 0
            },
            "f6dad9e193fa2959a849b81caf9cb6ecde466771": {
              "privateKey": "589417286a3213dceb37f8f89bd164c3505a4cec9200c61f7c6db13a30a71b45",
              "amount": "90000000000000000000000",
              "nonce": 0
            },
            "10200e3da08ee88729469d6eabc055cb225821e7": {
              "privateKey": "5430365143ce0154b682301d0ab731897221906a7054bbf5bd83c7663a6cbc40",
              "amount": "1000000000000000000",
              "nonce": 0
            },
            "ac941274c3b6a50203cc5e7939b7dad9f32a0c12": {
              "privateKey": "1080d2cca18ace8225354ac021f9977404cee46f1d12e9981af8c36322eac1a4",
              "amount": "1000000000000000000",
              "nonce": 0
            },
            "ec902fe17d90203d0bddd943d97b29576ece3177": {
              "privateKey": "254d9924fc1dcdca44ce92d80255c6a0bb690f867abde80e626fbfef4d357004",
              "amount": "1000000000000000000",
              "nonce": 0
            },
            "c2035715831ab100ec42e562ce341b834bed1f4c": {
              "privateKey": "b8fc4e270594d87d3f728d0873a38fb0896ea83bd6f96b4f3c9ff0a29122efe4",
              "amount": "1000000000000000000",
              "nonce": 0
            },
            "6cd3667ba79310837e33f0aecbe13688a6cbca32": {
              "privateKey": "b87f4ba7dcd6e60f2cca8352c89904e3993c5b2b0b608d255002edcda6374de4",
              "amount": "1000000000000000000",
              "nonce": 0
            }
          }
          </pre>
        </div>
      </div>
    </div>

    <div class="install container mt-5" v-if="!container">
      <div class="actions" v-if="!loading">
        <b-button type="btn is-success" @click="handleBuildContainer">Build service image</b-button>
      </div>
      <div class="install-logs" v-if="installLogs.length">
        <div class="log-message" v-for="(log,index) in installLogs" :key="index">{{log}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";

export default {
  name: "IsolatedServer",
  data() {
    return {
      service: null,
      container: undefined,
      loading: false,
      tab: "logs",
      logs: [],
      socket: undefined,
      installLogs: [],
      imageData: {
        name: "Isolated Server Instance",
        image: "isolatedserver",
        tarbal: "isolatedserver.tar.gz",
        labels: {
          name: "Isolated Server Instance",
          ceres: "isolatedserver",
          containerPort: "5555",
          hostPort: "5555",
        },
      },
    };
  },
  async created() {
    this.socket = io("http://localhost:3939");
    await this.getContainerData();

    if (this.container) {
      this.socket.on("connect", () => {
        this.logs.unshift("Socket connected.");
      });

      this.socket.emit("container-logs", this.container.Id);

      this.socket.on(this.container.Id, (msg) => {
        msg = JSON.parse(msg);
        // eslint-disable-next-line no-control-regex
        const str = msg.stream.replace(/\0|\1|\u0019/g, "");
        this.logs.unshift(str);
      });

      this.socket.on("disconnect", () => {
        console.log(this.socket.connected);
      });
    }
  },
  methods: {
    async handleBuildContainer() {
      this.installLogs = ["Installing Isolated Server. This may take a while..."];
      this.loading = true;
      this.socket.emit("build-image", this.imageData);

      this.socket.on("install-logs", (msg) => {
        console.log(msg);
        msg = JSON.parse(msg);
        if (msg.success === true) {
          this.getContainerData();
        } else {
          // eslint-disable-next-line no-control-regex
          const str = msg.stream.replace(/\0|\1|\u0019/g, "");
          this.installLogs.unshift(str);
        }
      });
    },
    async getContainerData() {
      const containers = await axios.get(
        "http://localhost:3939/container/list"
      );

      const cts = containers.data;

      if (cts.length) {
        this.container = cts.find(
          (item) => item.Labels.ceres === this.imageData.image
        );
      }
    },
    async handleStopContainer() {
      this.loading = "Stopping service...";
      await axios.post("http://localhost:3939/container/stop", {
        id: this.container.Id,
      });

      this.loading = false;

      await this.getContainerData();
    },
    async handleStartContainer() {
      this.loading = "Starting service...";
      await axios.post("http://localhost:3939/container/start", {
        image: this.container.Labels.ceres,
      });

      this.loading = false;

      await this.getContainerData();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 2rem;
  .subtitle {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
}

.isolated-server {
  .tabs {
    li {
      &.is-active {
        background-color: #111;
        a {
          color: #29ccc4;
          border-color: #111;
        }
      }
      a {
        color: #fff;
      }
    }
    margin-bottom: 0;
  }
  .tabs-content {
    height: 400px;
    width: 100%;
    background-color: #111;
    overflow-y: scroll;
    padding: 1rem;
  }

  .install-logs {
    width: 100%;
    height: 400px;
    overflow-y: scroll;
    background-color: #111;
    padding: 1rem;
  }
}
</style>