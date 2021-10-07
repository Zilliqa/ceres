<template>
  <div class="container pt-5">
    <div class="details mb-4">
      <h2 class="subtitle font-weight-bold text-white">
        <img
          src="@/assets/logo-zilliqa-isolated-server.png"
          style="width: 30px; height: 30px; object-fit: contain"
        />
        {{ imageData.shortName }}
      </h2>
      <p class="description text-white-50 mb-4">
        Zilliqa Isolated Server is a test server that simulates the Zilliqa
        blockchain locally. dApp developers can use it to speed up testing of
        their applications. Transactions sent to the Isolated Server are
        validated immediately, hence improving the productivity for dApp
        developers.
      </p>

      <div class="metadata-container" v-if="containers.length">
        <service-metadata
          :container="container"
          v-for="container in containers"
          :key="container.Id"
        ></service-metadata>
      </div>
    </div>
    <div class="actions" v-if="dockerStatus === true">
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
          <button
            class="btn btn-danger btn-block"
            @click="handleStopContainer"
            v-else
          >
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
          <li
            class="nav-item"
            :class="{ active: tab === 'faucet' }"
            @click="tab = 'faucet'"
            v-if="container && container.State === 'running'"
          >
            <a class="nav-link" href="#">Faucet Request</a>
          </li>
          <li
            class="nav-item"
            :class="{ active: tab === 'accounts' }"
            @click="tab = 'accounts'"
            v-if="container && container.State === 'running'"
          >
            <a class="nav-link" href="#">Genesis accounts</a>
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
          <div class="tab-faucet" v-if="tab === 'faucet'">
            <label>Select genesis account:</label>
            <select
              v-model="faucetCallGenesisAccount"
              class="form-control mb-4"
            >
              <option
                v-for="(gn, addr) of genesisAccounts"
                :key="addr"
                :value="gn.privateKey"
              >
                {{ addr }}
              </option>
            </select>
            <label>Enter receiving address:</label>
            <input
              type="text"
              class="form-control mb-4"
              placeholder="0x05C8F25019d8A77a9a09743342C9b61ae7FB5270"
              v-model="faucetCallAddress"
            />
            <label>Enter amount in ZIL:</label>
            <input
              type="number"
              class="form-control mb-4"
              v-model="faucetCallAmount"
            />
            <div
              class="btn btn-success"
              @click="handleRequest"
              v-if="!faucetCallLoading"
            >
              Request funds
            </div>
          </div>
          <div class="tab-accounts" v-if="tab === 'accounts'">
            <vue-json-pretty :data="genesisAccounts"> </vue-json-pretty>
          </div>
        </div>
      </div>
    </div>
    <div class="alert alert-danger" v-else>
      In order to run Zilliqa Containers you need to have Docker running in your
      system.
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LogRow from "@/components/LogRow";
import sockets from "@/mixins/sockets";
import ServiceMetadata from "@/components/Service/Metadata";
import { mapGetters } from "vuex";
const { Zilliqa } = require("@zilliqa-js/zilliqa");
const { BN, Long, bytes, units } = require("@zilliqa-js/util");

import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default {
  name: "IsolatedServer",
  components: { LogRow, ServiceMetadata, VueJsonPretty },
  data() {
    return {
      faucetCallAddress: undefined,
      faucetCallLoading: false,
      faucetCallGenesisAccount: undefined,
      faucetCallAmount: 10000,
      service: null,
      container: undefined,
      containers: [],
      loading: false,
      tab: "logs",
      logs: [],
      socket: undefined,
      installLogs: [],
      genesisAccounts: {
        d90f2e538ce0df89c8273cad3b63ec44a3c4ed82: {
          privateKey:
            "e53d1c3edaffc7a7bab5418eb836cf75819a82872b4a1a0f1c7fcf5c3e020b89",
          amount: "900000000000000000000000",
          nonce: 0,
        },
        "381f4008505e940ad7681ec3468a719060caf796": {
          privateKey:
            "d96e9eb5b782a80ea153c937fa83e5948485fbfc8b7e7c069d7b914dbc350aba",
          amount: "900000000000000000000000",
          nonce: 0,
        },
        b028055ea3bc78d759d10663da40d171dec992aa: {
          privateKey:
            "e7f59a4beb997a02a13e0d5e025b39a6f0adc64d37bb1e6a849a4863b4680411",
          amount: "900000000000000000000000",
          nonce: 0,
        },
        f6dad9e193fa2959a849b81caf9cb6ecde466771: {
          privateKey:
            "589417286a3213dceb37f8f89bd164c3505a4cec9200c61f7c6db13a30a71b45",
          amount: "900000000000000000000000",
          nonce: 0,
        },
        "10200e3da08ee88729469d6eabc055cb225821e7": {
          privateKey:
            "5430365143ce0154b682301d0ab731897221906a7054bbf5bd83c7663a6cbc40",
          amount: "900000000000000000000000",
          nonce: 0,
        },
        ac941274c3b6a50203cc5e7939b7dad9f32a0c12: {
          privateKey:
            "1080d2cca18ace8225354ac021f9977404cee46f1d12e9981af8c36322eac1a4",
          amount: "900000000000000000000000",
          nonce: 0,
        },
        ec902fe17d90203d0bddd943d97b29576ece3177: {
          privateKey:
            "254d9924fc1dcdca44ce92d80255c6a0bb690f867abde80e626fbfef4d357004",
          amount: "900000000000000000000000",
          nonce: 0,
        },
        c2035715831ab100ec42e562ce341b834bed1f4c: {
          privateKey:
            "b8fc4e270594d87d3f728d0873a38fb0896ea83bd6f96b4f3c9ff0a29122efe4",
          amount: "900000000000000000000000",
          nonce: 0,
        },
        "6cd3667ba79310837e33f0aecbe13688a6cbca32": {
          privateKey:
            "b87f4ba7dcd6e60f2cca8352c89904e3993c5b2b0b608d255002edcda6374de4",
          amount: "900000000000000000000000",
          nonce: 0,
        },
      },
      imageData: {
        shortName: "Isolated Server",
        badge: "Server",
        name: "Isolated Server Instance",
        image: "zilliqa/zilliqa-isolated-server",
        tag: "latest",
        labels: {
          name: "Isolated Server Instance",
          ceres: "zilliqa-isolated-server",
          containerPort: "5555",
          hostPort: "5555",
        },
      },
      secondaryImages: [],
    };
  },
  mixins: [sockets],
  computed: {
    ...mapGetters(["dockerStatus"]),
  },
  watch: {
    logs: function () {
      document.querySelector(".tabs-content").scrollTop =
        document.querySelector(".tab-logs") !== null
          ? document.querySelector(".tab-logs").scrollHeight
          : 0;
    },
  },
  async mounted() {
    await this.getContainerData();
  },
  methods: {
    async handleRequest() {
      this.faucetCallLoading = true;

      const zilliqa = new Zilliqa(
        `http://localhost:${this.imageData.labels.hostPort}`
      );

      zilliqa.wallet.addByPrivateKey(this.faucetCallGenesisAccount);

      const chainId = 222; // chainId of the developer testnet
      const msgVersion = 1; // current msgVersion
      const VERSION = bytes.pack(chainId, msgVersion);
      const myGasPrice = units.toQa("2000", units.Units.Li);

      try {
        const tx = await zilliqa.blockchain.createTransaction(
          zilliqa.transactions.new(
            {
              version: VERSION,
              toAddr: this.faucetCallAddress,
              amount: new BN(
                units.toQa(this.faucetCallAmount, units.Units.Zil)
              ),
              gasPrice: myGasPrice,
              gasLimit: Long.fromNumber(50),
            },
            false
          )
        );

        this.faucetCallLoading = false;

        if (tx.receipt.success === true) {
          this.faucetCallSuccess = true;
          this.faucetCallAddress = undefined;
          this.$notify({
            group: "ceres",
            type: "success",
            title: "Faucet call",
            text: `Funds requested successfully from the faucet.`,
          });
        } else {
          this.$notify({
            group: "ceres",
            type: "error",
            title: "Faucet call failed",
            text: tx.receipt,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
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
          type: "info",
          title: "Installation result",
          text: `${this.imageData.shortName} has been installed on your system. Please wait while the FAUCET server is installed... 1/2`,
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
    background-color: #222;
    border-radius: 0;

    &.active {
      background-color: transparent;
      a {
        color: #29ccc4;

        border: 1px solid #29ccc4;
        border-bottom-color: lighten(#222, 2);
      }
    }
    a {
      color: #fff;
      &:hover {
        border: 1px solid #29ccc4;
        border-bottom-color: lighten(#222, 2);
      }
    }
  }
  .tabs-content {
    height: 350px;
    width: 100%;
    background-color: #111;
    overflow-y: scroll;
    padding: 1rem;
  }

  .form-control {
    background-color: #222;
    border: 0;
    border-radius: 0;
    color: #fff;
  }
}
</style>
