<template>
  <div class="text-light d-flex align-items-center">
    <small class="text-muted">Docker status:</small>

    <span class="ml-2 badge badge-success" v-if="running">RUNNING</span>
    <span class="ml-2 badge badge-danger" v-else>STOPPED</span>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "DockerStatus",
  data() {
    return {
      running: false,
    };
  },
  created() {
    const socket = io("http://localhost:3939");

    socket.on("connect", () => {
      setInterval(() => {
        socket.emit("docker-ping");
      }, 5000);
    });

    socket.on("docker-ping", (msg) => {
      if (msg.success === "OK") {
        this.running = true;
      } else {
        this.running = false;
      }

      if (this.running !== this.$store.state.docker.running) {
        this.$store.commit("updateDockerStatus", this.running);
      }
    });
  },
};
</script>
