<template>
  <tr>
    <td>{{co.Labels.name}}</td>
    <td>
      <b-tag
        :class="{'is-success':co.State === 'running', 'is-danger': co.State !== 'running'}"
      >{{co.State}}</b-tag>
    </td>
    <td>{{co.Status}}</td>
    <td>
      <div v-if="co.Ports[0]">http://localhost:{{co.Ports[0].PublicPort}}</div>
    </td>
    <td>
      <div class="actions" v-if="!loading">
        <b-button type="btn is-info mr-2" v-if="co.State === 'running'">Details</b-button>
        <b-button
          type="btn is-success"
          @click="handleStartContainer"
          v-if="co.State !== 'running'"
        >Start Service</b-button>
        <b-button type="btn is-danger" @click="handleStopContainer" v-else>Stop Service</b-button>
      </div>
      <div class="loading" v-else>{{loading}}</div>
    </td>
  </tr>
</template>

<script>
import axios from "axios";

export default {
  props: ["co"],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async handleStopContainer() {
      this.loading = "Stopping service...";
      await axios.post("http://localhost:3939/container/stop", {
        id: this.co.Id,
      });

      this.loading = false;

      this.$emit("reload-containers");
    },
    async handleStartContainer() {
      console.log(this.co);
      this.loading = "Starting service...";
      await axios.post("http://localhost:3939/container/start", {
        image: this.co.Labels.ceres,
      });

      this.loading = false;

      this.$emit("reload-containers");
    },
  },
};
</script>

<style lang="scss" scoped>
tr {
  td,
  th {
    padding: 0.5rem;
    color: #fff !important;
  }
}

.btn {
  padding: 0.2rem 0.8rem !important;
  height: auto;
}
</style>