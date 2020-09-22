module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        extraResources: ["./extra/**"],
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/_variables.scss";`,
      },
    },
  },
};
