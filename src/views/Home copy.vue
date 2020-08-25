<template>
  <div class="hello">
    <div class="container">
      <h4>Available Containers</h4>
      <table class="table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>State</th>
            <th>Status</th>
            <th style="display: none;">Docker ID</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <container-row
          v-on:reload-containers="handleReloadContainers"
          v-for="co in containers"
          :key="co.Id"
          :co="co"
        ></container-row>
      </table>
    </div>
    <div class="container">
      <h4>Service Images</h4>
      <table class="table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <image-row
          v-on:reload-images="reloadData"
          v-for="image in services"
          :key="image.id"
          :image="image"
        ></image-row>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ContainerRow from "@/components/ContainerRow";
import ImageRow from "@/components/ImageRow";
import io from "socket.io-client";

export default {
  name: "HelloWorld",
  components: { ContainerRow, ImageRow },
  data() {
    return {
      socket: undefined,
      images: [],
      containers: [],
      services: [],
    };
  },
  props: {
    msg: String,
  },
  async created() {
    await this.getServices();
    await this.reloadData();

    setInterval(async () => {
      await this.reloadData();
    }, 10000);

    this.socket = io('http://localhost:3939');

    this.socket.on("connect", () => {
      this.socket.emit('test', 'teessss');
      console.log(this.socket.connected); // true
    });

    this.socket.on("logs", (msc) => {
      console.log(msc);
    });

    this.socket.on("disconnect", () => {
      console.log(this.socket.connected); // false
    });
  },
  methods: {
    async getServices() {
      const services = await axios.get("http://localhost:3939/image/available");

      this.services = services.data;
    },
    async handleReloadContainers() {
      const containers = await axios.get(
        "http://localhost:3939/container/list"
      );

      this.containers = containers.data;
    },
    async handleReloadImages() {
      const images = await axios.get("http://localhost:3939/image/list");

      this.images = images.data;

      this.images.forEach((image) => {
        const found = this.services.find(
          (serv) => serv.image === image.data.Labels.ceres
        );
        if (found !== undefined) {
          found.installed = true;
        }
      });
    },
    async reloadData() {
      await this.handleReloadImages();
      await this.handleReloadContainers();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  padding: 2rem;
}
.dockerid {
  width: 150px;
  overflow: hidden;
}
.table {
  width: 100%;
  background-color: #4a5759;

  td,
  th {
    padding: 0.5rem;
    color: #fff;
  }
}
</style>
