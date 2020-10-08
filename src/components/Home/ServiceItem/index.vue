<template>
  <div class="service-item" @click="redirectToService(service.slug)">
    <div class="logo">
      <img :src="image" />
    </div>
    <div class="name">{{ service.name }}</div>
    <div class="status-badges">
      <status-badge
        v-for="container in containers"
        :key="container.Id"
        :status="container.State"
      />
    </div>
    <div class="port-badges">
      <port-badge
        v-for="container in containers"
        :key="container.Id"
        :port="container.Labels.hostPort"
      />
    </div>
  </div>
</template>
<script>
import StatusBadge from "./StatusBadge";
import PortBadge from "./PortBadge";
import { mapGetters } from "vuex";

import axios from "axios";
export default {
  data() {
    return {
      container: undefined,
      containers: [],
    };
  },
  components: { StatusBadge, PortBadge },
  props: {
    service: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["dockerStatus"]),
    image() {
      return require(`@/assets/logo-${this.service.slug}.png`);
    },
  },
  async mounted() {
    if (this.dockerStatus === true) {
      await this.getContainersData();
    }
  },
  watch: {
    dockerStatus(newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        return this.getContainersData();
      }
    },
  },
  methods: {
    redirectToService(service) {
      return this.$router.push({
        name: service,
      });
    },
    async getContainersData() {
      this.containers = [];
      this.container = undefined;
      const containers = await axios.get(
        "http://localhost:3939/container/list"
      );

      const cts = containers.data;

      if (cts.length) {
        const container = cts.find(
          (item) => item.Labels.ceres === this.service.imageData.image
        );
        if (container !== undefined) {
          this.containers.push({
            ...container,
            name: this.service.imageData.badge,
          });
          this.container = container;

          this.service.secondaryImages.forEach(async (imageData) => {
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
  },
};
</script>

<style lang="scss" scoped>
.service-item {
  padding: 1rem 2rem;
  background-color: #092532;
  margin-right: 1rem;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: relative;

  .status-badges {
    position: absolute;
    left: 0.5rem;
    top: 0.5rem;
    display: flex;
  }

  .port-badges {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    display: flex;
  }

  .name {
    text-align: center;
  }

  transition: all 0.25s ease-in-out;

  &:hover {
    background-color: darken($primary-color, 22);
    cursor: pointer;
  }

  .logo {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: auto;
      max-height: 48px;
      object-fit: contain;
    }
  }
}
</style>
