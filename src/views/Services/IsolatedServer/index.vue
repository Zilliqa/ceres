<template>
  <div class="container pt-5">
    <div class="details mb-4">
      <h2 class="subtitle font-weight-bold text-white">
        <img
          src="@/assets/logo-zilliqa-isolated-server.png"
          style="width:30px; height: 30px; object-fit:contain;"
        />
        {{ imageData.shortName }}
      </h2>
      <p class="description text-white-50 mb-4">
        Zilliqa Isolated Server is a test server for dApp developers to quickly
        test their applications.
        <br />Transactions are validated immediately, hence improving the
        productivity for dApp developers.
      </p>

      <div class="metadata-container" v-if="containers.length">
        <service-metadata
          :container="container"
          v-for="container in containers"
          :key="container.Id"
        ></service-metadata>
      </div>
    </div>
    <div class="not-installed" v-if="!container">
      <div class="actions d-flex align-items-center" v-if="!loading">
        <button
          class="btn btn-lg btn-block btn-success font-weight-bold py-4"
          @click="handleBuildContainer"
        >
          Download & install
        </button>
      </div>
    </div>
    <div class="is-installed mt-4" v-else>
      <div class="actions" v-if="!loading">
        <div
          class="d-flex align-items-center"
          v-if="container.State !== 'running'"
        >
          <button
            class="btn btn-success btn-block mr-4"
            @click="handleStartContainer"
          >
            Start Service
          </button>
          <button
            class="btn btn-link text-danger mr-4"
            @click="handleRemoveContainer"
          >
            Uninstall
          </button>
        </div>
        <button class="btn btn-danger btn-block" @click="handleStopContainer" v-else>
          Stop Service
        </button>
      </div>
    </div>

    <div class="loading" v-if="loading">
      <div class="alert alert-info">
        {{ loading }}
      </div>
    </div>

    <div class="tabs-container bg-dark mt-4">
      <ul class="nav nav-tabs">
        <li
          class="nav-item"
          :class="{ active: tab === 'logs' }"
          @click="tab = 'logs'"
        >
          <a class="nav-link" href="#">Logs</a>
        </li>
        <li class="nav-item d-none" :class="{ active: tab === 'accounts' }">
          <a>Accounts (boot.json)</a>
        </li>
        <li class="nav-item d-none" :class="{ active: tab === 'request' }">
          <a>API Request</a>
        </li>
      </ul>

      <div class="tabs-content bg-dark">
        <div class="tab-logs bg-dark" v-if="tab === 'logs'">
          <log-row
            v-for="(log, index) in logs"
            :key="index"
            :log="log"
          ></log-row>
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
  </div>
</template>

<script>
import axios from "axios";
import LogRow from "@/components/LogRow";
import sockets from "@/mixins/sockets";
import ServiceMetadata from "@/components/Service/Metadata";

export default {
  name: "IsolatedServer",
  components: { LogRow, ServiceMetadata },
  data() {
    return {
      service: null,
      container: undefined,
      containers: [],
      loading: false,
      tab: "logs",
      logs: [],
      socket: undefined,
      installLogs: [],
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
    };
  },
  mixins: [sockets],
  watch: {
    logs: function() {
      document.querySelector(
        ".tabs-content"
      ).scrollTop = document.querySelector(".tab-logs").scrollHeight;
    },
  },
  async mounted() {
    await this.getContainerData();
  },
  methods: {
    async installSecondaryImages() {
      await Promise.all(
        this.secondaryImages.map(async (image) => {
          const result = await this.installImage(image);

          if (result.success === true) {
            await this.getContainerData();
            this.$notify({
              group: "ceres",
              type: "success",
              title: "Installation result",
              text: `${image.name} has been successfully installed on your system.`,
            });
          }
        })
      );

      this.loading = false;
    },
    async handleBuildContainer() {
      this.logs = [];
      this.loading = `Installing ${this.imageData.name}. This may take a while...`;

      let result = await this.installImage(this.imageData);

      if (result.success === true) {
        await this.getContainerData();

        this.$notify({
          group: "ceres",
          type: "success",
          title: "Installation result",
          text: `${this.imageData.shortName} has been successfully installed on your system.`,
        });

        await this.installSecondaryImages();
      }
    },
    async handleRemoveContainer() {
      this.logs = [];
      this.loading = `Removing ${this.imageData.name} Image. This may take a while...`;

      await Promise.all(
        this.containers.map(async (container) => {
          const result = await this.removeContainerAndImage({
            container: container.Id,
            image: container.ImageID,
          });

          if (result.success === true) {
            this.$notify({
              group: "ceres",
              type: "success",
              title: "Installation result",
              text: `${container.id} has been successfully removed from your system.`,
            });
          }
        })
      );

      await this.getContainerData();
      this.loading = false;
    },
    async getContainerData() {
      this.containers = [];
      this.container = undefined;
      const containers = await axios.get(
        "http://localhost:3939/container/list"
      );

      const cts = containers.data;

      if (cts.length) {
        const container = cts.find(
          (item) => item.Labels.ceres === this.imageData.image
        );
        if (container !== undefined) {
          this.containers.push({ ...container, name: this.imageData.badge });
          this.container = container;

          if (this.container && this.container.State === "running") {
            this.logs = [];
            this.openLogsSocket(this.container.Id);
          }

          this.secondaryImages.forEach(async (imageData) => {
            const container = cts.find(
              (item) => item.Labels.ceres === imageData.image
            );

            if (container !== undefined) {
              this.containers.push({
                ...container,
                name: imageData.badge,
              });
            }
          });
        }
      }
    },
    async handleStopContainer() {
      this.loading = "Stopping service...";

      await Promise.all(
        this.containers.map(async (container) => {
          await axios.post("http://localhost:3939/container/stop", {
            id: container.Id,
          });
        })
      );

      await this.getContainerData();
      this.loading = false;
    },
    async handleStartContainer() {
      this.loading = "Starting service...";

      await Promise.all(
        this.containers.map(async (container) => {
          await axios.post("http://localhost:3939/container/start", {
            image: container.Labels.ceres,
          });
        })
      );

      await this.getContainerData();
      this.loading = false;
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

.port-input {
  max-width: 80px;
}

.tabs-container {
  border-radius: 8px;
  .nav-tabs {
    border-color: #222;
  }
  li.nav-item {
    border-radius: 8px;
    &.active {
      //background-color: #333;
      a {
        color: #29ccc4;
        border-bottom-color: lighten(#222, 2);
      }
    }
    a {
      color: #fff;
    }
  }
  .tabs-content {
    height: 300px;
    width: 100%;
    background-color: #111;
    overflow-y: scroll;
    padding: 1rem;
  }
}
</style>
