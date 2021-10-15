module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      buildResources: "./build",
      linux: {
        target: [
          {
            target: "AppImage",
            icon: "32x32.png",
          },
          {
            target: "deb",
            icon: "32x32.png",
          },
          {
            target: "zip",
            icon: "32x32.png",
          },
        ],
      },
      mac: {
        hardenedRuntime: true,
        gatekeeperAssess: false,
        entitlements: "build/entitlements.mac.plist",
        entitlementsInherit: "build/entitlements.mac.plist",
        extendInfo: {
          NSAppTransportSecurity: {
            NSAllowsArbitraryLoads: true,
          },
        },
      },
      build: {
        afterSign: "scripts/notarize.js",
        publish: {
          provider: "github",
          owner: "zilliqa",
          repo: "ceres",
        },
      },
      dmg: {
        sign: false,
      },
      builderOptions: {
        appId: "com.ceres.app",
        productName: "Ceres",
        copyright: "Copyright © 2020 Zilliqa",
        extraResources: ["extra", "build"],
        extraFiles: ["extra", "build"],
        afterSign: "scripts/notarize.js",
      },
      publish: ["github"],
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
