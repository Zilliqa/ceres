module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      buildResources: "./build",
      mac: {
        "hardenedRuntime": true,
        "gatekeeperAssess": false,
        "entitlements": "build/entitlements.mac.plist",
        "entitlementsInherit": "build/entitlements.mac.plist",
        "extendInfo": {
          "NSAppTransportSecurity": {
            "NSAllowsArbitraryLoads": true
          }
        },
      },
      build: {
        "afterSign": "scripts/notarize.js",
        "publish": {
          "provider": "github",
          "owner": "zilliqa",
          "repo": "ceres"
        }
      },
      "dmg": {
        "sign": false
      },
      builderOptions: {
        appId: "com.ceres.app",
        productName: "Ceres",
        copyright: "Copyright © 2020 Zilliqa",
        extraResources: ["extra"],
        extraFiles: ["extra"],
        "afterSign": "scripts/notarize.js"
      },
      publish: ["github"]
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
