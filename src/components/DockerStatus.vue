<template>
  <div class="text-light d-flex align-items-center">
    <small class="text-muted">Docker status:</small>

    <span class="ml-2" v-if="running === undefined">loading</span>
    <span class="ml-2 badge badge-success" v-if="running === true">
      RUNNING
    </span>
    <span class="ml-2 badge badge-danger" v-if="running === false">
      STOPPED
    </span>
  </div>
</template>

<script>
export default {
  name: "DockerStatus",
  data() {
    return {
      running: undefined,
    };
  },
  methods: {
    checkDockerStatus() {
      fetch("http://localhost:3939/docker-status")
        .then((response) => response.json())
        .then((json) => {
          if (json === "OK") {
            this.running = true;
            this.$store.commit("updateDockerStatus", this.running);
          } else {
            this.running = false;
            this.$store.commit("updateDockerStatus", this.running);
          }
        });
    },
  },
  async created() {
    this.checkDockerStatus();
    setInterval(() => {
      this.checkDockerStatus();
    }, 3000);
  },
};
</script>
