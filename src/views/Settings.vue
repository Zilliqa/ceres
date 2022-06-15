<template>
  <div class="container pt-5">
    <div class="details mb-4">
      <h2 class="subtitle font-weight-bold text-white">Ceres Settings</h2>
    </div>
    <div class="description text-muted mb-4">
      <div class="mb-4">
        <label>Docker Engine Path</label>
        <input
          type="text"
          class="form-control"
          placeholder="Docker engine path"
          v-model="socketPath"
        />
      </div>
      <div class="mb-4">
        <button class="btn btn-primary" @click="handleSaveSettings">
          Save settings
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SettingsPage",
  data() {
    return {
      socketPath: "",
    };
  },
  created() {
    this.socketPath = this.$store.getters.dockerSocketPath;
  },
  methods: {
    async handleSaveSettings() {
      this.$store.commit("updateDockerSocketPath", this.socketPath);
      await axios.post("http://localhost:3939/docker-init", {
        docker_path: this.socketPath,
      });
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
label {
  color: #fff;
  font-weight: bold;
}
input {
  background-color: #fff;
  border: 0;
  border-radius: 0;
}
</style>
