<template>
  <div id="app">
    <h1 class="title has-link" @click="goToIndex()">Ceres - Zilliqa Development Tools</h1>
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {
    goToIndex() {
      this.$router.push({
        name: "home",
      });
    },
  },
};
</script>

<style lang="scss">
.has-link {
  cursor: pointer;
}
html,
body {
  width: 100%;
  height: 100%;
  background-color: #222;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.title {
  color: #29ccc4 !important;
  text-align: center;
}
#app {
  background-color: #222;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #dedede;
  padding-top: 2rem;
}
</style>
