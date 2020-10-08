module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: "com.ceres.app",
        productName: "Ceres",
        copyright: "Copyright © 2020 Zilliqa",
        extraResources: ["extra"],
        extraFiles: ["extra"],
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
