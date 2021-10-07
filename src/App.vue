<template>
  <div id="app">
    <nav class="top-navbar navbar navbar-dark bg-dark">
      <a
        class="navbar-brand mb-0 h1 d-flex align-items-center has-link"
        @click="goToIndex()"
        href="#"
      >
        <transition name="fade">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            class="bi bi-house-door mr-2"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            v-if="!isHome"
          >
            <path
              fill-rule="evenodd"
              d="M7.646 1.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 .146.354v7a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1-.5-.5v-4H7v4a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l6-6zM2.5 7.707V14H6v-4a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4h3.5V7.707L8 2.207l-5.5 5.5z"
            />
            <path
              fill-rule="evenodd"
              d="M13 2.5V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
            />
          </svg>
        </transition>

        <img src="@/assets/Ceres-01.png" height="30px" alt="" />
        <span class="font-weight-bold text-primary">Ceres</span>
      </a>

      <div class="d-flex justify-content-end">
        <docker-status />
        <settings-button />
      </div>
    </nav>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <notifications group="ceres" />
  </div>
</template>

<script>
import DockerStatus from "@/components/DockerStatus";
import SettingsButton from "@/components/SettingsButton";

export default {
  name: "Ceres",
  components: { DockerStatus, SettingsButton },
  computed: {
    isHome() {
      return this.$route.name === "home";
    },
  },
  methods: {
    goToIndex() {
      if (this.$route.name !== "home") {
        this.$router.push({
          name: "home",
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700;900&display=swap");

@import "node_modules/bootstrap/scss/bootstrap";

.fade-enter-active {
  transition: opacity 0.25s;
}

.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

html,
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
}

.has-link {
  cursor: pointer;
}
</style>
