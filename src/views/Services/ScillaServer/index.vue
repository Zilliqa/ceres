<template>
  <div class="container pt-5">
    <div class="details mb-4">
      <h2 class="subtitle font-weight-bold text-white">
        <img
          src="@/assets/logo-scillaserver.png"
          style="width:30px; height: 30px; object-fit:contain;"
        />
        {{ imageData.shortName }}
      </h2>
      <p class="description text-muted mb-4">
        A scilla-server provides the functionality of scilla-runner and
        scilla-checker as a JSON-RPC server. The scilla-server process accepts
        contract execution requests and executes the contract, providing a JSON
        output within the server process itself.<br />
        More details can be found
        <a
          href="https://github.com/Zilliqa/scilla/wiki/scilla-server-API"
          target="_blank"
          >here</a
        >
      </p>

      <div class="metadata-container" v-if="containers.length">
        <p class="font-weight-bold text-white mb-0">
          Containers:
        </p>
        <service-metadata
          :container="container"
          v-for="container in containers"
          :key="container.Id"
        ></service-metadata>
      </div>
    </div>
    <div class="not-installed" v-if="!container">
      <!-- <div class="alert alert-info">
        To use this service Ceres needs to download and build the image.<br />This
        might take some time depending on your network connection.
      </div> -->
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
          <button class="btn btn-success mr-4" @click="handleStartContainer">
            Start Service
          </button>
          <button
            class="btn btn-link text-danger mr-4"
            @click="handleRemoveContainer"
          >
            Uninstall Service
          </button>
        </div>
        <button class="btn btn-danger" @click="handleStopContainer" v-else>
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
  name: "ScillaServer",
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
