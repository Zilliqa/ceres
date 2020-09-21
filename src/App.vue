<template>
  <div id="app">
    <div class="top-bar">
      <img src="@/assets/cancel.svg" />
    </div>
    <nav class="top-navbar navbar navbar-dark bg-dark pt-3">
      <span
        class="navbar-brand mb-0 h1 d-flex align-items-center has-link"
        @click="goToIndex()"
        href="#"
      >
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
        Ceres - Zilliqa Development Tools</span
      >

      <div class="text-light d-flex align-items-center">
        Docker daemon:

        <span class="ml-2 badge badge-success">Running</span>
      </div>
    </nav>
    <router-view />
    <notifications group="ceres" />
  </div>
</template>

<script>
export default {
  name: "Ceres",
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

$body-bg: #222;
$body-color: #fff;

$font-size-base: 0.9rem;
$font-family-sans-serif: "Open Sans", Helvetica, Arial, sans-serif;

$theme-colors: (
  "primary": #29ccc4,
  "dark": lighten($body-bg, 2),
);

@import "node_modules/bootstrap/scss/bootstrap";

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

.top-bar {
  height: 20px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  padding-left: 5px;

  img {
    height: 8px;
    cursor: pointer;
  }
}

.top-navbar {
  -webkit-app-region: drag;
}

.has-link {
  cursor: pointer;
}
</style>
