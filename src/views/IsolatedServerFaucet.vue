<template>
  <div class="isolated-server">
    <div class="details container">
      <h2 class="subtitle has-text-white has-text-weight-bold">Isolated Server Faucet</h2>
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
        </ul>
      </div>
      <div class="tabs-content">
        <div class="tab-logs" v-if="tab === 'logs'">
          <div class="log-message" v-for="(log,index) in logs" :key="index">{{log}}</div>
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
  name: "IsolatedServerFaucet",
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
        name: "Isolated Server Faucet",
        image: "isolatedserverfaucet",
        tarbal: "isolatedserverfaucet.tar.gz",
        labels: {
          name: "Isolated Server Faucet",
          ceres: "isolatedserverfaucet",
          containerPort: "5556",
          hostPort: "5556",
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
      this.installLogs = ["Installing Isolated Server Faucet. This may take a while..."];
      this.loading = true;
      this.socket.emit("build-image", this.imageData);

      this.socket.on("install-logs", (msg) => {
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