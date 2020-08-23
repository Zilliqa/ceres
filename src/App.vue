<template>
  <div id="app">
    <h1 class="title">Ceres - Zilliqa Local Network</h1>
    <router-view />
  </div>
</template>

<style lang="scss">
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
